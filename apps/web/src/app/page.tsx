'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageSquare,
  Calendar,
  ShieldCheck,
  CreditCard,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  Zap,
  Activity,
  Bot,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { api } from '@/lib/api';

/* ─────────────────────────────────────────────
   IntersectionObserver hook for scroll-triggered
   fade-in animations
   ───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

export default function LandingPage() {
  // Live Demo Interactive State
  const [demoInput, setDemoInput] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoMessages, setDemoMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'user',
      text: 'Hi! What are the charges for HydraFacial and is Dr. Priya available tomorrow?',
      time: '10:42 AM',
    },
    {
      sender: 'ai',
      text: 'Hello! 👋 Our **HydraFacial MD Elite Glow** is ₹3,500 (45 mins session). Yes, Dr. Priya Sharma has open slots tomorrow at **10:30 AM**, **11:00 AM**, and **11:30 AM**. Would you like me to reserve a slot for you?',
      time: '10:42 AM',
    },
  ]);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered section refs
  const featuresView = useInView(0.1);
  const howItWorksView = useInView(0.1);
  const pricingView = useInView(0.1);
  const faqView = useInView(0.1);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [demoMessages, demoLoading]);

  const handleSendDemoMessage = async (textToSend?: string) => {
    const message = textToSend || demoInput;
    if (!message.trim() || demoLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDemoMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setDemoInput('');
    setDemoLoading(true);

    try {
      const res = await api.sendSimulatorMessage({
        phone: '+919999900000',
        name: 'Website Visitor',
        message,
      });

      if (res?.aiMessage) {
        setDemoMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.aiMessage.content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      setDemoMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "I can check Dr. Priya's availability and treatment fees directly from our clinic schedule. Feel free to explore our live dashboard preview!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setDemoLoading(false);
    }
  };

  const samplePrompts = [
    'What is the price of Chemical Peel?',
    'Is Dr. Vikram available on Friday?',
    'Book consultation for acne scars',
  ];

  const features = [
    {
      icon: MessageSquare,
      title: 'Meta WhatsApp Cloud API',
      desc: 'Official WhatsApp Business webhook with idempotency, rich interactive buttons, and template notifications.',
    },
    {
      icon: Sparkles,
      title: 'Zero-Hallucination RAG',
      desc: 'LangChain & pgvector retrieval strictly grounded on your clinic procedures, doctor profiles, and aftercare sheets.',
    },
    {
      icon: Calendar,
      title: 'Conflict-Free Slot Engine',
      desc: 'Deterministic appointment booking based on actual doctor shifts, break timings, and consultation duration.',
    },
    {
      icon: CreditCard,
      title: 'Razorpay Advance Deposits',
      desc: 'Collect advance consultation fees or treatment deposits right inside WhatsApp, eliminating clinic no-shows.',
    },
    {
      icon: UserCheck,
      title: '1-Click Receptionist Takeover',
      desc: 'Instant human takeover switch pauses AI whenever staff want to personally handle a VIP inquiry.',
    },
    {
      icon: ShieldCheck,
      title: 'Medical Safety Guardrails',
      desc: 'Strict non-diagnostic boundaries. Emergency signals automatically trigger clinical escalations.',
    },
  ];

  const steps = [
    { num: '01', title: 'WhatsApp Inquiry', desc: 'Patient messages your clinic WhatsApp number with treatment or timing questions.' },
    { num: '02', title: 'Grounded AI Reply', desc: 'Dermo retrieves verified prices and doctor availability instantly via RAG.' },
    { num: '03', title: 'Slot & Deposit', desc: 'Patient picks an open slot and pays the booking deposit via Razorpay.' },
    { num: '04', title: 'Dashboard Sync', desc: 'Lead, chat history, and confirmed booking instantly appear on clinic dashboard.' },
  ];

  const faqs = [
    {
      q: 'Will the AI give medical diagnoses to patients?',
      a: 'No. Dermo includes strict medical safety guardrails. It answers clinic logistics, procedure info, pricing, and scheduling. Any request for medical diagnosis or prescription advice is flagged and handed over to clinic staff.',
    },
    {
      q: 'How does Dermo prevent double-booking?',
      a: 'Dermo connects to your actual doctor shifts, consultation buffer times, and existing appointment calendar. Slots are calculated deterministically with conflict prevention.',
    },
    {
      q: 'Can our receptionist intervene and take over chats?',
      a: 'Yes! The dashboard includes a 1-click Take Over console that pauses AI automation for that conversation instantly, allowing staff to chat directly.',
    },
    {
      q: 'How do Razorpay advance deposits work?',
      a: 'When an appointment is requested, Dermo can generate a secure Razorpay payment link. Once verified, the slot is locked and confirmed.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F0] text-[#553E53] selection:bg-[#B6CBDE] selection:text-[#553E53]">
      {/* ═══════════════════════════════════════════
          AMBIENT BACKGROUND GLOWS
          ═══════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[700px] h-[500px] bg-[#B6CBDE]/30 rounded-full blur-[160px] animate-gradient-shift" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[400px] bg-[#553E53]/8 rounded-full blur-[140px] animate-gradient-shift delay-300" />
        <div className="absolute top-[50%] left-[50%] w-[600px] h-[300px] bg-[#B6CBDE]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* ═══════════════════════════════════════════
          NAVIGATION
          ═══════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-[#553E53]/12 bg-[#F5F6F0]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in-up">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-[#553E53] p-1.5 ring-2 ring-[#B6CBDE]/50">
              <img src="/logo.png" alt="Dermo Logo" className="w-full h-full object-contain filter brightness-110" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#553E53] flex items-center gap-1.5">
                Dermo<span className="text-[#8E6F8B]">.ai</span>
              </span>
              <span className="text-[10px] block uppercase tracking-widest text-[#553E53]/70 font-bold">
                Clinic AI Employee
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#553E53]/80 animate-fade-in-up delay-100">
            <a href="#features" className="hover:text-[#553E53] transition-colors py-1 hover-underline">Features</a>
            <a href="#demo" className="hover:text-[#553E53] transition-colors py-1 hover-underline">Interactive Demo</a>
            <a href="#how-it-works" className="hover:text-[#553E53] transition-colors py-1 hover-underline">How It Works</a>
            <a href="#pricing" className="hover:text-[#553E53] transition-colors py-1 hover-underline">Pricing</a>
            <a href="#faq" className="hover:text-[#553E53] transition-colors py-1 hover-underline">FAQ</a>
          </nav>

          <div className="flex items-center gap-3 animate-fade-in-up delay-200">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-semibold text-sm shadow-md shadow-[#553E53]/15 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Clinic Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#B6CBDE] transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#553E53]/15 text-[#553E53] text-xs font-bold tracking-wide shadow-sm animate-fade-in-up">
                <Zap className="w-3.5 h-3.5 text-[#553E53]" />
                <span>LangChain + Gemini AI + pgvector RAG + Razorpay</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#553E53] leading-[1.15] animate-fade-in-up delay-100">
                The <span className="text-shimmer">24/7 AI Employee</span> Built For Dermatology Clinics.
              </h1>

              <p className="text-lg text-[#553E53]/80 max-w-2xl leading-relaxed animate-fade-in-up delay-200 font-medium">
                Zero hallucinations. Dermo handles WhatsApp inquiries in English & Hinglish, answers procedure pricing, verifies live doctor shift availability, collects Razorpay deposits, and eliminates double-bookings.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2 animate-fade-in-up delay-300">
                <Link
                  href="/dashboard"
                  className="group px-6 py-3.5 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-bold text-base shadow-lg shadow-[#553E53]/20 flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Building2 className="w-5 h-5 text-[#B6CBDE]" />
                  <span>Explore Live Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#B6CBDE] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#demo"
                  className="group px-6 py-3.5 rounded-xl bg-white hover:bg-[#B6CBDE]/25 border border-[#553E53]/20 text-[#553E53] font-bold text-base flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                >
                  <MessageSquare className="w-5 h-5 text-[#553E53]" />
                  <span>Test WhatsApp Demo</span>
                </a>
              </div>

              {/* Trust Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#553E53]/15 max-w-xl animate-fade-in-up delay-500">
                {[
                  { value: '98.4%', label: 'RAG Accuracy Score' },
                  { value: '0', label: 'Double Bookings' },
                  { value: '< 2s', label: 'WhatsApp Latency' },
                ].map((stat, i) => (
                  <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${600 + i * 100}ms` }}>
                    <div className="text-2xl sm:text-3xl font-bold text-[#553E53] font-mono">{stat.value}</div>
                    <div className="text-xs text-[#553E53]/65 mt-0.5 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Animated WhatsApp Widget Demo */}
            <div id="demo" className="lg:col-span-5 animate-slide-in-right delay-200">
              <div className="relative mx-auto max-w-[380px] animate-float">
                <div className="relative rounded-[36px] p-3 bg-white border border-[#553E53]/15 shadow-2xl shadow-[#553E53]/10">
                  {/* Phone Speaker Notch */}
                  <div className="w-28 h-3.5 bg-[#553E53]/15 rounded-full mx-auto mb-2" />

                  {/* WhatsApp Chat Container */}
                  <div className="rounded-[26px] bg-[#EBF1F6] overflow-hidden flex flex-col h-[520px] border border-[#553E53]/10 text-xs">
                    {/* WhatsApp Header */}
                    <div className="bg-[#553E53] px-4 py-3 flex items-center justify-between text-[#F5F6F0]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#B6CBDE] text-[#553E53] flex items-center justify-center font-bold text-xs shadow-md">
                          DA
                        </div>
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-1 text-white">
                            <span>DermaCare AI</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#B6CBDE]" />
                          </div>
                          <div className="text-[10px] text-[#B6CBDE] flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Online • WhatsApp Official</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Messages Feed */}
                    <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#EBF1F6] no-scrollbar">
                      <div className="text-center animate-fade-in-up">
                        <span className="px-2.5 py-1 rounded bg-white/80 text-[10px] text-[#553E53]/70 border border-[#553E53]/10 shadow-xs">
                          🔒 End-to-end encrypted AI conversation
                        </span>
                      </div>

                      {demoMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in-up`}
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <div
                            className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed transition-all duration-300 shadow-sm ${
                              msg.sender === 'user'
                                ? 'bg-[#553E53] text-[#F5F6F0] rounded-tr-none'
                                : 'bg-white text-[#553E53] rounded-tl-none border border-[#553E53]/10'
                            }`}
                          >
                            <div className="whitespace-pre-line text-[11px]">{msg.text}</div>
                            <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-[#B6CBDE]' : 'text-[#553E53]/55'}`}>
                              {msg.time}
                            </div>
                          </div>
                        </div>
                      ))}

                      {demoLoading && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white w-20 text-[#553E53] text-[10px] animate-fade-in-up border border-[#553E53]/10 shadow-xs">
                          <span className="animate-bounce">●</span>
                          <span className="animate-bounce [animation-delay:0.2s]">●</span>
                          <span className="animate-bounce [animation-delay:0.4s]">●</span>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Sample Prompts Pills */}
                    <div className="p-2 bg-white/90 border-t border-[#553E53]/10 flex gap-1.5 overflow-x-auto no-scrollbar">
                      {samplePrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendDemoMessage(prompt)}
                          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/15 text-[10px] text-[#553E53] font-medium transition-all duration-300"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    {/* WhatsApp Input Field */}
                    <div className="p-2.5 bg-white flex items-center gap-2 border-t border-[#553E53]/10">
                      <input
                        type="text"
                        value={demoInput}
                        onChange={(e) => setDemoInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendDemoMessage()}
                        placeholder="Type a WhatsApp inquiry..."
                        className="flex-1 bg-[#F5F6F0] border border-[#553E53]/15 rounded-lg px-3 py-1.5 text-[#553E53] placeholder:text-[#553E53]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#B6CBDE]"
                      />
                      <button
                        onClick={() => handleSendDemoMessage()}
                        disabled={demoLoading || !demoInput.trim()}
                        className="p-2 rounded-lg bg-[#553E53] text-[#F5F6F0] hover:bg-[#433041] transition-all duration-300 disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5 text-[#B6CBDE]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6 CORE FEATURES
          ═══════════════════════════════════════════ */}
      <section id="features" className="py-20 border-t border-[#553E53]/10 bg-white/50 relative" ref={featuresView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center max-w-3xl mx-auto mb-16 space-y-3 transition-all duration-700 ${featuresView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs uppercase tracking-widest text-[#553E53] font-bold">
              Autonomous & Deterministic
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53]">
              Built Specifically for Aesthetic & Dermatology Workflows
            </h2>
            <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
              Generic chatbot tools make up answers and double-book doctors. Dermo is deeply integrated with your clinic operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`bg-white border border-[#553E53]/12 p-6 rounded-2xl space-y-4 hover:border-[#553E53]/40 hover:shadow-lg transition-all duration-300 group shadow-xs ${
                    featuresView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: `${150 + i * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#B6CBDE]/30 border border-[#B6CBDE]/60 flex items-center justify-center text-[#553E53] group-hover:bg-[#553E53] group-hover:text-[#F5F6F0] transition-all duration-300 group-hover:scale-105 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#553E53]">{feature.title}</h3>
                  <p className="text-[#553E53]/70 text-sm leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 border-t border-[#553E53]/10" ref={howItWorksView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-16 space-y-3 transition-all duration-700 ${howItWorksView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs uppercase tracking-widest text-[#553E53] font-bold">
              Seamless Patient Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53]">How Dermo Automates Your Patient Pipeline</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`bg-white border-t-2 border-t-[#553E53] border border-[#553E53]/10 p-6 rounded-2xl space-y-3 shadow-xs transition-all duration-300 hover:shadow-md ${
                  howItWorksView.isInView ? 'animate-slide-in-left' : 'opacity-0 -translate-x-8'
                }`}
                style={{ animationDelay: `${200 + i * 150}ms` }}
              >
                <span className="text-3xl font-extrabold font-mono text-[#B6CBDE] block">{step.num}</span>
                <h4 className="text-base font-bold text-[#553E53]">{step.title}</h4>
                <p className="text-xs text-[#553E53]/70 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING MATRIX
          ═══════════════════════════════════════════ */}
      <section id="pricing" className="py-20 border-t border-[#553E53]/10 bg-white/40 relative" ref={pricingView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center max-w-3xl mx-auto mb-16 space-y-3 transition-all duration-700 ${pricingView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs uppercase tracking-widest text-[#553E53] font-bold">Transparent Plans</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53]">Simple Pricing for Growing Clinics</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className={`bg-white border border-[#553E53]/12 p-8 rounded-3xl space-y-6 shadow-sm hover:shadow-md transition-all duration-300 ${pricingView.isInView ? 'animate-fade-in-up delay-200' : 'opacity-0 translate-y-8'}`}>
              <div>
                <h3 className="text-lg font-bold text-[#553E53]">Single Doctor Clinic</h3>
                <p className="text-xs text-[#553E53]/65 mt-1 font-medium">For boutique aesthetic and skincare clinics.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#553E53]">₹4,999</span>
                <span className="text-[#553E53]/60 text-sm font-medium">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-[#553E53]/85 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> 1 WhatsApp Clinic Number
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Up to 1,000 monthly patient chats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Grounded RAG Knowledge Base
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Appointment Slot Booking Engine
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/20 text-[#553E53] font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-xs"
              >
                Get Started
              </Link>
            </div>

            {/* Pro / Featured */}
            <div className={`bg-white border-2 border-[#553E53] p-8 rounded-3xl space-y-6 relative shadow-xl shadow-[#553E53]/10 transition-all duration-300 hover:-translate-y-1 ${pricingView.isInView ? 'animate-scale-in delay-300' : 'opacity-0 scale-90'}`}>
              <div className="absolute -top-3.5 right-8 px-3 py-1 rounded-full bg-[#553E53] text-[#F5F6F0] text-[10px] font-bold uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#553E53]">Multi-Doctor Aesthetic Clinic</h3>
                <p className="text-xs text-[#553E53]/65 mt-1 font-medium">For busy laser & dermatology centers.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#553E53]">₹9,999</span>
                <span className="text-[#553E53]/60 text-sm font-medium">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-[#553E53]/85 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Up to 5 Doctor Shift Schedules
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Unlimited monthly WhatsApp chats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Razorpay Advance Booking Deposits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> 1-Click Human Receptionist Takeover
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> WhatsApp Mobile Simulator Sandbox
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-md shadow-[#553E53]/20"
              >
                Launch Dashboard Demo
              </Link>
            </div>

            {/* Enterprise */}
            <div className={`bg-white border border-[#553E53]/12 p-8 rounded-3xl space-y-6 shadow-sm hover:shadow-md transition-all duration-300 ${pricingView.isInView ? 'animate-fade-in-up delay-400' : 'opacity-0 translate-y-8'}`}>
              <div>
                <h3 className="text-lg font-bold text-[#553E53]">Clinic Chains & Hospitals</h3>
                <p className="text-xs text-[#553E53]/65 mt-1 font-medium">Multi-branch aesthetic chains with custom EMR.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#553E53]">Custom</span>
              </div>
              <ul className="space-y-3 text-xs text-[#553E53]/85 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Multi-branch clinic routing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Custom EMR / CRM sync integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Dedicated SLA & HIPAA / DPDP setup
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/20 text-[#553E53] font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-xs"
              >
                Contact Clinic Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ ACCORDION
          ═══════════════════════════════════════════ */}
      <section id="faq" className="py-20 border-t border-[#553E53]/10" ref={faqView.ref}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 space-y-3 transition-all duration-700 ${faqView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs uppercase tracking-widest text-[#553E53] font-bold">Frequently Asked Questions</span>
            <h2 className="text-3xl font-extrabold text-[#553E53]">Everything You Need to Know</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all duration-300 shadow-xs ${
                    isOpen ? 'border-[#553E53] bg-[#B6CBDE]/15' : 'border-[#553E53]/15 hover:border-[#553E53]/35'
                  } ${faqView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
                  style={{ animationDelay: `${200 + i * 100}ms` }}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-bold text-[#553E53] text-sm sm:text-base">{faq.q}</h4>
                    <ChevronDown
                      className={`w-5 h-5 text-[#553E53] shrink-0 transition-transform duration-300 ease-spring ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  <div className={`faq-content ${isOpen ? 'open' : ''}`}>
                    <div>
                      <p className="mt-3 text-xs sm:text-sm text-[#553E53]/75 leading-relaxed pt-2 border-t border-[#553E53]/10 font-medium">
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

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="py-12 border-t border-[#553E53]/15 bg-white text-[#553E53]/70 text-xs relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-[#553E53] p-1 flex items-center justify-center">
              <img src="/logo.png" alt="Dermo" className="w-full h-full object-contain filter brightness-110" />
            </div>
            <span className="font-bold text-[#553E53]">Dermo.ai</span>
            <span className="font-medium">— Managed AI Employee for Clinics.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/dashboard" className="hover:text-[#553E53] py-1 transition-colors hover-underline">Dashboard</Link>
            <Link href="/dashboard/conversations" className="hover:text-[#553E53] py-1 transition-colors hover-underline">WhatsApp Simulator</Link>
            <Link href="/dashboard/payments" className="hover:text-[#553E53] py-1 transition-colors hover-underline">Razorpay Setup</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
