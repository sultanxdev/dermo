'use client';

import React, { useState } from 'react';
import { IconChevronRight, IconCalendar, IconCheck } from '@/components/ui/icons';
import { useInView } from '@/hooks/use-in-view';

interface HowItWorksProps {
  onBookDemo: () => void;
}

/* ── Inline SVG icons specific to this section ── */
const IconClipboard = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
  </svg>
);
const IconWrench = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const IconFlask = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 3h6l1 8H8L9 3z" />
    <path d="M6.4 14.7A4 4 0 0 0 8 22h8a4 4 0 0 0 1.6-7.3" />
    <line x1="12" y1="3" x2="12" y2="11" />
  </svg>
);
const IconRocket = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const STEPS = [
  {
    icon: IconClipboard,
    title: 'Book a demo',
    owner: 'You share',
    ownerColor: 'bg-[#B6CBDE]/30 text-[#553E53]',
    desc: 'Tell us your specialty, doctor schedule, and current WhatsApp volume. 30 minutes is all we need.',
    detail: 'Specialty · Schedule · Volume',
    gradient: 'from-[#B6CBDE]/20 to-[#B6CBDE]/5',
    accentBorder: 'border-[#B6CBDE]/50',
    isLast: false,
  },
  {
    icon: IconWrench,
    title: 'We configure your workspace',
    owner: 'We build',
    ownerColor: 'bg-[#4B624A]/15 text-[#4B624A]',
    desc: 'We load verified clinic info, treatments, pricing, doctor shifts, your WhatsApp number, and payments.',
    detail: 'Treatments · Shifts · Payments',
    gradient: 'from-[#4B624A]/12 to-[#4B624A]/3',
    accentBorder: 'border-[#4B624A]/30',
    isLast: false,
  },
  {
    icon: IconFlask,
    title: 'Test with real scenarios',
    owner: 'Together',
    ownerColor: 'bg-[#553E53]/12 text-[#553E53]',
    desc: 'Your team tries real patient conversations in a simulator before anything touches live WhatsApp.',
    detail: 'Simulator · Review · Approve',
    gradient: 'from-[#553E53]/10 to-[#553E53]/3',
    accentBorder: 'border-[#553E53]/20',
    isLast: false,
  },
  {
    icon: IconRocket,
    title: 'Go live',
    owner: 'Live',
    ownerColor: 'bg-[#553E53] text-[#F5F6F0]',
    desc: 'Dermo answers patients 24/7 while your team supervises every conversation from the dashboard.',
    detail: '24/7 · Dashboard · Full oversight',
    gradient: 'from-[#553E53]/15 to-[#553E53]/5',
    accentBorder: 'border-[#553E53]/40',
    isLast: true,
  },
];

export function HowItWorks({ onBookDemo }: HowItWorksProps) {
  const { ref, isInView } = useInView();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section
      id="how-it-works"
      ref={ref}
      aria-labelledby="how-it-works-title"
      className="relative py-24 sm:py-32 border-b border-[#553E53]/10 bg-[#F5F6F0] overflow-hidden"
    >
      {/* Subtle background radial texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 10%, rgba(182,203,222,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 90%, rgba(85,62,83,0.07) 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="max-w-2xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4B624A]/25 bg-[#4B624A]/8 text-[#4B624A] text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4B624A] animate-pulse" />
            Managed onboarding
          </div>
          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#553E53] tracking-tight text-balance leading-[1.1]"
          >
            We set up Dermo<br className="hidden sm:block" />
            <span className="text-[#4B624A]"> around your clinic</span>
          </h2>
          <p className="text-base sm:text-lg text-[#553E53]/70 leading-relaxed max-w-xl">
            No bot builders and no self-service setup. We configure and test Dermo against your real
            schedule and procedures, then you go live with full human oversight.
          </p>
        </div>

        {/* ══════════════════════════════════════════════
             STEPPER BAR  (desktop: horizontal, mobile: vertical)
        ══════════════════════════════════════════════ */}

        {/* ── DESKTOP stepper ── */}
        <div className="hidden lg:block mb-10" aria-hidden>
          {/* Outer container positions rail + nodes */}
          <div className="relative flex items-center">

            {/* ── Rail track (background) ── */}
            <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 h-2 rounded-full bg-[#553E53]/8" />

            {/* ── Animated fill segments between nodes ── */}
            {/* Segment 1: node0 → node1 */}
            <div className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full overflow-hidden"
              style={{ left: 'calc(25% * 0 + 20px)', right: 'calc(25% * 3 + 20px)' }}>
              <div
                className={`h-full w-full bg-gradient-to-r from-[#4B624A] to-[#4B624A]/70 origin-left transition-transform duration-500 ease-out delay-[100ms] motion-reduce:transition-none ${
                  isInView ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </div>
            {/* Segment 2: node1 → node2 */}
            <div className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full overflow-hidden"
              style={{ left: 'calc(25% * 1 + 20px)', right: 'calc(25% * 2 + 20px)' }}>
              <div
                className={`h-full w-full bg-gradient-to-r from-[#4B624A]/70 to-[#553E53]/70 origin-left transition-transform duration-500 ease-out delay-[350ms] motion-reduce:transition-none ${
                  isInView ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </div>
            {/* Segment 3: node2 → node3 */}
            <div className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full overflow-hidden"
              style={{ left: 'calc(25% * 2 + 20px)', right: 'calc(25% * 1 + 20px)' }}>
              <div
                className={`h-full w-full bg-gradient-to-r from-[#553E53]/70 to-[#553E53] origin-left transition-transform duration-500 ease-out delay-[600ms] motion-reduce:transition-none ${
                  isInView ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </div>

            {/* ── Nodes ── */}
            {STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <div
                  key={step.title}
                  className="relative z-10 flex-1 flex justify-center first:justify-start last:justify-end"
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Outer pulse ring */}
                  <div
                    className={`absolute w-[52px] h-[52px] rounded-full transition-all duration-300 ${
                      step.isLast
                        ? 'bg-[#553E53]/15'
                        : isActive
                        ? 'bg-[#4B624A]/15'
                        : 'bg-transparent'
                    }`}
                    style={{ top: '50%', transform: 'translate(-50%, -50%)', left: '50%', position: 'absolute' }}
                  />
                  {/* Node circle */}
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold border-[2.5px] shadow-sm transition-all duration-300 ${
                      step.isLast
                        ? 'bg-[#553E53] text-[#F5F6F0] border-[#553E53] shadow-[#553E53]/30'
                        : isActive
                        ? 'bg-[#4B624A] text-[#F5F6F0] border-[#4B624A] shadow-[#4B624A]/30'
                        : 'bg-white text-[#553E53] border-[#553E53]/20 shadow-[#553E53]/5'
                    }`}
                  >
                    {step.isLast
                      ? <IconCheck className="w-[18px] h-[18px]" />
                      : <span>{i + 1}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Node labels row ── */}
          <div className={`flex mt-3 transition-opacity duration-700 delay-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className={`flex-1 flex flex-col transition-colors duration-200 ${
                  i === 0 ? 'items-start' : i === STEPS.length - 1 ? 'items-end' : 'items-center'
                }`}
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
              >
                <span className={`text-[11px] font-semibold tracking-wide transition-colors duration-200 ${
                  step.isLast ? 'text-[#553E53]' : activeStep === i ? 'text-[#4B624A]' : 'text-[#553E53]/40'
                }`}>
                  {['Day 1', 'Week 1', 'Week 2', 'Week 2–3'][i]}
                </span>
                <span className={`text-[10px] font-medium transition-colors duration-200 ${
                  activeStep === i ? 'text-[#553E53]/60' : 'text-[#553E53]/30'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MOBILE stepper (vertical) ── */}
        <div className="lg:hidden mb-8" aria-hidden>
          <div className="relative flex flex-col gap-0">
            {/* Rail */}
            <div className="absolute left-[19px] top-5 bottom-5 w-1.5 rounded-full bg-[#553E53]/8" />
            <div
              className={`absolute left-[19px] top-5 w-1.5 rounded-full bg-gradient-to-b from-[#4B624A] to-[#553E53] origin-top transition-transform duration-[1000ms] ease-out motion-reduce:transition-none ${
                isInView ? 'scale-y-100' : 'scale-y-0'
              } bottom-5`}
            />
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative flex items-center gap-4 py-3">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold border-[2.5px] bg-white shrink-0 transition-all duration-300 ${
                  step.isLast ? 'border-[#553E53] text-[#F5F6F0] bg-[#553E53]' : 'border-[#553E53]/25 text-[#553E53]'
                }`}>
                  {step.isLast ? <IconCheck className="w-4 h-4" /> : i + 1}
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#553E53]/40 tracking-wide">{['Day 1', 'Week 1', 'Week 2', 'Week 2–3'][i]}</span>
                  <p className="text-sm font-bold text-[#553E53] leading-snug">{step.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Step cards grid ── */}
        <ol className="grid gap-4 lg:gap-5 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i;
            return (
              <li
                key={step.title}
                className="relative flex gap-4 lg:flex-col lg:gap-0 cursor-default"
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Card */}
                <div
                  className={`flex-1 lg:flex-none rounded-2xl border p-5 transition-all duration-300 ${step.accentBorder} bg-gradient-to-br ${step.gradient} ${
                    isActive ? 'shadow-lg shadow-[#553E53]/8 -translate-y-1' : 'shadow-sm'
                  }`}
                >
                  {/* Icon + badge row */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[#553E53] border ${step.accentBorder} bg-white/60`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${step.ownerColor}`}>
                      {step.owner}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-bold text-[#553E53] leading-snug mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#553E53]/65 leading-relaxed mb-4">
                    {step.desc}
                  </p>

                  {/* Detail tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {step.detail.split(' · ').map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 rounded-md bg-white/70 border border-[#553E53]/10 text-[10px] font-semibold text-[#553E53]/55 tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* ── CTA Panel ── */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-[#553E53] px-6 py-10 sm:px-12 sm:py-12">
          {/* Decorative glows */}
          <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#B6CBDE]/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#4B624A]/20 blur-2xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl space-y-3">
              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-2">
                {['Setup in 2 weeks', 'No tech team needed', 'Cancel any time'].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-semibold text-[#F5F6F0]/80 border border-white/10"
                  >
                    <IconCheck className="w-2.5 h-2.5 text-[#B6CBDE]" />
                    {badge}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F6F0] tracking-tight leading-tight">
                See Dermo on your<br className="hidden sm:block" /> clinic&apos;s workflow
              </h3>
              <p className="text-sm text-[#F5F6F0]/65 leading-relaxed">
                Book a demo and we&apos;ll walk through how Dermo would handle your schedule, treatments,
                and patient conversations — live.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <button
                type="button"
                id="how-it-works-book-demo"
                onClick={onBookDemo}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#F5F6F0] text-[#553E53] text-sm font-bold hover:bg-white transition-all duration-200 hover:shadow-lg hover:shadow-[#553E53]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6CBDE]"
              >
                <IconCalendar className="w-4 h-4" />
                Book a free demo
                <IconChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </button>
              <p className="text-[11px] text-[#F5F6F0]/45 font-medium">
                30 min · No commitment required
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}