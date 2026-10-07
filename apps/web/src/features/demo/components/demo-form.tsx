'use client';

import React, { useState } from 'react';
import { DemoFormData } from '../types';
import { submitDemoRequest } from '../actions';
import {
  IconArrowRight,
  IconCheckCircle,
  IconLock,
  IconAlertCircle,
} from '@/components/ui/icons';

interface DemoFormProps {
  onSuccess?: () => void;
  className?: string;
  isModal?: boolean;
}

export function DemoForm({ onSuccess, className = '', isModal = false }: DemoFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<DemoFormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await submitDemoRequest(formData);
    setLoading(false);
    if (res.success) {
      setSubmitted(true);
      onSuccess?.();
    } else {
      setError(res.message || 'Failed to submit demo request. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#4B624A]/10 border border-[#4B624A]/30 text-[#4B624A] flex items-center justify-center mx-auto">
          <IconCheckCircle className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-[#553E53]">Demo request received.</h3>
        <p className="text-xs sm:text-sm text-[#553E53]/80 leading-relaxed max-w-sm mx-auto font-medium">
          Thank you, <strong>{formData.name || 'Doctor'}</strong>. We&apos;ll review your clinic details for{' '}
          <strong>{formData.clinicName || 'your clinic'}</strong> and contact you to schedule the demo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3.5 text-xs ${className}`}>
      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-700 text-xs">
          <IconAlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[#553E53] font-semibold mb-1">Your Name *</label>
          <input
            type="text"
            required
            placeholder="Dr. Priya Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
          />
        </div>
        <div>
          <label className="block text-[#553E53] font-semibold mb-1">Clinic Name *</label>
          <input
            type="text"
            required
            placeholder="Nova Skin Clinic"
            value={formData.clinicName}
            onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
            className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[#553E53] font-semibold mb-1">Clinic Email *</label>
          <input
            type="email"
            required
            placeholder="priya@novaskin.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
          />
        </div>
        <div>
          <label className="block text-[#553E53] font-semibold mb-1">Phone / WhatsApp *</label>
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] font-mono focus:outline-none focus:border-[#553E53]"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[#553E53] font-semibold mb-1">Clinic Type</label>
          <select
            value={formData.clinicType}
            onChange={(e) => setFormData({ ...formData, clinicType: e.target.value })}
            className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-2.5 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
          >
            <option value="Dermatology & Aesthetics">Dermatology</option>
            <option value="Dental Clinic">Dental</option>
            <option value="Aesthetic Medicine">Aesthetic</option>
            <option value="Physiotherapy">Physiotherapy</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="Other Outpatient">Other Outpatient</option>
          </select>
        </div>

        <div>
          <label className="block text-[#553E53] font-semibold mb-1">Providers</label>
          <select
            value={formData.providerCount}
            onChange={(e) => setFormData({ ...formData, providerCount: e.target.value })}
            className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-2.5 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
          >
            <option value="1 Doctor">1 Doctor</option>
            <option value="2-4 Doctors">2-4 Doctors</option>
            <option value="5+ Doctors">5+ Doctors</option>
          </select>
        </div>

        <div>
          <label className="block text-[#553E53] font-semibold mb-1">City *</label>
          <input
            type="text"
            required
            placeholder="e.g. Bengaluru"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#553E53] font-semibold mb-1">Preferred Demo Time</label>
        <select
          value={formData.preferredTime}
          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
          className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl px-3 py-2 text-[#553E53] focus:outline-none focus:border-[#553E53]"
        >
          <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
          <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
          <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
        </select>
      </div>

      <div>
        <label className="block text-[#553E53] font-semibold mb-1">
          What would you like Dermo to automate?
        </label>
        <textarea
          rows={isModal ? 2 : 3}
          placeholder="e.g. Inquiries after hours, checking doctor availability, deposits..."
          value={formData.automationNotes}
          onChange={(e) => setFormData({ ...formData, automationNotes: e.target.value })}
          className="w-full bg-[#F5F6F0] border border-[#553E53]/20 rounded-xl p-2.5 text-[#553E53] placeholder:text-[#553E53]/40 focus:outline-none focus:border-[#553E53]"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-60"
        >
          <span>{loading ? 'Submitting...' : 'Submit Demo Request'}</span>
          <IconArrowRight className="w-3.5 h-3.5 text-[#B6CBDE]" />
        </button>
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#553E53]/60 mt-2 font-medium">
          <IconLock className="w-3 h-3 text-[#4B624A]" />
          <span>We&apos;ll review your clinic details and contact you to schedule the demo.</span>
        </div>
      </div>
    </form>
  );
}
