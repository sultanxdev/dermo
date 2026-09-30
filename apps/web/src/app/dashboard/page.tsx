'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  CreditCard,
  UserCheck,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  PhoneCall,
  Stethoscope,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';

export default function DashboardOverviewPage() {
  const [overview, setOverview] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ovData, apts, convs, docs] = await Promise.all([
          api.getAnalyticsOverview(),
          api.getAppointments(),
          api.getConversations(),
          api.getDoctors(),
        ]);
        setOverview(ovData);
        setAppointments(apts);
        setConversations(convs);
        setDoctors(docs);
      } catch (err) {
        console.error('Failed loading dashboard overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#553E53] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#553E53]/70 font-medium">Loading clinic operational metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-white border border-[#553E53]/15 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B6CBDE]/25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B6CBDE]/30 border border-[#553E53]/15 text-[#553E53] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#553E53]" />
            <span>AI Receptionist Operating at Peak Efficiency</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#553E53]">
            DermaCare Aesthetics & Laser Clinic
          </h1>
          <p className="text-xs sm:text-sm text-[#553E53]/70">
            Live patient conversion pipeline, automated slot booking, and Razorpay payment holds synchronized in real time.
          </p>
        </div>

        <div className="mt-5 sm:mt-0 sm:absolute sm:right-8 sm:bottom-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard/conversations"
            className="px-4 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-medium text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4 text-[#B6CBDE]" />
            <span>Open WhatsApp Simulator</span>
          </Link>
          <Link
            href="/dashboard/appointments"
            className="px-4 py-2.5 rounded-xl bg-[#F5F6F0] hover:bg-[#e8ecea] text-[#553E53] font-medium text-xs flex items-center gap-2 border border-[#553E53]/15 transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#553E53]" />
            <span>Manage Slots</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Inquiries */}
        <div className="bg-white p-5 rounded-2xl space-y-2 border border-[#553E53]/10 shadow-sm hover:border-[#553E53]/25 transition-all">
          <div className="flex items-center justify-between text-[#553E53]/70">
            <span className="text-xs font-medium">WhatsApp Inquiries</span>
            <div className="p-2 rounded-lg bg-[#B6CBDE]/30 text-[#553E53]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#553E53] font-mono">
            {overview?.totalEnquiries || 0}
          </div>
          <div className="text-[11px] text-[#553E53] flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3 text-[#553E53]" />
            <span>+24% vs last week</span>
          </div>
        </div>

        {/* Qualified Leads */}
        <div className="bg-white p-5 rounded-2xl space-y-2 border border-[#553E53]/10 shadow-sm hover:border-[#553E53]/25 transition-all">
          <div className="flex items-center justify-between text-[#553E53]/70">
            <span className="text-xs font-medium">Qualified Leads</span>
            <div className="p-2 rounded-lg bg-[#B6CBDE]/30 text-[#553E53]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#553E53] font-mono">
            {overview?.qualifiedLeads || 0}
          </div>
          <div className="text-[11px] text-[#553E53]/70">
            High-intent patient inquiries
          </div>
        </div>

        {/* Appointments Booked */}
        <div className="bg-white p-5 rounded-2xl space-y-2 border border-[#553E53]/10 shadow-sm hover:border-[#553E53]/25 transition-all">
          <div className="flex items-center justify-between text-[#553E53]/70">
            <span className="text-xs font-medium">Confirmed Bookings</span>
            <div className="p-2 rounded-lg bg-[#B6CBDE]/30 text-[#553E53]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#553E53] font-mono">
            {overview?.appointmentsBooked || 0}
          </div>
          <div className="text-[11px] text-[#553E53] flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-[#553E53]" />
            <span>{overview?.aiConversionRate || 0}% conversion rate</span>
          </div>
        </div>

        {/* Razorpay Revenue */}
        <div className="bg-white p-5 rounded-2xl space-y-2 border border-[#553E53]/10 shadow-sm hover:border-[#553E53]/25 transition-all">
          <div className="flex items-center justify-between text-[#553E53]/70">
            <span className="text-xs font-medium">Razorpay Deposits</span>
            <div className="p-2 rounded-lg bg-[#B6CBDE]/30 text-[#553E53]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#553E53] font-mono">
            {formatCurrency(overview?.totalRevenue || 0)}
          </div>
          <div className="text-[11px] text-[#553E53]/70">
            Advance holding fees captured
          </div>
        </div>
      </div>

      {/* Main Grid: Doctors Shifts & Recent Appointments */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Appointments & Activity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-[#553E53]/10 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#553E53]" />
                <h3 className="font-serif font-bold text-[#553E53] text-base">Upcoming Appointments</h3>
              </div>
              <Link
                href="/dashboard/appointments"
                className="text-xs text-[#553E53] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {appointments.slice(0, 4).map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10 flex items-center justify-between gap-4 hover:border-[#553E53]/25 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B6CBDE]/30 border border-[#553E53]/15 flex items-center justify-center font-bold text-[#553E53] text-xs">
                      {apt.startTime}
                    </div>
                    <div>
                      <div className="font-semibold text-[#553E53] text-xs sm:text-sm">{apt.leadName}</div>
                      <div className="text-[11px] text-[#553E53]/70 flex items-center gap-1">
                        <span>{apt.serviceName}</span>
                        <span>•</span>
                        <span className="text-[#553E53] font-medium">{apt.doctorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-[#B6CBDE]/30 text-[#553E53] border-[#553E53]/20'
                          : apt.status === 'BOOKED'
                          ? 'bg-[#B6CBDE]/20 text-[#553E53] border-[#553E53]/20'
                          : 'bg-white text-[#553E53]/70 border-[#553E53]/15'
                      }`}
                    >
                      {apt.status}
                    </span>
                    {apt.paymentStatus === 'PAID' && (
                      <span className="px-1.5 py-0.5 rounded-md bg-[#553E53] text-[#F5F6F0] text-[9px] font-mono">
                        ₹{apt.depositPaid} Paid
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent WhatsApp Live Conversations */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-[#553E53]/10 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#553E53]" />
                <h3 className="font-serif font-bold text-[#553E53] text-base">Live Patient Conversations</h3>
              </div>
              <Link
                href="/dashboard/conversations"
                className="text-xs text-[#553E53] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Live Chat Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {conversations.slice(0, 3).map((conv) => (
                <div
                  key={conv.id}
                  className="p-3.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#553E53] text-xs">{conv.patientName}</span>
                      <span className="text-[10px] text-[#553E53]/60 font-mono">{conv.patientPhone}</span>
                      {conv.mode === 'HUMAN_TAKEOVER' ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[9px] font-bold border border-rose-200">
                          Staff Takeover
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-[#B6CBDE]/30 text-[#553E53] text-[9px] font-bold border border-[#553E53]/20">
                          AI Handling
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#553E53]/70 truncate">
                      {conv.lastMessagePreview || 'No messages yet.'}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/conversations`}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 text-[#553E53] text-xs font-medium border border-[#553E53]/15 transition-colors"
                  >
                    Open Chat
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Doctor Availability Today & AI Performance */}
        <div className="lg:col-span-5 space-y-6">
          {/* Doctor Profiles & Shifts */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-[#553E53]/10 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#553E53]" />
                <h3 className="font-serif font-bold text-[#553E53] text-base">Doctors on Duty Today</h3>
              </div>
              <Link
                href="/dashboard/doctors"
                className="text-xs text-[#553E53] hover:underline font-semibold"
              >
                Manage Shifts
              </Link>
            </div>

            <div className="space-y-4">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10 space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120'}
                      alt={doc.name}
                      className="w-11 h-11 rounded-xl object-cover border border-[#553E53]/15"
                    />
                    <div>
                      <div className="font-bold text-[#553E53] text-xs sm:text-sm">{doc.name}</div>
                      <div className="text-[10px] text-[#553E53]/80 font-medium">{doc.title}</div>
                      <div className="text-[10px] text-[#553E53]/60">{doc.qualification}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#553E53]/10 flex items-center justify-between text-[11px]">
                    <span className="text-[#553E53]/70 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#553E53]" />
                      10:00 AM – 6:00 PM (30m slots)
                    </span>
                    <span className="font-mono text-[#553E53] font-bold">₹{doc.consultationFee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Grounding & DPDP Compliance Badge */}
          <div className="p-5 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-3">
            <div className="flex items-center gap-2 text-[#553E53] font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#553E53]" />
              <span>Medical Safety & Compliance System</span>
            </div>
            <p className="text-xs text-[#553E53]/80 leading-relaxed">
              Dermo's safety guardrail intercepts medical prescription requests and routes emergency keywords directly to on-duty staff. All chats are encrypted.
            </p>
            <div className="flex items-center gap-4 text-[10px] text-[#553E53]/70 font-mono">
              <span>• Zero Hallucinations</span>
              <span>• Meta Webhook Verified</span>
              <span>• DPDP Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
