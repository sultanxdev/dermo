'use client';

import React from 'react';
import { IconChevronRight } from '@/components/ui/icons';
import { useInView } from '@/hooks/use-in-view';

interface HowItWorksProps {
  onBookDemo: () => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Book a Demo',
    desc: 'Tell us about your clinic, specialty, doctor schedule, and current WhatsApp volume.',
  },
  {
    num: '02',
    title: 'We Configure Workspace',
    desc: 'We load your verified clinic info, treatments, pricing, doctor shifts, WhatsApp number, and payments.',
  },
  {
    num: '03',
    title: 'Test Your AI Employee',
    desc: 'We simulate and test real patient scenarios with your team before connecting your live WhatsApp.',
  },
  {
    num: '04',
    title: 'Go Live',
    desc: 'Your clinic begins handling patient inquiries 24/7 with full human oversight from the dashboard.',
  },
];

export function HowItWorks({ onBookDemo }: HowItWorksProps) {
  const { ref, isInView } = useInView();

  return (
    <section id="how-it-works" className="py-20 border-b border-[#553E53]/12" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
            Managed Clinic Onboarding
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
            We Set Up Dermo With Your Clinic.
          </h2>
          <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
            No complicated self-service setups or confusing bot builders. We configure and test Dermo around your clinic&apos;s real schedule and procedures.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-3xl bg-[#F5F6F0] border border-[#553E53]/15 space-y-3 shadow-2xs"
            >
              <span className="text-2xl font-extrabold text-[#4B624A] block">{step.num}</span>
              <h4 className="text-base font-bold text-[#553E53]">{step.title}</h4>
              <p className="text-xs text-[#553E53]/75 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Managed Onboarding Visual Strip */}
        <div className="mt-12 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#B6CBDE]/20 border border-[#553E53]/15 text-center space-y-4">
          <h3 className="text-2xl font-bold text-[#553E53]">No Complicated Setup.</h3>
          <p className="text-xs sm:text-sm text-[#553E53]/80 max-w-xl mx-auto font-medium leading-relaxed">
            We help configure Dermo around your clinic&apos;s actual workflow before you go live.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-bold text-[#553E53]">
            <span className="px-3 py-1.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/15">Clinic</span>
            <IconChevronRight className="w-3.5 h-3.5 text-[#553E53]/60" />
            <span className="px-3 py-1.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/15">Demo</span>
            <IconChevronRight className="w-3.5 h-3.5 text-[#553E53]/60" />
            <span className="px-3 py-1.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/15">Configuration</span>
            <IconChevronRight className="w-3.5 h-3.5 text-[#553E53]/60" />
            <span className="px-3 py-1.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/15">Testing</span>
            <IconChevronRight className="w-3.5 h-3.5 text-[#553E53]/60" />
            <span className="px-3 py-1.5 rounded-xl bg-[#553E53] text-[#F5F6F0]">Go Live</span>
          </div>
          <div className="pt-2">
            <button
              onClick={onBookDemo}
              className="px-6 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] text-xs font-bold transition-all shadow-xs"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
