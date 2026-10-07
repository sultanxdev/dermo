'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Phone,
  Tag,
  Calendar,
  Sparkles,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Lead, LeadStatus } from '@dermo/types';

const STAGES: { id: LeadStatus; label: string; dotColor: string }[] = [
  { id: 'NEW', label: 'New Enquiries', dotColor: 'bg-blue-500' },
  { id: 'CONTACTED', label: 'Contacted', dotColor: 'bg-amber-500' },
  { id: 'QUALIFIED', label: 'Qualified (High Intent)', dotColor: 'bg-purple-500' },
  { id: 'APPOINTMENT_BOOKED', label: 'Appointment Booked', dotColor: 'bg-[#553E53]' },
  { id: 'CONVERTED', label: 'Converted', dotColor: 'bg-emerald-500' },
  { id: 'LOST', label: 'Lost / Closed', dotColor: 'bg-neutral-400' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newConcern, setNewConcern] = useState('');
  const [newSource, setNewSource] = useState<'WHATSAPP' | 'WEBSITE' | 'WALK_IN' | 'INSTAGRAM'>('WHATSAPP');

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      await loadLeads();
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    try {
      await api.createLead({
        name: newName,
        phone: newPhone,
        primaryConcern: newConcern,
        source: newSource,
        status: 'NEW',
        tags: [newSource, 'Manual'],
      });
      setShowAddModal(false);
      setNewName('');
      setNewPhone('');
      setNewConcern('');
      await loadLeads();
    } catch (err) {
      console.error('Failed to create lead:', err);
    }
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#553E53] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#553E53]" />
            <span>Clinic Leads & Patient Pipeline</span>
          </h1>
          <p className="text-xs text-[#553E53]/70 mt-1">
            Track inquiries from WhatsApp, website, and Instagram across conversion stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-white border border-[#553E53]/15 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-[#553E53] text-[#F5F6F0]'
                  : 'text-[#553E53]/70 hover:text-[#553E53]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#553E53] text-[#F5F6F0]'
                  : 'text-[#553E53]/70 hover:text-[#553E53]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-medium text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[#B6CBDE]" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 max-w-md bg-white border border-[#553E53]/15 rounded-xl px-3.5 py-2 text-xs shadow-sm">
        <Search className="w-4 h-4 text-[#553E53]/60" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by patient name, phone, or treatment tag..."
          className="flex-1 bg-transparent border-none text-[#553E53] placeholder-[#553E53]/40 focus:outline-none"
        />
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-white rounded-2xl p-3 border border-[#553E53]/10 shadow-sm flex flex-col min-w-[240px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#553E53]/10">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                    <h3 className="font-semibold text-xs text-[#553E53] truncate">{stage.label}</h3>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#F5F6F0] text-[10px] font-mono text-[#553E53]/70">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10 hover:border-[#553E53]/25 transition-all space-y-2 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-xs text-[#553E53]">{lead.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#B6CBDE]/25 text-[9px] font-semibold text-[#553E53] border border-[#553E53]/10">
                          {lead.source}
                        </span>
                      </div>

                      <div className="text-[10px] text-[#553E53]/70 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#553E53]/60" />
                        <span>{lead.phone}</span>
                      </div>

                      {lead.primaryConcern && (
                        <p className="text-[11px] text-[#553E53]/90 line-clamp-2 bg-white p-1.5 rounded-lg border border-[#553E53]/10">
                          {lead.primaryConcern}
                        </p>
                      )}

                      {/* Tags */}
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {lead.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-[#B6CBDE]/30 text-[#553E53] text-[9px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Status Selector Dropdown */}
                      <div className="pt-2 border-t border-[#553E53]/10 flex justify-between items-center text-[10px]">
                        <span className="text-[#553E53]/60">Move to:</span>
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                          className="bg-white border border-[#553E53]/15 rounded px-1.5 py-0.5 text-[10px] text-[#553E53] focus:outline-none"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-[#553E53]/40 text-[11px]">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-[#553E53]/10 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-[#553E53]">
            <thead className="bg-[#F5F6F0] text-[#553E53]/70 border-b border-[#553E53]/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Patient Name</th>
                <th className="p-3.5">Phone Number</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Primary Concern</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#553E53]/10">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#F5F6F0]/50 transition-colors">
                  <td className="p-3.5 font-bold text-[#553E53]">{lead.name}</td>
                  <td className="p-3.5 font-mono text-[#553E53]/70">{lead.phone}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#B6CBDE]/25 text-[10px] font-semibold text-[#553E53] border border-[#553E53]/10">
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#553E53]/80 max-w-xs truncate">{lead.primaryConcern || '—'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#B6CBDE]/30 text-[#553E53] text-[10px] font-bold border border-[#553E53]/20">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                      className="bg-[#F5F6F0] border border-[#553E53]/15 rounded-lg px-2 py-1 text-xs text-[#553E53]"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#553E53]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-[#553E53]/15 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#553E53]">Create New Lead</h3>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                />
              </div>

              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs font-mono focus:outline-none focus:border-[#553E53]"
                />
              </div>

              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Primary Concern / Treatment Inquiry</label>
                <input
                  type="text"
                  value={newConcern}
                  onChange={(e) => setNewConcern(e.target.value)}
                  placeholder="e.g. HydraFacial, Acne Scar Treatment"
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                />
              </div>

              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Inquiry Source</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as any)}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                >
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="WEBSITE">Website</option>
                  <option value="WALK_IN">Walk-in</option>
                  <option value="INSTAGRAM">Instagram</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F6F0] text-[#553E53] font-medium text-xs hover:bg-[#e8ecea] border border-[#553E53]/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#553E53] text-[#F5F6F0] font-medium text-xs hover:bg-[#433041]"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
