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

const FEATURES_LIST = [
  {
    icon: IconMessageSquare,
    title: 'WhatsApp AI receptionist',
    desc: 'Reply to patients 24/7 from your clinic’s verified WhatsApp number, so after-hours enquiries don’t go cold.',
    tags: ['WhatsApp Business API', '24/7'],
  },
  {
    icon: IconFileText,
    title: 'Clinic knowledge',
    desc: 'Answer from your approved services, pricing, FAQs, policies, and provider details. Nothing made up.',
    tags: ['Treatment catalog', 'Pricing', 'FAQs'],
  },
  {
    icon: IconUserCheck,
    title: 'Lead capture',
    desc: 'Capture each enquiry with the patient’s name, number, treatment interest, and priority, ready for follow-up.',
    tags: ['Name & contact', 'Treatment intent'],
  },
  {
    icon: IconCalendar,
    title: 'Appointment booking',
    desc: 'Book against real doctor shifts, treatment durations, and buffers between visits.',
    tags: ['Doctor shifts', 'No double-booking'],
  },
  {
    icon: IconCreditCard,
    title: 'Payment collection',
    desc: 'Collect consultation or booking deposits inside the chat to confirm slots and reduce no-shows.',
    tags: ['UPI', 'Razorpay'],
  },
  {
    icon: IconShieldCheck,
    title: 'Human handoff',
    desc: 'Staff can take over any conversation in one click. The AI pauses and the full thread history stays visible.',
    tags: ['One-click takeover', 'Live alerts'],
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-24 border-b border-[#553E53]/10 bg-[#F5F6F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 space-y-4">
          <p className="text-sm font-semibold text-[#4B624A]">Features</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight text-balance">
            Everything your front desk does on WhatsApp, automated
          </h2>
          <p className="text-base text-[#553E53]/75 leading-relaxed">
            Built for appointment-based outpatient clinics, from the first message to a paid booking.
          </p>
        </div>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {FEATURES_LIST.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#B6CBDE]/35 text-[#553E53] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#553E53]">{feature.title}</h3>
                <p className="text-sm text-[#553E53]/75 leading-relaxed">{feature.desc}</p>
                <ul className="flex flex-wrap gap-2 pt-1" aria-label={`${feature.title} details`}>
                  {feature.tags.map((tag) => (
                    <li
                      key={tag}
                      className="px-2.5 py-1 rounded-full border border-[#553E53]/15 text-xs font-medium text-[#553E53]/80"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}