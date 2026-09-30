'use client';

import React from 'react';
import Link from 'next/link';
import { IconArrowRight, DermoLogo } from '@/components/ui/icons';

export default function VerifyEmailPage() {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-4 border border-[#553E53]/15 p-3 hover:scale-105 transition-transform">
          <DermoLogo className="w-full h-full" size={40} />
        </Link>
        <h1 className="text-2xl font-bold text-[#553E53] tracking-tight">
          Verify your email
        </h1>
        <p className="text-xs text-[#553E53]/70 mt-1 font-medium">
          Check your inbox for the clinic verification link
        </p>
      </div>

      <div className="bg-[#F5F6F0] border border-[#553E53]/15 rounded-3xl p-7 sm:p-8 shadow-sm text-center space-y-4">
        <p className="text-xs text-[#553E53]/80 leading-relaxed font-medium">
          We&apos;ve sent a verification link to your registered clinic email. Please click the link to activate your access.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] text-xs font-semibold transition-colors"
        >
          <span>Return to Clinic Login</span>
          <IconArrowRight className="w-3.5 h-3.5 text-[#B6CBDE]" />
        </Link>
      </div>
    </div>
  );
}
