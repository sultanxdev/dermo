'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import {
  IconArrowRight,
  IconLock,
  IconMail,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
  IconLoader,
  DermoLogo,
} from '@/components/ui/icons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Invalid email or password.');
      } else {
        const sessionRes = await authClient.getSession();
        const user = sessionRes?.data?.user as any;
        if (user?.accountType === 'INTERNAL_TEAM') {
          router.push('/internal');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-4 border border-[#553E53]/15 p-3 hover:scale-105 transition-transform">
          <DermoLogo className="w-full h-full" size={40} />
        </Link>
        <h1 className="text-2xl font-bold text-[#553E53] tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-[#553E53]/70 mt-1 font-medium">
          Sign in to your <span className="text-[#553E53] font-bold">Dermo</span> clinic dashboard
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-[#F5F6F0] border border-[#553E53]/15 rounded-3xl p-7 sm:p-8 shadow-sm">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-700 text-xs">
            <IconAlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-[#553E53] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative group">
              <IconMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#553E53]/50 group-focus-within:text-[#553E53] transition-colors" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@novaskinclinic.in"
                required
                autoComplete="email"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/20 text-[#553E53] placeholder:text-[#553E53]/40 text-xs focus:outline-none focus:border-[#553E53] transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-[#553E53] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group">
              <IconLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#553E53]/50 group-focus-within:text-[#553E53] transition-colors" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-11 pr-12 py-2.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/20 text-[#553E53] placeholder:text-[#553E53]/40 text-xs focus:outline-none focus:border-[#553E53] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#553E53]/50 hover:text-[#553E53] transition-colors"
              >
                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-3.5 h-3.5 rounded border-[#553E53]/30 text-[#553E53] focus:ring-0"
              />
              <span className="text-[#553E53]/80 group-hover:text-[#553E53] transition-colors font-medium">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-[#553E53] hover:underline transition-colors font-semibold">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-semibold text-xs shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <IconLoader className="w-4 h-4 text-[#B6CBDE]" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <IconArrowRight className="w-4 h-4 text-[#B6CBDE]" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer — Onboarding Link */}
      <p className="text-center text-xs text-[#553E53]/80 mt-6 font-medium">
        Looking to deploy Dermo for your practice?{' '}
        <Link href="/book-demo" className="text-[#553E53] hover:underline font-bold transition-colors">
          Book a Demo
        </Link>
      </p>
    </div>
  );
}
