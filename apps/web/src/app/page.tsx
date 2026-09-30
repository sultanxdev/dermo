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
  Phone,
  Video,
  MoreVertical,
  Check,
  ChevronRight,
  Stethoscope,
  X,
  FileText,
  Lock,
  RotateCcw,
  Smile,
  Paperclip,
  Camera,
  Mic,
  ArrowDown,
  CheckCheck,
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
  // Demo Booking Modal State
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoFormSubmitted, setDemoFormSubmitted] = useState(false);
  const [demoFormData, setDemoFormData] = useState({
    clinicName: '',
    contactName: '',
    phone: '',
    specialty: 'Aesthetic & Dermatology',
    monthlyVolume: '100-300 patients/mo',
  });

  // Interactive WhatsApp Demo State
  const [demoStep, setDemoStep] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');
  const [additionalMessages, setAdditionalMessages] = useState<Array<{ sender: 'patient' | 'dermo'; text: string; time: string }>>([]);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered section refs
  const workflowView = useInView(0.1);
  const featuresView = useInView(0.1);
  const howItWorksView = useInView(0.1);
  const pricingView = useInView(0.1);
  const faqView = useInView(0.1);

  // Auto-scroll chat when demo state changes
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
    }, 800);
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
      // Deterministic fallback response tailored to Nova Skin Clinic
      setAdditionalMessages((prev) => [
        ...prev,
        {
          sender: 'dermo',
          text: `Thank you for asking! At Nova Skin Clinic, our consultations start from ₹800 with verified specialists. Would you like to view our doctor schedule for tomorrow?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoFormSubmitted(true);
  };

  const features = [
    {
      icon: MessageSquare,
      title: 'WhatsApp Business API Integration',
      desc: 'Connect your verified clinic WhatsApp number. Instant response times, rich interactive buttons, and template notifications.',
    },
    {
      icon: Sparkles,
      title: 'Verified Clinic Knowledge Base',
      desc: 'Retrieval grounded strictly on your clinic procedures, consultation fees, pre-care guidelines, and doctor profiles.',
    },
    {
      icon: Calendar,
      title: 'Real Provider Availability Engine',
      desc: 'Deterministic appointment booking based on actual doctor shifts, break intervals, and consultation duration.',
    },
    {
      icon: CreditCard,
      title: 'Automated Advance Deposits',
      desc: 'Collect advance consultation fees or treatment deposits right inside WhatsApp, eliminating clinic no-shows.',
    },
    {
      icon: UserCheck,
      title: '1-Click Receptionist Takeover',
      desc: 'Instant human takeover switch pauses AI whenever clinic staff want to personally handle a high-value inquiry.',
    },
    {
      icon: ShieldCheck,
      title: 'Medical Safety Guardrails',
      desc: 'Strict non-diagnostic boundaries. Emergency signals automatically trigger clinical escalations to on-duty staff.',
    },
  ];

  const steps = [
    { num: '01', title: 'WhatsApp Inquiry', desc: 'Patient messages your clinic WhatsApp number with treatment or timing questions.' },
    { num: '02', title: 'Grounded AI Reply', desc: 'Dermo retrieves verified prices and doctor availability instantly from clinic records.' },
    { num: '03', title: 'Slot & Deposit', desc: 'Patient picks an open slot and pays the booking deposit via secure link.' },
    { num: '04', title: 'Dashboard Sync', desc: 'Lead, chat history, and confirmed booking instantly appear on clinic dashboard.' },
  ];

  const faqs = [
    {
      q: 'Will the AI give medical diagnoses or write prescriptions?',
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
      q: 'How do advance deposits work?',
      a: 'When an appointment is requested, Dermo can generate a secure payment link. Once verified, the slot is locked and confirmed.',
    },
    {
      q: 'What types of clinics can use Dermo?',
      a: 'Dermo is built for modern appointment-based outpatient clinics — including Dermatology, Dental, Aesthetics, Physiotherapy, Ophthalmology, and Orthopedic practices.',
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
              <span className="text-xl font-bold tracking-tight text-[#553E53] flex items-center gap-1.5 font-serif">
                Dermo<span className="text-[#8E6F8B]">.ai</span>
              </span>
              <span className="text-[10px] block uppercase tracking-widest text-[#553E53]/70 font-semibold">
                Clinic AI Employee
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#553E53]/80 animate-fade-in-up delay-100">
            <a href="#features" className="hover:text-[#553E53] transition-colors py-1 hover-underline">Features</a>
            <a href="#demo" className="hover:text-[#553E53] transition-colors py-1 hover-underline">Live WhatsApp Demo</a>
            <a href="#workflow" className="hover:text-[#553E53] transition-colors py-1 hover-underline">Architecture</a>
            <a href="#how-it-works" className="hover:text-[#553E53] transition-colors py-1 hover-underline">How It Works</a>
            <a href="#pricing" className="hover:text-[#553E53] transition-colors py-1 hover-underline">Pricing</a>
            <a href="#faq" className="hover:text-[#553E53] transition-colors py-1 hover-underline">FAQ</a>
          </nav>

          <div className="flex items-center gap-4 animate-fade-in-up delay-200">
            {/* Secondary Clinic Login */}
            <Link
              href="/auth/login"
              className="text-xs font-semibold text-[#553E53]/80 hover:text-[#553E53] transition-colors py-1.5 px-2"
            >
              Clinic Login
            </Link>

            {/* Primary Navigation CTA */}
            <button
              onClick={() => {
                setShowDemoModal(true);
                setDemoFormSubmitted(false);
              }}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-medium text-xs sm:text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Book a Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B6CBDE] transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: SaaS Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#553E53]/15 text-[#553E53] text-xs font-semibold tracking-wide shadow-xs animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>AI Employee for Modern Outpatient Clinics</span>
              </div>

              {/* Exact Requested Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif font-bold tracking-tight text-[#553E53] leading-[1.12] animate-fade-in-up delay-100">
                The 24/7 AI Employee for Modern Clinics.
              </h1>

              {/* Exact Requested Supporting Copy */}
              <p className="text-base sm:text-lg text-[#553E53]/80 max-w-xl leading-relaxed animate-fade-in-up delay-200">
                Dermo handles patient conversations on WhatsApp, captures leads, answers questions using your clinic&apos;s verified information, checks real provider availability, books appointments, collects payments, and hands conversations to your team when needed.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2 animate-fade-in-up delay-300">
                <button
                  onClick={() => {
                    setShowDemoModal(true);
                    setDemoFormSubmitted(false);
                  }}
                  className="group px-6 py-3.5 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-semibold text-sm sm:text-base shadow-md shadow-[#553E53]/15 flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span>Book a Demo</span>
                  <ArrowRight className="w-4 h-4 text-[#B6CBDE] transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <a
                  href="#workflow"
                  className="group px-6 py-3.5 rounded-xl bg-white hover:bg-[#B6CBDE]/25 border border-[#553E53]/20 text-[#553E53] font-semibold text-sm sm:text-base flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 shadow-xs"
                >
                  <span>See How It Works</span>
                  <ChevronDown className="w-4 h-4 text-[#553E53]/70 group-hover:translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Capability-oriented Trust Statements (No fake metrics) */}
              <div className="pt-6 border-t border-[#553E53]/15 max-w-xl animate-fade-in-up delay-400">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#553E53]">
                      <Clock className="w-3.5 h-3.5 text-[#553E53]" />
                      <span>24/7 Patient Response</span>
                    </div>
                    <p className="text-[11px] text-[#553E53]/70 leading-tight">
                      Captures after-hours inquiries on WhatsApp instantly
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#553E53]">
                      <Calendar className="w-3.5 h-3.5 text-[#553E53]" />
                      <span>Real Availability</span>
                    </div>
                    <p className="text-[11px] text-[#553E53]/70 leading-tight">
                      Synced directly to verified doctor shifts & breaks
                    </p>
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#553E53]">
                      <UserCheck className="w-3.5 h-3.5 text-[#553E53]" />
                      <span>Human Handoff</span>
                    </div>
                    <p className="text-[11px] text-[#553E53]/70 leading-tight">
                      1-click staff takeover switch whenever needed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic iPhone Smartphone Frame & Interactive WhatsApp UI */}
            <div id="demo" className="lg:col-span-6 flex justify-center animate-slide-in-right delay-200">
              <div className="relative w-full max-w-[370px]">
                {/* Interactive Demo Label Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#553E53] text-[#F5F6F0] text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Interactive Demo</span>
                </div>

                {/* iPhone Outer Device Frame */}
                <div className="relative rounded-[50px] p-3.5 bg-gradient-to-b from-[#2B232A] via-[#1A1519] to-[#2B232A] shadow-2xl shadow-[#553E53]/25 border-[4px] border-[#423340]">
                  {/* Dynamic Island Notch */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-between px-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-800" />
                    <div className="w-2 h-2 rounded-full bg-[#0a1a0a]" />
                  </div>

                  {/* Inner Screen Container */}
                  <div className="rounded-[40px] bg-[#EFEAE2] overflow-hidden flex flex-col h-[580px] border border-black/20 text-xs relative select-none">
                    {/* Status Bar */}
                    <div className="bg-[#553E53] pt-3 px-6 pb-1.5 flex items-center justify-between text-[#F5F6F0] text-[11px] font-semibold">
                      <span>10:42</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px]">5G</span>
                        <div className="w-4 h-2 rounded-sm border border-[#F5F6F0] flex items-center p-0.5">
                          <div className="w-2.5 h-full bg-[#F5F6F0] rounded-xs" />
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Navigation Header */}
                    <div className="bg-[#553E53] px-3 py-2.5 flex items-center justify-between text-[#F5F6F0] shadow-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={handleResetDemo} title="Reset demo" className="text-[#B6CBDE] hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                        
                        {/* Dermo AI Avatar */}
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-[#B6CBDE] text-[#553E53] flex items-center justify-center font-bold text-xs shadow-inner">
                            <Bot className="w-5 h-5 text-[#553E53]" />
                          </div>
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#553E53]" />
                        </div>

                        <div>
                          <div className="font-bold text-xs flex items-center gap-1 text-white">
                            <span>Dermo AI</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                          </div>
                          <div className="text-[10px] text-[#B6CBDE] font-medium leading-none mt-0.5">
                            Online • Clinic AI Assistant
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[#B6CBDE]">
                        <Phone className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                        <Video className="w-4 h-4 hover:text-white cursor-pointer" />
                        <button onClick={handleResetDemo} title="Restart demo" className="hover:text-white">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Clinic Context Sub-banner */}
                    <div className="bg-white/80 backdrop-blur-xs px-3 py-1 text-[10px] text-[#553E53]/80 border-b border-[#553E53]/10 flex items-center justify-between">
                      <span className="font-semibold flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#553E53]" />
                        Nova Skin Clinic (Indiranagar)
                      </span>
                      <span className="text-[9px] text-[#553E53]/60 font-medium">WhatsApp Verified</span>
                    </div>

                    {/* WhatsApp Message Stream */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#EFEAE2] no-scrollbar">
                      {/* Encryption Notice */}
                      <div className="text-center my-1">
                        <span className="px-2.5 py-1 rounded-md bg-[#FFF9C4]/80 text-[9px] text-[#7A6A00] shadow-2xs inline-block">
                          🔒 Messages are end-to-end encrypted for patient privacy.
                        </span>
                      </div>

                      {/* Message 1: Patient */}
                      <div className="flex flex-col items-end">
                        <div className="max-w-[85%] rounded-2xl rounded-tr-xs px-3 py-2 bg-[#D9FDD3] text-[#111B21] shadow-xs text-[11px] leading-relaxed">
                          <p>Hi, what is the price of HydraFacial and is Dr. Priya available tomorrow?</p>
                          <div className="text-[9px] text-neutral-500 flex items-center justify-end gap-1 mt-1">
                            <span>10:42 AM</span>
                            <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                          </div>
                        </div>
                      </div>

                      {/* Message 2: Dermo AI Answer & Slot Availability */}
                      <div className="flex flex-col items-start">
                        <div className="max-w-[88%] rounded-2xl rounded-tl-xs px-3 py-2.5 bg-white text-[#111B21] shadow-xs text-[11px] leading-relaxed space-y-2 border border-black/5">
                          <p>
                            Hi! 👋 HydraFacial is <strong>₹3,500</strong> for a 45-minute session.
                          </p>
                          <div className="p-2 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10 space-y-1">
                            <span className="text-[10px] font-bold text-[#553E53] block">
                              Dr. Priya Sharma is available tomorrow:
                            </span>
                            <div className="text-[10px] text-neutral-600 space-y-0.5 font-medium">
                              <div>• 10:30 AM (Available)</div>
                              <div>• 11:00 AM (Available)</div>
                              <div>• 11:30 AM (Available)</div>
                            </div>
                          </div>
                          <p className="text-[10px] text-neutral-700 font-medium">
                            Would you like me to reserve a slot?
                          </p>

                          {/* Quick Slot Action Pills */}
                          {demoStep === 0 && (
                            <div className="pt-1 flex flex-wrap gap-1.5">
                              {['10:30 AM', '11:00 AM', '11:30 AM'].map((time) => (
                                <button
                                  key={time}
                                  onClick={() => handleSelectSlot(time)}
                                  className="px-2.5 py-1 rounded-lg bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] text-[10px] font-semibold transition-all active:scale-95 shadow-2xs"
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="text-[9px] text-neutral-400 text-right mt-0.5">
                            10:42 AM
                          </div>
                        </div>
                      </div>

                      {/* Step 1: Patient Books Slot */}
                      {demoStep >= 1 && (
                        <>
                          <div className="flex flex-col items-end animate-fade-in-up">
                            <div className="max-w-[85%] rounded-2xl rounded-tr-xs px-3 py-2 bg-[#D9FDD3] text-[#111B21] shadow-xs text-[11px] leading-relaxed">
                              <p>Can I book 11:00 AM?</p>
                              <div className="text-[9px] text-neutral-500 flex items-center justify-end gap-1 mt-1">
                                <span>10:43 AM</span>
                                <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                              </div>
                            </div>
                          </div>

                          {/* Step 1: Dermo AI Reserve & Deposit Button */}
                          <div className="flex flex-col items-start animate-fade-in-up">
                            <div className="max-w-[88%] rounded-2xl rounded-tl-xs px-3 py-2.5 bg-white text-[#111B21] shadow-xs text-[11px] leading-relaxed space-y-2 border border-black/5">
                              <p>
                                Absolutely. I&apos;ll reserve the <strong>11:00 AM slot</strong> with Dr. Priya Sharma and take you to secure the consultation deposit.
                              </p>

                              {!depositPaid && (
                                <div className="p-2.5 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-2">
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-bold text-[#553E53]">Nova Skin Clinic Booking</span>
                                    <span className="font-mono font-bold text-[#553E53]">₹500 Deposit</span>
                                  </div>
                                  <button
                                    onClick={handlePayDeposit}
                                    className="w-full py-2 rounded-lg bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                                  >
                                    <CreditCard className="w-3.5 h-3.5 text-[#B6CBDE]" />
                                    <span>Pay ₹500 Deposit (Simulate)</span>
                                  </button>
                                </div>
                              )}

                              <div className="text-[9px] text-neutral-400 text-right mt-0.5">
                                10:43 AM
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Step 2: Payment Confirmation & Booking Locked */}
                      {depositPaid && (
                        <div className="flex flex-col items-start animate-fade-in-up">
                          <div className="max-w-[88%] rounded-2xl rounded-tl-xs px-3 py-2.5 bg-white text-[#111B21] shadow-xs text-[11px] leading-relaxed space-y-2 border border-emerald-500/20">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Deposit Paid Successfully (₹500)</span>
                            </div>
                            <p>
                              Appointment confirmed! 🎉 Your slot is officially locked for tomorrow at <strong>11:00 AM</strong> with <strong>Dr. Priya Sharma</strong>.
                            </p>
                            <div className="text-[10px] text-neutral-600 p-2 rounded-lg bg-[#F5F6F0] border border-neutral-200">
                              <div>• Booking ID: <strong>#NOV-4921</strong></div>
                              <div>• Treatment: HydraFacial (45m)</div>
                              <div>• Location: Nova Skin Clinic, Indiranagar</div>
                            </div>
                            <div className="text-[9px] text-neutral-400 text-right">
                              10:44 AM
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Custom User Chat Messages */}
                      {additionalMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'} animate-fade-in-up`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed shadow-xs ${
                              msg.sender === 'patient'
                                ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-xs'
                                : 'bg-white text-[#111B21] rounded-tl-xs border border-black/5'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <div className="text-[9px] text-neutral-500 text-right mt-1">
                              {msg.time}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-white w-16 text-[#553E53] shadow-xs border border-black/5 animate-fade-in-up">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Interactive Prompt Shortcuts */}
                    <div className="p-2 bg-[#F0F2F5] border-t border-[#553E53]/10 flex gap-1.5 overflow-x-auto no-scrollbar">
                      {demoStep === 0 && (
                        <button
                          onClick={() => handleSelectSlot('11:00 AM')}
                          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-[#B6CBDE]/30 border border-[#553E53]/15 text-[10px] text-[#553E53] font-medium transition-all"
                        >
                          📅 Book 11:00 AM
                        </button>
                      )}
                      <button
                        onClick={() => handleSendCustomMessage('What is the price of Chemical Peel?')}
                        className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-[#B6CBDE]/30 border border-[#553E53]/15 text-[10px] text-[#553E53] font-medium transition-all"
                      >
                        Ask Chemical Peel
                      </button>
                      <button
                        onClick={() => handleSendCustomMessage('Can I speak with your human receptionist?')}
                        className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-[#B6CBDE]/30 border border-[#553E53]/15 text-[10px] text-[#553E53] font-medium transition-all"
                      >
                        Request Receptionist
                      </button>
                      <button
                        onClick={handleResetDemo}
                        className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#553E53] text-[#F5F6F0] text-[10px] font-medium transition-all hover:bg-[#433041]"
                      >
                        Reset Demo ↺
                      </button>
                    </div>

                    {/* WhatsApp Mobile Input Bar */}
                    <div className="p-2 bg-[#F0F2F5] flex items-center gap-2 border-t border-black/5">
                      <div className="flex items-center gap-1 text-neutral-500">
                        <Smile className="w-4 h-4 cursor-pointer hover:text-neutral-700" />
                        <Paperclip className="w-4 h-4 cursor-pointer hover:text-neutral-700" />
                      </div>
                      <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendCustomMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-white rounded-full px-3.5 py-1.5 text-[#111B21] placeholder:text-neutral-400 text-xs focus:outline-none shadow-2xs"
                      />
                      {customInput.trim() ? (
                        <button
                          onClick={() => handleSendCustomMessage()}
                          className="p-1.5 rounded-full bg-[#553E53] text-[#F5F6F0] hover:bg-[#433041] transition-colors"
                        >
                          <Send className="w-3.5 h-3.5 text-[#B6CBDE]" />
                        </button>
                      ) : (
                        <div className="p-1.5 text-neutral-500">
                          <Mic className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 9: WORKFLOW ARCHITECTURE DIAGRAM
          ═══════════════════════════════════════════ */}
      <section id="workflow" className="py-16 lg:py-24 border-t border-[#553E53]/12 bg-white/70 relative" ref={workflowView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center max-w-3xl mx-auto mb-14 space-y-3 transition-all duration-700 ${workflowView.isInView ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs uppercase tracking-widest text-[#553E53] font-bold">
              Autonomous Clinic Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#553E53]">
              More Than A Chatbot: Full Patient Journey Automation
            </h2>
            <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
              Dermo integrates patient inquiries, verified clinical knowledge, doctor shift availability, and payment confirmation into a single closed-loop system.
            </p>
          </div>

          {/* Conceptual Workflow Diagram Component */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#553E53]/15 shadow-sm space-y-8">
            {/* Step 1: Patient Inbound */}
            <div className="flex flex-col items-center">
              <div className="px-5 py-3 rounded-2xl bg-[#553E53] text-[#F5F6F0] text-center shadow-md shadow-[#553E53]/15 flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#B6CBDE]" />
                <span className="font-bold text-sm sm:text-base">Patient WhatsApp Message</span>
              </div>
              <div className="w-0.5 h-8 bg-gradient-to-b from-[#553E53] to-[#B6CBDE] my-1" />
              <ArrowDown className="w-4 h-4 text-[#553E53] -mt-2" />
            </div>

            {/* Step 2: Dermo AI Engine */}
            <div className="flex flex-col items-center">
              <div className="px-6 py-3.5 rounded-2xl bg-[#B6CBDE]/30 border-2 border-[#553E53] text-[#553E53] text-center shadow-xs flex items-center gap-3">
                <Bot className="w-5 h-5 text-[#553E53]" />
                <div>
                  <span className="font-bold text-base sm:text-lg block">Dermo AI Core</span>
                  <span className="text-[11px] text-[#553E53]/70 font-medium">Intent Matching & Medical Safety Guardrails</span>
                </div>
              </div>
              <div className="w-0.5 h-8 bg-[#553E53]/30 my-1" />
              <ArrowDown className="w-4 h-4 text-[#553E53] -mt-2" />
            </div>

            {/* Step 3: Tri-branch Architecture */}
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              {/* Branch 1: Answer */}
              <div className="p-5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10 space-y-2 text-center flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#553E53]/15 mx-auto flex items-center justify-center text-[#553E53] mb-2 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#553E53]">1. Verified Answers</h4>
                  <p className="text-xs text-[#553E53]/70 mt-1 leading-relaxed">
                    Treatments, pricing catalog, doctor bios, and pre/post procedural care.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#553E53]/10 text-[10px] text-[#553E53]/80 font-semibold">
                  Zero Hallucinations
                </div>
              </div>

              {/* Branch 2: Lead Capture */}
              <div className="p-5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10 space-y-2 text-center flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#553E53]/15 mx-auto flex items-center justify-center text-[#553E53] mb-2 shadow-2xs">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#553E53]">2. Lead Capture</h4>
                  <p className="text-xs text-[#553E53]/70 mt-1 leading-relaxed">
                    Extracts patient name, WhatsApp contact, intent, and primary concern.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#553E53]/10 text-[10px] text-[#553E53]/80 font-semibold">
                  Automatic CRM Sync
                </div>
              </div>

              {/* Branch 3: Booking Pipeline */}
              <div className="p-5 rounded-2xl bg-[#F5F6F0] border-2 border-[#553E53]/25 space-y-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#553E53] text-[#F5F6F0] mx-auto flex items-center justify-center mb-2 shadow-xs">
                  <Calendar className="w-5 h-5 text-[#B6CBDE]" />
                </div>
                <h4 className="font-bold text-sm text-[#553E53]">3. Booking Pipeline</h4>
                
                <div className="space-y-2 text-left text-xs bg-white p-3 rounded-xl border border-[#553E53]/10">
                  <div className="flex items-center gap-2 text-[#553E53] font-semibold">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Real Shift Availability</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#553E53] font-semibold">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Advance Deposit Link</span>
                  </div>
                </div>
                <div className="text-[10px] text-[#553E53]/80 font-semibold pt-1">
                  Prevents Double-Booking
                </div>
              </div>
            </div>

            {/* Step 4: Human Handoff Bridge */}
            <div className="pt-4 flex flex-col items-center">
              <div className="w-full max-w-md p-3.5 rounded-2xl bg-[#B6CBDE]/25 border border-[#553E53]/20 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#553E53]" />
                  <span className="font-bold text-[#553E53]">Safety & Human Handoff</span>
                </div>
                <span className="text-[11px] text-[#553E53]/80 font-medium">
                  1-Click Receptionist Takeover
                </span>
              </div>
              <div className="w-0.5 h-6 bg-[#553E53]/30 my-1" />
              <ArrowDown className="w-4 h-4 text-[#553E53] -mt-1" />
            </div>

            {/* Step 5: Clinic Dashboard */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#553E53] text-[#F5F6F0] font-bold text-sm sm:text-base shadow-md">
                <Building2 className="w-4 h-4 text-[#B6CBDE]" />
                <span>Clinic Management Dashboard</span>
              </div>
              <p className="text-xs text-[#553E53]/70 mt-2 font-medium">
                Live appointments, patient pipeline, conversation logs, and DPDP audit trail.
              </p>
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
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#553E53]">
              Engineered for Busy Outpatient Clinics
            </h2>
            <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
              Generic chatbot tools make up answers and double-book doctors. Dermo is deeply integrated with verified clinic operations.
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
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#553E53]">How Dermo Automates Your Patient Pipeline</h2>
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
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#553E53]">Simple Pricing for Modern Clinics</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className={`bg-white border border-[#553E53]/12 p-8 rounded-3xl space-y-6 shadow-sm hover:shadow-md transition-all duration-300 ${pricingView.isInView ? 'animate-fade-in-up delay-200' : 'opacity-0 translate-y-8'}`}>
              <div>
                <h3 className="text-lg font-bold text-[#553E53]">Single Provider Clinic</h3>
                <p className="text-xs text-[#553E53]/65 mt-1 font-medium">For boutique outpatient practices.</p>
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
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Grounded Clinic Knowledge Base
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Appointment Slot Booking Engine
                </li>
              </ul>
              <button
                onClick={() => {
                  setShowDemoModal(true);
                  setDemoFormSubmitted(false);
                }}
                className="w-full py-3 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/20 text-[#553E53] font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-xs"
              >
                Book a Demo
              </button>
            </div>

            {/* Pro / Featured */}
            <div className={`bg-white border-2 border-[#553E53] p-8 rounded-3xl space-y-6 relative shadow-xl shadow-[#553E53]/10 transition-all duration-300 hover:-translate-y-1 ${pricingView.isInView ? 'animate-scale-in delay-300' : 'opacity-0 scale-90'}`}>
              <div className="absolute -top-3.5 right-8 px-3 py-1 rounded-full bg-[#553E53] text-[#F5F6F0] text-[10px] font-bold uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#553E53]">Multi-Doctor Clinic</h3>
                <p className="text-xs text-[#553E53]/65 mt-1 font-medium">For busy aesthetic, dental & specialty centers.</p>
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
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Advance Booking Deposits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> 1-Click Human Receptionist Takeover
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Dedicated Clinic Setup Support
                </li>
              </ul>
              <button
                onClick={() => {
                  setShowDemoModal(true);
                  setDemoFormSubmitted(false);
                }}
                className="w-full py-3 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-md shadow-[#553E53]/20"
              >
                Schedule Clinic Walkthrough
              </button>
            </div>

            {/* Enterprise */}
            <div className={`bg-white border border-[#553E53]/12 p-8 rounded-3xl space-y-6 shadow-sm hover:shadow-md transition-all duration-300 ${pricingView.isInView ? 'animate-fade-in-up delay-400' : 'opacity-0 translate-y-8'}`}>
              <div>
                <h3 className="text-lg font-bold text-[#553E53]">Clinic Chains & Hospitals</h3>
                <p className="text-xs text-[#553E53]/65 mt-1 font-medium">Multi-branch clinic groups with custom EMR.</p>
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
                  <CheckCircle2 className="w-4 h-4 text-[#553E53] shrink-0" /> Dedicated SLA & DPDP setup
                </li>
              </ul>
              <button
                onClick={() => {
                  setShowDemoModal(true);
                  setDemoFormSubmitted(false);
                }}
                className="w-full py-3 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/20 text-[#553E53] font-bold text-sm flex items-center justify-center transition-all duration-300 shadow-xs"
              >
                Contact Clinic Solutions
              </button>
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
            <h2 className="text-3xl font-serif font-bold text-[#553E53]">Everything You Need to Know</h2>
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
            <span className="font-medium">— The 24/7 AI Employee for Modern Clinics.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <button onClick={() => setShowDemoModal(true)} className="hover:text-[#553E53] py-1 transition-colors hover-underline">
              Book a Demo
            </button>
            <Link href="/auth/login" className="hover:text-[#553E53] py-1 transition-colors hover-underline">
              Clinic Login
            </Link>
            <a href="#workflow" className="hover:text-[#553E53] py-1 transition-colors hover-underline">
              Architecture
            </a>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════
          BOOK A DEMO MODAL
          ═══════════════════════════════════════════ */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-[#553E53]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#553E53]/20 shadow-2xl relative">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F5F6F0] text-[#553E53]/60 hover:text-[#553E53] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {demoFormSubmitted ? (
              <div className="py-6 text-center space-y-4 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#553E53]">Demo Request Received!</h3>
                <p className="text-xs text-[#553E53]/80 leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong>{demoFormData.contactName || 'Doctor'}</strong>. Our clinic deployment specialist will reach out on WhatsApp at <strong>{demoFormData.phone || 'your number'}</strong> to schedule a 15-minute walkthrough for <strong>{demoFormData.clinicName || 'your clinic'}</strong>.
                </p>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#553E53] text-[#F5F6F0] text-xs font-semibold hover:bg-[#433041] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B6CBDE]/30 text-[#553E53] text-[10px] font-bold uppercase tracking-wider mb-2">
                    Managed Clinic Onboarding
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#553E53]">Book a 15-Minute Clinic Demo</h3>
                  <p className="text-xs text-[#553E53]/70 mt-1">
                    See how Dermo automates WhatsApp inquiries, slot reservations, and deposits for your practice.
                  </p>
                </div>

                <form onSubmit={handleDemoSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[#553E53]/80 font-medium mb-1">Clinic Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nova Aesthetics & Laser Clinic"
                      value={demoFormData.clinicName}
                      onChange={(e) => setDemoFormData({ ...demoFormData, clinicName: e.target.value })}
                      className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#553E53]/80 font-medium mb-1">Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Priya Sharma"
                        value={demoFormData.contactName}
                        onChange={(e) => setDemoFormData({ ...demoFormData, contactName: e.target.value })}
                        className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#553E53]/80 font-medium mb-1">WhatsApp Phone *</label>
                      <input
                        type="text"
                        required
                        placeholder="+91 98765 43210"
                        value={demoFormData.phone}
                        onChange={(e) => setDemoFormData({ ...demoFormData, phone: e.target.value })}
                        className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] font-mono focus:outline-none focus:border-[#553E53]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#553E53]/80 font-medium mb-1">Clinic Specialty</label>
                    <select
                      value={demoFormData.specialty}
                      onChange={(e) => setDemoFormData({ ...demoFormData, specialty: e.target.value })}
                      className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                    >
                      <option value="Aesthetic & Dermatology">Aesthetic & Dermatology</option>
                      <option value="Dental Clinic">Dental Clinic</option>
                      <option value="Physiotherapy & Wellness">Physiotherapy & Wellness</option>
                      <option value="Ophthalmology / Eye Care">Ophthalmology / Eye Care</option>
                      <option value="Multi-Specialty Clinic">Multi-Specialty Clinic</option>
                      <option value="Other Outpatient Clinic">Other Outpatient Clinic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#553E53]/80 font-medium mb-1">Estimated Monthly Inquiries</label>
                    <select
                      value={demoFormData.monthlyVolume}
                      onChange={(e) => setDemoFormData({ ...demoFormData, monthlyVolume: e.target.value })}
                      className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                    >
                      <option value="Under 100 inquiries/mo">Under 100 inquiries / month</option>
                      <option value="100-300 patients/mo">100 - 300 inquiries / month</option>
                      <option value="300-1,000 patients/mo">300 - 1,000 inquiries / month</option>
                      <option value="1,000+ patients/mo (Multi-Branch)">1,000+ inquiries / month (Multi-Branch)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <span>Schedule Live Clinic Walkthrough</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B6CBDE]" />
                    </button>
                    <p className="text-[10px] text-center text-[#553E53]/60 mt-2 font-medium">
                      No spam. We verify clinic operations directly on WhatsApp.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
