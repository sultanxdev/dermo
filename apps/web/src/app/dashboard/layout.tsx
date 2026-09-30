'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
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
  ChevronRight,
  ExternalLink,
  LogOut,
  Loader2,
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

function getUserInitials(name: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userName = user?.name || user?.email || 'User';
  const userEmail = user?.email || '';
  const initials = getUserInitials(userName);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = '/auth/login';
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#F5F6F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#553E53] animate-spin" />
          <span className="text-sm text-[#553E53]/70 font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F0] flex text-[#553E53] selection:bg-[#B6CBDE] selection:text-[#553E53]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#553E53]/15 bg-white/95 backdrop-blur-xl flex flex-col fixed inset-y-0 z-40 shadow-sm">
        {/* Clinic Brand */}
        <div className="p-4 border-b border-[#553E53]/10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#553E53] p-1.5 flex items-center justify-center shadow-md shadow-[#553E53]/15 group-hover:scale-105 transition-transform ring-2 ring-[#B6CBDE]/40">
              <img src="/logo.png" alt="Dermo Logo" className="w-full h-full object-contain filter brightness-110" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[#553E53] block">
                Dermo<span className="text-[#8E6F8B]">.ai</span>
              </span>
              <span className="text-[10px] text-[#553E53]/70 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#553E53] animate-pulse" />
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#553E53] text-[#F5F6F0] shadow-sm'
                    : 'text-[#553E53]/75 hover:text-[#553E53] hover:bg-[#B6CBDE]/25'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B6CBDE]' : 'text-[#553E53]/60'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${
                    isActive
                      ? 'bg-[#B6CBDE] text-[#553E53] border-transparent'
                      : 'bg-[#B6CBDE]/30 text-[#553E53] border-[#B6CBDE]/60'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Clinic Status & Profile */}
        <div className="p-3 border-t border-[#553E53]/10 bg-[#F5F6F0]/60">
          <div className="p-2.5 rounded-xl bg-white border border-[#553E53]/10 mb-2 shadow-xs">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#553E53]/70 font-medium">WhatsApp Webhook</span>
              <span className="text-[#553E53] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Healthy
              </span>
            </div>
            <div className="text-[10px] text-[#553E53]/55 truncate">Indiranagar, Bengaluru</div>
          </div>

          <div className="flex items-center justify-between px-1">
            <Link
              href="/"
              className="text-[11px] text-[#553E53]/70 hover:text-[#553E53] flex items-center gap-1 transition-colors font-medium"
            >
              <span>Landing Page</span>
              <ExternalLink className="w-3 h-3 text-[#553E53]/60" />
            </Link>
            <span className="text-[10px] text-[#553E53]/50 font-mono">v1.0 (Phase 1)</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col bg-[#F5F6F0]">
        {/* Top Header */}
        <header className="h-16 border-b border-[#553E53]/10 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-[#553E53]/70 font-medium">
            <span>Clinic Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#553E53]/40" />
            <span className="text-[#553E53] font-bold capitalize">
              {pathname.split('/')[2] || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F6F0] border border-[#553E53]/15 text-xs text-[#553E53] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#553E53] animate-pulse" />
              <span>Gemini 2.0 Flash + RAG Vector Store</span>
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-[#553E53]/15">
              <div className="w-8 h-8 rounded-full bg-[#553E53] flex items-center justify-center text-[#F5F6F0] font-bold text-xs shadow-sm ring-2 ring-[#B6CBDE]/50">
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-[#553E53]">{userName}</div>
                <div className="text-[10px] text-[#553E53]/60">
                  {userEmail || 'Active Session'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-1.5 rounded-lg text-[#553E53]/60 hover:text-red-600 hover:bg-red-50 transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
