'use client';

import React from 'react';
import { IconChevronRight } from '@/components/ui/icons';
import { useInView } from '@/hooks/use-in-view';

interface HowItWorksProps {
  onBookDemo: () => void;
}

const STEPS = [
  {
    title: 'Book a demo',
    owner: 'You share',
    desc: 'Tell us your specialty, doctor schedule, and current WhatsApp volume.',
  },
  {
    title: 'We configure your workspace',
    owner: 'We build',
    desc: 'We load verified clinic info, treatments, pricing, doctor shifts, your WhatsApp number, and payments.',
  },
  {
    title: 'Test with real scenarios',
    owner: 'Together',
    desc: 'Your team tries real patient conversations in a simulator before anything touches live WhatsApp.',
  },
  {
    title: 'Go live',
    owner: 'Live',
    desc: 'Dermo answers patients 24/7 while your team supervises every conversation from the dashboard.',
  },
];

export function HowItWorks({ onBookDemo }: HowItWorksProps) {
  const { ref, isInView } = useInView();

  return (
    <section
      id="how-it-works"
      ref={ref}
      aria-labelledby="how-it-works-title"
      className="py-20 sm:py-24 border-b border-[#553E53]/10 bg-[#F5F6F0]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 space-y-4">
          <p className="text-sm font-semibold text-[#4B624A]">Managed onboarding</p>
          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight text-balance"
          >
            We set up Dermo around your clinic
          </h2>
          <p className="text-base text-[#553E53]/75 leading-relaxed">
            No bot builders and no self-service setup. We configure and test Dermo against your real
            schedule and procedures, then you go live with full human oversight.
          </p>
        </div>

        {/* Timeline: vertical on mobile, horizontal on lg */}
        <ol className="relative grid gap-10 lg:gap-6 lg:grid-cols-4">
          {/* Connector line */}
          <span
            aria-hidden
            className="absolute left-[19px] top-2 bottom-2 w-px bg-[#553E53]/15 lg:left-5 lg:right-5 lg:top-[19px] lg:bottom-auto lg:h-px lg:w-auto"
          />
          <span
            aria-hidden
            className={`absolute left-[19px] top-2 w-px bg-[#4B624A] origin-top transition-transform duration-1000 ease-out motion-reduce:transition-none lg:left-5 lg:right-5 lg:top-[19px] lg:h-px lg:w-auto lg:origin-left ${isInView ? 'scale-y-100 lg:scale-x-100' : 'scale-y-0 lg:scale-y-100 lg:scale-x-0'
              } bottom-2 lg:bottom-auto`}
          />

          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1;
            return (
              <li key={step.title} className="relative flex gap-4 lg:block lg:pr-4">
                <div
                  className={`relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${isLast
                      ? 'bg-[#553E53] text-[#F5F6F0] border-[#553E53]'
                      : 'bg-[#F5F6F0] text-[#4B624A] border-[#4B624A]'
                    }`}
                >
                  {i + 1}
                </div>
                <div className="lg:mt-6 space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#B6CBDE]/30 text-[11px] font-semibold text-[#553E53]">
                    {step.owner}
                  </span>
                  <h3 className="text-lg font-bold text-[#553E53] leading-snug">{step.title}</h3>
                  <p className="text-sm text-[#553E53]/75 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* CTA panel */}
        <div className="mt-16 rounded-3xl bg-[#553E53] px-6 py-10 sm:px-12 sm:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <h3 className="text-2xl font-bold text-[#F5F6F0] tracking-tight">
              See Dermo on your clinic&apos;s workflow
            </h3>
            <p className="text-sm text-[#F5F6F0]/75 leading-relaxed">
              Book a demo and we&apos;ll walk through how Dermo would handle your schedule, treatments,
              and patient conversations.
            </p>
          </div>
          <button
            type="button"
            onClick={onBookDemo}
            className="group shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F5F6F0] text-[#553E53] text-sm font-bold hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6CBDE]"
          >
            Book a demo
            <IconChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </button>
        </div>
      </div>
    </section>
  );
}