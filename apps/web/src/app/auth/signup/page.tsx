'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export default function RequestDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    clinicName: '',
    email: '',
    phone: '',
    city: '',
    clinicType: 'Aesthetic Dermatology',
    doctorCount: 1,
    requirements: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'doctorCount' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.createDemoRequest({
        name: formData.name.trim(),
        clinicName: formData.clinicName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim() || undefined,
        clinicType: formData.clinicType,
        doctorCount: formData.doctorCount,
        requirements: formData.requirements.trim() || undefined,
      });

      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit demo request. Please check your inputs or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 mb-5">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Request Clinic Access & Demo
        </h1>
        <p className="text-sm text-neutral-400 mt-1.5 max-w-sm mx-auto">
          Dermo is an invite-only AI operating system for aesthetic & dermatology clinics.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 rounded-2xl p-8 shadow-2xl shadow-black/40">
        {/* Notice Banner */}
        <div className="flex items-start gap-3 p-3.5 mb-6 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200/90 text-xs leading-relaxed">
          <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <span>
            Clinic workspaces are provisioned by our medical onboarding team following a personalized workflow consultation.
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Consultation Request Received</h3>
              <p className="text-sm text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Thank you, Dr. <span className="text-white font-medium">{formData.name}</span>! Our team will contact you via WhatsApp / email within 24 hours to schedule your live walkthrough and activate your clinic workspace.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
              <Link
                href="/auth/login"
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Already have credentials? Sign in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Doctor / Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Doctor / Clinic Owner Name
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dr. Priya Sharma"
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
                />
              </div>
            </div>

            {/* Clinic Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Clinic / Practice Name
              </label>
              <div className="relative group">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  placeholder="DermaCare Aesthetics Clinic"
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
                />
              </div>
            </div>

            {/* Work Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Work Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@clinic.in"
                    required
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Phone / WhatsApp
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
                  />
                </div>
              </div>
            </div>

            {/* City & Doctors Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  City
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Bengaluru"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Number of Doctors
                </label>
                <div className="relative group">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-400 transition-colors" />
                  <select
                    name="doctorCount"
                    value={formData.doctorCount}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
                  >
                    <option value={1} className="bg-neutral-900">1 Doctor (Solo Practice)</option>
                    <option value={2} className="bg-neutral-900">2 - 3 Doctors</option>
                    <option value={5} className="bg-neutral-900">4 - 8 Doctors (Group Clinic)</option>
                    <option value={10} className="bg-neutral-900">10+ Doctors (Multi-branch Chain)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Clinic Specialization
              </label>
              <select
                name="clinicType"
                value={formData.clinicType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/60 transition-all hover:border-neutral-600"
              >
                <option value="Aesthetic Dermatology" className="bg-neutral-900">Aesthetic Dermatology & Cosmetology</option>
                <option value="Medical Dermatology" className="bg-neutral-900">Medical Dermatology</option>
                <option value="Trichology & Hair Restoration" className="bg-neutral-900">Trichology & Hair Restoration</option>
                <option value="Plastic & Cosmetic Surgery" className="bg-neutral-900">Plastic & Cosmetic Surgery</option>
                <option value="Integrated Skin & Laser Center" className="bg-neutral-900">Integrated Skin & Laser Center</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <span>Request Personalized Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-neutral-500 mt-6">
        Already provisioned with a clinic account?{' '}
        <Link href="/auth/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
}
