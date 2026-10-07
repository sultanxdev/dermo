'use client';

import React from 'react';
import { IconMessageSquare, IconCheck } from '@/components/ui/icons';
import { useInView } from '@/hooks/use-in-view';

/* ── Inline icons ── */
const IconX = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconClock = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconZap = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconTrendingDown = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" />
  </svg>
);

const QUESTIONS = [
  { text: 'What services do you offer?', time: '9:02 AM' },
  { text: 'How much does it cost?', time: '9:14 AM' },
  { text: 'Is the doctor available tomorrow?', time: '10:31 AM' },
  { text: 'Can I book an appointment?', time: '11:05 AM' },
  { text: 'How do I pay?', time: '2:48 PM' },
  { text: 'Can someone call me?', time: '7:22 PM' },
];

const RESOLVED = [
  { text: 'Pricing sent instantly', sub: 'Verified from clinic knowledge base' },
  { text: 'Slot booked for tomorrow', sub: 'Dr. Sharma · 10:30 AM confirmed' },
  { text: 'Deposit collected ₹500', sub: 'UPI · Razorpay link auto-sent' },
  { text: 'Handoff to staff', sub: 'Complex query escalated in 1-click' },
];

const STATS = [
  { icon: IconClock, value: '6–8 hrs', label: 'lost per day to repetitive chats' },
  { icon: IconTrendingDown, value: '~23%', label: 'after-hours leads go to competitors' },
  { icon: IconMessageSquare, value: '40+', label: 'identical questions answered daily' },
];

export function Problem() {
  const { ref, isInView } = useInView();

  return (
    <section
      id="problem"
      ref={ref}
      aria-labelledby="problem-title"
      className="relative py-24 sm:py-32 border-b border-[#553E53]/10 bg-[#F5F6F0] overflow-hidden"
    >
      {/* Background texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 90% 20%, rgba(85,62,83,0.06) 0%, transparent 45%), radial-gradient(circle at 5% 80%, rgba(182,203,222,0.14) 0%, transparent 40%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="max-w-2xl mx-auto text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#553E53]/20 bg-[#553E53]/6 text-[#553E53] text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#553E53]/60" />
            The front-desk bottleneck
          </div>
          <h2
            id="problem-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-balance"
          >
            <span className="text-[#553E53]">Your team shouldn&apos;t spend</span>
            <br className="hidden sm:block" />
            <span className="text-[#4B624A]"> all day on the same questions.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#553E53]/65 leading-relaxed max-w-xl mx-auto">
            Repetitive WhatsApp conversations eat up receptionist hours and silently lose after-hours leads to competitors.
          </p>
        </div>

        {/* ── Problem stat strip ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-12 rounded-2xl overflow-hidden border border-[#553E53]/10 bg-[#553E53]/8">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-[#F5F6F0] px-6 py-5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#553E53]/8 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#553E53]" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#553E53] tracking-tight leading-none">{value}</div>
                <div className="text-[11px] text-[#553E53]/50 font-medium mt-0.5 leading-snug">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Before / After split ── */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* ── LEFT: Without Dermo ── */}
          <div
            className={`relative rounded-3xl overflow-hidden border border-[#553E53]/15 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#553E53]/6 border-b border-[#553E53]/10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#553E53]/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#553E53]/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#553E53]/10" />
                </div>
                <span className="text-[11px] font-semibold text-[#553E53]/50 tracking-wide uppercase ml-1">
                  WhatsApp · Clinic Inbox
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-[10px] font-bold text-red-500/80">Without Dermo</span>
              </div>
            </div>

            {/* Chat messages */}
            <div className="px-4 py-4 bg-[#F5F6F0] space-y-2.5 min-h-[300px]">
              {/* Overflow badge */}
              <div className="flex justify-center mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[10px] font-bold text-red-500">
                  <IconX className="w-2.5 h-2.5" />
                  6 unanswered messages · Staff not available
                </span>
              </div>

              {QUESTIONS.map((q, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 items-start transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                  }`}
                  style={{ transitionDelay: `${200 + i * 80}ms` }}
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-[#B6CBDE]/50 border border-[#B6CBDE]/60 shrink-0 flex items-center justify-center text-[10px] font-bold text-[#553E53]">
                    P
                  </div>
                  <div className="flex-1">
                    <div className="inline-block max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm bg-white border border-[#553E53]/8 shadow-sm">
                      <p className="text-[13px] text-[#553E53] font-medium leading-snug">
                        &ldquo;{q.text}&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 ml-1">
                      <span className="text-[10px] text-[#553E53]/35">{q.time}</span>
                      {/* Unread indicator */}
                      <span className="text-[10px] text-red-400/70 font-medium">· No reply</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Waiting message */}
              <div className="flex justify-center pt-2">
                <span className="text-[11px] text-[#553E53]/35 font-medium italic">
                  Receptionist available at 10:00 AM tomorrow…
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: With Dermo ── */}
          <div
            className={`relative rounded-3xl overflow-hidden border border-[#4B624A]/25 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#4B624A]/8 border-b border-[#4B624A]/15">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4B624A]/25" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4B624A]/18" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4B624A]/12" />
                </div>
                <span className="text-[11px] font-semibold text-[#4B624A]/60 tracking-wide uppercase ml-1">
                  Dermo AI · Active 24/7
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4B624A] animate-pulse" />
                <span className="text-[10px] font-bold text-[#4B624A]">All resolved</span>
              </div>
            </div>

            {/* Resolution feed */}
            <div className="px-4 py-4 bg-[#F5F6F0] min-h-[300px] space-y-2.5">
              {/* Dermo responded badge */}
              <div className="flex justify-center mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4B624A]/8 border border-[#4B624A]/20 text-[10px] font-bold text-[#4B624A]">
                  <IconZap className="w-2.5 h-2.5" />
                  Dermo replied in &lt; 5 seconds
                </span>
              </div>

              {RESOLVED.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 items-start transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  {/* Dermo avatar */}
                  <div className="w-7 h-7 rounded-full bg-[#4B624A] shrink-0 flex items-center justify-center">
                    <IconZap className="w-3 h-3 text-[#F5F6F0]" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block max-w-[90%] px-3 py-2 rounded-2xl rounded-tl-sm bg-[#4B624A]/8 border border-[#4B624A]/18">
                      <p className="text-[13px] text-[#4B624A] font-semibold leading-snug">
                        {item.text}
                      </p>
                      <p className="text-[10px] text-[#553E53]/50 mt-0.5 leading-snug">{item.sub}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 ml-1">
                      <IconCheck className="w-2.5 h-2.5 text-[#4B624A]" />
                      <span className="text-[10px] text-[#4B624A]/60 font-medium">Resolved</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom metric pills */}
              <div className="pt-3 border-t border-[#4B624A]/10 flex flex-wrap gap-2">
                {['24/7 coverage', 'Zero missed leads', 'Staff alerted when needed'].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#4B624A]/8 border border-[#4B624A]/15 text-[10px] font-semibold text-[#4B624A]"
                  >
                    <IconCheck className="w-2 h-2" />
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

