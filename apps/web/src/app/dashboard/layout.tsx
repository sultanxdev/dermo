'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Calendar,
  Sparkles,
  Stethoscope,
  BookOpen,
  CreditCard,
  PhoneCall,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Activity,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/conversations', label: 'Conversations & Sim', icon: MessageSquare, badge: 'Live' },
  { href: '/dashboard/leads', label: 'Leads Kanban', icon: Users },
  { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/services', label: 'Services & Pricing', icon: Sparkles },
  { href: '/dashboard/doctors', label: 'Doctors & Shifts', icon: Stethoscope },
  { href: '/dashboard/knowledge', label: 'Knowledge & FAQs', icon: BookOpen },
  { href: '/dashboard/payments', label: 'Razorpay Payments', icon: CreditCard },
  { href: '/dashboard/whatsapp', label: 'WhatsApp Gateway', icon: PhoneCall },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Clinic & Audit', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-neutral-100 selection:bg-orange-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800/80 bg-[#0D0D0D]/90 backdrop-blur-xl flex flex-col fixed inset-y-0 z-40">
        {/* Clinic Brand */}
        <div className="p-4 border-b border-neutral-800/80">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-lg shadow-orange-500/10 group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Dermo Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                DermaCare<span className="text-orange-400">.ai</span>
              </span>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                <span>AI Assistant Active</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-[9px] font-bold border border-orange-500/40 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Clinic Status & Profile */}
        <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/40">
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 mb-2">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-neutral-400">WhatsApp Webhook</span>
              <span className="text-orange-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Healthy
              </span>
            </div>
            <div className="text-[10px] text-neutral-500 truncate">Indiranagar, Bengaluru</div>
          </div>

          <div className="flex items-center justify-between px-1">
            <Link
              href="/"
              className="text-[11px] text-neutral-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
            >
              <span>Landing Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="text-[10px] text-neutral-500 font-mono">v1.0 (Phase 1)</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col bg-[#0A0A0A]">
        {/* Top Header */}
        <header className="h-16 border-b border-neutral-800/80 px-8 flex items-center justify-between bg-[#0A0A0A]/75 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Clinic Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-neutral-200 font-semibold capitalize">
              {pathname.split('/')[2] || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span>Gemini 2.0 Flash + RAG Vector Store</span>
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-neutral-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-black font-bold text-xs">
                PS
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white">Dr. Priya Sharma</div>
                <div className="text-[10px] text-orange-400">Clinic Owner / Chief Dermatologist</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
