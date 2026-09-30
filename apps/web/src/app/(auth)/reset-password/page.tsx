'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IconLock, IconArrowRight, DermoLogo } from '@/components/ui/icons';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [completed, setCompleted] = useState(false);

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-4 border border-[#553E53]/15 p-3 hover:scale-105 transition-transform">
          <DermoLogo className="w-full h-full" size={40} />
        </Link>
        <h1 className="text-2xl font-bold text-[#553E53] tracking-tight">
          Create new password
        </h1>
        <p className="text-xs text-[#553E53]/70 mt-1 font-medium">
          Choose a strong password for your clinic account
        </p>
      </div>

      <div className="bg-[#F5F6F0] border border-[#553E53]/15 rounded-3xl p-7 sm:p-8 shadow-sm">
        {completed ? (
          <div className="text-center space-y-3 py-4">
            <p className="text-xs text-[#553E53]/80 leading-relaxed font-medium">
              Your password has been updated successfully.
            </p>
            <Link
              href="/auth/login"
              className="inline-block text-xs font-bold text-[#553E53] hover:underline pt-2"
            >
              Sign In to Dashboard
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCompleted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="new-pass" className="block text-xs font-semibold text-[#553E53] mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative group">
                <IconLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#553E53]/50 group-focus-within:text-[#553E53] transition-colors" />
                <input
                  id="new-pass"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/20 text-[#553E53] placeholder:text-[#553E53]/40 text-xs focus:outline-none focus:border-[#553E53] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-semibold text-xs shadow-sm transition-all active:scale-[0.98]"
            >
              <span>Update Password</span>
              <IconArrowRight className="w-4 h-4 text-[#B6CBDE]" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
