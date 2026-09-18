'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ChevronRight,
  Send,
  Zap,
  Activity,
  Bot,
  Building2,
  Lock,
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
        name: 'Landing Page Visitor',
        message,
      });

      const aiText = res?.aiMessage?.content || "Thanks for your inquiry! Our team will assist you.";
      setDemoMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      // Fallback response for offline demo
      setTimeout(() => {
        let reply = "Hello! Welcome to DermaCare Clinic. How can I assist with your appointment today?";
        if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
          reply = "✨ Our **HydraFacial MD** is ₹3,500 and **Carbon Laser** is ₹4,200. Would you like to view our doctor schedule?";
        } else if (message.toLowerCase().includes('tretinoin') || message.toLowerCase().includes('medicine')) {
          reply = "⚠️ **Medical Safety**: Prescription advice requires an in-person assessment by Dr. Priya. Would you like to book a consultation?";
        }
        setDemoMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 600);
    } finally {
      setDemoLoading(false);
    }
  };

  const samplePrompts = [
    "What is the price of HydraFacial?",
    "Is Dr. Priya available tomorrow morning?",
    "Can you prescribe me tretinoin cream?",
    "How does Razorpay deposit booking work?",
  ];

  const faqs = [
    {
      q: 'How does Dermo prevent AI hallucinations for clinic pricing and medical advice?',
      a: 'Dermo is powered by a strict LangChain RAG pipeline grounded purely on your verified clinic database records and pgvector documents. It operates under a hardcoded non-diagnostic safety guardrail that blocks prescription advice and immediately flags emergency questions.',
    },
    {
      q: 'Does Dermo eliminate double-booking of doctor slots?',
      a: 'Yes. Unlike generic chatbot tools, Dermo calculates actual doctor shift hours, break times, and slot durations atomically in the backend database. Every booking is checked before confirmation.',
    },
    {
      q: 'How does Razorpay payment integration reduce no-shows?',
      a: 'Clinics can enable automated advance deposits (e.g. ₹500) via Razorpay. Patients receive an instant UPI/Card payment link inside WhatsApp to hold their slot, reducing clinic no-shows from ~30% down to under 3%.',
    },
    {
      q: 'Can our reception staff take over a conversation anytime?',
      a: 'Absolutely. A single click on the "Take Over" button on the dashboard immediately pauses the AI assistant, allowing staff to chat directly with the patient in real time from the dashboard.',
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: 'Meta WhatsApp Cloud API Native',
      desc: 'Connects directly to your clinic WhatsApp number. Automatic challenge verification, idempotency deduplication on provider message ID, and quick-reply buttons.',
    },
    {
      icon: Sparkles,
      title: 'LangChain & pgvector RAG Grounding',
      desc: 'Answers pricing, pre-care, post-care, and doctor credentials strictly from your clinic approved database and vectorized knowledge base. Zero hallucinations.',
    },
    {
      icon: Calendar,
      title: 'Dynamic Doctor Shift Slot Engine',
      desc: 'Computes available slots live based on doctor shifts, break intervals, and procedure duration. Atomic reservation eliminates conflicting double-bookings.',
    },
    {
      icon: CreditCard,
      title: 'Razorpay Advance Deposit Checkout',
      desc: 'Collect advance booking deposits (e.g. ₹500 via UPI/Cards) directly through WhatsApp before holding premium doctor slots, slashing no-show rates.',
    },
    {
      icon: ShieldCheck,
      title: 'Medical Non-Diagnostic Guardrails',
      desc: 'Strict safety policies prevent drug prescription, dosage advice, or disease diagnosis. Inquiries trigger safe escalation and connect patients with human doctors.',
    },
    {
      icon: UserCheck,
      title: '1-Click Human Receptionist Takeover',
      desc: 'Receptionists can monitor live chat streams and take over anytime with 1-click. AI automatically pauses until staff releases the conversation back to AI.',
    },
  ];

  const steps = [
    { num: '01', title: 'Patient Enquires', desc: 'Patient texts clinic WhatsApp asking about HydraFacial, laser, or doctor timings.' },
    { num: '02', title: 'Grounded Answer', desc: 'LangChain AI pulls exact pricing and answers treatment questions with zero hallucination.' },
    { num: '03', title: 'Slot Reservation', desc: 'Calculates doctor open hours and holds the chosen time slot with Razorpay deposit verification.' },
    { num: '04', title: 'Dashboard Sync', desc: 'Lead, chat history, and confirmed booking instantly appear on clinic dashboard.' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 selection:bg-orange-500 selection:text-white">
      {/* ═══════════════════════════════════════════
          AMBIENT BACKGROUND GLOWS (animated)
          ═══════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[700px] h-[500px] bg-orange-500/[0.06] rounded-full blur-[160px] animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[400px] bg-amber-500/[0.04] rounded-full blur-[140px] animate-gradient-shift delay-300" style={{ backgroundSize: '200% 200%' }} />
        <div className="absolute top-[50%] left-[50%] w-[600px] h-[300px] bg-orange-600/[0.03] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Subtle grain overlay */}
      <div className="fixed inset-0 pointer-events-none -z-[5] opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }} />

      {/* ═══════════════════════════════════════════
          NAVIGATION
          ═══════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/60 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in-up">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-orange-500/10 flex items-center justify-center bg-black">
              <img src="/logo.png" alt="Dermo Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Dermo<span className="text-orange-400">.ai</span>
              </span>
              <span className="text-[10px] block uppercase tracking-widest text-orange-400 font-semibold">
                Clinic AI Employee
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300 animate-fade-in-up delay-100">
            <a href="#features" className="hover-underline hover:text-orange-400 transition-colors py-1">Features</a>
            <a href="#demo" className="hover-underline hover:text-orange-400 transition-colors py-1">Interactive Demo</a>
            <a href="#how-it-works" className="hover-underline hover:text-orange-400 transition-colors py-1">How It Works</a>
            <a href="#pricing" className="hover-underline hover:text-orange-400 transition-colors py-1">Pricing</a>
            <a href="#faq" className="hover-underline hover:text-orange-400 transition-colors py-1">FAQ</a>
          </nav>

          <div className="flex items-center gap-3 animate-fade-in-up delay-200">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-orange-500/40"
            >
              <span>Clinic Dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Floating ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-orange-400/30"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animation: `particle-float ${6 + i * 1.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold tracking-wide animate-fade-in-up animate-breathe">
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                <span>LangChain + Gemini AI + pgvector RAG + Razorpay</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] animate-fade-in-up delay-100">
                The <span className="text-shimmer">24/7 AI Employee</span> Built For Dermatology Clinics.
              </h1>

              <p className="text-lg text-neutral-300 max-w-2xl leading-relaxed animate-fade-in-up delay-200">
                Zero hallucinations. Dermo handles WhatsApp inquiries in English & Hinglish, answers procedure pricing, verifies live doctor shift availability, collects Razorpay deposits, and eliminates double-bookings.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2 animate-fade-in-up delay-300">
                <Link
                  href="/dashboard"
                  className="group px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-bold text-base shadow-xl shadow-orange-500/30 flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-500/50"
                >
                  <Building2 className="w-5 h-5" />
                  <span>Explore Live Dashboard</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#demo"
                  className="group px-6 py-3.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-200 font-semibold text-base flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-5 h-5 text-orange-400" />
                  <span>Test WhatsApp Demo</span>
                </a>
              </div>

              {/* Trust Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-800/80 max-w-xl animate-fade-in-up delay-500">
                {[
                  { value: '98.4%', label: 'RAG Accuracy Score', color: 'text-white' },
                  { value: '0', label: 'Double Bookings', color: 'text-orange-400' },
                  { value: '< 2s', label: 'WhatsApp Latency', color: 'text-white' },
                ].map((stat, i) => (
                  <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${600 + i * 100}ms` }}>
                    <div className={`text-2xl sm:text-3xl font-bold ${stat.color} font-mono`}>{stat.value}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Animated WhatsApp Widget Demo */}
            <div id="demo" className="lg:col-span-5 animate-slide-in-right delay-200">
              <div className="relative mx-auto max-w-[380px] animate-float">
                {/* Animated gradient border ring */}
                <div className="absolute -inset-1 rounded-[38px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 opacity-20 blur-sm animate-gradient-shift" style={{ backgroundSize: '200% 200%' }} />

                <div className="relative rounded-[36px] p-3 bg-neutral-900 border border-neutral-700/80 shadow-2xl shadow-orange-950/50 animate-glow-pulse">
                  {/* Phone Speaker Notch */}
                  <div className="w-28 h-4 bg-neutral-800 rounded-full mx-auto mb-2" />

                  {/* WhatsApp Chat Container */}
                  <div className="rounded-[26px] bg-[#0b141a] overflow-hidden flex flex-col h-[520px] border border-neutral-800 text-xs">
                    {/* WhatsApp Header */}
                    <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-neutral-700/50 text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                          DA
                        </div>
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-1">
                            <span>DermaCare AI</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                          </div>
                          <div className="text-[10px] text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                            <span>Online • WhatsApp Official</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Messages Feed */}
                    <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0b141a] no-scrollbar">
                      <div className="text-center animate-fade-in-up">
                        <span className="px-2.5 py-1 rounded bg-[#182229] text-[10px] text-neutral-400 border border-neutral-800">
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
                            className={`max-w-[85%] rounded-xl px-3 py-2 text-neutral-100 shadow-sm leading-relaxed transition-all duration-300 ${
                              msg.sender === 'user'
                                ? 'bg-[#005c4b] rounded-tr-none'
                                : 'bg-[#202c33] rounded-tl-none border border-neutral-700/50'
                            }`}
                          >
                            <div className="whitespace-pre-line text-[11px]">{msg.text}</div>
                            <div className="text-[9px] text-neutral-400 text-right mt-1">{msg.time}</div>
                          </div>
                        </div>
                      ))}

                      {demoLoading && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#202c33] w-20 text-neutral-400 text-[10px] animate-fade-in-up">
                          <span className="animate-bounce">●</span>
                          <span className="animate-bounce [animation-delay:0.2s]">●</span>
                          <span className="animate-bounce [animation-delay:0.4s]">●</span>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Sample Prompts Pills */}
                    <div className="p-2 bg-[#111b21] border-t border-neutral-800 flex gap-1.5 overflow-x-auto no-scrollbar">
                      {samplePrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendDemoMessage(prompt)}
                          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-orange-950/60 hover:text-orange-300 border border-neutral-700/80 text-[10px] text-neutral-300 transition-all duration-300 hover:border-orange-500/40 hover:scale-[1.03]"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    {/* WhatsApp Input Field */}
                    <div className="p-2.5 bg-[#202c33] flex items-center gap-2 border-t border-neutral-700/60">
                      <input
                        type="text"
                        value={demoInput}
                        onChange={(e) => setDemoInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendDemoMessage()}
                        placeholder="Type a WhatsApp inquiry..."
                        className="flex-1 bg-[#2a3942] border-none rounded-lg px-3 py-1.5 text-neutral-100 placeholder-neutral-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 transition-shadow duration-300"
                      />
                      <button
                        onClick={() => handleSendDemoMessage()}
                        disabled={demoLoading || !demoInput.trim()}
                        className="p-2 rounded-lg bg-orange-500 text-black hover:bg-orange-400 transition-all duration-300 disabled:opacity-40 hover:shadow-md hover:shadow-orange-500/30 hover:scale-105 active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
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
      <section id="features" className="py-20 border-t border-neutral-800/60 bg-neutral-950/40 relative" ref={featuresView.ref}>
        {/* Subtle section mesh */}
        <div className="absolute inset-0 mesh-gradient pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center max-w-3xl mx-auto mb-16 space-y-3 transition-all duration-700 ${featuresView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">
              Autonomous & Deterministic
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built Specifically for Aesthetic & Dermatology Workflows
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Generic chatbot tools make up answers and double-book doctors. Dermo is deeply integrated with your clinic operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`glass-card p-6 rounded-2xl space-y-4 hover:border-orange-500/40 transition-all duration-500 group ${
                    featuresView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: `${150 + i * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-50 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
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
      <section id="how-it-works" className="py-20 border-t border-neutral-800/60" ref={howItWorksView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-16 space-y-3 transition-all duration-700 ${howItWorksView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">
              Seamless Patient Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Dermo Automates Your Patient Pipeline</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`glass-card p-6 rounded-2xl relative border-t-2 border-t-orange-500 space-y-3 step-connector transition-all duration-500 hover:border-t-amber-400 ${
                  howItWorksView.isInView ? 'animate-slide-in-left' : 'opacity-0 -translate-x-8'
                }`}
                style={{ animationDelay: `${200 + i * 150}ms` }}
              >
                <span className="text-3xl font-extrabold font-mono bg-gradient-to-b from-orange-500/40 to-transparent bg-clip-text text-transparent">{step.num}</span>
                <h4 className="text-base font-bold text-white">{step.title}</h4>
                <p className="text-xs text-neutral-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING MATRIX
          ═══════════════════════════════════════════ */}
      <section id="pricing" className="py-20 border-t border-neutral-800/60 bg-neutral-950/50 relative" ref={pricingView.ref}>
        <div className="absolute inset-0 mesh-gradient pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center max-w-3xl mx-auto mb-16 space-y-3 transition-all duration-700 ${pricingView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">Transparent Plans</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Simple Pricing for Growing Clinics</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className={`glass-card p-8 rounded-3xl space-y-6 transition-all duration-500 hover:border-neutral-600 ${pricingView.isInView ? 'animate-fade-in-up delay-200' : 'opacity-0 translate-y-8'}`}>
              <div>
                <h3 className="text-lg font-bold text-white">Single Doctor Clinic</h3>
                <p className="text-xs text-neutral-400 mt-1">For boutique aesthetic and skincare clinics.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">₹4,999</span>
                <span className="text-neutral-400 text-sm">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> 1 WhatsApp Clinic Number
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> Up to 1,000 monthly patient chats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> Grounded RAG Knowledge Base
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> Appointment Slot Booking Engine
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>

            {/* Pro / Featured */}
            <div className={`pricing-glow p-8 rounded-3xl space-y-6 relative bg-neutral-900/90 shadow-2xl shadow-orange-950/80 transition-all duration-500 hover:-translate-y-1 ${pricingView.isInView ? 'animate-scale-in delay-300' : 'opacity-0 scale-90'}`}>
              <div className="absolute -top-3.5 right-8 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black text-[10px] font-bold uppercase tracking-wider shadow-md shadow-orange-500/30 animate-breathe">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Multi-Doctor Aesthetic Clinic</h3>
                <p className="text-xs text-neutral-400 mt-1">For busy laser & dermatology centers.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">₹9,999</span>
                <span className="text-neutral-400 text-sm">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> Up to 5 Doctor Shift Schedules
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> Unlimited monthly WhatsApp chats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> Razorpay Advance Booking Deposits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> 1-Click Human Receptionist Takeover
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> WhatsApp Mobile Simulator Sandbox
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 hover:shadow-orange-500/40"
              >
                Launch Dashboard Demo
              </Link>
            </div>

            {/* Enterprise */}
            <div className={`glass-card p-8 rounded-3xl space-y-6 transition-all duration-500 hover:border-neutral-600 ${pricingView.isInView ? 'animate-fade-in-up delay-400' : 'opacity-0 translate-y-8'}`}>
              <div>
                <h3 className="text-lg font-bold text-white">Clinic Chains & Hospitals</h3>
                <p className="text-xs text-neutral-400 mt-1">Multi-branch aesthetic chains with custom EMR.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <ul className="space-y-3 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> Multi-branch clinic routing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> Custom EMR / CRM sync integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" /> Dedicated SLA & HIPAA / DPDP setup
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Contact Clinic Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ ACCORDION (smooth height transitions)
          ═══════════════════════════════════════════ */}
      <section id="faq" className="py-20 border-t border-neutral-800/60" ref={faqView.ref}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 space-y-3 transition-all duration-700 ${faqView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">Frequently Asked Questions</span>
            <h2 className="text-3xl font-extrabold text-white">Everything You Need to Know</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`glass-card rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                    isOpen ? 'border-orange-500/30 bg-orange-500/[0.03]' : 'border-neutral-800 hover:border-neutral-700'
                  } ${faqView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
                  style={{ animationDelay: `${200 + i * 100}ms` }}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-semibold text-neutral-100 text-sm sm:text-base">{faq.q}</h4>
                    <ChevronDown
                      className={`w-5 h-5 text-orange-400 shrink-0 transition-transform duration-300 ease-spring ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  <div className={`faq-content ${isOpen ? 'open' : ''}`}>
                    <div>
                      <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed pt-2 border-t border-neutral-800/60">
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
      <footer className="py-12 border-t border-neutral-800/60 bg-neutral-950 text-neutral-400 text-xs relative overflow-hidden">
        {/* Gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-black flex items-center justify-center">
              <img src="/logo.png" alt="Dermo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-white">Dermo.ai</span>
            <span>— Managed AI Employee for Clinics.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover-underline hover:text-orange-400 py-1 transition-colors">Dashboard</Link>
            <Link href="/dashboard/conversations" className="hover-underline hover:text-orange-400 py-1 transition-colors">WhatsApp Simulator</Link>
            <Link href="/dashboard/payments" className="hover-underline hover:text-orange-400 py-1 transition-colors">Razorpay Setup</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
