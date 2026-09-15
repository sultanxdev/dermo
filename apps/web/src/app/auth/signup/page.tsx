'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, UserPlus, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const ROLES = [
  { value: 'STAFF', label: 'Staff' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'OWNER', label: 'Owner' },
] as const;

interface PasswordStrength {
  score: number; // 0-5
  label: string;
  color: string;
  checks: { label: string; passed: boolean }[];
}

function evaluatePassword(password: string): PasswordStrength {
  const checks = [
    { label: '8+ characters', passed: password.length >= 8 },
    { label: 'Uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', passed: /[a-z]/.test(password) },
    { label: 'Number', passed: /[0-9]/.test(password) },
    { label: 'Special character', passed: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.passed).length;
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const colors = [
    'bg-red-500',
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-emerald-400',
  ];

  return { score, label: labels[score], color: colors[score], checks };
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('STAFF');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = useMemo(() => evaluatePassword(password), [password]);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (passwordStrength.score < 5) {
      setError('Password does not meet all requirements.');
      return;
    }

    setIsLoading(true);

    try {
      // Register via Express API
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword, role }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok || !registerData.success) {
        setError(registerData?.error?.message || 'Registration failed.');
        setIsLoading(false);
        return;
      }

      // Auto-login via NextAuth after successful registration
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Account created but auto-login failed. Please sign in manually.');
        router.push('/auth/login');
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
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-neutral-400 mt-1.5">
          Join the <span className="text-orange-400 font-medium">DermaCare</span> clinic team
        </p>
      </div>

      {/* Signup Card */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-8 shadow-2xl shadow-black/40">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="signup-name" className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Priya Sharma"
                required
                minLength={2}
                autoComplete="name"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@clinic.com"
                required
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label htmlFor="signup-role" className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
              Role
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                    role === r.value
                      ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                      : 'bg-neutral-800/40 border-neutral-700/50 text-neutral-400 hover:text-neutral-300 hover:border-neutral-600'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
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

            {/* Password Strength Bar */}
            {password.length > 0 && (
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i < passwordStrength.score ? passwordStrength.color : 'bg-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400 font-medium min-w-[60px] text-right">
                    {passwordStrength.label}
                  </span>
                </div>

                {/* Individual checks */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {passwordStrength.checks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1.5">
                      {check.passed ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-neutral-600" />
                      )}
                      <span
                        className={`text-[11px] ${check.passed ? 'text-emerald-300/80' : 'text-neutral-500'}`}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="signup-confirm-password" className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className={`w-full pl-11 pr-12 py-3 rounded-xl bg-neutral-800/60 border text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 transition-all hover:border-neutral-600 ${
                  passwordsMatch
                    ? 'border-emerald-500/50 focus:ring-emerald-500/50'
                    : passwordsMismatch
                      ? 'border-red-500/50 focus:ring-red-500/50'
                      : 'border-neutral-700/60 focus:ring-orange-500/50 focus:border-orange-500/60'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordsMismatch && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Passwords do not match
              </p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Passwords match
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || passwordsMismatch || passwordStrength.score < 5}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer — Login Link */}
      <p className="text-center text-sm text-neutral-500 mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
