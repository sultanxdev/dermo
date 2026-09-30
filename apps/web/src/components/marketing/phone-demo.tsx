'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  IconCheckCircle,
  IconCheckCheck,
  IconChevronRight,
  IconBot,
  IconPhone,
  IconVideo,
  IconRotateCcw,
  IconBuilding,
  IconLock,
  IconCreditCard,
  IconSend,
  IconMessageSquare,
} from '@/components/ui/icons';
import { api } from '@/lib/api';

export function PhoneDemo() {
  const [demoStep, setDemoStep] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');
  const [additionalMessages, setAdditionalMessages] = useState<
    Array<{ sender: 'patient' | 'dermo'; text: string; time: string }>
  >([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [demoStep, isTyping, depositPaid, additionalMessages]);

  const handleSelectSlot = (slotTime: string) => {
    if (demoStep >= 1) return;
    setIsTyping(true);
    setTimeout(() => {
      setDemoStep(1);
      setIsTyping(false);
    }, 600);
  };

  const handlePayDeposit = () => {
    if (depositPaid) return;
    setIsTyping(true);
    setTimeout(() => {
      setDepositPaid(true);
      setDemoStep(2);
      setIsTyping(false);
    }, 750);
  };

  const handleResetDemo = () => {
    setDemoStep(0);
    setDepositPaid(false);
    setIsTyping(false);
    setAdditionalMessages([]);
    setCustomInput('');
  };

  const handleSendCustomMessage = async (textToSend?: string) => {
    const text = textToSend || customInput;
    if (!text.trim() || isTyping) return;

    const patientMsg = {
      sender: 'patient' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAdditionalMessages((prev) => [...prev, patientMsg]);
    if (!textToSend) setCustomInput('');
    setIsTyping(true);

    try {
      const res = await api.sendSimulatorMessage({
        phone: '+919876500000',
        name: 'Demo Visitor',
        message: text,
      });

      if (res?.aiMessage?.content) {
        setAdditionalMessages((prev) => [
          ...prev,
          {
            sender: 'dermo',
            text: res.aiMessage.content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      setAdditionalMessages((prev) => [
        ...prev,
        {
          sender: 'dermo',
          text: `At Nova Skin Clinic, our Chemical Peel treatments start from ₹2,500. Dr. Priya Sharma is available for consultations this week. Would you like me to check open slots?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative w-full max-w-[380px]">
      {/* Interactive Demo Label Badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full bg-[#553E53] text-[#F5F6F0] text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-[#B6CBDE]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4B624A]" />
        <span>Interactive Demo</span>
      </div>

      {/* iPhone Outer Device Frame */}
      <div className="relative rounded-[44px] p-3.5 bg-[#553E53] shadow-xl border-4 border-[#553E53]/80">
        {/* Dynamic Island Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#553E53]/90 rounded-full z-20 flex items-center justify-between px-2">
          <div className="w-2 h-2 rounded-full bg-[#553E53]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#4B624A]" />
        </div>

        {/* Inner Screen Container */}
        <div className="rounded-[36px] bg-[#F5F6F0] overflow-hidden flex flex-col h-[590px] border border-[#553E53]/15 text-xs relative select-none">
          {/* Status Bar */}
          <div className="bg-[#553E53] pt-3 px-6 pb-1.5 flex items-center justify-between text-[#F5F6F0] text-[11px] font-semibold">
            <span>10:42</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-4 h-2 rounded-xs border border-[#F5F6F0] flex items-center p-0.5">
                <div className="w-2 h-full bg-[#F5F6F0] rounded-xs" />
              </div>
            </div>
          </div>

          {/* WhatsApp Header */}
          <div className="bg-[#553E53] px-3.5 py-2.5 flex items-center justify-between text-[#F5F6F0] border-b border-[#553E53]/30">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleResetDemo}
                title="Reset demo"
                className="text-[#B6CBDE] hover:text-[#F5F6F0] transition-colors"
              >
                <IconChevronRight className="w-4 h-4 rotate-180" />
              </button>

              {/* Avatar */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#B6CBDE] text-[#553E53] flex items-center justify-center font-bold text-xs">
                  <IconBot className="w-5 h-5 text-[#553E53]" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4B624A] border-2 border-[#553E53]" />
              </div>

              <div>
                <div className="font-bold text-xs flex items-center gap-1 text-[#F5F6F0]">
                  <span>Dermo AI</span>
                  <IconCheckCircle className="w-3.5 h-3.5 text-[#B6CBDE]" />
                </div>
                <div className="text-[10px] text-[#B6CBDE] font-medium leading-none mt-0.5">
                  Nova Skin Clinic • Online
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[#B6CBDE]">
              <IconPhone className="w-3.5 h-3.5 hover:text-[#F5F6F0] cursor-pointer" />
              <IconVideo className="w-4 h-4 hover:text-[#F5F6F0] cursor-pointer" />
              <button onClick={handleResetDemo} title="Restart demo" className="hover:text-[#F5F6F0]">
                <IconRotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* WhatsApp Context Sub-banner */}
          <div className="bg-[#B6CBDE]/20 px-3 py-1.5 text-[10px] text-[#553E53] border-b border-[#553E53]/10 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1">
              <IconBuilding className="w-3 h-3 text-[#553E53]" />
              Nova Skin Clinic (Verified Practice)
            </span>
            <span className="text-[#4B624A] font-bold">Active</span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F5F6F0] no-scrollbar">
            {/* Privacy notice */}
            <div className="text-center my-1">
              <span className="px-3 py-1 rounded-md bg-[#B6CBDE]/30 text-[9px] text-[#553E53] inline-flex items-center gap-1 font-medium">
                <IconLock className="w-3 h-3 text-[#4B624A]" />
                Grounded in verified Nova Skin Clinic knowledge.
              </span>
            </div>

            {/* Message 1: Patient */}
            <div className="flex flex-col items-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-xs px-3.5 py-2.5 bg-[#B6CBDE]/40 text-[#553E53] text-[11px] leading-relaxed shadow-xs">
                <p>Hi, what is the price of HydraFacial and is Dr. Priya available tomorrow?</p>
                <div className="text-[9px] text-[#553E53]/60 flex items-center justify-end gap-1 mt-1">
                  <span>10:42 AM</span>
                  <IconCheckCheck className="w-3.5 h-3.5 text-[#4B624A]" />
                </div>
              </div>
            </div>

            {/* Message 2: Dermo AI Answer & Slot Availability */}
            <div className="flex flex-col items-start">
              <div className="max-w-[88%] rounded-2xl rounded-tl-xs px-3.5 py-2.5 bg-[#F5F6F0] border border-[#553E53]/20 text-[#553E53] text-[11px] leading-relaxed space-y-2 shadow-xs">
                <p>
                  Hi! HydraFacial is <strong>₹3,500</strong> for a 45-minute session.
                </p>
                <div className="p-2.5 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-1">
                  <span className="text-[10px] font-bold text-[#553E53] block">
                    Dr. Priya Sharma is available tomorrow:
                  </span>
                  <div className="text-[10px] text-[#553E53]/85 space-y-0.5 font-semibold">
                    <div>• 10:30 AM</div>
                    <div>• 11:00 AM</div>
                    <div>• 11:30 AM</div>
                  </div>
                </div>
                <p className="text-[10px] text-[#553E53]/90 font-medium">
                  Would you like me to reserve a slot?
                </p>

                {/* Quick Slot Action Pills */}
                {demoStep === 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {['10:30 AM', '11:00 AM', '11:30 AM'].map((time) => (
                      <button
                        key={time}
                        onClick={() => handleSelectSlot(time)}
                        className="px-2.5 py-1 rounded-lg bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] text-[10px] font-bold transition-all active:scale-95"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[9px] text-[#553E53]/50 text-right mt-0.5">
                  10:42 AM
                </div>
              </div>
            </div>

            {/* Step 1: Patient selects 11:00 AM */}
            {demoStep >= 1 && (
              <>
                <div className="flex flex-col items-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs px-3.5 py-2 bg-[#B6CBDE]/40 text-[#553E53] text-[11px] leading-relaxed shadow-xs">
                    <p>Book 11:00 AM.</p>
                    <div className="text-[9px] text-[#553E53]/60 flex items-center justify-end gap-1 mt-1">
                      <span>10:43 AM</span>
                      <IconCheckCheck className="w-3.5 h-3.5 text-[#4B624A]" />
                    </div>
                  </div>
                </div>

                {/* Step 1: Dermo AI prompts for Deposit */}
                <div className="flex flex-col items-start">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-xs px-3.5 py-2.5 bg-[#F5F6F0] border border-[#553E53]/20 text-[#553E53] text-[11px] leading-relaxed space-y-2 shadow-xs">
                    <p>
                      Your slot is available. A <strong>₹500 consultation deposit</strong> is required to confirm the appointment.
                    </p>

                    {!depositPaid && (
                      <div className="p-2.5 rounded-xl bg-[#B6CBDE]/25 border border-[#553E53]/20 space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-[#553E53]">Nova Skin Clinic Booking</span>
                          <span className="font-bold text-[#4B624A]">₹500 Deposit</span>
                        </div>
                        <button
                          onClick={handlePayDeposit}
                          className="w-full py-2 rounded-lg bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
                        >
                          <IconCreditCard className="w-3.5 h-3.5 text-[#B6CBDE]" />
                          <span>Pay ₹500 Deposit</span>
                        </button>
                      </div>
                    )}

                    <div className="text-[9px] text-[#553E53]/50 text-right mt-0.5">
                      10:43 AM
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Payment Confirmed */}
            {depositPaid && (
              <div className="flex flex-col items-start">
                <div className="max-w-[88%] rounded-2xl rounded-tl-xs px-3.5 py-2.5 bg-[#F5F6F0] border border-[#4B624A]/40 text-[#553E53] text-[11px] leading-relaxed space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 text-[#4B624A] font-bold text-xs">
                    <IconCheckCircle className="w-4 h-4 text-[#4B624A]" />
                    <span>Appointment Confirmed</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#4B624A]/10 border border-[#4B624A]/25 text-[10px] space-y-1">
                    <div className="font-bold text-[#553E53]">Dr. Priya Sharma</div>
                    <div className="font-semibold text-[#4B624A]">Tomorrow · 11:00 AM</div>
                    <div className="text-[#553E53]/70 text-[9px] pt-1 border-t border-[#553E53]/10">
                      Confirmation sent to WhatsApp.
                    </div>
                  </div>
                  <div className="text-[9px] text-[#553E53]/50 text-right">
                    10:44 AM
                  </div>
                </div>
              </div>
            )}

            {/* Custom User Chat Messages */}
            {additionalMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[11px] leading-relaxed shadow-xs ${
                    msg.sender === 'patient'
                      ? 'bg-[#B6CBDE]/40 text-[#553E53] rounded-tr-xs'
                      : 'bg-[#F5F6F0] border border-[#553E53]/20 text-[#553E53] rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="text-[9px] text-[#553E53]/60 text-right mt-1">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/20 w-16 text-[#553E53] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#553E53]/50 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#553E53]/50 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#553E53]/50 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Simulation Shortcuts */}
          <div className="p-2 bg-[#F5F6F0] border-t border-[#553E53]/10 flex gap-1.5 overflow-x-auto no-scrollbar">
            {demoStep === 0 && (
              <button
                onClick={() => handleSelectSlot('11:00 AM')}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] text-[10px] font-semibold transition-all"
              >
                Book 11:00 AM
              </button>
            )}
            <button
              onClick={() => handleSendCustomMessage('What is the price of Chemical Peel?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#B6CBDE]/30 hover:bg-[#B6CBDE]/50 border border-[#553E53]/15 text-[10px] text-[#553E53] font-medium transition-all"
            >
              Ask Chemical Peel
            </button>
            <button
              onClick={() => handleSendCustomMessage('Can I speak with your human receptionist?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#B6CBDE]/30 hover:bg-[#B6CBDE]/50 border border-[#553E53]/15 text-[10px] text-[#553E53] font-medium transition-all"
            >
              Request Receptionist
            </button>
            <button
              onClick={handleResetDemo}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#553E53]/10 hover:bg-[#553E53]/20 text-[#553E53] text-[10px] font-medium transition-all"
            >
              Reset Demo
            </button>
          </div>

          {/* WhatsApp Mobile Input Bar */}
          <div className="p-2 bg-[#F5F6F0] flex items-center gap-2 border-t border-[#553E53]/10">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCustomMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-[#B6CBDE]/20 border border-[#553E53]/15 rounded-full px-3.5 py-1.5 text-[#553E53] placeholder:text-[#553E53]/40 text-xs focus:outline-none"
            />
            {customInput.trim() ? (
              <button
                onClick={() => handleSendCustomMessage()}
                className="p-1.5 rounded-full bg-[#553E53] text-[#F5F6F0] hover:bg-[#4B624A] transition-colors"
              >
                <IconSend className="w-3.5 h-3.5 text-[#B6CBDE]" />
              </button>
            ) : (
              <button
                onClick={() => handleSendCustomMessage('How do I book?')}
                className="p-1.5 text-[#553E53]/60 hover:text-[#553E53]"
              >
                <IconMessageSquare className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
