'use client';

import React, { useState } from 'react';
import { IconChevronDown } from '@/components/ui/icons';
import { useInView } from '@/hooks/use-in-view';

const FAQS = [
  {
    q: 'Does Dermo replace our receptionist?',
    a: 'No. Dermo acts as an AI front-desk assistant that absorbs repetitive patient inquiries, after-hours messages, pricing queries, and booking logistics. Your reception staff stay in complete control from the dashboard and can step into any conversation with a single click.',
  },
  {
    q: 'Can Dermo use our clinic information?',
    a: 'Yes. Dermo is grounded strictly in your clinic’s verified services, consultation fees, doctor profiles, pre/post-procedure guidance, and scheduling rules. It does not pull outside medical answers or make assumptions.',
  },
  {
    q: 'Can Dermo check real provider availability?',
    a: 'Yes. Dermo evaluates your configured doctor shifts, clinic hours, existing appointments, and procedure durations to offer open slots deterministically, preventing double-bookings.',
  },
  {
    q: 'Can Dermo collect deposits?',
    a: 'Yes. When an appointment is scheduled, Dermo can automatically issue a secure payment link for a consultation or procedure deposit. The slot is locked once the deposit is verified.',
  },
  {
    q: 'Can staff take over conversations?',
    a: 'Immediately. The clinic dashboard provides a 1-click Human Takeover switch. When activated, Dermo AI pauses on that WhatsApp thread, allowing clinic staff to chat directly with the patient.',
  },
  {
    q: 'Does Dermo diagnose patients?',
    a: 'No. Dermo is strictly an administrative front-desk system. It has safety guardrails that block diagnostic claims or prescription advice and immediately flags clinical questions for human staff review.',
  },
  {
    q: 'Do we need to configure everything ourselves?',
    a: 'No. Dermo uses a managed onboarding model. Our team works with your clinic to configure your verified treatment menu, doctor schedules, policies, WhatsApp integration, and payment links before you go live.',
  },
];

export function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { ref, isInView } = useInView();

  return (
    <section id="faq" className="py-20 border-b border-[#553E53]/12" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className={`bg-[#F5F6F0] border rounded-2xl p-5 cursor-pointer transition-colors shadow-2xs ${
                  isOpen ? 'border-[#553E53] bg-[#B6CBDE]/15' : 'border-[#553E53]/15 hover:border-[#553E53]/35'
                }`}
                onClick={() => setOpenFaq(isOpen ? null : i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-bold text-[#553E53] text-sm sm:text-base">{faq.q}</h4>
                  <IconChevronDown
                    className={`w-4 h-4 text-[#553E53] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <div className={`faq-content ${isOpen ? 'open' : ''}`}>
                  <div>
                    <p className="mt-3 text-xs sm:text-sm text-[#553E53]/80 leading-relaxed pt-2 border-t border-[#553E53]/10 font-medium">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
