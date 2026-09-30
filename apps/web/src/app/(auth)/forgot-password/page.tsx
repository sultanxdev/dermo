'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IconShieldCheck, IconMail, IconArrowRight } from '@/components/ui/icons';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#553E53] text-[#F5F6F0] shadow-sm mb-4 border border-[#B6CBDE]/30">
          <IconShieldCheck className="w-8 h-8 text-[#B6CBDE]" />
        </div>
        <h1 className="text-2xl font-bold text-[#553E53] tracking-tight">
          Reset password
        </h1>
        <p className="text-xs text-[#553E53]/70 mt-1 font-medium">
          Enter your clinic email to receive a password reset link
        </p>
      </div>

      <div className="bg-[#F5F6F0] border border-[#553E53]/15 rounded-3xl p-7 sm:p-8 shadow-sm">
        {submitted ? (
          <div className="text-center space-y-3 py-4">
            <p className="text-xs text-[#553E53]/80 leading-relaxed font-medium">
              If an account exists for <strong>{email}</strong>, a password reset link has been sent.
            </p>
            <Link
              href="/auth/login"
              className="inline-block text-xs font-bold text-[#553E53] hover:underline pt-2"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="reset-email" className="block text-xs font-semibold text-[#553E53] mb-1.5 uppercase tracking-wider">
                Clinic Email
              </label>
              <div className="relative group">
                <IconMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#553E53]/50 group-focus-within:text-[#553E53] transition-colors" />
                <input
                  id="reset-email"
                  type="email"
                  required
                  placeholder="doctor@novaskinclinic.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/20 text-[#553E53] placeholder:text-[#553E53]/40 text-xs focus:outline-none focus:border-[#553E53] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-semibold text-xs shadow-sm transition-all active:scale-[0.98]"
            >
              <span>Send Reset Link</span>
              <IconArrowRight className="w-4 h-4 text-[#B6CBDE]" />
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-xs text-[#553E53]/80 mt-6 font-medium">
        Remembered your credentials?{' '}
        <Link href="/auth/login" className="text-[#553E53] hover:underline font-bold transition-colors">
          Clinic Login
        </Link>
      </p>
    </div>
  );
}
