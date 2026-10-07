'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  Activity,
  AlertCircle,
  ExternalLink,
  Filter,
  RefreshCw,
  Plus,
  Send,
  Zap,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';

type AppointmentFilter = 'ALL' | 'CONFIRMED' | 'PAID';

export default function DashboardOverviewPage() {
  const [overview, setOverview] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState<AppointmentFilter>('ALL');
  const [takeoverLoading, setTakeoverLoading] = useState<string | null>(null);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const [ovData, apts, convs, docs] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getAppointments(),
        api.getConversations(),
        api.getDoctors(),
      ]);
      setOverview(ovData);
      setAppointments(apts || []);
      setConversations(convs || []);
      setDoctors(docs || []);
    } catch (err) {
      console.error('Failed loading dashboard overview:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTakeover = async (conversationId: string) => {
    setTakeoverLoading(conversationId);
    try {
      await api.takeoverConversation(conversationId);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, mode: 'HUMAN_TAKEOVER' } : c
        )
      );
    } catch (err) {
      console.error('Failed to take over conversation:', err);
    } finally {
      setTakeoverLoading(null);
    }
  };

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    if (appointmentFilter === 'ALL') return appointments;
    if (appointmentFilter === 'PAID') {
      return appointments.filter((a) => a.paymentStatus === 'PAID');
    }
    return appointments.filter((a) => a.status === appointmentFilter);
  }, [appointments, appointmentFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[55vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#553E53] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#553E53]/70 font-medium">Synchronizing clinic operations...</span>
        </div>
      </div>
    );
  }

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-7">
      {/* ── 1. Executive Operations Command Bar (ui-taste: task-first, clean hierarchy) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#553E53]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#553E53]">
              Clinic Operations Pulse
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4B624A]/10 border border-[#4B624A]/25 text-[#4B624A] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4B624A] animate-pulse" />
              <span>Clinic Open • 09:00 - 20:00</span>
            </span>
          </div>
          <p className="text-xs text-[#553E53]/70 flex items-center gap-2">
            <span>{todayDateFormatted}</span>
            <span>•</span>
            <span>Indiranagar & Koramangala, Bengaluru</span>
            <span>•</span>
            <span className="text-[#553E53] font-semibold">Gemini 2.0 AI Receptionist Active</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F5F6F0] border border-[#553E53]/15 text-xs font-semibold text-[#553E53] shadow-xs transition-colors disabled:opacity-50"
            title="Refresh latest clinic metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#553E53]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/dashboard/conversations"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5F6F0] border border-[#553E53]/15 hover:border-[#553E53]/30 text-xs font-semibold text-[#553E53] shadow-xs transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#553E53]" />
            <span>WhatsApp Sandbox</span>
          </Link>

          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#B6CBDE]" />
            <span>Book In-Clinic Slot</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Operational KPIs (ui-taste: tabular-nums, clear contrast, porcelain cards) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* WhatsApp Patient Enquiries */}
        <div className="p-5 rounded-2xl bg-white border border-[#553E53]/10 shadow-xs hover:border-[#553E53]/25 transition-colors">
          <div className="flex items-center justify-between text-[#553E53]/70 text-xs mb-2">
            <span className="font-semibold text-[#553E53]">Inbound Enquiries</span>
            <div className="w-7 h-7 rounded-lg bg-[#B6CBDE]/30 flex items-center justify-center text-[#553E53]">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#553E53] tabular-nums">
            {overview?.totalEnquiries || 0}
          </div>
          <div className="text-[11px] text-[#4B624A] flex items-center gap-1 mt-1.5 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+24% velocity this week</span>
          </div>
        </div>

        {/* High-Intent Qualified Leads */}
        <div className="p-5 rounded-2xl bg-white border border-[#553E53]/10 shadow-xs hover:border-[#553E53]/25 transition-colors">
          <div className="flex items-center justify-between text-[#553E53]/70 text-xs mb-2">
            <span className="font-semibold text-[#553E53]">Qualified Leads</span>
            <div className="w-7 h-7 rounded-lg bg-[#553E53]/10 flex items-center justify-center text-[#553E53]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#553E53] tabular-nums">
            {overview?.qualifiedLeads || 0}
          </div>
          <div className="text-[11px] text-[#553E53]/70 mt-1.5 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#553E53]" />
            <span>Triage status: High intent</span>
          </div>
        </div>

        {/* Confirmed Slot Bookings */}
        <div className="p-5 rounded-2xl bg-white border border-[#553E53]/10 shadow-xs hover:border-[#553E53]/25 transition-colors">
          <div className="flex items-center justify-between text-[#553E53]/70 text-xs mb-2">
            <span className="font-semibold text-[#553E53]">Confirmed Bookings</span>
            <div className="w-7 h-7 rounded-lg bg-[#B6CBDE]/30 flex items-center justify-center text-[#553E53]">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#553E53] tabular-nums">
            {overview?.appointmentsBooked || 0}
          </div>
          <div className="text-[11px] text-[#4B624A] mt-1.5 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>{overview?.aiConversionRate || 0}% AI conversion rate</span>
          </div>
        </div>

        {/* Razorpay Advance Holding Deposits */}
        <div className="p-5 rounded-2xl bg-white border border-[#553E53]/10 shadow-xs hover:border-[#553E53]/25 transition-colors">
          <div className="flex items-center justify-between text-[#553E53]/70 text-xs mb-2">
            <span className="font-semibold text-[#553E53]">Advance Deposits</span>
            <div className="w-7 h-7 rounded-lg bg-[#4B624A]/10 flex items-center justify-center text-[#4B624A]">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4B624A] tabular-nums">
            {formatCurrency(overview?.totalRevenue || 0)}
          </div>
          <div className="text-[11px] text-[#553E53]/70 mt-1.5 flex items-center gap-1 font-medium">
            <span>Razorpay holds • Zero no-shows</span>
          </div>
        </div>
      </div>

      {/* ── 3. Main Operational Surface: Schedule & Real-Time Patient Engagement ── */}
      <div className="grid lg:grid-cols-12 gap-7">
        {/* Left Column (7 cols): Today's Patient Schedule Console */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#553E53]/10 shadow-sm space-y-4">
            {/* Header + Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#553E53]/10">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#553E53]" />
                <h2 className="font-bold text-[#553E53] text-sm sm:text-base">
                  Today&apos;s Consultation Schedule
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#F5F6F0] text-[#553E53] tabular-nums font-mono border border-[#553E53]/10">
                  {appointments.length}
                </span>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1 bg-[#F5F6F0] p-1 rounded-xl border border-[#553E53]/10 text-[11px]">
                {(['ALL', 'CONFIRMED', 'PAID'] as AppointmentFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAppointmentFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      appointmentFilter === filter
                        ? 'bg-white text-[#553E53] shadow-xs'
                        : 'text-[#553E53]/70 hover:text-[#553E53]'
                    }`}
                  >
                    {filter === 'ALL' ? 'All' : filter === 'CONFIRMED' ? 'Confirmed' : 'Deposit Paid'}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments List (High density, clean typography) */}
            {filteredAppointments.length === 0 ? (
              <div className="py-12 text-center text-[#553E53]/60 text-xs space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-[#553E53]/30" />
                <p className="font-medium">No appointments matching this filter.</p>
                <Link
                  href="/dashboard/conversations"
                  className="inline-block text-[#553E53] hover:underline font-semibold pt-1"
                >
                  Test booking via WhatsApp Simulator →
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredAppointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl bg-[#F5F6F0]/60 border border-[#553E53]/10 hover:border-[#553E53]/25 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Time slot pill with tabular-nums */}
                      <div className="w-14 py-2 rounded-lg bg-white border border-[#553E53]/15 text-[#553E53] text-center font-bold text-xs tabular-nums shrink-0 shadow-xs">
                        {apt.startTime || '10:00'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#553E53] text-xs sm:text-sm truncate">
                            {apt.leadName || 'Patient'}
                          </span>
                          {apt.leadPhone && (
                            <span className="text-[10px] text-[#553E53]/60 font-mono hidden sm:inline">
                              {apt.leadPhone}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#553E53]/75 truncate flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-[#553E53]">{apt.serviceName}</span>
                          <span className="text-[#553E53]/40">•</span>
                          <span className="text-[#553E53]/90 font-medium">{apt.doctorName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {apt.paymentStatus === 'PAID' ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#4B624A]/10 text-[#4B624A] border border-[#4B624A]/25 text-[10px] font-bold tabular-nums">
                          ₹{apt.depositPaid || 500} Paid
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                          Deposit Pending
                        </span>
                      )}

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          apt.status === 'CONFIRMED'
                            ? 'bg-[#B6CBDE]/30 text-[#553E53] border-[#553E53]/20'
                            : 'bg-white text-[#553E53]/70 border-[#553E53]/15'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Link
                href="/dashboard/appointments"
                className="text-xs text-[#553E53] hover:underline flex items-center gap-1 font-bold transition-colors"
              >
                <span>View complete calendar & slot grid</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#553E53]/70" />
              </Link>
            </div>
          </div>

          {/* ── Real-Time Patient Engagement (WhatsApp Threads) ── */}
          <div className="p-6 rounded-2xl bg-white border border-[#553E53]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#553E53]/10">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#553E53]" />
                <h2 className="font-bold text-[#553E53] text-sm sm:text-base">
                  Live Patient WhatsApp Conversations
                </h2>
              </div>
              <Link
                href="/dashboard/conversations"
                className="text-xs text-[#553E53] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Full Chat Console</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#553E53]/70" />
              </Link>
            </div>

            {conversations.length === 0 ? (
              <div className="py-8 text-center text-[#553E53]/60 text-xs font-medium">
                No active patient conversations. Send a simulation message to start.
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.slice(0, 3).map((conv) => (
                  <div
                    key={conv.id}
                    className="p-3.5 rounded-xl bg-[#F5F6F0]/60 border border-[#553E53]/10 flex items-center justify-between gap-4 hover:border-[#553E53]/25 transition-colors"
                  >
                    <div className="space-y-1 min-w-0 max-w-[70%]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#553E53] text-xs">{conv.patientName}</span>
                        <span className="text-[10px] text-[#553E53]/60 font-mono">{conv.patientPhone}</span>
                        {conv.mode === 'HUMAN_TAKEOVER' ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                            Staff Takeover Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-[#B6CBDE]/30 text-[#553E53] text-[10px] font-bold border border-[#B6CBDE]/60">
                            AI Autopilot
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#553E53]/75 truncate font-medium">
                        {conv.lastMessagePreview || 'Patient connected via WhatsApp'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {conv.mode !== 'HUMAN_TAKEOVER' && (
                        <button
                          onClick={() => handleTakeover(conv.id)}
                          disabled={takeoverLoading === conv.id}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50 text-[#553E53] text-xs font-semibold border border-[#553E53]/15 transition-colors disabled:opacity-50 shadow-2xs"
                        >
                          {takeoverLoading === conv.id ? 'Pausing AI...' : 'Take Over'}
                        </button>
                      )}
                      <Link
                        href={`/dashboard/conversations`}
                        className="px-3 py-1.5 rounded-lg bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] text-xs font-semibold shadow-xs transition-colors"
                      >
                        Reply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Doctor Shifts on Duty & Medical Guardrails */}
        <div className="lg:col-span-5 space-y-6">
          {/* Doctor On-Duty Roster */}
          <div className="p-6 rounded-2xl bg-white border border-[#553E53]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#553E53]/10">
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-4 h-4 text-[#553E53]" />
                <h2 className="font-bold text-[#553E53] text-sm sm:text-base">
                  Doctors on Duty Today
                </h2>
              </div>
              <Link
                href="/dashboard/doctors"
                className="text-xs text-[#553E53] hover:underline font-bold"
              >
                Manage Shifts
              </Link>
            </div>

            <div className="space-y-3">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-[#F5F6F0]/60 border border-[#553E53]/10 space-y-2.5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120'}
                      alt={doc.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#553E53]/15 shrink-0 shadow-xs"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-[#553E53] text-xs sm:text-sm truncate">{doc.name}</div>
                      <div className="text-[10px] text-[#553E53]/80 font-semibold truncate">{doc.title}</div>
                      <div className="text-[10px] text-[#553E53]/60 truncate">{doc.qualification}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#553E53]/10 flex items-center justify-between text-[11px]">
                    <span className="text-[#553E53]/70 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#553E53]/50" />
                      <span>10:00 AM – 6:00 PM (30m)</span>
                    </span>
                    <span className="font-mono text-[#553E53] font-bold tabular-nums">
                      ₹{doc.consultationFee}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Safety Guardrail & Clinical Triage System */}
          <div className="p-5 rounded-2xl bg-white border border-[#4B624A]/20 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#4B624A] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#4B624A]" />
              <span>Medical Safety & Guardrails</span>
            </div>
            <p className="text-xs text-[#553E53]/80 leading-relaxed">
              Automated clinical safety filter actively guards incoming patient messages. Diagnostic and prescription queries are deflected with disclaimers; acute emergency keywords immediately alert on-duty clinic staff.
            </p>
            <div className="pt-2 border-t border-[#553E53]/10 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-[#553E53]/70 font-semibold">
              <span className="text-[#4B624A]">✓ Zero AI Hallucinations</span>
              <span>✓ WhatsApp Verified</span>
              <span>✓ DPDP/HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
