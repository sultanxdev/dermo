'use client';

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Plus,
  Tag,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Service, ServiceCategory } from '@dermo/types';

const CATEGORIES: { id: ServiceCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Treatments' },
  { id: 'FACIAL_AESTHETICS', label: 'Facial Aesthetics' },
  { id: 'LASER_TREATMENTS', label: 'Medical Lasers' },
  { id: 'HAIR_RESTORATION', label: 'Hair Restoration' },
  { id: 'CLINICAL_DERMATOLOGY', label: 'Clinical Dermatology' },
  { id: 'ANTI_AGING', label: 'Anti-Aging & Injectables' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('FACIAL_AESTHETICS');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(3500);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [depositRequired, setDepositRequired] = useState(true);
  const [depositAmount, setDepositAmount] = useState(500);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  }

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    try {
      await api.createService({
        name,
        category,
        description,
        benefits: ['Doctor Consulted', 'Standard Clinical Protocol'],
        price: Number(price),
        durationMinutes: Number(durationMinutes),
        depositRequired,
        depositAmount: depositRequired ? Number(depositAmount) : 0,
        bookingEnabled: true,
        requiresConsultationFirst: false,
        status: 'ACTIVE',
      });
      setShowAddModal(false);
      setName('');
      setDescription('');
      await loadServices();
    } catch (err) {
      console.error('Failed to create service:', err);
    }
  };

  const filtered = selectedCategory === 'ALL'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#553E53] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#553E53]" />
            <span>Treatments & Pricing Catalog</span>
          </h1>
          <p className="text-xs text-[#553E53]/70 mt-1">
            Grounded clinic procedures, duration, pricing, and Razorpay advance deposit rules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-medium text-xs flex items-center gap-2 shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4 text-[#B6CBDE]" />
          <span>Add New Treatment</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#553E53] text-[#F5F6F0]'
                : 'bg-white border border-[#553E53]/15 text-[#553E53]/70 hover:text-[#553E53]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl p-5 border border-[#553E53]/10 shadow-sm space-y-4 hover:border-[#553E53]/25 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-[#553E53]">{service.name}</h3>
                <span className="px-2 py-0.5 rounded bg-[#B6CBDE]/30 text-[#553E53] text-[10px] font-bold border border-[#553E53]/20 whitespace-nowrap">
                  {service.category.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-[#553E53]/80 leading-relaxed">
                {service.description}
              </p>

              {/* Benefits */}
              {service.benefits && service.benefits.length > 0 && (
                <div className="pt-2 space-y-1">
                  {service.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#553E53]/70">
                      <CheckCircle2 className="w-3 h-3 text-[#553E53]" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#553E53]/10 flex items-center justify-between">
              <div>
                <div className="text-lg font-extrabold text-[#553E53] font-mono">
                  {formatCurrency(service.price)}
                </div>
                <div className="text-[10px] text-[#553E53]/60 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#553E53]/60" />
                  <span>{service.durationMinutes} mins session</span>
                </div>
              </div>

              {service.depositRequired ? (
                <span className="px-2 py-1 rounded-lg bg-[#553E53] text-[#F5F6F0] text-[10px] font-medium flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-[#B6CBDE]" />
                  <span>Deposit: ₹{service.depositAmount || 500}</span>
                </span>
              ) : (
                <span className="text-[10px] text-[#553E53]/50">No deposit</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Treatment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#553E53]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-[#553E53]/15 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#553E53]">Add Clinic Treatment</h3>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Treatment Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q-Switch Nd:YAG Laser"
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                />
              </div>

              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                >
                  <option value="FACIAL_AESTHETICS">Facial Aesthetics</option>
                  <option value="LASER_TREATMENTS">Medical Lasers</option>
                  <option value="HAIR_RESTORATION">Hair Restoration</option>
                  <option value="CLINICAL_DERMATOLOGY">Clinical Dermatology</option>
                  <option value="ANTI_AGING">Anti-Aging & Injectables</option>
                </select>
              </div>

              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Procedure summary and clinical benefits..."
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl p-2.5 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">Duration (Mins) *</label>
                  <input
                    type="number"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="depositToggle"
                  checked={depositRequired}
                  onChange={(e) => setDepositRequired(e.target.checked)}
                  className="rounded border-[#553E53]/20 text-[#553E53] focus:ring-[#553E53]"
                />
                <label htmlFor="depositToggle" className="text-[#553E53] text-xs font-medium">
                  Require Razorpay advance booking deposit (₹500)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F6F0] text-[#553E53] font-medium text-xs border border-[#553E53]/15 hover:bg-[#e8ecea]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#553E53] text-[#F5F6F0] font-medium text-xs hover:bg-[#433041]"
                >
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
