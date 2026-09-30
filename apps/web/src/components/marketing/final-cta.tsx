'use client';

import React from 'react';
import { IconArrowRight, IconChevronDown } from '@/components/ui/icons';

interface FinalCTAProps {
  onBookDemo: () => void;
}

export function FinalCTA({ onBookDemo }: FinalCTAProps) {
  return (
    <section className="py-20 border-b border-[#553E53]/12 bg-[#B6CBDE]/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
          Give Your Clinic a 24/7 AI Employee.
        </h2>
        <p className="text-sm sm:text-base text-[#553E53]/80 max-w-xl mx-auto font-medium leading-relaxed">
          Let Dermo handle repetitive patient conversations while your team focuses on running the clinic.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onBookDemo}
            className="group px-7 py-3.5 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-bold text-sm sm:text-base shadow-sm flex items-center gap-2 transition-all active:scale-[0.98]"
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
      </div>
    </section>
  );
}
