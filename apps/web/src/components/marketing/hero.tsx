'use client';

import React from 'react';
import { IconArrowRight, IconArrowDown } from '@/components/ui/icons';
import { PhoneDemo } from './phone-demo';

interface HeroProps {
  onBookDemo: () => void;
}

export function Hero({ onBookDemo }: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 sm:pt-14 sm:pb-20 lg:pt-24 lg:pb-28 xl:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* Left Column: SaaS Value Proposition (~52% on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* 1. Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B6CBDE]/30 border border-[#553E53]/15 text-[#553E53] text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-5 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4B624A]" aria-hidden="true" />
              <span>AI Employee for Clinics</span>
            </div>

            {/* 2. Headline */}
            <h1 className="text-[34px] leading-[1.12] sm:text-5xl sm:leading-[1.08] lg:text-[52px] lg:leading-[1.08] xl:text-[58px] xl:leading-[1.06] font-extrabold tracking-[-0.035em] text-[#553E53] max-w-[620px] mb-6 sm:mb-7">
              The 24/7 AI Employee for Modern Clinics.
            </h1>

            {/* 3. Supporting Copy */}
            <p className="text-[17px] sm:text-[18px] lg:text-[18.5px] leading-[1.65] text-[#553E53]/75 font-medium max-w-[560px] mb-7 sm:mb-8">
              Dermo handles patient conversations on WhatsApp, captures leads, answers questions using your clinic&apos;s verified information, checks real provider availability, books appointments, collects payments, and hands conversations to your team when needed.
            </p>

            {/* 4. Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={onBookDemo}
                className="group h-[52px] px-6 sm:px-7 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-bold text-[15px] shadow-sm hover:shadow-md flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98]"
              >
                <span>Book a Demo</span>
                <IconArrowRight className="w-4 h-4 text-[#B6CBDE] transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA */}
              <a
                href="#workflow"
                className="h-[52px] px-6 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/25 border border-[#553E53]/20 hover:border-[#553E53]/35 text-[#553E53] font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span>See How It Works</span>
                <IconArrowDown className="w-4 h-4 text-[#553E53]/70 transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>
            </div>

            {/* 5. Trust Line */}
            <p className="text-[13px] sm:text-sm text-[#4B624A] font-semibold tracking-normal mt-5 sm:mt-6">
              Built for outpatient clinics. Managed onboarding. Human-controlled.
            </p>
          </div>

          {/* Right Column: Interactive Phone Demo (~48% on desktop) */}
          <div id="demo" className="lg:col-span-5 flex justify-center lg:justify-end mt-4 lg:mt-0">
            <PhoneDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
