'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  IconArrowRight,
  IconArrowDown,
  IconCheck,
  IconCheckCheck,
  IconCheckCircle,
  IconChevronDown,
  IconChevronRight,
  IconCalendar,
  IconClock,
  IconCreditCard,
  IconShieldCheck,
  IconUserCheck,
  IconBuilding,
  IconMessageSquare,
  IconBot,
  IconPhone,
  IconVideo,
  IconRotateCcw,
  IconSend,
  IconX,
  IconFileText,
  IconLock,
  IconSparkle,
  IconUsers,
  IconMenu,
} from './components/Icons';
import { api } from '@/lib/api';

/* ─────────────────────────────────────────────
   IntersectionObserver hook for subtle scroll
   fade-in animations
   ───────────────────────────────────────────── */
function useInView(threshold = 0.1) {
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
  // Mobile Nav Drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Demo Booking Modal State
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoFormSubmitted, setDemoFormSubmitted] = useState(false);
  const [demoFormData, setDemoFormData] = useState({
    name: '',
    clinicName: '',
    email: '',
    phone: '',
    clinicType: 'Dermatology & Aesthetics',
    providerCount: '1-3 Doctors',
    city: '',
    preferredTime: 'Morning (10:00 AM - 1:00 PM)',
    automationNotes: '',
  });

  // Interactive WhatsApp Demo State
  // 0: Initial question & slot proposals
  // 1: Slot selected (11:00 AM) & deposit prompt
  // 2: Deposit paid & appointment confirmed
  const [demoStep, setDemoStep] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');
  const [additionalMessages, setAdditionalMessages] = useState<
    Array<{ sender: 'patient' | 'dermo'; text: string; time: string }>
  >([]);

  // FAQ open accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll views
  const workflowView = useInView();
  const problemView = useInView();
  const featuresView = useInView();
  const controlView = useInView();
  const dashboardView = useInView();
  const howItWorksView = useInView();
  const clinicTypesView = useInView();
  const pricingView = useInView();
  const faqView = useInView();

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
      // Deterministic realistic fallback response tailored to Nova Skin Clinic
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

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoFormSubmitted(true);
  };

  const faqs = [
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

  return (
    <div className="min-h-screen bg-[#F5F6F0] text-[#553E53] selection:bg-[#B6CBDE] selection:text-[#553E53]">
      {/* ═══════════════════════════════════════════
          STICKY NAVBAR (Section 8)
          ═══════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 border-b border-[#553E53]/10 bg-[#F5F6F0]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#553E53] p-1 flex items-center justify-center">
              <img src="/logo.png" alt="Dermo.ai" className="w-full h-full object-contain filter brightness-110" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#553E53]">
                Dermo<span className="text-[#4B624A]">.ai</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#553E53]/80">
            <a href="#features" className="hover:text-[#553E53] transition-colors py-1">Features</a>
            <a href="#how-it-works" className="hover:text-[#553E53] transition-colors py-1">How It Works</a>
            <a href="#demo" className="hover:text-[#553E53] transition-colors py-1">Demo</a>
            <a href="#dashboard" className="hover:text-[#553E53] transition-colors py-1">Dashboard</a>
            <a href="#pricing" className="hover:text-[#553E53] transition-colors py-1">Pricing</a>
            <a href="#faq" className="hover:text-[#553E53] transition-colors py-1">FAQ</a>
          </nav>

          {/* Right Navigation CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-xs font-semibold text-[#553E53]/80 hover:text-[#553E53] transition-colors py-1.5 px-2"
            >
              Clinic Login
            </Link>
            <button
              onClick={() => {
                setShowDemoModal(true);
                setDemoFormSubmitted(false);
              }}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-semibold text-xs transition-all shadow-sm active:scale-95"
            >
              <span>Book a Demo</span>
              <IconArrowRight className="w-3.5 h-3.5 text-[#B6CBDE] transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => {
                setShowDemoModal(true);
                setDemoFormSubmitted(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#553E53] text-[#F5F6F0] font-semibold text-xs"
            >
              Book Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#553E53] hover:bg-[#553E53]/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-[#553E53]/10 bg-[#F5F6F0] px-4 py-4 space-y-3 text-xs font-semibold">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#553E53]/80 hover:text-[#553E53]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#553E53]/80 hover:text-[#553E53]"
            >
              How It Works
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#553E53]/80 hover:text-[#553E53]"
            >
              Interactive Demo
            </a>
            <a
              href="#dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#553E53]/80 hover:text-[#553E53]"
            >
              Clinic Dashboard
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#553E53]/80 hover:text-[#553E53]"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#553E53]/80 hover:text-[#553E53]"
            >
              FAQ
            </a>
            <div className="pt-2 border-t border-[#553E53]/10 flex items-center justify-between">
              <Link
                href="/auth/login"
                className="text-xs font-semibold text-[#553E53] py-1"
              >
                Clinic Login →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════
          HERO SECTION (Section 9, 10, 11, 12)
          ═══════════════════════════════════════════ */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: SaaS Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B6CBDE]/30 border border-[#553E53]/15 text-[#553E53] text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#4B624A]" />
                <span>AI EMPLOYEE FOR CLINICS</span>
              </div>

              {/* Exact Requested Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#553E53] leading-[1.12]">
                The 24/7 AI Employee for Modern Clinics.
              </h1>

              {/* Exact Requested Supporting Copy */}
              <p className="text-base sm:text-lg text-[#553E53]/80 max-w-xl leading-relaxed font-normal">
                Dermo handles patient conversations on WhatsApp, captures leads, answers questions using your clinic&apos;s verified information, checks real provider availability, books appointments, collects payments, and hands conversations to your team when needed.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  onClick={() => {
                    setShowDemoModal(true);
                    setDemoFormSubmitted(false);
                  }}
                  className="group px-6 py-3.5 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-bold text-sm sm:text-base shadow-sm flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>Book a Demo</span>
                  <IconArrowRight className="w-4 h-4 text-[#B6CBDE] transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="#workflow"
                  className="px-6 py-3.5 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/25 text-[#553E53] font-bold text-sm sm:text-base flex items-center gap-2 transition-all"
                >
                  <span>See How It Works</span>
                  <IconChevronDown className="w-4 h-4 text-[#553E53]/80" />
                </a>
              </div>

              {/* Supporting Line */}
              <p className="text-xs sm:text-sm text-[#4B624A] font-semibold pt-1">
                Built for outpatient clinics. Managed onboarding. Human-controlled.
              </p>
            </div>

            {/* Right Column: Realistic iPhone Smartphone Frame & Interactive WhatsApp UI */}
            <div id="demo" className="lg:col-span-6 flex justify-center">
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
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CAPABILITY STRIP (Section 13)
          ═══════════════════════════════════════════ */}
      <section className="py-5 border-y border-[#553E53]/15 bg-[#B6CBDE]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-bold text-[#553E53] tracking-wide text-center">
            <span>24/7 Patient Response</span>
            <span className="text-[#4B624A] font-extrabold">•</span>
            <span>Real Availability</span>
            <span className="text-[#4B624A] font-extrabold">•</span>
            <span>Lead Capture</span>
            <span className="text-[#4B624A] font-extrabold">•</span>
            <span>Appointment Booking</span>
            <span className="text-[#4B624A] font-extrabold">•</span>
            <span>Payment Collection</span>
            <span className="text-[#4B624A] font-extrabold">•</span>
            <span>Human Handoff</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROBLEM SECTION (Section 14)
          ═══════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 border-b border-[#553E53]/12" ref={problemView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
              The Front-Desk Bottleneck
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
              Your Team Shouldn&apos;t Spend All Day Answering the Same Questions.
            </h2>
            <p className="text-sm sm:text-base text-[#553E53]/75 font-medium leading-relaxed">
              These repetitive conversations consume receptionist time and can cause missed leads. Dermo handles the repetitive work while your team stays in control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Common Repetitive Questions */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#553E53]/70 uppercase tracking-wider mb-2">
                Typical Daily Clinic WhatsApp Volume:
              </div>

              {[
                'What services do you offer?',
                'How much does it cost?',
                'Is the doctor available tomorrow?',
                'Can I book an appointment?',
                'How do I pay?',
                'Can someone call me?',
              ].map((question, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/15 hover:border-[#553E53]/35 transition-colors shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#B6CBDE]/30 text-[#553E53] flex items-center justify-center shrink-0">
                    <IconMessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#553E53]">&ldquo;{question}&rdquo;</span>
                </div>
              ))}
            </div>

            {/* Reception Backlog vs Dermo Operational Visual */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-5">
              <div className="flex items-center justify-between border-b border-[#553E53]/10 pb-3">
                <span className="font-bold text-xs text-[#553E53]">Front Desk Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#4B624A]/15 text-[#4B624A] text-[10px] font-bold">
                  Dermo Operational
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10 space-y-1">
                  <div className="font-bold text-[#553E53]">Without Dermo:</div>
                  <p className="text-[#553E53]/75 leading-relaxed">
                    Phone ringing while receptionists answer pricing on WhatsApp. Enquiries after 7:00 PM wait until 10:00 AM next day, often going to competitor clinics.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F5F6F0] border-2 border-[#4B624A]/40 space-y-1">
                  <div className="font-bold text-[#4B624A] flex items-center gap-1.5">
                    <IconCheck className="w-4 h-4 text-[#4B624A]" />
                    <span>With Dermo AI:</span>
                  </div>
                  <p className="text-[#553E53]/85 leading-relaxed font-medium">
                    Inquiries resolved in seconds 24/7. Verified pricing provided, doctor availability offered, advance deposit collected, and staff step in only when specialized human attention is needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CORE WORKFLOW SECTION (Section 15)
          ═══════════════════════════════════════════ */}
      <section id="workflow" className="py-16 lg:py-24 border-b border-[#553E53]/12" ref={workflowView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
              Integrated Product Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
              One AI Employee. Your Entire Front Desk.
            </h2>
            <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
              A closed-loop operations pipeline connecting patient WhatsApp inquiries directly into clinic doctor availability and staff management.
            </p>
          </div>

          {/* Workflow Diagram */}
          <div className="max-w-4xl mx-auto bg-[#F5F6F0] rounded-3xl p-6 sm:p-10 border border-[#553E53]/15 shadow-sm space-y-7">
            {/* Step 1: Patient WhatsApp */}
            <div className="flex flex-col items-center">
              <div className="px-6 py-3 rounded-2xl bg-[#553E53] text-[#F5F6F0] text-center shadow-sm flex items-center gap-2.5">
                <IconMessageSquare className="w-4 h-4 text-[#B6CBDE]" />
                <span className="font-bold text-sm sm:text-base">Patient WhatsApp</span>
              </div>
              <div className="w-0.5 h-6 bg-[#553E53]/30 my-1" />
              <IconArrowDown className="w-4 h-4 text-[#553E53] -mt-1" />
            </div>

            {/* Step 2: Dermo AI Engine */}
            <div className="flex flex-col items-center">
              <div className="px-8 py-3.5 rounded-2xl bg-[#B6CBDE]/30 border-2 border-[#553E53] text-[#553E53] text-center shadow-2xs flex items-center gap-3">
                <IconBot className="w-5 h-5 text-[#553E53]" />
                <div>
                  <span className="font-bold text-base block">Dermo AI</span>
                  <span className="text-[11px] text-[#553E53]/70 font-semibold">
                    Clinic Knowledge & Intent Classification
                  </span>
                </div>
              </div>
              <div className="w-0.5 h-6 bg-[#553E53]/30 my-1" />
              <IconArrowDown className="w-4 h-4 text-[#553E53] -mt-1" />
            </div>

            {/* Step 3: Tri-branch Architecture */}
            <div className="grid md:grid-cols-3 gap-5">
              {/* Branch 1: Answer */}
              <div className="p-5 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 text-center flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#553E53] text-[#F5F6F0] mx-auto flex items-center justify-center mb-2.5">
                    <IconFileText className="w-4 h-4 text-[#B6CBDE]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#553E53]">Answer</h4>
                  <p className="text-xs text-[#553E53]/75 mt-1 font-medium leading-relaxed">
                    Verified procedure pricing, pre-treatment instructions, clinic hours, and doctor bios.
                  </p>
                </div>
              </div>

              {/* Branch 2: Lead Capture */}
              <div className="p-5 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 text-center flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#553E53] text-[#F5F6F0] mx-auto flex items-center justify-center mb-2.5">
                    <IconUserCheck className="w-4 h-4 text-[#B6CBDE]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#553E53]">Lead Capture</h4>
                  <p className="text-xs text-[#553E53]/75 mt-1 font-medium leading-relaxed">
                    Captures patient contact, treatment interest, urgency, and records lead profile.
                  </p>
                </div>
              </div>

              {/* Branch 3: Booking */}
              <div className="p-5 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 text-center flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#553E53] text-[#F5F6F0] mx-auto flex items-center justify-center mb-2.5">
                    <IconCalendar className="w-4 h-4 text-[#B6CBDE]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#553E53]">Booking</h4>
                  <p className="text-xs text-[#553E53]/75 mt-1 font-medium leading-relaxed">
                    Checks real provider shift availability, reserves open slot, and issues deposit link.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4: Availability & Payment */}
            <div className="flex flex-col items-center pt-2">
              <div className="w-full max-w-md p-3 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/20 flex items-center justify-around text-xs font-bold text-[#553E53]">
                <div className="flex items-center gap-1.5">
                  <IconClock className="w-3.5 h-3.5 text-[#4B624A]" />
                  <span>Real Availability Engine</span>
                </div>
                <span className="text-[#553E53]/30">|</span>
                <div className="flex items-center gap-1.5">
                  <IconCreditCard className="w-3.5 h-3.5 text-[#4B624A]" />
                  <span>Deposit Collection</span>
                </div>
              </div>
              <div className="w-0.5 h-6 bg-[#553E53]/30 my-1" />
              <IconArrowDown className="w-4 h-4 text-[#553E53] -mt-1" />
            </div>

            {/* Step 5: Human Handoff Bridge */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md p-3.5 rounded-2xl bg-[#4B624A]/10 border border-[#4B624A]/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <IconShieldCheck className="w-4 h-4 text-[#4B624A]" />
                  <span className="font-bold text-[#553E53]">Human Handoff</span>
                </div>
                <span className="text-[11px] text-[#4B624A] font-bold">
                  1-Click Receptionist Takeover
                </span>
              </div>
              <div className="w-0.5 h-6 bg-[#553E53]/30 my-1" />
              <IconArrowDown className="w-4 h-4 text-[#553E53] -mt-1" />
            </div>

            {/* Step 6: Clinic Dashboard */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-[#553E53] text-[#F5F6F0] font-bold text-sm shadow-sm">
                <IconBuilding className="w-4 h-4 text-[#B6CBDE]" />
                <span>Clinic Dashboard</span>
              </div>
              <p className="text-xs text-[#553E53]/70 mt-2 font-medium">
                Live appointments, patient pipeline, conversation logs, and staff takeover switch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE SECTION (Section 16)
          ═══════════════════════════════════════════ */}
      <section id="features" className="py-20 border-b border-[#553E53]/12" ref={featuresView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
              Everything Your Clinic Needs to Automate the Front Desk.
            </h2>
            <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
              Built specifically around the operational realities of appointment-based outpatient practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F5F6F0] border border-[#553E53]/15 p-6 rounded-3xl space-y-4 hover:border-[#553E53]/40 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#553E53] text-[#F5F6F0] flex items-center justify-center">
                <IconMessageSquare className="w-5 h-5 text-[#B6CBDE]" />
              </div>
              <h3 className="text-lg font-bold text-[#553E53]">WhatsApp AI Receptionist</h3>
              <p className="text-[#553E53]/75 text-xs sm:text-sm leading-relaxed font-medium">
                Handle patient inquiries 24/7 through the clinic&apos;s verified WhatsApp number without letting leads go cold after hours.
              </p>
              <div className="p-3 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/10 text-[11px] text-[#553E53] font-medium">
                <span className="text-[#4B624A] font-bold">UI Status:</span> WhatsApp Business API connected • Instant 24/7 routing
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F5F6F0] border border-[#553E53]/15 p-6 rounded-3xl space-y-4 hover:border-[#553E53]/40 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#553E53] text-[#F5F6F0] flex items-center justify-center">
                <IconFileText className="w-5 h-5 text-[#B6CBDE]" />
              </div>
              <h3 className="text-lg font-bold text-[#553E53]">Clinic Knowledge</h3>
              <p className="text-[#553E53]/75 text-xs sm:text-sm leading-relaxed font-medium">
                Answer using clinic services, pricing, FAQs, policies, providers, and approved information with verified accuracy.
              </p>
              <div className="p-3 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/10 text-[11px] text-[#553E53] font-medium">
                <span className="text-[#4B624A] font-bold">UI Status:</span> Grounded Vector Knowledge • Procedure & fee catalog
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F5F6F0] border border-[#553E53]/15 p-6 rounded-3xl space-y-4 hover:border-[#553E53]/40 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#553E53] text-[#F5F6F0] flex items-center justify-center">
                <IconUserCheck className="w-5 h-5 text-[#B6CBDE]" />
              </div>
              <h3 className="text-lg font-bold text-[#553E53]">Lead Capture</h3>
              <p className="text-[#553E53]/75 text-xs sm:text-sm leading-relaxed font-medium">
                Capture and organize patient inquiries, extracting name, contact number, treatment intent, and priority status automatically.
              </p>
              <div className="p-3 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/10 text-[11px] text-[#553E53] font-medium">
                <span className="text-[#4B624A] font-bold">UI Status:</span> CRM sync active • Automatic patient intent profiling
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F5F6F0] border border-[#553E53]/15 p-6 rounded-3xl space-y-4 hover:border-[#553E53]/40 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#553E53] text-[#F5F6F0] flex items-center justify-center">
                <IconCalendar className="w-5 h-5 text-[#B6CBDE]" />
              </div>
              <h3 className="text-lg font-bold text-[#553E53]">Appointment Booking</h3>
              <p className="text-[#553E53]/75 text-xs sm:text-sm leading-relaxed font-medium">
                Check real provider availability and manage booking based on doctor shifts, treatment duration, and schedule buffers.
              </p>
              <div className="p-3 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/10 text-[11px] text-[#553E53] font-medium">
                <span className="text-[#4B624A] font-bold">UI Status:</span> Real shift engine • Prevents double-booking
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#F5F6F0] border border-[#553E53]/15 p-6 rounded-3xl space-y-4 hover:border-[#553E53]/40 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#553E53] text-[#F5F6F0] flex items-center justify-center">
                <IconCreditCard className="w-5 h-5 text-[#B6CBDE]" />
              </div>
              <h3 className="text-lg font-bold text-[#553E53]">Payment Collection</h3>
              <p className="text-[#553E53]/75 text-xs sm:text-sm leading-relaxed font-medium">
                Collect consultation or booking deposits right inside WhatsApp, securing clinic appointments and curbing no-shows.
              </p>
              <div className="p-3 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/10 text-[11px] text-[#553E53] font-medium">
                <span className="text-[#4B624A] font-bold">UI Status:</span> Razorpay / UPI integrated • Auto-locks reservation
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#F5F6F0] border border-[#553E53]/15 p-6 rounded-3xl space-y-4 hover:border-[#553E53]/40 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-[#553E53] text-[#F5F6F0] flex items-center justify-center">
                <IconShieldCheck className="w-5 h-5 text-[#B6CBDE]" />
              </div>
              <h3 className="text-lg font-bold text-[#553E53]">Human Handoff</h3>
              <p className="text-[#553E53]/75 text-xs sm:text-sm leading-relaxed font-medium">
                Allow staff to immediately take over conversations at any time. AI automation pauses instantly with complete thread history.
              </p>
              <div className="p-3 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/10 text-[11px] text-[#553E53] font-medium">
                <span className="text-[#4B624A] font-bold">UI Status:</span> 1-click takeover console • Real-time notification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CONTROL / TRUST SECTION (Section 17)
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-b border-[#553E53]/12" ref={controlView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
              Staff-Controlled Automation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
              AI Handles the Work. Your Team Stays in Control.
            </h2>
            <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
              We know clinic trust is paramount. Dermo is engineered so clinic staff can step in whenever they choose.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-[#B6CBDE]/20 rounded-3xl p-6 sm:p-10 border border-[#553E53]/15 space-y-8">
            {/* Visual State Bar */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/15">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4B624A] mx-auto mb-2" />
                <div className="font-bold text-xs sm:text-sm text-[#553E53]">AI Active</div>
                <div className="text-[10px] text-[#553E53]/70 mt-1">Autonomous response to patient questions</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#553E53] text-[#F5F6F0] shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-[#B6CBDE] mx-auto mb-2" />
                <div className="font-bold text-xs sm:text-sm text-[#F5F6F0]">Human Takeover</div>
                <div className="text-[10px] text-[#B6CBDE] mt-1">Staff clicks button to take over thread</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/15">
                <div className="w-2.5 h-2.5 rounded-full bg-[#553E53]/40 mx-auto mb-2" />
                <div className="font-bold text-xs sm:text-sm text-[#553E53]">AI Paused</div>
                <div className="text-[10px] text-[#553E53]/70 mt-1">Staff chats directly with patient</div>
              </div>
            </div>

            {/* Core Operational Guarantees */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs font-medium text-[#553E53]">
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10">
                <IconCheckCircle className="w-4 h-4 text-[#4B624A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#553E53] font-bold">1-Click Staff Takeover</strong>
                  Receptionists can take over any active WhatsApp thread instantly from the dashboard.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10">
                <IconCheckCircle className="w-4 h-4 text-[#4B624A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#553E53] font-bold">Approved Clinic Knowledge</strong>
                  Responses adhere strictly to your uploaded procedure descriptions and verified pricing.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10">
                <IconCheckCircle className="w-4 h-4 text-[#4B624A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#553E53] font-bold">Real Provider Availability</strong>
                  Appointments are only offered when doctors actually have an open slot in the schedule.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/10">
                <IconCheckCircle className="w-4 h-4 text-[#4B624A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#553E53] font-bold">Medical Safety Escalation</strong>
                  Requests for diagnoses or medical opinions trigger immediate clinical escalation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DASHBOARD PREVIEW (Section 18)
          ═══════════════════════════════════════════ */}
      <section id="dashboard" className="py-20 border-b border-[#553E53]/12" ref={dashboardView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
              Operations Control
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
              Your Clinic. One Operational Dashboard.
            </h2>
            <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
              A clean, functional SaaS portal built for clinic owners and reception staff to monitor patient conversations, confirmed bookings, and revenue in real time.
            </p>
          </div>

          {/* Realistic SaaS Dashboard Mockup */}
          <div className="max-w-5xl mx-auto rounded-3xl bg-[#F5F6F0] border-2 border-[#553E53]/20 shadow-md overflow-hidden text-xs">
            {/* Window bar */}
            <div className="bg-[#553E53] px-4 py-3 flex items-center justify-between text-[#F5F6F0] border-b border-[#553E53]/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B6CBDE]/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#B6CBDE]/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#B6CBDE]/40" />
                <span className="text-[11px] font-bold text-[#F5F6F0] ml-2">
                  Dermo Clinic Management — Nova Skin Clinic
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#B6CBDE]">
                <span className="w-2 h-2 rounded-full bg-[#4B624A]" />
                <span>WhatsApp Live</span>
              </div>
            </div>

            <div className="grid md:grid-cols-12 min-h-[460px]">
              {/* Sidebar Navigation */}
              <div className="md:col-span-3 bg-[#F5F6F0] border-r border-[#553E53]/15 p-3 space-y-1 font-semibold text-[#553E53]/80">
                <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-[#553E53]/50 font-bold">
                  Navigation
                </div>
                {[
                  { name: 'Overview', active: true },
                  { name: 'Conversations', badge: '3' },
                  { name: 'Patients' },
                  { name: 'Leads', badge: '12' },
                  { name: 'Appointments', badge: '5 Today' },
                  { name: 'Providers' },
                  { name: 'Services' },
                  { name: 'Knowledge' },
                  { name: 'Payments' },
                  { name: 'WhatsApp' },
                  { name: 'AI Employee' },
                  { name: 'Settings' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs ${
                      item.active
                        ? 'bg-[#553E53] text-[#F5F6F0] font-bold'
                        : 'hover:bg-[#B6CBDE]/25 text-[#553E53]'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                          item.active
                            ? 'bg-[#4B624A] text-[#F5F6F0]'
                            : 'bg-[#B6CBDE]/50 text-[#553E53]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Main Dashboard Panel */}
              <div className="md:col-span-9 p-5 sm:p-6 space-y-5 bg-[#F5F6F0]">
                {/* Metric Summary Cards */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#553E53]/70">Today&apos;s Inquiries</span>
                    <div className="text-2xl font-extrabold text-[#553E53]">28 Active</div>
                    <span className="text-[10px] text-[#4B624A] font-semibold">24 handled by Dermo AI</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#553E53]/70">Appointments Booked</span>
                    <div className="text-2xl font-extrabold text-[#553E53]">14 Confirmed</div>
                    <span className="text-[10px] text-[#4B624A] font-semibold">Tomorrow schedule locked</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#553E53]/70">Deposits Collected</span>
                    <div className="text-2xl font-extrabold text-[#553E53]">₹7,000</div>
                    <span className="text-[10px] text-[#4B624A] font-semibold">14 deposits @ ₹500 verified</span>
                  </div>
                </div>

                {/* Live Conversation Stream Table */}
                <div className="rounded-2xl border border-[#553E53]/15 bg-[#F5F6F0] p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#553E53]/10 pb-2">
                    <span className="font-bold text-xs text-[#553E53]">Recent Patient Conversations</span>
                    <span className="text-[10px] text-[#553E53]/60 font-semibold">Real-Time Sync</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/10">
                      <div>
                        <div className="font-bold text-xs text-[#553E53]">Ananya V. (+91 98201 ••••)</div>
                        <div className="text-[11px] text-[#553E53]/70">HydraFacial with Dr. Priya Sharma · Tomorrow 11:00 AM</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#4B624A]/20 text-[#4B624A] text-[10px] font-bold">
                          Deposit Paid
                        </span>
                        <button className="px-2.5 py-1 rounded-lg bg-[#553E53] text-[#F5F6F0] text-[10px] font-semibold">
                          View
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10">
                      <div>
                        <div className="font-bold text-xs text-[#553E53]">Rahul M. (+91 98112 ••••)</div>
                        <div className="text-[11px] text-[#553E53]/70">Inquired about Acne Scar Laser pricing & post-care</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#B6CBDE]/40 text-[#553E53] text-[10px] font-bold">
                          AI Handled
                        </span>
                        <button className="px-2.5 py-1 rounded-lg bg-[#553E53] text-[#F5F6F0] text-[10px] font-semibold">
                          Take Over
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10">
                      <div>
                        <div className="font-bold text-xs text-[#553E53]">Kavita S. (+91 99341 ••••)</div>
                        <div className="text-[11px] text-[#553E53]/70">Requested consultation with senior dermatologist</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#553E53]/15 text-[#553E53] text-[10px] font-bold">
                          Human Takeover
                        </span>
                        <button className="px-2.5 py-1 rounded-lg bg-[#4B624A] text-[#F5F6F0] text-[10px] font-semibold">
                          Staff Chatting
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS & MANAGED ONBOARDING (Section 19 & 20)
          ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 border-b border-[#553E53]/12" ref={howItWorksView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
              Managed Clinic Onboarding
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
              We Set Up Dermo With Your Clinic.
            </h2>
            <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
              No complicated self-service setups or confusing bot builders. We configure and test Dermo around your clinic&apos;s real schedule and procedures.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="p-6 rounded-3xl bg-[#F5F6F0] border border-[#553E53]/15 space-y-3 shadow-2xs">
              <span className="text-2xl font-extrabold text-[#4B624A] block">01</span>
              <h4 className="text-base font-bold text-[#553E53]">Book a Demo</h4>
              <p className="text-xs text-[#553E53]/75 font-medium leading-relaxed">
                Tell us about your clinic, specialty, doctor schedule, and current WhatsApp volume.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F5F6F0] border border-[#553E53]/15 space-y-3 shadow-2xs">
              <span className="text-2xl font-extrabold text-[#4B624A] block">02</span>
              <h4 className="text-base font-bold text-[#553E53]">We Configure Workspace</h4>
              <p className="text-xs text-[#553E53]/75 font-medium leading-relaxed">
                We load your verified clinic info, treatments, pricing, doctor shifts, WhatsApp number, and payments.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F5F6F0] border border-[#553E53]/15 space-y-3 shadow-2xs">
              <span className="text-2xl font-extrabold text-[#4B624A] block">03</span>
              <h4 className="text-base font-bold text-[#553E53]">Test Your AI Employee</h4>
              <p className="text-xs text-[#553E53]/75 font-medium leading-relaxed">
                We simulate and test real patient scenarios with your team before connecting your live WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F5F6F0] border border-[#553E53]/15 space-y-3 shadow-2xs">
              <span className="text-2xl font-extrabold text-[#4B624A] block">04</span>
              <h4 className="text-base font-bold text-[#553E53]">Go Live</h4>
              <p className="text-xs text-[#553E53]/75 font-medium leading-relaxed">
                Your clinic begins handling patient inquiries 24/7 with full human oversight from the dashboard.
              </p>
            </div>
          </div>

          {/* Managed Onboarding Visual Strip */}
          <div className="mt-12 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#B6CBDE]/20 border border-[#553E53]/15 text-center space-y-4">
            <h3 className="text-2xl font-bold text-[#553E53]">No Complicated Setup.</h3>
            <p className="text-xs sm:text-sm text-[#553E53]/80 max-w-xl mx-auto font-medium leading-relaxed">
              We help configure Dermo around your clinic&apos;s actual workflow before you go live.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-bold text-[#553E53]">
              <span className="px-3 py-1.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/15">Clinic</span>
              <IconChevronRight className="w-3.5 h-3.5 text-[#553E53]/60" />
              <span className="px-3 py-1.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/15">Demo</span>
              <IconChevronRight className="w-3.5 h-3.5 text-[#553E53]/60" />
              <span className="px-3 py-1.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/15">Configuration</span>
              <IconChevronRight className="w-3.5 h-3.5 text-[#553E53]/60" />
              <span className="px-3 py-1.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/15">Testing</span>
              <IconChevronRight className="w-3.5 h-3.5 text-[#553E53]/60" />
              <span className="px-3 py-1.5 rounded-xl bg-[#553E53] text-[#F5F6F0]">Go Live</span>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setShowDemoModal(true);
                  setDemoFormSubmitted(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] text-xs font-bold transition-all shadow-xs"
              >
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CLINIC TYPES (Section 21)
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-b border-[#553E53]/12" ref={clinicTypesView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
              Specialized Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
              Built for the Way Modern Clinics Operate.
            </h2>
            <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
              Configured around the appointment and consultation workflows of specialized outpatient practices.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Dermatology', desc: 'Skin concerns, procedural consultations, acne treatments.' },
              { title: 'Dental', desc: 'Cleanings, root canals, orthodontics, emergency dental inquiries.' },
              { title: 'Aesthetic', desc: 'HydraFacials, laser treatments, chemical peels, advance deposits.' },
              { title: 'Physiotherapy', desc: 'Session packaging, slot availability, rehab appointments.' },
              { title: 'Orthopedic', desc: 'Specialist consultations, joint clinic schedules, X-ray booking.' },
              { title: 'Other Outpatient Clinics', desc: 'Any appointment-based practice requiring front-desk automation.' },
            ].map((clinic, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F5F6F0] border border-[#553E53]/15 hover:border-[#553E53]/35 transition-colors space-y-1.5 shadow-2xs"
              >
                <div className="font-bold text-sm text-[#553E53]">{clinic.title}</div>
                <p className="text-xs text-[#553E53]/70 font-medium leading-relaxed">{clinic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING (Section 22)
          ═══════════════════════════════════════════ */}
      <section id="pricing" className="py-20 border-b border-[#553E53]/12" ref={pricingView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
              Predictable Investment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
              Simple Pricing for Growing Clinics.
            </h2>
            <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
              Transparent monthly pricing with managed onboarding. No hidden implementation fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Plan 1: Single Doctor Clinic */}
            <div className="p-8 rounded-3xl bg-[#F5F6F0] border border-[#553E53]/20 flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#553E53]">Single Doctor Clinic</h3>
                  <p className="text-xs text-[#553E53]/70 font-medium mt-1">
                    For solo practitioners and boutique outpatient practices.
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#553E53]">₹4,999</span>
                  <span className="text-xs text-[#553E53]/60 font-semibold">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#553E53]/85 font-medium border-t border-[#553E53]/10 pt-4">
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>1 WhatsApp Clinic Number</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>1 Doctor Shift Schedule</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>Grounded Clinic Knowledge Base</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>Appointment Slot Booking</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setShowDemoModal(true);
                  setDemoFormSubmitted(false);
                }}
                className="w-full py-3 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/25 text-[#553E53] font-bold text-xs transition-colors shadow-2xs"
              >
                Book a Demo
              </button>
            </div>

            {/* Plan 2: Multi-Doctor Clinic (Visually Emphasized) */}
            <div className="p-8 rounded-3xl bg-[#F5F6F0] border-2 border-[#553E53] flex flex-col justify-between space-y-6 shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#553E53] text-[#F5F6F0] text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </div>

              <div className="space-y-4 pt-1">
                <div>
                  <h3 className="text-lg font-bold text-[#553E53]">Multi-Doctor Clinic</h3>
                  <p className="text-xs text-[#553E53]/70 font-medium mt-1">
                    For busy specialty clinics with multiple providers and rooms.
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#553E53]">₹9,999</span>
                  <span className="text-xs text-[#553E53]/60 font-semibold">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#553E53]/85 font-medium border-t border-[#553E53]/10 pt-4">
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>Up to 5 Doctor Shift Schedules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>Advance Booking Deposits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>1-Click Human Receptionist Takeover</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>Dedicated Clinic Setup & Knowledge Tuning</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setShowDemoModal(true);
                  setDemoFormSubmitted(false);
                }}
                className="w-full py-3.5 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-bold text-xs transition-colors shadow-sm"
              >
                Book a Demo
              </button>
            </div>

            {/* Plan 3: Growing Clinic / Multi-Branch */}
            <div className="p-8 rounded-3xl bg-[#F5F6F0] border border-[#553E53]/20 flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#553E53]">Growing Clinic / Multi-Branch</h3>
                  <p className="text-xs text-[#553E53]/70 font-medium mt-1">
                    For clinic chains with multi-branch routing or custom EMR sync.
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#553E53]">Custom</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#553E53]/85 font-medium border-t border-[#553E53]/10 pt-4">
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>Multi-Branch WhatsApp Routing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>Custom EMR & PMS API Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                    <span>Dedicated Account Manager & SLA</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setShowDemoModal(true);
                  setDemoFormSubmitted(false);
                }}
                className="w-full py-3 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/25 text-[#553E53] font-bold text-xs transition-colors shadow-2xs"
              >
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ (Section 23)
          ═══════════════════════════════════════════ */}
      <section id="faq" className="py-20 border-b border-[#553E53]/12" ref={faqView.ref}>
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
            {faqs.map((faq, i) => {
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

      {/* ═══════════════════════════════════════════
          FINAL CTA (Section 24)
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-b border-[#553E53]/12 bg-[#B6CBDE]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
            Give Your Clinic a 24/7 AI Employee.
          </h2>
          <p className="text-sm sm:text-base text-[#553E53]/80 max-w-xl mx-auto font-medium leading-relaxed">
            Let Dermo handle repetitive patient conversations while your team focuses on running the clinic.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => {
                setShowDemoModal(true);
                setDemoFormSubmitted(false);
              }}
              className="group px-7 py-3.5 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-bold text-sm sm:text-base shadow-sm flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Book a Demo</span>
              <IconArrowRight className="w-4 h-4 text-[#B6CBDE] transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#workflow"
              className="px-6 py-3.5 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/25 text-[#553E53] font-bold text-sm sm:text-base flex items-center gap-2 transition-all"
            >
              <span>See How It Works</span>
              <IconChevronDown className="w-4 h-4 text-[#553E53]/80" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER (Section 27)
          ═══════════════════════════════════════════ */}
      <footer className="py-12 bg-[#F5F6F0] text-[#553E53]/70 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#553E53]/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-md overflow-hidden bg-[#553E53] p-1 flex items-center justify-center">
                  <img src="/logo.png" alt="Dermo" className="w-full h-full object-contain filter brightness-110" />
                </div>
                <span className="font-bold text-base text-[#553E53]">Dermo.ai</span>
              </div>
              <p className="text-xs text-[#553E53]/70 font-medium">
                The AI Employee for Modern Clinics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-semibold text-[#553E53]/80">
              <a href="#features" className="hover:text-[#553E53] transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-[#553E53] transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-[#553E53] transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-[#553E53] transition-colors">FAQ</a>
              <Link href="/book-demo" className="text-[#4B624A] hover:text-[#553E53] transition-colors">
                Book a Demo
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#553E53]/60 font-medium">
            <div className="flex items-center gap-4">
              <span>Existing Clinics:</span>
              <Link href="/auth/login" className="font-bold text-[#553E53] hover:underline">
                Clinic Login
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="hover:text-[#553E53] cursor-pointer">Privacy</span>
              <span>•</span>
              <span className="hover:text-[#553E53] cursor-pointer">Terms</span>
              <span>•</span>
              <span className="hover:text-[#553E53] cursor-pointer">Refund Policy</span>
              <span>•</span>
              <span className="hover:text-[#553E53] cursor-pointer">Medical Safety</span>
              <span>•</span>
              <span className="hover:text-[#553E53] cursor-pointer">Contact</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════
          BOOK DEMO MODAL (Section 25)
          ═══════════════════════════════════════════ */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-[#553E53]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F5F6F0] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#553E53]/20 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#B6CBDE]/30 text-[#553E53]/70 hover:text-[#553E53] transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>

            {demoFormSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#4B624A]/10 border border-[#4B624A]/30 text-[#4B624A] flex items-center justify-center mx-auto">
                  <IconCheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#553E53]">Demo request received.</h3>
                <p className="text-xs text-[#553E53]/80 leading-relaxed max-w-sm mx-auto font-medium">
                  We&apos;ll review your clinic details and contact you to schedule the demo.
                </p>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#553E53] text-[#F5F6F0] text-xs font-semibold hover:bg-[#4B624A] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B6CBDE]/30 text-[#4B624A] text-[10px] font-bold uppercase tracking-wider mb-2">
                    Managed Clinic Onboarding
                  </div>
                  <h3 className="text-xl font-extrabold text-[#553E53]">Book a Clinic Demo</h3>
                  <p className="text-xs text-[#553E53]/70 mt-1 font-medium">
                    Discuss your clinic workflow and see Dermo handle real WhatsApp patient inquiries.
                  </p>
                </div>

                <form onSubmit={handleDemoSubmit} className="space-y-3 text-xs">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#553E53] font-semibold mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Priya Sharma"
                        value={demoFormData.name}
                        onChange={(e) => setDemoFormData({ ...demoFormData, name: e.target.value })}
                        className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#553E53] font-semibold mb-1">Clinic Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nova Skin Clinic"
                        value={demoFormData.clinicName}
                        onChange={(e) => setDemoFormData({ ...demoFormData, clinicName: e.target.value })}
                        className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#553E53] font-semibold mb-1">Clinic Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="contact@novaskin.com"
                        value={demoFormData.email}
                        onChange={(e) => setDemoFormData({ ...demoFormData, email: e.target.value })}
                        className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#553E53] font-semibold mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={demoFormData.phone}
                        onChange={(e) => setDemoFormData({ ...demoFormData, phone: e.target.value })}
                        className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] font-mono focus:outline-none focus:border-[#553E53]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#553E53] font-semibold mb-1">Clinic Type</label>
                      <select
                        value={demoFormData.clinicType}
                        onChange={(e) => setDemoFormData({ ...demoFormData, clinicType: e.target.value })}
                        className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-2.5 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                      >
                        <option value="Dermatology & Aesthetics">Dermatology</option>
                        <option value="Dental Clinic">Dental</option>
                        <option value="Aesthetic Medicine">Aesthetic</option>
                        <option value="Physiotherapy">Physiotherapy</option>
                        <option value="Orthopedic">Orthopedic</option>
                        <option value="Other Outpatient">Other Outpatient</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#553E53] font-semibold mb-1">Providers</label>
                      <select
                        value={demoFormData.providerCount}
                        onChange={(e) => setDemoFormData({ ...demoFormData, providerCount: e.target.value })}
                        className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-2.5 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                      >
                        <option value="1 Doctor">1 Doctor</option>
                        <option value="2-4 Doctors">2-4 Doctors</option>
                        <option value="5+ Doctors">5+ Doctors</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#553E53] font-semibold mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mumbai"
                        value={demoFormData.city}
                        onChange={(e) => setDemoFormData({ ...demoFormData, city: e.target.value })}
                        className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#553E53] font-semibold mb-1">Preferred Demo Time</label>
                    <select
                      value={demoFormData.preferredTime}
                      onChange={(e) => setDemoFormData({ ...demoFormData, preferredTime: e.target.value })}
                      className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                    >
                      <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                      <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                      <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#553E53] font-semibold mb-1">
                      What would you like Dermo to automate?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Inquiries after hours, checking doctor availability, deposits..."
                      value={demoFormData.automationNotes}
                      onChange={(e) => setDemoFormData({ ...demoFormData, automationNotes: e.target.value })}
                      className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl p-2.5 text-[#553E53] placeholder:text-[#553E53]/40 focus:outline-none focus:border-[#553E53]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <span>Submit Demo Request</span>
                      <IconArrowRight className="w-3.5 h-3.5 text-[#B6CBDE]" />
                    </button>
                    <p className="text-[10px] text-center text-[#553E53]/60 mt-2 font-medium">
                      We&apos;ll review your clinic details and contact you to schedule the demo.
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
