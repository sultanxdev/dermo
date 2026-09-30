'use client';

import React from 'react';
import { CAPABILITY_ITEMS } from '@/config/constants';

export function CapabilityStrip() {
  return (
    <section className="py-5 border-y border-[#553E53]/15 bg-[#B6CBDE]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-bold text-[#553E53] tracking-wide text-center">
          {CAPABILITY_ITEMS.map((item, idx) => (
            <React.Fragment key={item}>
              <span>{item}</span>
              {idx < CAPABILITY_ITEMS.length - 1 && (
                <span className="text-[#4B624A] font-extrabold">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
