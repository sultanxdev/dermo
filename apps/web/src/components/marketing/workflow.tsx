'use client';

import React, { useState } from 'react';
import {
  IconFileText,
  IconUserCheck,
  IconCalendar,
  IconCreditCard,
  IconShieldCheck,
  IconCheck,
} from '@/components/ui/icons';

const STAGES = [
  {
    id: 'answer',
    icon: IconFileText,
    title: 'Answer',
    desc: 'Replies from your approved pricing, procedures, hours, and doctor profiles.',
    chat: [
      { from: 'patient', text: 'How much is a chemical peel, and is there downtime?' },
      { from: 'dermo', text: 'Our glycolic peel is listed at the price in your catalog. Most patients see mild redness for 1–2 days. Would you like to book a consultation?' },
    ],
    backstage: ['Matched intent: treatment pricing', 'Pulled approved price and aftercare notes', 'No diagnosis requested, so no escalation'],
    result: 'Conversation logged in the dashboard',
  },
  {
    id: 'capture',
    icon: IconUserCheck,
    title: 'Capture lead',
    desc: 'Records who is asking, what they want, and how urgent it is.',
    chat: [
      { from: 'patient', text: 'I’d like to start laser hair removal soon. I’m Ananya.' },
      { from: 'dermo', text: 'Nice to meet you, Ananya. Is this number the best one to reach you on?' },
    ],
    backstage: ['Name: Ananya', 'Treatment interest: laser hair removal', 'Priority: ready to book'],
    result: 'New lead added to the patient pipeline',
  },
  {
    id: 'book',
    icon: IconCalendar,
    title: 'Book',
    desc: 'Offers only slots that exist, based on doctor shifts and treatment length.',
    chat: [
      { from: 'patient', text: 'Anything this Saturday?' },
      { from: 'dermo', text: 'Dr. Mehta has 11:00 and 12:30 open on Saturday. Which would you prefer?' },
    ],
    backstage: ['Checked Dr. Mehta’s Saturday shift', 'Applied 45 min treatment + buffer', 'Held 11:00 slot while patient decides'],
    result: 'Slot reserved on the clinic calendar',
  },
  {
    id: 'pay',
    icon: IconCreditCard,
    title: 'Collect deposit',
    desc: 'Sends a payment link in the chat so confirmed visits are paid for.',
    chat: [
      { from: 'patient', text: '11:00 works.' },
      { from: 'dermo', text: 'Booked tentatively. Pay the deposit here to confirm: [payment link]' },
    ],
    backstage: ['Generated deposit link', 'Slot locked until payment completes', 'Reminder queued if unpaid'],
    result: 'Appointment confirmed after payment',
  },
] as const;

export function Workflow() {
  const [activeId, setActiveId] = useState<(typeof STAGES)[number]['id']>('answer');
  const stage = STAGES.find((s) => s.id === activeId)!;

  return (
    <section id="workflow" className="py-20 sm:py-24 border-b border-[#553E53]/10 bg-[#F5F6F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 space-y-4">
          <p className="text-sm font-semibold text-[#4B624A]">How Dermo works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight text-balance">
            From first message to confirmed appointment
          </h2>
          <p className="text-base text-[#553E53]/75 leading-relaxed">
            Dermo connects patient WhatsApp conversations to your doctors&apos; real availability and your
            dashboard. Pick a stage to see what the patient sees and what happens behind the scenes.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-12 items-start">
          {/* Stage selector */}
          <div role="tablist" aria-label="Conversation stages" aria-orientation="vertical" className="space-y-2">
            {STAGES.map((s) => {
              const Icon = s.icon;
              const on = s.id === activeId;
              return (
                <button
                  key={s.id}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  onClick={() => setActiveId(s.id)}
                  className={`w-full text-left flex gap-4 p-4 rounded-2xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B624A] ${on ? 'bg-white border-[#553E53]/40 shadow-sm' : 'border-transparent hover:bg-[#553E53]/5'
                    }`}
                >
                  <span
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${on ? 'bg-[#553E53] text-[#B6CBDE]' : 'bg-[#B6CBDE]/35 text-[#553E53]'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block font-bold text-[#553E53]">{s.title}</span>
                    <span className="block text-sm text-[#553E53]/70 leading-relaxed mt-0.5">{s.desc}</span>
                  </span>
                </button>
              );
            })}

            <div className="flex gap-4 p-4 mt-4 rounded-2xl bg-[#4B624A]/10 border border-[#4B624A]/25">
              <IconShieldCheck className="w-5 h-5 text-[#4B624A] shrink-0 mt-0.5" />
              <p className="text-sm text-[#553E53] leading-relaxed">
                <strong className="font-bold">Staff can step in at any stage.</strong> One click pauses Dermo and
                hands the thread to your receptionist.
              </p>
            </div>
          </div>

          {/* Product panel */}
          <div role="tabpanel" className="rounded-3xl bg-[#B6CBDE]/20 border border-[#553E53]/15 p-4 sm:p-6 space-y-4">
            <div className="rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#553E53]/10 text-xs font-semibold text-[#553E53]">
                Patient&apos;s WhatsApp
              </div>
              <div className="p-4 space-y-3 min-h-[170px]" aria-live="polite">
                {stage.chat.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'dermo' ? 'justify-end' : 'justify-start'}`}>
                    <p
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === 'dermo'
                          ? 'bg-[#553E53] text-[#F5F6F0] rounded-br-md'
                          : 'bg-white border border-[#553E53]/10 text-[#553E53] rounded-bl-md'
                        }`}
                    >
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10 p-4">
                <h3 className="text-xs font-semibold text-[#553E53]/70 mb-2.5">Behind the scenes</h3>
                <ul className="space-y-2">
                  {stage.backstage.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-[#553E53] leading-snug">
                      <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-[#553E53] p-4 flex flex-col justify-between gap-3">
                <h3 className="text-xs font-semibold text-[#B6CBDE]">Clinic dashboard</h3>
                <p className="text-sm font-semibold text-[#F5F6F0] leading-snug">{stage.result}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}