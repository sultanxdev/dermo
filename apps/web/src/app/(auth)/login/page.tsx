'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import {
  IconArrowRight,
  IconLock,
  IconShieldCheck,
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
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
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
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setError('');
    setSocialLoading(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (err: any) {
      setError(err?.message || `Failed to sign in with ${provider}.`);
      setSocialLoading(null);
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
          <div className="flex items-center gap-2.5 p-3 mb-5 rounded-xl bg-[#553E53]/10 border border-[#553E53]/25 text-[#553E53] text-xs">
            <IconAlertCircle className="w-4 h-4 flex-shrink-0 text-[#553E53]" />
            <span>{error}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => handleSocialSignIn('google')}
            disabled={!!socialLoading || isLoading}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/15 text-xs font-semibold text-[#553E53] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {socialLoading === 'google' ? (
              <IconLoader className="w-4 h-4 text-[#553E53]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn('github')}
            disabled={!!socialLoading || isLoading}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/15 text-xs font-semibold text-[#553E53] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {socialLoading === 'github' ? (
              <IconLoader className="w-4 h-4 text-[#553E53]" />
            ) : (
              <svg className="w-4 h-4 fill-current text-[#553E53]" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            )}
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#553E53]/15" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#F5F6F0] px-3 text-[10px] text-[#553E53]/60 uppercase tracking-wider font-semibold">
              Or continue with email
            </span>
          </div>
        </div>

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
            <button type="button" className="text-[#553E53] hover:underline transition-colors font-semibold">
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !!socialLoading}
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
