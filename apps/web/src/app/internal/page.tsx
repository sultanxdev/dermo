'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Power,
  ChevronRight,
  Rocket,
  Check,
  X,
  Sparkles,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

type Tab = 'overview' | 'demo-requests' | 'clinics' | 'provision';

export default function InternalAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<{
    clinics: { total: number; active: number; suspended: number };
    demoRequests: { total: number; pending: number };
  }>({
    clinics: { total: 0, active: 0, suspended: 0 },
    demoRequests: { total: 0, pending: 0 },
  });

  const [demoRequests, setDemoRequests] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Provisioning Form State
  const [provisionForm, setProvisionForm] = useState({
    sourceDemoRequestId: '',
    name: '',
    slug: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
  });
  const [provisionResult, setProvisionResult] = useState<any | null>(null);

  // Clinic Checklist Modal State
  const [selectedClinicChecklist, setSelectedClinicChecklist] = useState<{
    clinic: any;
    checklist: any;
  } | null>(null);
  const [isChecklistLoading, setIsChecklistLoading] = useState(false);

  // Load Data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, clinicsRes, demosRes] = await Promise.allSettled([
        api.getInternalStats(),
        api.getInternalClinics(),
        api.getInternalDemoRequests(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value);
      }
      if (clinicsRes.status === 'fulfilled' && clinicsRes.value) {
        setClinics(clinicsRes.value);
      }
      if (demosRes.status === 'fulfilled' && demosRes.value) {
        setDemoRequests(demosRes.value);
      }
    } catch (err) {
      console.error('Failed to load internal data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Demo Request Status Change
  const handleUpdateDemoStatus = async (id: string, newStatus: string) => {
    setActionLoading(`demo-${id}`);
    setFeedback(null);
    try {
      await api.updateDemoRequestStatus(id, newStatus);
      setDemoRequests((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
      setFeedback({ type: 'success', message: `Demo request status updated to ${newStatus}` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update status' });
    } finally {
      setActionLoading(null);
    }
  };

  // Convert Demo Request to Provisioning Form
  const handleStartProvisionFromDemo = (demo: any) => {
    const slugSuggestion = demo.clinic_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setProvisionForm({
      sourceDemoRequestId: demo.id,
      name: demo.clinic_name,
      slug: slugSuggestion,
      ownerName: demo.name,
      email: demo.email,
      phone: demo.phone,
      address: '',
      city: demo.city || '',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
    });
    setProvisionResult(null);
    setActiveTab('provision');
  };

  // Handle Clinic Status (Suspend / Reactivate)
  const handleToggleClinicStatus = async (clinicId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setActionLoading(`clinic-status-${clinicId}`);
    setFeedback(null);
    try {
      await api.updateClinicStatus(clinicId, nextStatus as any);
      setClinics((prev) =>
        prev.map((c) => (c.id === clinicId ? { ...c, status: nextStatus } : c))
      );
      setFeedback({
        type: 'success',
        message: `Clinic tenant ${clinicId} is now ${nextStatus}`,
      });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update clinic status' });
    } finally {
      setActionLoading(null);
    }
  };

  // View Checklist Modal
  const handleOpenChecklist = async (clinicId: string) => {
    setIsChecklistLoading(true);
    try {
      const data = await api.getInternalClinic(clinicId);
      setSelectedClinicChecklist(data);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to fetch checklist' });
    } finally {
      setIsChecklistLoading(false);
    }
  };

  // Launch Clinic
  const handleLaunchClinic = async (clinicId: string) => {
    setActionLoading(`launch-${clinicId}`);
    try {
      const res = await api.launchClinic(clinicId);
      setFeedback({ type: 'success', message: res.message || 'Clinic launched successfully!' });
      setSelectedClinicChecklist(null);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Launch gate failed' });
    } finally {
      setActionLoading(null);
    }
  };

  // Submit Provisioning Form
  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('provisioning');
    setFeedback(null);
    setProvisionResult(null);

    try {
      const result = await api.provisionClinic({
        sourceDemoRequestId: provisionForm.sourceDemoRequestId || undefined,
        name: provisionForm.name.trim(),
        slug: provisionForm.slug.trim(),
        ownerName: provisionForm.ownerName.trim(),
        email: provisionForm.email.trim(),
        phone: provisionForm.phone.trim(),
        address: provisionForm.address.trim() || undefined,
        city: provisionForm.city.trim() || undefined,
        timezone: provisionForm.timezone,
        currency: provisionForm.currency,
      });

      setProvisionResult(result);
      setFeedback({
        type: 'success',
        message: `Successfully provisioned clinic workspace ${result.clinic.name}!`,
      });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to provision clinic.' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Dermo Internal Operations Console</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            B2B Tenant Provisioning, Invariant Security & Clinic Lifecycle Gate.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
            <span>Sync DB</span>
          </button>
          <button
            onClick={() => {
              setProvisionForm({
                sourceDemoRequestId: '',
                name: '',
                slug: '',
                ownerName: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                timezone: 'Asia/Kolkata',
                currency: 'INR',
              });
              setProvisionResult(null);
              setActiveTab('provision');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-semibold text-xs shadow-lg shadow-orange-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Clinic</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border text-sm animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-neutral-400 hover:text-white text-xs px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Clinics</span>
            <Building2 className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.clinics.total}</div>
          <div className="text-[11px] text-neutral-500 mt-1">Multi-tenant PostgreSQL workspaces</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Tenants</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats.clinics.active}</div>
          <div className="text-[11px] text-neutral-500 mt-1">Live authorized workspaces</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Suspended Clinics</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-300">{stats.clinics.suspended}</div>
          <div className="text-[11px] text-neutral-500 mt-1">Blocked by requireClinicOwner guard</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pending Inquiries</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{stats.demoRequests.pending}</div>
          <div className="text-[11px] text-neutral-500 mt-1">Awaiting review or demo call</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-neutral-800 space-x-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'overview'
              ? 'text-orange-400 border-b-2 border-orange-500 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Overview & Pipeline
        </button>
        <button
          onClick={() => setActiveTab('demo-requests')}
          className={`pb-3 relative transition-colors flex items-center gap-2 ${
            activeTab === 'demo-requests'
              ? 'text-orange-400 border-b-2 border-orange-500 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>Demo Requests</span>
          {stats.demoRequests.pending > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
              {stats.demoRequests.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('clinics')}
          className={`pb-3 relative transition-colors flex items-center gap-2 ${
            activeTab === 'clinics'
              ? 'text-orange-400 border-b-2 border-orange-500 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>Clinics Management</span>
          <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-[10px]">
            {clinics.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('provision')}
          className={`pb-3 relative transition-colors flex items-center gap-1.5 ${
            activeTab === 'provision'
              ? 'text-orange-400 border-b-2 border-orange-500 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provisioning Wizard</span>
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inquiries Card */}
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>Recent Inbound Requests</span>
              </h3>
              <button
                onClick={() => setActiveTab('demo-requests')}
                className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {demoRequests.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs">
                No demo requests captured yet.
              </div>
            ) : (
              <div className="space-y-3">
                {demoRequests.slice(0, 4).map((demo) => (
                  <div
                    key={demo.id}
                    className="p-3.5 rounded-xl bg-neutral-800/40 border border-neutral-700/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{demo.clinic_name}</div>
                      <div className="text-neutral-400 flex items-center gap-2 mt-0.5">
                        <span>{demo.name}</span>
                        <span>•</span>
                        <span>{demo.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        {demo.status}
                      </span>
                      <button
                        onClick={() => handleStartProvisionFromDemo(demo)}
                        className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-[11px] font-medium transition-colors"
                      >
                        Provision
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Clinic Readiness Health */}
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-orange-400" />
                <span>Tenants In Flight</span>
              </h3>
              <button
                onClick={() => setActiveTab('clinics')}
                className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <span>Manage all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {clinics.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs">
                No clinics provisioned in database yet.
              </div>
            ) : (
              <div className="space-y-3">
                {clinics.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-neutral-800/40 border border-neutral-700/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-neutral-400 text-[11px] mt-0.5">
                        Owner: {c.owner_name || c.email} ({c.owner_email || 'Awaiting activation'})
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                      >
                        {c.status}
                      </span>
                      <button
                        onClick={() => handleOpenChecklist(c.id)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-medium transition-colors"
                      >
                        Checklist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Demo Requests */}
      {activeTab === 'demo-requests' && (
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Inbound Clinic Demo & Access Pipeline</h3>
            <span className="text-xs text-neutral-500">{demoRequests.length} requests recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/60 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="p-3">Clinic & Doctor</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Location & Doctors</th>
                  <th className="p-3">Specialty</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {demoRequests.map((demo) => (
                  <tr key={demo.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-white">{demo.clinic_name}</div>
                      <div className="text-neutral-400">{demo.name}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-neutral-200">{demo.email}</div>
                      <div className="text-neutral-400">{demo.phone}</div>
                    </td>
                    <td className="p-3">
                      <div>{demo.city || '—'}</div>
                      <div className="text-neutral-400">{demo.doctor_count || 1} Doctor(s)</div>
                    </td>
                    <td className="p-3">
                      <span className="text-neutral-300">{demo.clinic_type || 'Dermatology'}</span>
                    </td>
                    <td className="p-3">
                      <select
                        value={demo.status}
                        onChange={(e) => handleUpdateDemoStatus(demo.id, e.target.value)}
                        disabled={actionLoading === `demo-${demo.id}`}
                        className="bg-neutral-900 border border-neutral-700 text-white text-[11px] rounded-lg px-2 py-1 focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="DEMO_COMPLETED">DEMO_COMPLETED</option>
                        <option value="ONBOARDING">ONBOARDING</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleStartProvisionFromDemo(demo)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-semibold text-[11px] shadow-sm transition-all"
                      >
                        Provision Clinic
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Clinics Management */}
      {activeTab === 'clinics' && (
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Provisioned Clinic Tenants</h3>
            <span className="text-xs text-neutral-500">{clinics.length} total tenants</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/60 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="p-3">Clinic Name & Slug</th>
                  <th className="p-3">Owner Contact</th>
                  <th className="p-3">Tenant Status</th>
                  <th className="p-3">Onboarding Stage</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {clinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-white">{clinic.name}</div>
                      <div className="text-neutral-500 text-[10px] font-mono">/{clinic.slug}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-neutral-200">{clinic.owner_name || clinic.email}</div>
                      <div className="text-neutral-400">{clinic.owner_email || clinic.email}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          clinic.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            clinic.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        />
                        <span>{clinic.status}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-800 border border-neutral-700 text-neutral-300">
                        {clinic.onboarding_status || 'CONFIGURING'}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-400">
                      {new Date(clinic.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenChecklist(clinic.id)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors"
                      >
                        Checklist
                      </button>
                      <button
                        onClick={() => handleToggleClinicStatus(clinic.id, clinic.status)}
                        disabled={actionLoading === `clinic-status-${clinic.id}`}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                          clinic.status === 'ACTIVE'
                            ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {clinic.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Provisioning Wizard */}
      {activeTab === 'provision' && (
        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span>Provision New Clinic Workspace</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Creates the tenant database entry, provisions Better Auth owner credentials, enforces multi-tenant database constraints, and dispatches an activation link.
            </p>
          </div>

          {provisionResult && (
            <div className="p-4 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Clinic Workspace Provisioned!</span>
              </div>
              <div><strong>Clinic ID:</strong> {provisionResult.clinic?.id}</div>
              <div><strong>Owner ID:</strong> {provisionResult.owner?.id}</div>
              <div><strong>Email:</strong> {provisionResult.owner?.email}</div>
              <p className="text-neutral-400 pt-1 border-t border-emerald-500/20">
                Password activation email dispatched pointing to <code>/reset-password</code>.
              </p>
            </div>
          )}

          <form onSubmit={handleProvisionSubmit} className="space-y-4 text-xs">
            {/* Linked Demo Request ID */}
            {provisionForm.sourceDemoRequestId && (
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 flex items-center justify-between">
                <span>Linked to Demo Request: <strong>{provisionForm.sourceDemoRequestId}</strong></span>
                <button
                  type="button"
                  onClick={() => setProvisionForm((prev) => ({ ...prev, sourceDemoRequestId: '' }))}
                  className="text-neutral-400 hover:text-white"
                >
                  Clear link
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
                  Clinic Name *
                </label>
                <input
                  type="text"
                  required
                  value={provisionForm.name}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Skin & Laser Clinic"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
                  URL Slug * (Lowercase & Hyphens)
                </label>
                <input
                  type="text"
                  required
                  value={provisionForm.slug}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="skin-laser-clinic"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
                  Owner / Doctor Name *
                </label>
                <input
                  type="text"
                  required
                  value={provisionForm.ownerName}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, ownerName: e.target.value }))}
                  placeholder="Dr. Rajesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
                  Owner Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={provisionForm.email}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="rajesh@skinclinic.in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
                  Clinic Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={provisionForm.phone}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  value={provisionForm.city}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="Mumbai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1 uppercase tracking-wider">
                Full Physical Address
              </label>
              <input
                type="text"
                value={provisionForm.address}
                onChange={(e) => setProvisionForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Suite 101, Medical Enclave, Bandra West"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading === 'provisioning'}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {actionLoading === 'provisioning' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Provisioning Workspace & Owner Account...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Provision Clinic & Send Activation</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Checklist & Launch Gate Modal */}
      {selectedClinicChecklist && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedClinicChecklist.clinic.name}
                </h3>
                <p className="text-xs text-neutral-400">Launch Gate Readiness Audit</p>
              </div>
              <button
                onClick={() => setSelectedClinicChecklist(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50">
                <span>Owner Activated Password</span>
                {selectedClinicChecklist.checklist?.ownerActivated ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50">
                <span>Profile & Location Configured</span>
                {selectedClinicChecklist.checklist?.profileConfigured ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50">
                <span>Doctors & Schedules Configured</span>
                {selectedClinicChecklist.checklist?.doctorsConfigured ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50">
                <span>Clinical Services Configured</span>
                {selectedClinicChecklist.checklist?.servicesConfigured ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedClinicChecklist(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleLaunchClinic(selectedClinicChecklist.clinic.id)}
                disabled={actionLoading === `launch-${selectedClinicChecklist.clinic.id}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/25"
              >
                <Rocket className="w-4 h-4" />
                <span>Launch Clinic Live</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
