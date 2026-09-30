'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  IconArrowRight,
  IconCheckCircle,
  IconChevronRight,
  IconBuilding,
  IconLock,
  IconCalendar,
} from '../components/Icons';

export default function BookDemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    clinicName: '',
    email: '',
    phone: '',
    clinicType: 'Dermatology & Aesthetics',
    providerCount: '1-3 Doctors',
    city: '',
    preferredTime: 'Morning (10:00 AM - 1:00 PM)',
    automationNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F0] text-[#553E53] selection:bg-[#B6CBDE] selection:text-[#553E53]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#553E53]/10 bg-[#F5F6F0]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#553E53] p-1 flex items-center justify-center">
              <img src="/logo.png" alt="Dermo.ai" className="w-full h-full object-contain filter brightness-110" />
            </div>
            <div className="font-bold text-lg tracking-tight text-[#553E53]">
              Dermo<span className="text-[#4B624A]">.ai</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/" className="text-[#553E53]/80 hover:text-[#553E53] transition-colors">
              Back to Home
            </Link>
            <Link
              href="/auth/login"
              className="px-3.5 py-1.5 rounded-lg border border-[#553E53]/20 hover:border-[#553E53] text-[#553E53] transition-colors"
            >
              Clinic Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="mb-8 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6CBDE]/30 border border-[#553E53]/10 text-[#4B624A] text-xs font-semibold tracking-wide">
            <IconCalendar className="w-3.5 h-3.5" />
            <span>Managed Clinic Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#553E53]">
            Book a Clinic Walkthrough
          </h1>
          <p className="text-sm sm:text-base text-[#553E53]/75 max-w-xl mx-auto font-medium">
            See how Dermo automates WhatsApp patient inquiries, real-time doctor availability, and deposit collection for your clinic.
          </p>
        </div>

        <div className="bg-[#F5F6F0] rounded-3xl border border-[#553E53]/15 shadow-sm p-6 sm:p-10 relative overflow-hidden">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#4B624A]/10 border border-[#4B624A]/30 text-[#4B624A] flex items-center justify-center mx-auto">
                <IconCheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[#553E53]">Demo Request Received</h2>
              <p className="text-sm text-[#553E53]/80 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name || 'Doctor'}</strong>. We have received your clinic details for{' '}
                <strong>{formData.clinicName || 'your clinic'}</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-[#B6CBDE]/25 border border-[#553E53]/10 text-xs text-[#553E53] max-w-md mx-auto text-left space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-[#4B624A]">
                  <IconCheckCircle className="w-4 h-4" />
                  <span>Next Step: Workflow Review</span>
                </div>
                <p className="text-[#553E53]/80 leading-normal">
                  Our clinic solutions team will review your specialty and contact you on WhatsApp / phone at{' '}
                  <strong>{formData.phone || 'your provided number'}</strong> to confirm your walkthrough time.
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] text-xs font-semibold transition-colors"
                >
                  Return to Overview
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#553E53] font-semibold mb-1.5">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Priya Sharma / Clinic Manager"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3.5 py-2.5 text-[#553E53] placeholder:text-[#553E53]/40 focus:outline-none focus:border-[#553E53] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#553E53] font-semibold mb-1.5">Clinic Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nova Skin & Aesthetic Clinic"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3.5 py-2.5 text-[#553E53] placeholder:text-[#553E53]/40 focus:outline-none focus:border-[#553E53] transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#553E53] font-semibold mb-1.5">Clinic Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="appointments@novaskin.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3.5 py-2.5 text-[#553E53] placeholder:text-[#553E53]/40 focus:outline-none focus:border-[#553E53] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#553E53] font-semibold mb-1.5">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3.5 py-2.5 text-[#553E53] placeholder:text-[#553E53]/40 font-mono focus:outline-none focus:border-[#553E53] transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#553E53] font-semibold mb-1.5">Clinic Type *</label>
                  <select
                    value={formData.clinicType}
                    onChange={(e) => setFormData({ ...formData, clinicType: e.target.value })}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2.5 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                  >
                    <option value="Dermatology & Aesthetics">Dermatology</option>
                    <option value="Dental Clinic">Dental</option>
                    <option value="Aesthetic Medicine">Aesthetic</option>
                    <option value="Physiotherapy">Physiotherapy</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Other Outpatient Clinic">Other Outpatient Clinic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#553E53] font-semibold mb-1.5">Number of Providers *</label>
                  <select
                    value={formData.providerCount}
                    onChange={(e) => setFormData({ ...formData, providerCount: e.target.value })}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2.5 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                  >
                    <option value="Solo Practitioner (1 Doctor)">1 Doctor (Single Provider)</option>
                    <option value="2-4 Doctors">2-4 Doctors</option>
                    <option value="5-10 Doctors">5-10 Doctors</option>
                    <option value="Multi-Branch (10+ Doctors)">10+ Doctors (Multi-Branch)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#553E53] font-semibold mb-1.5">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Bengaluru"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3.5 py-2.5 text-[#553E53] placeholder:text-[#553E53]/40 focus:outline-none focus:border-[#553E53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#553E53] font-semibold mb-1.5">Preferred Demo Time</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2.5 text-[#553E53] focus:outline-none focus:border-[#553E53]"
                >
                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                  <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#553E53] font-semibold mb-1.5">
                  What would you like Dermo to automate?
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. WhatsApp after-hours inquiries, consultation booking deposits, pricing questions, doctor schedule checking..."
                  value={formData.automationNotes}
                  onChange={(e) => setFormData({ ...formData, automationNotes: e.target.value })}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl p-3 text-[#553E53] placeholder:text-[#553E53]/40 focus:outline-none focus:border-[#553E53] transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
                >
                  <span>Request Clinic Walkthrough</span>
                  <IconArrowRight className="w-4 h-4 text-[#B6CBDE]" />
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-[#553E53]/70 mt-3 font-medium">
                  <IconLock className="w-3.5 h-3.5 text-[#4B624A]" />
                  <span>Sales-assisted onboarding. No spam. Patient data handled according to clinic policies.</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-[#553E53]/10 py-6 text-center text-xs text-[#553E53]/60 font-medium">
        <p>Dermo.ai — The AI Employee for Modern Clinics.</p>
      </footer>
    </div>
  );
}
