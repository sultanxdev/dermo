'use client';

import React from 'react';
import {
  IconMessageSquare,
  IconFileText,
  IconUserCheck,
  IconCalendar,
  IconCreditCard,
  IconShieldCheck,
} from '@/components/ui/icons';
import { useInView } from '@/hooks/use-in-view';

const FEATURES_LIST = [
  {
    icon: IconMessageSquare,
    title: 'WhatsApp AI Receptionist',
    desc: 'Handle patient inquiries 24/7 through the clinic’s verified WhatsApp number without letting leads go cold after hours.',
    status: 'WhatsApp Business API connected • Instant 24/7 routing',
  },
  {
    icon: IconFileText,
    title: 'Clinic Knowledge',
    desc: 'Answer using clinic services, pricing, FAQs, policies, providers, and approved information with verified accuracy.',
    status: 'Grounded Vector Knowledge • Procedure & fee catalog',
  },
  {
    icon: IconUserCheck,
    title: 'Lead Capture',
    desc: 'Capture and organize patient inquiries, extracting name, contact number, treatment intent, and priority status automatically.',
    status: 'CRM sync active • Automatic patient intent profiling',
  },
  {
    icon: IconCalendar,
    title: 'Appointment Booking',
    desc: 'Check real provider availability and manage booking based on doctor shifts, treatment duration, and schedule buffers.',
    status: 'Real shift engine • Prevents double-booking',
  },
  {
    icon: IconCreditCard,
    title: 'Payment Collection',
    desc: 'Collect consultation or booking deposits right inside WhatsApp, securing clinic appointments and curbing no-shows.',
    status: 'Razorpay / UPI integrated • Auto-locks reservation',
  },
  {
    icon: IconShieldCheck,
    title: 'Human Handoff',
    desc: 'Allow staff to immediately take over conversations at any time. AI automation pauses instantly with complete thread history.',
    status: '1-click takeover console • Real-time notification',
  },
];

export function Features() {
  const { ref, isInView } = useInView();

  return (
    <section id="features" className="py-20 border-b border-[#553E53]/12" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
            Everything Your Clinic Needs to Automate the Front Desk.
          </h2>
          <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
            Built specifically around the operational realities of appointment-based outpatient practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES_LIST.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-[#F5F6F0] border border-[#553E53]/15 p-6 rounded-3xl space-y-4 hover:border-[#553E53]/40 transition-colors shadow-2xs"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#553E53] text-[#F5F6F0] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#B6CBDE]" />
                </div>
                <h3 className="text-lg font-bold text-[#553E53]">{feature.title}</h3>
                <p className="text-[#553E53]/75 text-xs sm:text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
                <div className="p-3 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/10 text-[11px] text-[#553E53] font-medium">
                  <span className="text-[#4B624A] font-bold">UI Status:</span> {feature.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
