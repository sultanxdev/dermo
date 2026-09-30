'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

/* -------------------------------------------------------------------------- */
/* Types & constants                                                           */
/* -------------------------------------------------------------------------- */

type ChatMessage = {
  id: string;
  sender: 'patient' | 'clinic';
  text: string;
  time: string;
};

type BookingStep = 'idle' | 'slotSelected' | 'paid';

const SLOTS = ['10:30 AM', '11:00 AM', '11:30 AM'] as const;

const FALLBACK_REPLY =
  'At Nova Skin Clinic, our Chemical Peel treatments start from ₹2,500. Dr. Priya Sharma is available for consultations this week. Would you like me to reserve a consultation slot?';

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const uid = () => Math.random().toString(36).slice(2, 10);

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */

const IconVerified = () => (
  <svg className="w-3.5 h-3.5 text-[#25D366] shrink-0 inline-block" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z" />
  </svg>
);

const IconDoubleCheck = ({ read = true }: { read?: boolean }) => (
  <svg className={`w-3.5 h-3.5 ${read ? 'text-[#53BDEB]' : 'text-neutral-400'} inline-block`} viewBox="0 0 16 15" fill="none" aria-hidden="true">
    <path d="M15.01 3.316l-7.79 8.65-3.32-3.13.78-.83 2.5 2.36 7.02-7.8.81.75z" fill="currentColor" />
    <path d="M11.99 3.316l-7.79 8.65L.88 8.836l.78-.83 2.5 2.36 7.02-7.8.81.75z" fill="currentColor" />
  </svg>
);

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const IconPhoneCall = () => (
  <svg className="w-4 h-4 text-[#007AFF]" viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconVideoCall = () => (
  <svg className="w-4 h-4 text-[#007AFF]" viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const IconCamera = () => (
  <svg className="w-4 h-4 text-[#007AFF]" viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconMic = () => (
  <svg className="w-4 h-4 text-[#007AFF]" viewBox="0 0 24 24" {...strokeProps} aria-hidden="true">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-5 h-5 text-[#007AFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconSendArrow = () => (
  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const IconChevronLeft = () => (
  <svg className="w-5 h-5 text-[#007AFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconSticker = () => (
  <svg className="w-4 h-4 text-[#8E8E93]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* Small building blocks                                                       */
/* -------------------------------------------------------------------------- */

const BUBBLE_SHADOW = 'shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]';

function PatientBubble({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex flex-col items-end">
      <div className={`relative max-w-[85%] rounded-2xl rounded-tr-xs px-3 py-1.5 bg-[#DCF8C6] text-[#111B21] text-[12px] leading-relaxed ${BUBBLE_SHADOW}`}>
        <p className="break-words">{text}</p>
        <div className="text-[9.5px] text-[#667781] flex items-center justify-end gap-1 mt-0.5 select-none">
          <span>{time}</span>
          <IconDoubleCheck read />
        </div>
      </div>
    </div>
  );
}

function ClinicBubble({
  children,
  time,
  accent = false,
}: {
  children: React.ReactNode;
  time: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-start">
      <div
        className={`relative max-w-[88%] rounded-2xl rounded-tl-xs px-3 py-2 bg-white text-[#111B21] text-[12px] leading-relaxed space-y-2 ${BUBBLE_SHADOW} ${accent ? 'border-l-4 border-l-[#25D366]' : 'border border-black/[0.03]'
          }`}
      >
        {children}
        <div className="text-[9.5px] text-[#667781] text-right mt-0.5 select-none">{time}</div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className={`flex items-center gap-1 px-3 py-2 rounded-2xl rounded-tl-xs bg-white w-14 ${BUBBLE_SHADOW}`} aria-label="Clinic is typing" role="status">
      {[0, 0.2, 0.4].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-[#667781] animate-bounce"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PhoneDemo                                                                   */
/* -------------------------------------------------------------------------- */

export function PhoneDemo() {
  const [bookingStep, setBookingStep] = useState<BookingStep>('idle');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Incremented on every reset so stale timeouts / API responses are ignored.
  const sessionRef = useRef(0);

  const depositPaid = bookingStep === 'paid';

  /* Scroll only the chat container (scrollIntoView can jump the whole page) */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [bookingStep, isTyping, messages]);

  /* Clear pending timers on unmount */
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const session = sessionRef.current;
    const id = setTimeout(() => {
      if (session === sessionRef.current) fn();
    }, ms);
    timersRef.current.push(id);
  }, []);

  const handleSelectSlot = (slot: string) => {
    if (bookingStep !== 'idle' || isTyping) return;
    setSelectedSlot(slot);
    setIsTyping(true);
    schedule(() => {
      setBookingStep('slotSelected');
      setIsTyping(false);
    }, 600);
  };

  const handlePayDeposit = () => {
    if (bookingStep !== 'slotSelected' || isTyping) return;
    setIsTyping(true);
    schedule(() => {
      setBookingStep('paid');
      setIsTyping(false);
    }, 750);
  };

  const handleResetDemo = () => {
    sessionRef.current += 1;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setBookingStep('idle');
    setSelectedSlot(null);
    setIsTyping(false);
    setMessages([]);
    setCustomInput('');
  };

  const handleSendCustomMessage = async (textToSend?: string) => {
    const text = (textToSend ?? customInput).trim();
    if (!text || isTyping) return;

    const session = sessionRef.current;

    setMessages((prev) => [...prev, { id: uid(), sender: 'patient', text, time: nowTime() }]);
    if (textToSend === undefined) setCustomInput('');
    setIsTyping(true);

    let reply = FALLBACK_REPLY;
    try {
      const res = await api.sendSimulatorMessage({
        phone: '+919876500000',
        name: 'Demo Visitor',
        message: text,
      });
      if (res?.aiMessage?.content) reply = res.aiMessage.content;
    } catch {
      // Keep the fallback reply so the demo never looks broken.
    }

    // The user hit reset while the request was in flight — drop the result.
    if (session !== sessionRef.current) return;

    setMessages((prev) => [...prev, { id: uid(), sender: 'clinic', text: reply, time: nowTime() }]);
    setIsTyping(false);
  };

  const slotLabel = selectedSlot ?? '11:00 AM';

  return (
    <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
      {/* iPhone 16 Pro chassis */}
      <div className="relative rounded-[50px] p-[10px] bg-gradient-to-b from-[#3a3a3c] via-[#1c1c1e] to-[#121214] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_30px_-5px_rgba(85,62,83,0.18)] ring-1 ring-white/20 select-none">
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-[95px] w-[3px] h-[24px] bg-[#3a3a3c] rounded-l-xs" />
        <div className="absolute -left-[3px] top-[135px] w-[3px] h-[44px] bg-[#3a3a3c] rounded-l-xs" />
        <div className="absolute -left-[3px] top-[190px] w-[3px] h-[44px] bg-[#3a3a3c] rounded-l-xs" />
        <div className="absolute -right-[3px] top-[145px] w-[3px] h-[65px] bg-[#3a3a3c] rounded-r-xs" />

        {/* Screen */}
        <div className="relative rounded-[40px] bg-black overflow-hidden flex flex-col h-[580px] ring-1 ring-black/40">
          {/* Status bar + Dynamic Island */}
          <div className="relative z-30 bg-[#F6F6F6] pt-3 px-7 pb-1 flex items-center justify-between text-black text-[12px] font-semibold border-b border-black/[0.04]">
            <span>9:41</span>

            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-black rounded-full flex items-center justify-between px-3 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1e] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#0a0a14]" />
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a14] border border-[#2c2c2e] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#1a3a60] opacity-80" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-black">
              <svg className="w-4 h-3" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
                <rect x="0" y="9" width="3" height="3" rx="0.5" />
                <rect x="4.5" y="6" width="3" height="6" rx="0.5" />
                <rect x="9" y="3" width="3" height="9" rx="0.5" />
                <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
              </svg>
              <svg className="w-3.5 h-3" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
                <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-3.8-2.6a5.5 5.5 0 0 1 7.6 0l-.9.9a4.2 4.2 0 0 0-5.8 0l-.9-.9zm-2.8-2.8a9.4 9.4 0 0 1 13.2 0l-.9.9a8.1 8.1 0 0 0-11.4 0l-.9-.9z" />
              </svg>
              <div className="w-5 h-2.5 rounded-[4px] border border-black p-[1px] flex items-center">
                <div className="w-full h-full bg-black rounded-[2px]" />
              </div>
            </div>
          </div>

          {/* WhatsApp header */}
          <div className="relative z-20 bg-[#F6F6F6] px-2.5 py-2 flex items-center justify-between border-b border-black/[0.08] shadow-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <button
                type="button"
                onClick={handleResetDemo}
                className="flex items-center text-[#007AFF] -ml-1 hover:opacity-75 transition-opacity"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <IconChevronLeft />
                <span className="text-[13px] font-normal -ml-0.5">12</span>
              </button>

              <div className="relative shrink-0 ml-0.5">
                <div className="w-9 h-9 rounded-full bg-[#E8EDE4] border border-[#4B624A]/20 flex items-center justify-center overflow-hidden shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                    <path d="M40 0H80V40H120V80A40 40 0 0 0 80 120H40V80H0V40A40 40 0 0 0 40 0Z" fill="#4B624A" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] ring-2 ring-[#F6F6F6]" />
              </div>

              <div className="min-w-0 pl-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-[13px] text-neutral-900 truncate">Nova Skin Clinic</span>
                  <IconVerified />
                </div>
                <div className="text-[10px] text-[#25D366] font-medium leading-none">
                  {isTyping ? 'typing…' : 'online'}
                </div>
              </div>
            </div>

            {/* Decorative call buttons (they no longer reset the demo) */}
            <div className="flex items-center gap-4 pr-1.5">
              <button type="button" aria-label="Video call" className="hover:opacity-70 transition-opacity cursor-default">
                <IconVideoCall />
              </button>
              <button type="button" aria-label="Voice call" className="hover:opacity-70 transition-opacity cursor-default">
                <IconPhoneCall />
              </button>
            </div>
          </div>

          {/* Chat canvas */}
          <div
            ref={scrollRef}
            className="flex-1 p-3 overflow-y-auto space-y-2.5 relative no-scrollbar"
            style={{
              backgroundColor: '#EFEAE2',
              backgroundImage: 'radial-gradient(#d6cdc3 0.75px, transparent 0.75px)',
              backgroundSize: '16px 16px',
            }}
          >
            <div className="flex justify-center my-1">
              <span className="px-2.5 py-0.5 rounded-md bg-white/90 text-[#667781] text-[10px] font-semibold uppercase tracking-wider shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">
                Today
              </span>
            </div>

            <div className="flex justify-center mb-2 px-3">
              <div className="bg-[#FFEECD] text-[#54656F] text-[9.5px] leading-tight px-3 py-1.5 rounded-lg shadow-[0_1px_0.5px_rgba(0,0,0,0.12)] text-center max-w-[280px]">
                <span className="inline-block mr-1">🔒</span>
                Messages and calls are end-to-end encrypted. No one outside of this chat can read them.
              </div>
            </div>

            {/* Scripted: patient question */}
            <PatientBubble
              text="Hi, what is the price of HydraFacial and is Dr. Priya available tomorrow?"
              time="10:42 AM"
            />

            {/* Scripted: clinic answer with slots */}
            <ClinicBubble time="10:42 AM">
              <p>
                Hi! HydraFacial is <strong>₹3,500</strong> for a 45-minute medical session.
              </p>

              <div className="p-2 rounded-xl bg-[#F0F2F5] border border-black/[0.04] space-y-1">
                <span className="text-[10.5px] font-bold text-[#111B21] block">
                  Dr. Priya Sharma is available tomorrow:
                </span>
                <ul className="text-[11px] text-[#54656F] space-y-0.5 font-medium">
                  {SLOTS.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </div>

              <p className="text-[11px] font-normal">Would you like me to reserve a slot?</p>

              {bookingStep === 'idle' && (
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {SLOTS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleSelectSlot(t)}
                      disabled={isTyping}
                      className="px-3 py-1 rounded-lg bg-[#E7FFDB] hover:bg-[#DCF8C6] border border-[#25D366]/40 text-[#075E54] text-[11px] font-bold transition-all shadow-xs active:scale-95 disabled:opacity-60"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </ClinicBubble>

            {/* Step 1: slot chosen → deposit request */}
            {bookingStep !== 'idle' && (
              <>
                <PatientBubble text={`Book ${slotLabel}.`} time="10:43 AM" />

                <ClinicBubble time="10:43 AM">
                  <p>
                    Your slot is reserved. A <strong>₹500 consultation deposit</strong> is required to lock in
                    Dr. Priya&apos;s schedule.
                  </p>

                  {!depositPaid && (
                    <div className="p-2.5 rounded-xl bg-[#F0F2F5] border border-black/[0.06] space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#111B21]">Dr. Priya Sharma</span>
                        <span className="font-bold text-[#075E54]">₹500 Deposit</span>
                      </div>
                      <button
                        type="button"
                        onClick={handlePayDeposit}
                        disabled={isTyping}
                        className="w-full py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-sm disabled:opacity-60"
                      >
                        Pay ₹500 via UPI / Card
                      </button>
                    </div>
                  )}
                </ClinicBubble>
              </>
            )}

            {/* Step 2: confirmed */}
            {depositPaid && (
              <ClinicBubble time="10:44 AM" accent>
                <div className="flex items-center gap-1.5 text-[#25D366] font-bold text-[12px]">
                  <IconVerified />
                  <span>Appointment Confirmed!</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#E7FFDB] border border-[#25D366]/30 text-[11px] space-y-1">
                  <div className="font-bold text-[#111B21]">HydraFacial Consultation</div>
                  <div className="font-semibold text-[#075E54]">Tomorrow · {slotLabel}</div>
                  <div className="text-[#54656F] text-[10px] pt-1 border-t border-[#25D366]/20">
                    Payment of ₹500 received. Google Calendar invite synced.
                  </div>
                </div>
              </ClinicBubble>
            )}

            {/* Live messages */}
            {messages.map((msg) =>
              msg.sender === 'patient' ? (
                <PatientBubble key={msg.id} text={msg.text} time={msg.time} />
              ) : (
                <ClinicBubble key={msg.id} time={msg.time}>
                  <p className="break-words">{msg.text}</p>
                </ClinicBubble>
              )
            )}

            {isTyping && <TypingBubble />}
          </div>

          {/* Quick chips */}
          <div className="px-2.5 py-1.5 bg-[#F6F6F6] border-t border-black/[0.06] flex gap-1.5 overflow-x-auto no-scrollbar">
            {bookingStep === 'idle' && (
              <button
                type="button"
                onClick={() => handleSelectSlot('11:00 AM')}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#25D366] text-white text-[10px] font-bold shadow-2xs hover:bg-[#20ba59] transition-all disabled:opacity-60"
              >
                Tap 11:00 AM
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSendCustomMessage('What is the price of Chemical Peel?')}
              disabled={isTyping}
              className="whitespace-nowrap px-2.5 py-0.5 rounded-full bg-white border border-black/[0.1] text-[10px] text-[#54656F] font-semibold hover:bg-neutral-50 transition-all disabled:opacity-60"
            >
              Ask Chemical Peel
            </button>
            <button
              type="button"
              onClick={() => handleSendCustomMessage('Can I speak with a human receptionist?')}
              disabled={isTyping}
              className="whitespace-nowrap px-2.5 py-0.5 rounded-full bg-white border border-black/[0.1] text-[10px] text-[#54656F] font-semibold hover:bg-neutral-50 transition-all disabled:opacity-60"
            >
              Request Receptionist
            </button>
            <button
              type="button"
              onClick={handleResetDemo}
              className="whitespace-nowrap px-2 py-0.5 rounded-full bg-black/5 text-[10px] text-[#54656F] font-semibold hover:bg-black/10 transition-all ml-auto"
            >
              Reset
            </button>
          </div>

          {/* Input bar */}
          <form
            className="bg-[#F6F6F6] px-2.5 py-2 flex items-center gap-2 border-t border-black/[0.06]"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCustomMessage();
            }}
          >
            <button type="button" className="p-0.5 hover:opacity-75 transition-opacity" title="Add attachment" aria-label="Add attachment">
              <IconPlus />
            </button>

            <div className="flex-1 bg-white border border-black/[0.1] rounded-full px-3 py-1.5 flex items-center gap-2 shadow-2xs">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Message"
                aria-label="Type a message"
                maxLength={300}
                className="flex-1 min-w-0 text-[13px] text-black placeholder:text-[#8E8E93] bg-transparent focus:outline-none"
              />
              <button type="button" className="hover:opacity-70 transition-opacity" title="Stickers" aria-label="Stickers">
                <IconSticker />
              </button>
            </div>

            {customInput.trim() ? (
              <button
                type="submit"
                disabled={isTyping}
                className="w-8 h-8 rounded-full bg-[#007AFF] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs shrink-0 disabled:opacity-60"
                title="Send message"
                aria-label="Send message"
              >
                <IconSendArrow />
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" className="p-1 hover:opacity-75 transition-opacity" title="Camera" aria-label="Camera">
                  <IconCamera />
                </button>
                <button type="button" className="p-1 hover:opacity-75 transition-opacity" title="Voice message" aria-label="Voice message">
                  <IconMic />
                </button>
              </div>
            )}
          </form>

          {/* Home indicator */}
          <div className="bg-[#F6F6F6] pb-1.5 pt-0.5">
            <div className="w-28 h-1 bg-black/40 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneDemo;