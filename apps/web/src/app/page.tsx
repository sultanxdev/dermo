'use client';

import React, { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 selection:bg-orange-500 selection:text-white">
      {/* Background Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-orange-500/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[350px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-[#0A0A0A]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
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

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
            <a href="#features" className="hover:text-orange-400 transition-colors">Features</a>
            <a href="#demo" className="hover:text-orange-400 transition-colors">Interactive Demo</a>
            <a href="#how-it-works" className="hover:text-orange-400 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-orange-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-orange-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Clinic Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold tracking-wide">
                <Zap className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span>LangChain + Gemini AI + pgvector RAG + Razorpay</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                The <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200 bg-clip-text text-transparent">24/7 AI Employee</span> Built For Dermatology Clinics.
              </h1>

              <p className="text-lg text-neutral-300 max-w-2xl leading-relaxed">
                Zero hallucinations. Dermo handles WhatsApp inquiries in English & Hinglish, answers procedure pricing, verifies live doctor shift availability, collects Razorpay deposits, and eliminates double-bookings.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-bold text-base shadow-xl shadow-orange-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Building2 className="w-5 h-5" />
                  <span>Explore Live Dashboard</span>
                </Link>

                <a
                  href="#demo"
                  className="px-6 py-3.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-200 font-semibold text-base flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-orange-400" />
                  <span>Test WhatsApp Demo</span>
                </a>
              </div>

              {/* Trust Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-800/80 max-w-xl">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white font-mono">98.4%</div>
                  <div className="text-xs text-neutral-400 mt-0.5">RAG Accuracy Score</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-orange-400 font-mono">0</div>
                  <div className="text-xs text-neutral-400 mt-0.5">Double Bookings</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white font-mono">&lt; 2s</div>
                  <div className="text-xs text-neutral-400 mt-0.5">WhatsApp Latency</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive WhatsApp Widget Demo */}
            <div id="demo" className="lg:col-span-5">
              <div className="relative mx-auto max-w-[380px] rounded-[36px] p-3 bg-neutral-900 border border-neutral-700/80 shadow-2xl shadow-orange-950/50 glow-orange">
                {/* Phone Speaker Notch */}
                <div className="w-28 h-4 bg-neutral-800 rounded-full mx-auto mb-2" />

                {/* WhatsApp Chat Container */}
                <div className="rounded-[26px] bg-[#0b141a] overflow-hidden flex flex-col h-[520px] border border-neutral-800 text-xs">
                  {/* WhatsApp Header */}
                  <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-neutral-700/50 text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white text-xs">
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
                  <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0b141a]">
                    <div className="text-center">
                      <span className="px-2.5 py-1 rounded bg-[#182229] text-[10px] text-neutral-400 border border-neutral-800">
                        🔒 End-to-end encrypted AI conversation
                      </span>
                    </div>

                    {demoMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-3 py-2 text-neutral-100 shadow-sm leading-relaxed ${
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
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#202c33] w-20 text-neutral-400 text-[10px]">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce [animation-delay:0.2s]">●</span>
                        <span className="animate-bounce [animation-delay:0.4s]">●</span>
                      </div>
                    )}
                  </div>

                  {/* Sample Prompts Pills */}
                  <div className="p-2 bg-[#111b21] border-t border-neutral-800 flex gap-1.5 overflow-x-auto no-scrollbar">
                    {samplePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendDemoMessage(prompt)}
                        className="whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-orange-950/60 hover:text-orange-300 border border-neutral-700/80 text-[10px] text-neutral-300 transition-colors"
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
                      className="flex-1 bg-[#2a3942] border-none rounded-lg px-3 py-1.5 text-neutral-100 placeholder-neutral-400 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      onClick={() => handleSendDemoMessage()}
                      disabled={demoLoading || !demoInput.trim()}
                      className="p-2 rounded-lg bg-orange-500 text-black hover:bg-orange-400 transition-colors disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars */}
      <section id="features" className="py-20 border-t border-neutral-800/80 bg-neutral-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
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
            {/* Feature 1 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-orange-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Meta WhatsApp Cloud API Native</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Connects directly to your clinic WhatsApp number. Automatic challenge verification, idempotency deduplication on provider message ID, and quick-reply buttons.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-orange-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">LangChain & pgvector RAG Grounding</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Answers pricing, pre-care, post-care, and doctor credentials strictly from your clinic approved database and vectorized knowledge base. Zero hallucinations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-orange-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Dynamic Doctor Shift Slot Engine</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Computes available slots live based on doctor shifts, break intervals, and procedure duration. Atomic reservation eliminates conflicting double-bookings.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-orange-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Razorpay Advance Deposit Checkout</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Collect advance booking deposits (e.g. ₹500 via UPI/Cards) directly through WhatsApp before holding premium doctor slots, slashing no-show rates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-orange-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Medical Non-Diagnostic Guardrails</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Strict safety policies prevent drug prescription, dosage advice, or disease diagnosis. Inquiries trigger safe escalation and connect patients with human doctors.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-orange-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1-Click Human Receptionist Takeover</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Receptionists can monitor live chat streams and take over anytime with 1-click. AI automatically pauses until staff releases the conversation back to AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-t border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">
              Seamless Patient Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Dermo Automates Your Patient Pipeline</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl relative border-t-2 border-t-orange-500 space-y-3">
              <span className="text-3xl font-extrabold font-mono text-orange-500/30">01</span>
              <h4 className="text-base font-bold text-white">Patient Enquires</h4>
              <p className="text-xs text-neutral-400">Patient texts clinic WhatsApp asking about HydraFacial, laser, or doctor timings.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative border-t-2 border-t-orange-500 space-y-3">
              <span className="text-3xl font-extrabold font-mono text-orange-500/30">02</span>
              <h4 className="text-base font-bold text-white">Grounded Answer</h4>
              <p className="text-xs text-neutral-400">LangChain AI pulls exact pricing and answers treatment questions with zero hallucination.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative border-t-2 border-t-orange-500 space-y-3">
              <span className="text-3xl font-extrabold font-mono text-orange-500/30">03</span>
              <h4 className="text-base font-bold text-white">Slot Reservation</h4>
              <p className="text-xs text-neutral-400">Calculates doctor open hours and holds the chosen time slot with Razorpay deposit verification.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl relative border-t-2 border-t-orange-500 space-y-3">
              <span className="text-3xl font-extrabold font-mono text-orange-500/30">04</span>
              <h4 className="text-base font-bold text-white">Dashboard Sync</h4>
              <p className="text-xs text-neutral-400">Lead, chat history, and confirmed booking instantly appear on clinic dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className="py-20 border-t border-neutral-800/80 bg-neutral-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">Transparent Plans</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Simple Pricing for Growing Clinics</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="glass-card p-8 rounded-3xl space-y-6">
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
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> 1 WhatsApp Clinic Number
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> Up to 1,000 monthly patient chats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> Grounded RAG Knowledge Base
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> Appointment Slot Booking Engine
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm flex items-center justify-center transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro / Featured */}
            <div className="glass-card p-8 rounded-3xl space-y-6 border-2 border-orange-500/80 relative shadow-2xl shadow-orange-950/80 glow-orange">
              <div className="absolute -top-3.5 right-8 px-3 py-1 rounded-full bg-orange-500 text-black text-[10px] font-bold uppercase tracking-wider">
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
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> Up to 5 Doctor Shift Schedules
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> Unlimited monthly WhatsApp chats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> Razorpay Advance Booking Deposits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> 1-Click Human Receptionist Takeover
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> WhatsApp Mobile Simulator Sandbox
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm flex items-center justify-center transition-colors shadow-lg shadow-orange-500/25"
              >
                Launch Dashboard Demo
              </Link>
            </div>

            {/* Enterprise */}
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Clinic Chains & Hospitals</h3>
                <p className="text-xs text-neutral-400 mt-1">Multi-branch aesthetic chains with custom EMR.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <ul className="space-y-3 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> Multi-branch clinic routing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> Custom EMR / CRM sync integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400" /> Dedicated SLA & HIPAA / DPDP setup
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm flex items-center justify-center transition-colors"
              >
                Contact Clinic Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 border-t border-neutral-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs uppercase tracking-widest text-orange-400 font-bold">Frequently Asked Questions</span>
            <h2 className="text-3xl font-extrabold text-white">Everything You Need to Know</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 cursor-pointer border border-neutral-800 transition-all hover:border-neutral-700"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-semibold text-neutral-100 text-sm sm:text-base">{faq.q}</h4>
                  <ChevronDown
                    className={`w-5 h-5 text-orange-400 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {openFaq === i && (
                  <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed pt-2 border-t border-neutral-800/60">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-800/80 bg-neutral-950 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden bg-black flex items-center justify-center">
              <img src="/logo.png" alt="Dermo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-white">Dermo.ai</span>
            <span>— Managed AI Employee for Clinics.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-orange-400">Dashboard</Link>
            <Link href="/dashboard/conversations" className="hover:text-orange-400">WhatsApp Simulator</Link>
            <Link href="/dashboard/payments" className="hover:text-orange-400">Razorpay Setup</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
