'use client';

import React from 'react';
import {
  IconMessageSquare,
  IconBot,
  IconArrowDown,
  IconFileText,
  IconUserCheck,
  IconCalendar,
  IconClock,
  IconCreditCard,
  IconShieldCheck,
  IconBuilding,
} from '@/components/ui/icons';
import { useInView } from '@/hooks/use-in-view';

export function Workflow() {
  const { ref, isInView } = useInView();

  return (
    <section id="workflow" className="py-16 lg:py-24 border-b border-[#553E53]/12" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
            Integrated Product Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
            One AI Employee. Your Entire Front Desk.
          </h2>
          <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
            A closed-loop operations pipeline connecting patient WhatsApp inquiries directly into clinic doctor availability and staff management.
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="max-w-4xl mx-auto bg-[#F5F6F0] rounded-3xl p-6 sm:p-10 border border-[#553E53]/15 shadow-sm space-y-7">
          {/* Step 1: Patient WhatsApp */}
          <div className="flex flex-col items-center">
            <div className="px-6 py-3 rounded-2xl bg-[#553E53] text-[#F5F6F0] text-center shadow-sm flex items-center gap-2.5">
              <IconMessageSquare className="w-4 h-4 text-[#B6CBDE]" />
              <span className="font-bold text-sm sm:text-base">Patient WhatsApp</span>
            </div>
            <div className="w-0.5 h-6 bg-[#553E53]/30 my-1" />
            <IconArrowDown className="w-4 h-4 text-[#553E53] -mt-1" />
          </div>

          {/* Step 2: Dermo AI Engine */}
          <div className="flex flex-col items-center">
            <div className="px-8 py-3.5 rounded-2xl bg-[#B6CBDE]/30 border-2 border-[#553E53] text-[#553E53] text-center shadow-2xs flex items-center gap-3">
              <IconBot className="w-5 h-5 text-[#553E53]" />
              <div>
                <span className="font-bold text-base block">Dermo AI</span>
                <span className="text-[11px] text-[#553E53]/70 font-semibold">
                  Clinic Knowledge & Intent Classification
                </span>
              </div>
            </div>
            <div className="w-0.5 h-6 bg-[#553E53]/30 my-1" />
            <IconArrowDown className="w-4 h-4 text-[#553E53] -mt-1" />
          </div>

          {/* Step 3: Tri-branch Architecture */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Branch 1: Answer */}
            <div className="p-5 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 text-center flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#553E53] text-[#F5F6F0] mx-auto flex items-center justify-center mb-2.5">
                  <IconFileText className="w-4 h-4 text-[#B6CBDE]" />
                </div>
                <h4 className="font-bold text-sm text-[#553E53]">Answer</h4>
                <p className="text-xs text-[#553E53]/75 mt-1 font-medium leading-relaxed">
                  Verified procedure pricing, pre-treatment instructions, clinic hours, and doctor bios.
                </p>
              </div>
            </div>

            {/* Branch 2: Lead Capture */}
            <div className="p-5 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 text-center flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#553E53] text-[#F5F6F0] mx-auto flex items-center justify-center mb-2.5">
                  <IconUserCheck className="w-4 h-4 text-[#B6CBDE]" />
                </div>
                <h4 className="font-bold text-sm text-[#553E53]">Lead Capture</h4>
                <p className="text-xs text-[#553E53]/75 mt-1 font-medium leading-relaxed">
                  Captures patient contact, treatment interest, urgency, and records lead profile.
                </p>
              </div>
            </div>

            {/* Branch 3: Booking */}
            <div className="p-5 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 text-center flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#553E53] text-[#F5F6F0] mx-auto flex items-center justify-center mb-2.5">
                  <IconCalendar className="w-4 h-4 text-[#B6CBDE]" />
                </div>
                <h4 className="font-bold text-sm text-[#553E53]">Booking</h4>
                <p className="text-xs text-[#553E53]/75 mt-1 font-medium leading-relaxed">
                  Checks real provider shift availability, reserves open slot, and issues deposit link.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4: Availability & Payment */}
          <div className="flex flex-col items-center pt-2">
            <div className="w-full max-w-md p-3 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/20 flex items-center justify-around text-xs font-bold text-[#553E53]">
              <div className="flex items-center gap-1.5">
                <IconClock className="w-3.5 h-3.5 text-[#4B624A]" />
                <span>Real Availability Engine</span>
              </div>
              <span className="text-[#553E53]/30">|</span>
              <div className="flex items-center gap-1.5">
                <IconCreditCard className="w-3.5 h-3.5 text-[#4B624A]" />
                <span>Deposit Collection</span>
              </div>
            </div>
            <div className="w-0.5 h-6 bg-[#553E53]/30 my-1" />
            <IconArrowDown className="w-4 h-4 text-[#553E53] -mt-1" />
          </div>

          {/* Step 5: Human Handoff Bridge */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md p-3.5 rounded-2xl bg-[#4B624A]/10 border border-[#4B624A]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <IconShieldCheck className="w-4 h-4 text-[#4B624A]" />
                <span className="font-bold text-[#553E53]">Human Handoff</span>
              </div>
              <span className="text-[11px] text-[#4B624A] font-bold">
                1-Click Receptionist Takeover
              </span>
            </div>
            <div className="w-0.5 h-6 bg-[#553E53]/30 my-1" />
            <IconArrowDown className="w-4 h-4 text-[#553E53] -mt-1" />
          </div>

          {/* Step 6: Clinic Dashboard */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-[#553E53] text-[#F5F6F0] font-bold text-sm shadow-sm">
              <IconBuilding className="w-4 h-4 text-[#B6CBDE]" />
              <span>Clinic Dashboard</span>
            </div>
            <p className="text-xs text-[#553E53]/70 mt-2 font-medium">
              Live appointments, patient pipeline, conversation logs, and staff takeover switch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
