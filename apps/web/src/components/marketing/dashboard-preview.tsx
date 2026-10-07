'use client';

import React, { useState } from 'react';
import { useInView } from '@/hooks/use-in-view';

/* ── Inline icons ── */
const IconGrid = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const IconMessages = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconUsers = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCalendar = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconCreditCard = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const IconBrain = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" /><path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" /><path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
);
const IconSettings = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconWhatsApp = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);
const IconTrendUp = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
  </svg>
);
const IconCheck = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ── Static data ── */
const NAV_ITEMS = [
  { label: 'Overview', icon: IconGrid, badge: null, active: true },
  { label: 'Conversations', icon: IconMessages, badge: '3', active: false },
  { label: 'Patients', icon: IconUsers, badge: null, active: false },
  { label: 'Appointments', icon: IconCalendar, badge: '5', active: false },
  { label: 'Payments', icon: IconCreditCard, badge: null, active: false },
  { label: 'AI Employee', icon: IconBrain, badge: null, active: false },
  { label: 'WhatsApp', icon: IconWhatsApp, badge: null, active: false },
  { label: 'Settings', icon: IconSettings, badge: null, active: false },
];

/* Sparkline bar heights (relative, 4 bars each) */
const KPI_CARDS = [
  {
    label: "Today's inquiries",
    value: '28',
    sub: '24 handled by AI',
    trend: '+12% vs yesterday',
    trendUp: true,
    bars: [40, 55, 48, 70, 62, 80, 100],
    barColor: 'bg-[#B6CBDE]',
    accent: 'border-l-[#B6CBDE]',
  },
  {
    label: 'Appointments booked',
    value: '14',
    sub: 'Tomorrow locked in',
    trend: '+3 since morning',
    trendUp: true,
    bars: [30, 50, 45, 60, 55, 75, 90],
    barColor: 'bg-[#4B624A]/50',
    accent: 'border-l-[#4B624A]',
  },
  {
    label: 'Deposits collected',
    value: '₹7,000',
    sub: '14 × ₹500 confirmed',
    trend: '100% verified',
    trendUp: true,
    bars: [20, 35, 30, 50, 45, 65, 80],
    barColor: 'bg-[#553E53]/30',
    accent: 'border-l-[#553E53]',
  },
  {
    label: 'AI resolution rate',
    value: '86%',
    sub: '4 escalated to staff',
    trend: '+4% this week',
    trendUp: true,
    bars: [60, 65, 70, 72, 78, 82, 86],
    barColor: 'bg-[#4B624A]/40',
    accent: 'border-l-[#4B624A]',
  },
];

const CONVERSATIONS = [
  {
    initials: 'AV',
    name: 'Ananya V.',
    phone: '+91 98201 ••••',
    preview: 'HydraFacial · Dr. Priya Sharma · Tomorrow 11:00 AM',
    time: '11:42 AM',
    status: 'Deposit paid',
    statusColor: 'bg-[#4B624A]/12 text-[#4B624A] border-[#4B624A]/20',
    action: 'View',
    actionColor: 'bg-[#553E53] text-[#F5F6F0]',
    avatarBg: 'bg-[#4B624A]/15 text-[#4B624A]',
    dot: 'bg-[#4B624A]',
    unread: false,
  },
  {
    initials: 'RM',
    name: 'Rahul M.',
    phone: '+91 98112 ••••',
    preview: 'Acne Scar Laser pricing, post-care protocol',
    time: '10:18 AM',
    status: 'AI handled',
    statusColor: 'bg-[#B6CBDE]/40 text-[#553E53] border-[#B6CBDE]/50',
    action: 'Take over',
    actionColor: 'bg-[#553E53]/10 text-[#553E53] border border-[#553E53]/20',
    avatarBg: 'bg-[#B6CBDE]/40 text-[#553E53]',
    dot: 'bg-[#B6CBDE]',
    unread: true,
  },
  {
    initials: 'KS',
    name: 'Kavita S.',
    phone: '+91 99341 ••••',
    preview: 'Wants senior dermatologist consultation',
    time: '9:55 AM',
    status: 'Staff chatting',
    statusColor: 'bg-[#553E53]/10 text-[#553E53] border-[#553E53]/20',
    action: 'Join',
    actionColor: 'bg-[#4B624A] text-[#F5F6F0]',
    avatarBg: 'bg-[#553E53]/10 text-[#553E53]',
    dot: 'bg-[#553E53]',
    unread: false,
  },
];

const APPOINTMENTS_TODAY = [
  { time: '10:00', patient: 'Meera P.', treatment: 'Chemical Peel', doctor: 'Dr. Sharma', done: true },
  { time: '11:00', patient: 'Ananya V.', treatment: 'HydraFacial', doctor: 'Dr. Sharma', done: false },
  { time: '12:30', patient: 'Suresh K.', treatment: 'Laser Consult', doctor: 'Dr. Nair', done: false },
  { time: '3:00', patient: 'Priya R.', treatment: 'Botox Review', doctor: 'Dr. Sharma', done: false },
];

export function DashboardPreview() {
  const { ref, isInView } = useInView();
  const [activeNav, setActiveNav] = useState('Overview');

  return (
    <section
      id="dashboard"
      ref={ref}
      aria-labelledby="dashboard-title"
      className="relative py-24 sm:py-32 border-b border-[#553E53]/10 bg-[#F5F6F0] overflow-hidden"
    >
      {/* Background texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(182,203,222,0.15) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(85,62,83,0.06) 0%, transparent 40%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="max-w-2xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4B624A]/25 bg-[#4B624A]/8 text-[#4B624A] text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4B624A] animate-pulse" />
            Operations control
          </div>
          <h2
            id="dashboard-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]"
          >
            <span className="text-[#553E53]">Your clinic.</span>
            <span className="text-[#4B624A]"> One dashboard.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#553E53]/65 leading-relaxed max-w-xl">
            Monitor every patient conversation, booked appointment, and collected deposit — live, from one place. Your staff always stays in control.
          </p>
        </div>

        {/* ── Dashboard Browser Frame ── */}
        <div
          className={`rounded-2xl overflow-hidden border border-[#553E53]/15 shadow-2xl shadow-[#553E53]/8 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Browser chrome bar */}
          <div className="bg-[#2E2028] px-4 py-2.5 flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            {/* URL bar */}
            <div className="flex-1 max-w-sm mx-auto">
              <div className="bg-[#3D2E3A] rounded-md px-3 py-1 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-[#B6CBDE]/30 shrink-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4B624A]" />
                </div>
                <span className="text-[10px] text-[#B6CBDE]/60 font-mono truncate">app.dermo.ai/dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-pulse" />
              <span className="text-[10px] text-[#B6CBDE]/50 font-medium">WhatsApp live</span>
            </div>
          </div>

          {/* Dashboard shell */}
          <div className="flex text-[11px] bg-[#F8F7F4]" style={{ minHeight: 560 }}>

            {/* ── Sidebar ── */}
            <aside className="w-[180px] shrink-0 bg-[#2E2028] flex flex-col">
              {/* Logo */}
              <div className="px-4 py-4 border-b border-white/8 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#553E53] border border-[#B6CBDE]/20 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                    <path d="M 40 0 H 80 V 40 H 120 V 80 A 40 40 0 0 0 80 120 H 40 V 80 H 0 V 40 A 40 40 0 0 0 40 0 Z" fill="#B6CBDE" />
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#F5F6F0] leading-none">Dermo</div>
                  <div className="text-[9px] text-[#B6CBDE]/50 mt-0.5">Nova Skin Clinic</div>
                </div>
              </div>

              {/* Nav items */}
              <nav className="flex-1 px-2 py-3 space-y-0.5">
                <div className="px-2 py-1.5 text-[9px] uppercase tracking-widest text-white/25 font-bold">Main</div>
                {NAV_ITEMS.slice(0, 6).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveNav(item.label)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 group ${
                        isActive
                          ? 'bg-[#553E53] text-[#F5F6F0]'
                          : 'text-white/45 hover:text-white/80 hover:bg-white/6'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] font-semibold leading-none">{item.label}</span>
                      {item.badge && (
                        <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                          isActive ? 'bg-[#4B624A] text-white' : 'bg-white/12 text-white/60'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
                <div className="px-2 py-1.5 mt-2 text-[9px] uppercase tracking-widest text-white/25 font-bold">System</div>
                {NAV_ITEMS.slice(6).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveNav(item.label)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 ${
                        isActive
                          ? 'bg-[#553E53] text-[#F5F6F0]'
                          : 'text-white/45 hover:text-white/80 hover:bg-white/6'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] font-semibold leading-none">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* User footer */}
              <div className="px-3 py-3 border-t border-white/8 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#553E53] border border-[#B6CBDE]/20 flex items-center justify-center text-[9px] font-bold text-[#F5F6F0] shrink-0">NS</div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-white/70 truncate">Nova Skin</div>
                  <div className="text-[9px] text-white/30 truncate">Admin</div>
                </div>
              </div>
            </aside>

            {/* ── Main content ── */}
            <main className="flex-1 flex flex-col overflow-hidden">

              {/* Top bar */}
              <div className="px-5 py-3 border-b border-[#553E53]/8 bg-white/60 flex items-center justify-between shrink-0">
                <div>
                  <h1 className="text-[13px] font-bold text-[#553E53]">Overview</h1>
                  <p className="text-[10px] text-[#553E53]/45">Saturday, 4 Oct 2025 · 11:42 AM</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#4B624A]/8 border border-[#4B624A]/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4B624A] animate-pulse" />
                    <span className="text-[10px] font-semibold text-[#4B624A]">AI Online · 24/7</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#553E53]/8 border border-[#553E53]/12 flex items-center justify-center text-[9px] font-bold text-[#553E53]">NS</div>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* KPI cards row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {KPI_CARDS.map((card) => (
                    <div
                      key={card.label}
                      className={`bg-white rounded-xl border border-[#553E53]/8 p-3.5 border-l-[3px] ${card.accent} space-y-2`}
                    >
                      <div className="text-[9px] font-bold text-[#553E53]/50 uppercase tracking-wide leading-none">{card.label}</div>
                      <div className="text-lg font-extrabold text-[#553E53] leading-none">{card.value}</div>
                      <div className="text-[9px] text-[#553E53]/50">{card.sub}</div>
                      {/* Sparkline */}
                      <div className="flex items-end gap-0.5 h-5">
                        {card.bars.map((h, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-sm ${card.barColor} transition-all duration-500`}
                            style={{
                              height: isInView ? `${h}%` : '0%',
                              transitionDelay: `${300 + i * 60}ms`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <IconTrendUp className="w-2.5 h-2.5 text-[#4B624A]" />
                        <span className="text-[9px] text-[#4B624A] font-semibold">{card.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Two-column: conversations + schedule */}
                <div className="grid lg:grid-cols-5 gap-3">

                  {/* Conversations table (3/5) */}
                  <div className="lg:col-span-3 bg-white rounded-xl border border-[#553E53]/8 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#553E53]/8 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#553E53]">Live Conversations</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#553E53]/10 text-[#553E53] font-bold">3 active</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4B624A] animate-pulse" />
                        <span className="text-[9px] text-[#4B624A] font-semibold">Real-time</span>
                      </div>
                    </div>
                    <div className="divide-y divide-[#553E53]/6">
                      {CONVERSATIONS.map((c, i) => (
                        <div
                          key={i}
                          className={`px-4 py-3 flex items-start gap-3 transition-colors hover:bg-[#F5F6F0]/60 ${
                            c.unread ? 'bg-[#B6CBDE]/8' : ''
                          }`}
                        >
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${c.avatarBg}`}>
                            {c.initials}
                          </div>
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[11px] font-bold text-[#553E53]">{c.name}</span>
                              <span className="text-[9px] text-[#553E53]/40">{c.phone}</span>
                              {c.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#553E53] ml-auto shrink-0" />}
                            </div>
                            <div className="text-[10px] text-[#553E53]/55 truncate">{c.preview}</div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${c.statusColor}`}>{c.status}</span>
                              <span className="text-[9px] text-[#553E53]/35">{c.time}</span>
                            </div>
                          </div>
                          {/* Action */}
                          <button className={`shrink-0 text-[9px] font-bold px-2.5 py-1.5 rounded-lg ${c.actionColor}`}>
                            {c.action}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Today's schedule (2/5) */}
                  <div className="lg:col-span-2 bg-white rounded-xl border border-[#553E53]/8 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#553E53]/8 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#553E53]">Today&apos;s Schedule</span>
                      <span className="text-[9px] text-[#553E53]/40 font-medium">4 appts</span>
                    </div>
                    <div className="divide-y divide-[#553E53]/6">
                      {APPOINTMENTS_TODAY.map((appt, i) => (
                        <div key={i} className={`px-4 py-2.5 flex items-center gap-3 ${appt.done ? 'opacity-50' : ''}`}>
                          <div className="text-[10px] font-bold text-[#553E53]/50 w-9 shrink-0 tabular-nums">{appt.time}</div>
                          <div className={`w-1 self-stretch rounded-full shrink-0 ${appt.done ? 'bg-[#553E53]/20' : 'bg-[#4B624A]/50'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-[#553E53] truncate">{appt.patient}</div>
                            <div className="text-[9px] text-[#553E53]/45 truncate">{appt.treatment} · {appt.doctor}</div>
                          </div>
                          {appt.done
                            ? <IconCheck className="w-3.5 h-3.5 text-[#4B624A] shrink-0" />
                            : <div className="w-3.5 h-3.5 rounded-full border-2 border-[#553E53]/20 shrink-0" />
                          }
                        </div>
                      ))}
                    </div>

                    {/* WhatsApp activity ticker */}
                    <div className="px-4 py-3 border-t border-[#553E53]/8 space-y-1.5">
                      <div className="text-[9px] font-bold text-[#553E53]/40 uppercase tracking-wide">WhatsApp Activity</div>
                      {[
                        { msg: 'Pricing sent to Neha J.', ago: '2m ago' },
                        { msg: 'Slot booked for Rohit P.', ago: '9m ago' },
                        { msg: '₹500 deposit confirmed', ago: '14m ago' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#4B624A] shrink-0" />
                          <span className="text-[10px] text-[#553E53]/65 flex-1 truncate">{item.msg}</span>
                          <span className="text-[9px] text-[#553E53]/35 shrink-0">{item.ago}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* ── Feature callouts below the dashboard ── */}
        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {[
            { title: 'Live conversation feed', desc: 'Every patient message streams in real-time. Take over from AI in one click.' },
            { title: 'Revenue at a glance', desc: 'Track deposits, confirmed appointments, and daily earnings without spreadsheets.' },
            { title: 'Full audit trail', desc: 'Every AI response, handoff, and booking is logged with timestamps for your records.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#553E53]/8">
              <div className="w-5 h-5 rounded-full bg-[#4B624A]/10 flex items-center justify-center shrink-0 mt-0.5">
                <IconCheck className="w-3 h-3 text-[#4B624A]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#553E53] mb-0.5">{item.title}</div>
                <div className="text-xs text-[#553E53]/55 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
