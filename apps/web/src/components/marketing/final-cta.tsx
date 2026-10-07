'use client';

import React, { useEffect, useState } from 'react';
import { IconArrowRight, IconArrowDown } from '@/components/ui/icons';

interface FinalCTAProps {
  onBookDemo: () => void;
}

/** Mirrors what the product does, so the CTA shows the outcome instead of describing it. */
const ACTIVITY = [
  { icon: '💬', text: 'New lead captured on WhatsApp' },
  { icon: '📅', text: 'Slot booked with Dr. Priya' },
  { icon: '✅', text: '₹500 deposit received' },
] as const;

const FOCUS_LIGHT =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F6F0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#4B624A]';

export function FinalCTA({ onBookDemo }: FinalCTAProps) {
  const [index, setIndex] = useState(0);

  // Cycle the activity pill. Skipped entirely for reduced-motion users.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % ACTIVITY.length), 2800);
    return () => clearInterval(id);
  }, []);

  const current = ACTIVITY[index];

  return (
    <section aria-labelledby="final-cta-heading" className="bg-[#F5F6F0] py-16 sm:py-20">
      <style>{`
        @keyframes cta-pill-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cta-ring { 0% { box-shadow: 0 0 0 0 rgba(245,246,240,0.45); } 70%, 100% { box-shadow: 0 0 0 14px rgba(245,246,240,0); } }
        @keyframes cta-drift { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-24px,16px,0); } }
        @keyframes cta-sheen { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(260%) skewX(-20deg); } }
        .cta-pill-in { animation: cta-pill-in 0.45s ease-out both; }
        .cta-ring { animation: cta-ring 2.6s ease-out 1.2s infinite; }
        .cta-drift { animation: cta-drift 14s ease-in-out infinite; }
        .cta-primary:hover .cta-sheen { animation: cta-sheen 0.9s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .cta-pill-in, .cta-ring, .cta-drift, .cta-primary:hover .cta-sheen { animation: none; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[32px] bg-[#4B624A] px-6 py-14 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          {/* Decoration */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="cta-drift absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-[#B6CBDE]/25 blur-3xl" />
            <div className="cta-drift absolute -bottom-40 -left-24 h-[380px] w-[380px] rounded-full bg-[#553E53]/30 blur-3xl [animation-delay:-7s]" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(rgba(245,246,240,0.18) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
                maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 72%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 72%)',
              }}
            />
          </div>

          <div className="mx-auto max-w-3xl">
            {/* Live activity pill */}
            <div
              aria-hidden="true"
              className="mx-auto mb-7 flex h-9 w-fit items-center gap-2 rounded-full border border-[#F5F6F0]/20 bg-[#F5F6F0]/10 px-3.5 text-[13px] font-medium text-[#F5F6F0] backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#B6CBDE] opacity-70 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B6CBDE]" />
              </span>
              {/* key remounts the span so the enter animation replays on each change */}
              <span key={index} className="cta-pill-in inline-flex items-center gap-1.5">
                <span>{current.icon}</span>
                {current.text}
              </span>
            </div>

            <h2
              id="final-cta-heading"
              className="text-balance text-3xl font-bold leading-[1.1] tracking-tight text-[#F5F6F0] sm:text-4xl lg:text-[44px]"
            >
              Give your clinic a 24/7 AI employee.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#F5F6F0]/80 sm:text-lg">
              Let Dermo handle the repetitive patient conversations while your team focuses on running the clinic.
            </p>

            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onBookDemo}
                className={`cta-primary cta-ring group relative inline-flex h-[52px] items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#F5F6F0] px-7 text-[15px] font-semibold text-[#553E53] shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl active:translate-y-0 active:scale-[0.98] ${FOCUS_LIGHT}`}
              >
                {/* Light sheen that sweeps across on hover */}
                <span
                  aria-hidden="true"
                  className="cta-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-[#B6CBDE]/50 to-transparent"
                />
                <span className="relative">Book a demo</span>
                <IconArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <a
                href="#how-it-works"
                className={`group inline-flex h-[52px] items-center justify-center gap-2.5 rounded-xl border border-[#F5F6F0]/30 px-6 text-[15px] font-semibold text-[#F5F6F0] transition-colors duration-200 hover:border-[#F5F6F0]/60 hover:bg-[#F5F6F0]/10 ${FOCUS_LIGHT}`}
              >
                See how it works
                <IconArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>
            </div>

            <p className="mt-6 text-sm font-medium text-[#F5F6F0]/70">
              Managed onboarding. Your team stays in control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;