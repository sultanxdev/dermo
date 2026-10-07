'use client';

import React from 'react';
import { CLINIC_TYPES } from '@/config/constants';
import { useInView } from '@/hooks/use-in-view';

export function ClinicTypes() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-20 border-b border-[#553E53]/12" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
            Specialized Care
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
            Built for the Way Modern Clinics Operate.
          </h2>
          <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
            Configured around the appointment and consultation workflows of specialized outpatient practices.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {CLINIC_TYPES.map((clinic, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/15 hover:border-[#553E53]/35 transition-colors space-y-1.5 shadow-2xs"
            >
              <div className="font-bold text-sm text-[#553E53]">{clinic.title}</div>
              <p className="text-xs text-[#553E53]/70 font-medium leading-relaxed">{clinic.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
