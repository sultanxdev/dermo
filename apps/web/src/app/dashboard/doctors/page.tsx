'use client';

import React, { useEffect, useState } from 'react';
import {
  Stethoscope,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Doctor } from '@dermo/types';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      const data = await api.getDoctors();
      setDoctors(data);
      if (data.length > 0) setSelectedDoc(data[0]);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#553E53] flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-[#553E53]" />
          <span>Doctor Profiles & Shift Schedules</span>
        </h1>
        <p className="text-xs text-[#553E53]/70 mt-1">
          Manage clinical specialists, consultation fees, and weekly slot availability rules.
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className={`rounded-2xl p-6 border transition-all cursor-pointer space-y-4 shadow-sm ${
              selectedDoc?.id === doc.id
                ? 'border-[#553E53] ring-2 ring-[#B6CBDE] bg-white'
                : 'border-[#553E53]/10 bg-white hover:border-[#553E53]/25'
            }`}
          >
            <div className="flex items-start gap-4">
              <img
                src={doc.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                alt={doc.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#553E53]/15 shadow-sm"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#553E53]">{doc.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#B6CBDE]/30 text-[#553E53] text-[10px] font-bold border border-[#553E53]/20">
                    {doc.status}
                  </span>
                </div>
                <div className="text-xs text-[#553E53] font-medium">{doc.title}</div>
                <div className="text-[11px] text-[#553E53]/60">{doc.qualification}</div>
              </div>
            </div>

            <p className="text-xs text-[#553E53]/80 leading-relaxed bg-[#F5F6F0] p-3 rounded-xl border border-[#553E53]/10">
              {doc.bio}
            </p>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#553E53]/60 font-bold block">
                Specialties
              </span>
              <div className="flex flex-wrap gap-1.5">
                {doc.specialty.map((spec, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-[#B6CBDE]/25 text-[#553E53] text-[10px] font-medium border border-[#553E53]/10"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#553E53]/10 flex items-center justify-between text-xs">
              <div className="text-[#553E53]/70">
                Experience: <strong className="text-[#553E53]">{doc.experienceYears}+ years</strong>
              </div>
              <div>
                Consultation Fee: <strong className="text-[#553E53] font-mono font-bold text-sm">₹{doc.consultationFee}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Doctor Shift Schedule Inspector */}
      {selectedDoc && (
        <div className="bg-white rounded-2xl p-6 border border-[#553E53]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#553E53]/10">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#553E53]" />
              <h3 className="font-serif font-bold text-sm text-[#553E53]">
                Weekly Shift Schedule for {selectedDoc.name}
              </h3>
            </div>
            <span className="text-xs text-[#553E53]/60 font-mono">
              30 Mins / Slot • Break: 1:00 PM – 2:00 PM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {selectedDoc.schedule.map((shift, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-center text-xs space-y-1 ${
                  shift.isWorking
                    ? 'bg-[#F5F6F0] border-[#553E53]/15 text-[#553E53]'
                    : 'bg-white border-[#553E53]/5 text-[#553E53]/30'
                }`}
              >
                <div className="font-bold uppercase tracking-wider text-[11px] text-[#553E53]">
                  {shift.day}
                </div>
                {shift.isWorking ? (
                  <>
                    <div className="font-mono text-[11px] text-[#553E53] font-semibold">
                      {shift.startTime} – {shift.endTime}
                    </div>
                    {shift.breakStart && (
                      <div className="text-[10px] text-[#553E53]/60">
                        Break: {shift.breakStart}-{shift.breakEnd}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-[11px] text-[#553E53]/40 py-1">Day Off</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
