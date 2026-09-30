'use client';

import React from 'react';
import { IconMessageSquare, IconCheck } from '@/components/ui/icons';
import { useInView } from '@/hooks/use-in-view';

const COMMON_QUESTIONS = [
  'What services do you offer?',
  'How much does it cost?',
  'Is the doctor available tomorrow?',
  'Can I book an appointment?',
  'How do I pay?',
  'Can someone call me?',
];

export function Problem() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-16 lg:py-24 border-b border-[#553E53]/12" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
            The Front-Desk Bottleneck
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
            Your Team Shouldn&apos;t Spend All Day Answering the Same Questions.
          </h2>
          <p className="text-sm sm:text-base text-[#553E53]/75 font-medium leading-relaxed">
            These repetitive conversations consume receptionist time and can cause missed leads. Dermo handles the repetitive work while your team stays in control.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Common Repetitive Questions */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#553E53]/70 uppercase tracking-wider mb-2">
              Typical Daily Clinic WhatsApp Volume:
            </div>

            {COMMON_QUESTIONS.map((question, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/15 hover:border-[#553E53]/35 transition-colors shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-[#B6CBDE]/30 text-[#553E53] flex items-center justify-center shrink-0">
                  <IconMessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#553E53]">&ldquo;{question}&rdquo;</span>
              </div>
            ))}
          </div>

          {/* Reception Backlog vs Dermo Operational Visual */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-5">
            <div className="flex items-center justify-between border-b border-[#553E53]/10 pb-3">
              <span className="font-bold text-xs text-[#553E53]">Front Desk Status</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#4B624A]/15 text-[#4B624A] text-[10px] font-bold">
                Dermo Operational
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10 space-y-1">
                <div className="font-bold text-[#553E53]">Without Dermo:</div>
                <p className="text-[#553E53]/75 leading-relaxed">
                  Phone ringing while receptionists answer pricing on WhatsApp. Enquiries after 7:00 PM wait until 10:00 AM next day, often going to competitor clinics.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F6F0] border-2 border-[#4B624A]/40 space-y-1">
                <div className="font-bold text-[#4B624A] flex items-center gap-1.5">
                  <IconCheck className="w-4 h-4 text-[#4B624A]" />
                  <span>With Dermo AI:</span>
                </div>
                <p className="text-[#553E53]/85 leading-relaxed font-medium">
                  Inquiries resolved in seconds 24/7. Verified pricing provided, doctor availability offered, advance deposit collected, and staff step in only when specialized human attention is needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
