'use client';

import React from 'react';
import { IconArrowRight, IconArrowDown } from '@/components/ui/icons';
import { PhoneDemo } from './phone-demo';

interface HeroProps {
  onBookDemo: () => void;
}

/* -------------------------------------------------------------------------- */
/* Local content & helpers                                                     */
/* -------------------------------------------------------------------------- */

const CAPABILITIES = [
  'Answers patient questions from your verified clinic info',
  'Checks real provider availability and books the slot',
  'Collects deposits and confirms the appointment',
  'Hands over to your team the moment a human is needed',
] as const;

const TRUST_POINTS = ['Built for outpatient clinics', 'Managed onboarding', 'Human-controlled'] as const;

const IconCheck = () => (
  <svg
    className="h-3 w-3 text-[#F5F6F0]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function FloatingChip({
  className,
  icon,
  title,
  subtitle,
}: {
  className: string;
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute hidden items-center gap-2.5 rounded-2xl border border-[#553E53]/10 bg-white/95 px-3.5 py-2.5 shadow-[0_12px_30px_-10px_rgba(85,62,83,0.28)] backdrop-blur xl:flex ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4B624A]/10 text-[15px]">
        {icon}
      </span>
      <span className="leading-tight">
        <span className="block text-[12px] font-bold text-[#553E53]">{title}</span>
        <span className="block text-[11px] font-medium text-[#553E53]/60">{subtitle}</span>
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

export function Hero({ onBookDemo }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#F5F6F0] pb-16 pt-12 sm:pb-20 sm:pt-14 lg:pb-28 lg:pt-24 xl:pb-32"
    >
      {/* Decorative background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-32 h-[520px] w-[520px] rounded-full bg-[#B6CBDE]/40 blur-3xl" />
        <div className="absolute -left-40 top-1/2 h-[420px] w-[420px] rounded-full bg-[#4B624A]/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(rgba(85,62,83,0.12) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse at 70% 40%, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 70% 40%, black 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Left column */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#553E53]/15 bg-[#B6CBDE]/30 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#553E53] sm:mb-6 sm:text-xs">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#4B624A] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4B624A]" />
              </span>
              <span>AI Employee for Clinics</span>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="mb-5 max-w-[640px] text-balance text-[34px] font-extrabold leading-[1.12] tracking-[-0.035em] text-[#553E53] sm:mb-6 sm:text-5xl sm:leading-[1.08] lg:text-[52px] lg:leading-[1.08] xl:text-[58px] xl:leading-[1.06]"
            >
              Turn every WhatsApp message into a{' '}
              <span className="relative inline-block text-[#4B624A] sm:whitespace-nowrap">
                booked appointment
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-2 w-full text-[#B6CBDE]"
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path d="M2 5.5C40 1.5 110 1 198 4.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>

            {/* Supporting copy */}
            <p className="mb-6 max-w-[540px] text-[17px] font-medium leading-[1.65] text-[#553E53]/75 sm:text-[18px] lg:text-[18.5px]">
              Dermo is the 24/7 AI employee for your clinic. It replies instantly, captures every lead, and
              books patients while your front desk focuses on the people in the room.
            </p>

            {/* Capability checklist */}
            <ul className="mb-8 max-w-[540px] space-y-2.5 sm:mb-9">
              {CAPABILITIES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[14.5px] font-medium leading-snug text-[#553E53]/85 sm:text-[15px]"
                >
                  <span className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#4B624A]">
                    <IconCheck />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={onBookDemo}
                className="group flex h-[52px] items-center justify-center gap-2.5 rounded-xl bg-[#553E53] px-7 text-[15px] font-bold text-[#F5F6F0] shadow-sm transition-all duration-200 hover:bg-[#4B624A] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#553E53] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F6F0] active:scale-[0.98]"
              >
                <span>Book a Demo</span>
                <IconArrowRight className="h-4 w-4 text-[#B6CBDE] transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <a
                href="#how-it-works"
                className="group flex h-[52px] items-center justify-center gap-2 rounded-xl border border-[#553E53]/20 bg-white/70 px-6 text-[15px] font-bold text-[#553E53] transition-all duration-200 hover:border-[#553E53]/35 hover:bg-[#B6CBDE]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#553E53] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F6F0]"
              >
                <span>See How It Works</span>
                <IconArrowDown className="h-4 w-4 text-[#553E53]/70 transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>
            </div>

            {/* Trust line */}
            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] font-semibold text-[#4B624A] sm:text-sm">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#4B624A]/60" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: phone demo */}
          <div id="demo" className="mt-2 flex scroll-mt-24 justify-center lg:col-span-5 lg:mt-0 lg:justify-end">
            <div className="relative">
              {/* Soft glow behind the phone */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 bottom-0 top-10 rounded-[3rem] bg-[#B6CBDE]/50 blur-3xl"
              />

              <div className="relative">
                <PhoneDemo />
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;