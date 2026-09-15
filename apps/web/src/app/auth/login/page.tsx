'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

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
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 'Invalid email or password.' : result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 mb-5">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-neutral-400 mt-1.5">
          Sign in to your <span className="text-orange-400 font-medium">DermaCare</span> dashboard
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-8 shadow-2xl shadow-black/40">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dermacare.in"
                required
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-11 pr-12 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 transition-all ${
                  rememberMe
                    ? 'bg-orange-500 border-orange-500'
                    : 'border-neutral-600 group-hover:border-neutral-400'
                }`}>
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors">Remember me</span>
            </label>
            <button type="button" className="text-xs text-orange-400/80 hover:text-orange-300 transition-colors font-medium">
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-orange-500/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-neutral-900/60 px-3 text-[11px] text-neutral-500 uppercase tracking-wider">
              Demo Credentials
            </span>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div className="p-3.5 rounded-xl bg-neutral-800/40 border border-neutral-700/40">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">Quick Access</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-neutral-500 block">Email</span>
              <button
                type="button"
                onClick={() => setEmail('admin@dermacare.in')}
                className="text-neutral-200 font-mono hover:text-orange-300 transition-colors cursor-pointer"
              >
                admin@dermacare.in
              </button>
            </div>
            <div>
              <span className="text-neutral-500 block">Password</span>
              <button
                type="button"
                onClick={() => setPassword('Admin@123')}
                className="text-neutral-200 font-mono hover:text-orange-300 transition-colors cursor-pointer"
              >
                Admin@123
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — Sign Up Link */}
      <p className="text-center text-sm text-neutral-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
