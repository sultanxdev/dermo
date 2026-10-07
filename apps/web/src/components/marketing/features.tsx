'use client';

import React, { useState } from 'react';
import {
  IconMessageSquare,
  IconFileText,
  IconUserCheck,
  IconCalendar,
  IconCreditCard,
  IconShieldCheck,
  IconCheck,
} from '@/components/ui/icons';

/* Per-feature accent config */
const FEATURES_LIST = [
  {
    icon: IconMessageSquare,
    title: 'WhatsApp AI receptionist',
    desc: 'Reply to patients 24/7 from your clinic\u2019s verified WhatsApp number, so after-hours enquiries don\u2019t go cold.',
    tags: ['WhatsApp Business API', '24/7'],
    iconBg: 'bg-[#4B624A]/12 text-[#4B624A]',
    borderAccent: 'hover:border-[#4B624A]/40',
    glowColor: 'rgba(75,98,74,0.06)',
    hero: true,
  },
  {
    icon: IconFileText,
    title: 'Clinic knowledge',
    desc: 'Answer from your approved services, pricing, FAQs, policies, and provider details. Nothing made up.',
    tags: ['Treatment catalog', 'Pricing', 'FAQs'],
    iconBg: 'bg-[#B6CBDE]/40 text-[#553E53]',
    borderAccent: 'hover:border-[#B6CBDE]/60',
    glowColor: 'rgba(182,203,222,0.08)',
    hero: false,
  },
  {
    icon: IconUserCheck,
    title: 'Lead capture',
    desc: 'Capture each enquiry with the patient\u2019s name, number, treatment interest, and priority, ready for follow-up.',
    tags: ['Name & contact', 'Treatment intent'],
    iconBg: 'bg-[#553E53]/10 text-[#553E53]',
    borderAccent: 'hover:border-[#553E53]/30',
    glowColor: 'rgba(85,62,83,0.06)',
    hero: false,
  },
  {
    icon: IconCalendar,
    title: 'Appointment booking',
    desc: 'Book against real doctor shifts, treatment durations, and buffers between visits.',
    tags: ['Doctor shifts', 'No double-booking'],
    iconBg: 'bg-[#4B624A]/12 text-[#4B624A]',
    borderAccent: 'hover:border-[#4B624A]/40',
    glowColor: 'rgba(75,98,74,0.06)',
    hero: false,
  },
  {
    icon: IconCreditCard,
    title: 'Payment collection',
    desc: 'Collect consultation or booking deposits inside the chat to confirm slots and reduce no-shows.',
    tags: ['UPI', 'Razorpay'],
    iconBg: 'bg-[#B6CBDE]/40 text-[#553E53]',
    borderAccent: 'hover:border-[#B6CBDE]/60',
    glowColor: 'rgba(182,203,222,0.08)',
    hero: false,
  },
  {
    icon: IconShieldCheck,
    title: 'Human handoff',
    desc: 'Staff can take over any conversation in one click. The AI pauses and the full thread history stays visible.',
    tags: ['One-click takeover', 'Live alerts'],
    iconBg: 'bg-[#553E53]/10 text-[#553E53]',
    borderAccent: 'hover:border-[#553E53]/30',
    glowColor: 'rgba(85,62,83,0.06)',
    hero: false,
  },
];

export function Features() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative py-24 sm:py-32 border-b border-[#553E53]/10 bg-[#F5F6F0] overflow-hidden"
    >
      {/* Subtle background texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 75% 15%, rgba(182,203,222,0.16) 0%, transparent 45%), radial-gradient(circle at 10% 85%, rgba(75,98,74,0.08) 0%, transparent 40%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="max-w-2xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4B624A]/25 bg-[#4B624A]/8 text-[#4B624A] text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4B624A]" />
            Features
          </div>
          <h2
            id="features-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance leading-[1.1]"
          >
            <span className="text-[#553E53]">Everything your front desk does</span>
            <br className="hidden sm:block" />
            <span className="text-[#4B624A]"> on WhatsApp, automated</span>
          </h2>
          <p className="text-base sm:text-lg text-[#553E53]/70 leading-relaxed max-w-xl">
            Built for appointment-based outpatient clinics, from the first message to a paid booking.
          </p>
        </div>

        {/* ── Feature cards grid ── */}
        <ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Feature list"
        >
          {FEATURES_LIST.map((feature) => {
            const Icon = feature.icon;
            const isHovered = hovered === feature.title;
            return (
              <li
                key={feature.title}
                className={`group relative rounded-2xl border border-[#553E53]/10 bg-white/50 p-6 transition-all duration-300 cursor-default ${feature.borderAccent} ${
                  isHovered
                    ? 'shadow-xl -translate-y-1 bg-white/80'
                    : 'shadow-sm hover:shadow-md'
                } ${feature.hero ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                style={
                  isHovered
                    ? {
                        boxShadow: `0 20px 40px -8px ${feature.glowColor}, 0 4px 16px -4px rgba(85,62,83,0.08)`,
                      }
                    : undefined
                }
                onMouseEnter={() => setHovered(feature.title)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Top row: icon + (hero badge) */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${feature.iconBg} ${
                      isHovered ? 'scale-110' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {feature.hero && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#4B624A]/10 text-[#4B624A] text-[10px] font-bold tracking-wide uppercase border border-[#4B624A]/20">
                      <span className="w-1 h-1 rounded-full bg-[#4B624A] animate-pulse" />
                      Core feature
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-[#553E53] leading-snug mb-2 group-hover:text-[#4B624A] transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#553E53]/65 leading-relaxed mb-5">
                  {feature.desc}
                </p>

                {/* Tags with check icons */}
                <ul
                  className="flex flex-wrap gap-2"
                  aria-label={`${feature.title} details`}
                >
                  {feature.tags.map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F6F0] border border-[#553E53]/10 text-[11px] font-semibold text-[#553E53]/65"
                    >
                      <IconCheck className="w-2.5 h-2.5 text-[#4B624A] shrink-0" />
                      {tag}
                    </li>
                  ))}
                </ul>

                {/* Subtle bottom accent line that animates in on hover */}
                <div
                  aria-hidden
                  className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#553E53]/20 to-transparent transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </li>
            );
          })}
        </ul>

        {/* ── Bottom stat strip ── */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-[#553E53]/10 bg-[#553E53]/10">
          {[
            { value: '24/7', label: 'Patient availability' },
            { value: '< 5s', label: 'Average reply time' },
            { value: '100%', label: 'Clinic-verified answers' },
            { value: '1-click', label: 'Human takeover' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#F5F6F0] px-6 py-5 flex flex-col gap-0.5"
            >
              <span className="text-2xl font-extrabold text-[#553E53] tracking-tight">{stat.value}</span>
              <span className="text-xs text-[#553E53]/55 font-medium leading-snug">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}