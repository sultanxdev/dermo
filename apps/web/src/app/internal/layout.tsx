'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { ShieldAlert, LogOut, Loader2, Sparkles, Server, ArrowLeft } from 'lucide-react';

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/login');
      } else {
        const user = session.user as any;
        if (user?.accountType !== 'INTERNAL_TEAM') {
          // If a clinic owner tries to open /internal, send them to their clinic dashboard
          router.push('/dashboard');
        }
      }
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = '/login';
  };

  if (isPending || !session || (session.user as any)?.accountType !== 'INTERNAL_TEAM') {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Verifying Dermo Staff Clearance</h3>
            <p className="text-xs text-neutral-500 mt-1">Connecting to internal administration gateway...</p>
          </div>
        </div>
      </div>
    );
  }

  const user = session.user as any;

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Internal Console Header */}
      <header className="h-16 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/internal" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold tracking-tight text-white">
                Dermo<span className="text-orange-400">.internal</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold uppercase tracking-wider">
                Internal Ops
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick link to sample clinic view */}
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-orange-400" />
            <span>Clinic Demo View</span>
          </Link>

          <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white">{user.name || 'Admin'}</div>
              <div className="text-[10px] text-neutral-400">{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              title="Sign out of Internal Ops"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10">
        {children}
      </main>
    </div>
  );
}
