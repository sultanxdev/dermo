'use client';

import React from 'react';
import { IconArrowRight, IconChevronDown } from '@/components/ui/icons';
import { PhoneDemo } from './phone-demo';

interface HeroProps {
  onBookDemo: () => void;
}

export function Hero({ onBookDemo }: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: SaaS Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B6CBDE]/30 border border-[#553E53]/15 text-[#553E53] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#4B624A]" />
              <span>AI EMPLOYEE FOR CLINICS</span>
            </div>

            {/* Exact Requested Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#553E53] leading-[1.12]">
              The 24/7 AI Employee for Modern Clinics.
            </h1>

            {/* Exact Requested Supporting Copy */}
            <p className="text-base sm:text-lg text-[#553E53]/80 max-w-xl leading-relaxed font-normal">
              Dermo handles patient conversations on WhatsApp, captures leads, answers questions using your clinic&apos;s verified information, checks real provider availability, books appointments, collects payments, and hands conversations to your team when needed.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={onBookDemo}
                className="group px-6 py-3.5 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-bold text-sm sm:text-base shadow-sm flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Book a Demo</span>
                <IconArrowRight className="w-4 h-4 text-[#B6CBDE] transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#workflow"
                className="px-6 py-3.5 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/25 text-[#553E53] font-bold text-sm sm:text-base flex items-center gap-2 transition-all"
              >
                <span>See How It Works</span>
                <IconChevronDown className="w-4 h-4 text-[#553E53]/80" />
              </a>
            </div>

            {/* Supporting Line */}
            <p className="text-xs sm:text-sm text-[#4B624A] font-semibold pt-1">
              Built for outpatient clinics. Managed onboarding. Human-controlled.
            </p>
          </div>

          {/* Right Column: Realistic iPhone Smartphone Frame & Interactive WhatsApp UI */}
          <div id="demo" className="lg:col-span-6 flex justify-center">
            <PhoneDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
