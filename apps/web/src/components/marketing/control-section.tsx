'use client';

import React from 'react';
import { IconCheckCircle } from '@/components/ui/icons';
import { useInView } from '@/hooks/use-in-view';

export function ControlSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-20 border-b border-[#553E53]/12" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
            Staff-Controlled Automation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
            AI Handles the Work. Your Team Stays in Control.
          </h2>
          <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
            We know clinic trust is paramount. Dermo is engineered so clinic staff can step in whenever they choose.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#B6CBDE]/20 rounded-3xl p-6 sm:p-10 border border-[#553E53]/15 space-y-8">
          {/* Visual State Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/15">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4B624A] mx-auto mb-2" />
              <div className="font-bold text-xs sm:text-sm text-[#553E53]">AI Active</div>
              <div className="text-[10px] text-[#553E53]/70 mt-1">Autonomous response to patient questions</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#553E53] text-[#F5F6F0] shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-[#B6CBDE] mx-auto mb-2" />
              <div className="font-bold text-xs sm:text-sm text-[#F5F6F0]">Human Takeover</div>
              <div className="text-[10px] text-[#B6CBDE] mt-1">Staff clicks button to take over thread</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/15">
              <div className="w-2.5 h-2.5 rounded-full bg-[#553E53]/40 mx-auto mb-2" />
              <div className="font-bold text-xs sm:text-sm text-[#553E53]">AI Paused</div>
              <div className="text-[10px] text-[#553E53]/70 mt-1">Staff chats directly with patient</div>
            </div>
          </div>

          {/* Core Operational Guarantees */}
          <div className="grid sm:grid-cols-2 gap-4 text-xs font-medium text-[#553E53]">
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10">
              <IconCheckCircle className="w-4 h-4 text-[#4B624A] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#553E53] font-bold">1-Click Staff Takeover</strong>
                Receptionists can take over any active WhatsApp thread instantly from the dashboard.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10">
              <IconCheckCircle className="w-4 h-4 text-[#4B624A] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#553E53] font-bold">Approved Clinic Knowledge</strong>
                Responses adhere strictly to your uploaded procedure descriptions and verified pricing.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10">
              <IconCheckCircle className="w-4 h-4 text-[#4B624A] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#553E53] font-bold">Real Provider Availability</strong>
                Appointments are only offered when doctors actually have an open slot in the schedule.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10">
              <IconCheckCircle className="w-4 h-4 text-[#4B624A] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#553E53] font-bold">Medical Safety Escalation</strong>
                Requests for diagnoses or medical opinions trigger immediate clinical escalation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
