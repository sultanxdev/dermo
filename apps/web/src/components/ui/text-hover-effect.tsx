'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

interface TextHoverEffectProps {
    text: string;
    className?: string;
}

type ViewBox = { x: number; y: number; w: number; h: number };

const FONT_SIZE = 100;
const BASELINE = 100;
const FONT_WEIGHT = 800;
const TRACKING_EM = -0.035;

const FALLBACK: ViewBox = { x: 0, y: 22, w: 440, h: 80 };

/**
 * Footer wordmark.
 * - Fill only (no stroke), so variable-font overlap contours never show through.
 * - The viewBox is the real ink bounds of the text, so the first and last letters
 *   sit exactly on the container edges.
 * - The base fill is one flat soft plum tone.
 * - A brand-colored spotlight follows the pointer. It also sweeps across once when
 *   the wordmark scrolls into view, unless the user prefers reduced motion.
 */
export function TextHoverEffect({ text, className = '' }: TextHoverEffectProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const textRef = useRef<SVGTextElement>(null);
    const pointerInside = useRef(false);
    const swept = useRef(false);

    const [vb, setVb] = useState<ViewBox>(FALLBACK);
    const [ready, setReady] = useState(false);
    const [hovered, setHovered] = useState(false);
    // Spotlight position as a fraction of the viewBox, so it survives resizes.
    const [spot, setSpot] = useState({ fx: 0.5, fy: 0.5 });

    // useId returns ":r1:", which is not safe inside url(#...), so strip the colons.
    const uid = useId().replace(/:/g, '');
    const baseId = `base-${uid}`;
    const fillId = `fill-${uid}`;
    const revealId = `reveal-${uid}`;
    const maskId = `mask-${uid}`;

    /* Measure the real ink bounds with canvas; fall back to getBBox. */
    const measure = useCallback(() => {
        const svg = svgRef.current;
        if (!svg) return;

        try {
            const ctx = document.createElement('canvas').getContext('2d') as
                | (CanvasRenderingContext2D & { letterSpacing?: string })
                | null;
            // Canvas only matches the SVG text if it supports letter-spacing too.
            if (ctx && 'letterSpacing' in ctx) {
                ctx.font = `${FONT_WEIGHT} ${FONT_SIZE}px ${getComputedStyle(svg).fontFamily}`;
                ctx.letterSpacing = `${TRACKING_EM * FONT_SIZE}px`;
                const m = ctx.measureText(text);
                const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
                if (w > 0) {
                    setVb({
                        x: -m.actualBoundingBoxLeft,
                        y: BASELINE - m.actualBoundingBoxAscent,
                        w,
                        h: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
                    });
                    setReady(true);
                    return;
                }
            }
        } catch {
            /* fall through to getBBox */
        }

        const box = textRef.current?.getBBox();
        if (box && box.width) {
            setVb({ x: box.x, y: BASELINE - 0.76 * FONT_SIZE, w: box.width, h: 0.78 * FONT_SIZE });
            setReady(true);
        }
    }, [text]);

    useEffect(() => {
        measure();
        let cancelled = false;
        // Re-measure once web fonts finish loading, since glyph widths change.
        document.fonts?.ready.then(() => {
            if (!cancelled) measure();
        });
        return () => {
            cancelled = true;
        };
    }, [measure]);

    /* One-time sweep when the wordmark first scrolls into view. */
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg || !ready || swept.current) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let raf = 0;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || swept.current) return;
                swept.current = true;
                io.disconnect();

                const start = performance.now();
                const duration = 1800;
                setHovered(true);

                const tick = (now: number) => {
                    if (pointerInside.current) return; // the user took over
                    const t = Math.min((now - start) / duration, 1);
                    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                    setSpot({ fx: -0.1 + eased * 1.2, fy: 0.5 });
                    if (t < 1) raf = requestAnimationFrame(tick);
                    else setHovered(false);
                };
                raf = requestAnimationFrame(tick);
            },
            { threshold: 0.6 }
        );
        io.observe(svg);

        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [ready]);

    const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        setSpot({
            fx: (e.clientX - rect.left) / rect.width,
            fy: (e.clientY - rect.top) / rect.height,
        });
    };

    const textProps = {
        x: 0,
        y: BASELINE,
        style: {
            fontSize: `${FONT_SIZE}px`,
            fontFamily: 'inherit',
            fontWeight: FONT_WEIGHT,
            letterSpacing: `${TRACKING_EM}em`,
        } as React.CSSProperties,
    };

    return (
        <svg
            ref={svgRef}
            width="100%"
            viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            aria-hidden="true"
            onPointerEnter={() => {
                pointerInside.current = true;
                setHovered(true);
            }}
            onPointerLeave={() => {
                pointerInside.current = false;
                setHovered(false);
            }}
            onPointerMove={handleMove}
            className={`block w-full select-none transition-opacity duration-700 motion-reduce:transition-none ${ready ? 'opacity-100' : 'opacity-0'
                } ${className}`}
            style={{ touchAction: 'pan-y' }}
        >
            <defs>
                {/* Base fill: one flat tone, so no lighter band appears at the bottom */}
                <linearGradient id={baseId} gradientUnits="userSpaceOnUse" x1="0" y1={vb.y} x2="0" y2={vb.y + vb.h}>
                    <stop offset="0%" stopColor="#553E53" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#553E53" stopOpacity="0.12" />
                </linearGradient>

                {/* Spotlight fill: brand green into plum */}
                <linearGradient
                    id={fillId}
                    gradientUnits="userSpaceOnUse"
                    x1={vb.x}
                    y1={vb.y}
                    x2={vb.x + vb.w}
                    y2={vb.y + vb.h}
                >
                    <stop offset="0%" stopColor="#4B624A" />
                    <stop offset="100%" stopColor="#553E53" />
                </linearGradient>

                <radialGradient
                    id={revealId}
                    gradientUnits="userSpaceOnUse"
                    cx={vb.x + spot.fx * vb.w}
                    cy={vb.y + spot.fy * vb.h}
                    r={vb.w * 0.17}
                >
                    <stop offset="0%" stopColor="white" />
                    <stop offset="90%" stopColor="black" />
                </radialGradient>
                <mask id={maskId} maskUnits="userSpaceOnUse" x={vb.x} y={vb.y} width={vb.w} height={vb.h}>
                    <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill={`url(#${revealId})`} />
                </mask>
            </defs>

            {/* Base layer: always visible, so touch devices still see the wordmark */}
            <text ref={textRef} {...textProps} fill={`url(#${baseId})`}>
                {text}
            </text>

            {/* Spotlight layer: fades in and out smoothly with the pointer */}
            <g mask={`url(#${maskId})`} style={{ opacity: hovered ? 1 : 0, transition: 'opacity 350ms ease' }}>
                <text {...textProps} fill={`url(#${fillId})`}>
                    {text}
                </text>
            </g>
        </svg>
    );
}