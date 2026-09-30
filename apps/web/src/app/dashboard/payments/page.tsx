'use client';

import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Receipt,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RazorpayOrder, Lead } from '@dermo/types';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<RazorpayOrder[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Form State
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [amount, setAmount] = useState(500);
  const [description, setDescription] = useState('Consultation Holding Deposit');
  const [createdOrder, setCreatedOrder] = useState<RazorpayOrder | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [payData, leadData] = await Promise.all([api.getPayments(), api.getLeads()]);
      setPayments(payData);
      setLeads(leadData);
      if (leadData.length > 0) setSelectedLeadId(leadData[0].id);
    } catch (err) {
      console.error('Failed to load payments:', err);
    }
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !amount) return;

    try {
      const order = await api.createPaymentOrder({
        leadId: selectedLeadId,
        amount: Number(amount),
        description,
      });
      setCreatedOrder(order);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalCaptured = payments
    .filter((p) => p.status === 'CAPTURED')
    .reduce((sum, p) => sum + p.amount / 100, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#553E53] flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#553E53]" />
            <span>Razorpay Payment Gateway & Deposits</span>
          </h1>
          <p className="text-xs text-[#553E53]/70 mt-1">
            Automated advance consultation holding deposits and treatment payment verification.
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedOrder(null);
            setShowOrderModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-medium text-xs flex items-center gap-2 shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4 text-[#B6CBDE]" />
          <span>Generate Razorpay Link</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[#553E53]/10 shadow-sm space-y-1">
          <span className="text-xs text-[#553E53]/70">Total Captured Revenue</span>
          <div className="text-2xl font-bold font-mono text-[#553E53]">
            {formatCurrency(totalCaptured)}
          </div>
          <div className="text-[10px] text-[#553E53]/50">Collected through Razorpay UPI & Cards</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#553E53]/10 shadow-sm space-y-1">
          <span className="text-xs text-[#553E53]/70">Total Orders Generated</span>
          <div className="text-2xl font-bold font-mono text-[#553E53]">{payments.length}</div>
          <div className="text-[10px] text-[#553E53]/50">Includes WhatsApp holding links</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#553E53]/10 shadow-sm space-y-1">
          <span className="text-xs text-[#553E53]/70">Razorpay Gateway Status</span>
          <div className="text-sm font-bold text-[#553E53] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#553E53] animate-pulse" />
            <span>HMAC Verification Active</span>
          </div>
          <div className="text-[10px] text-[#553E53]/50">Instant webhook reconciliation</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#553E53]/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#553E53]/10 bg-[#F5F6F0]/60 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-[#553E53]">Payment Orders & Audit Trail</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#553E53]">
            <thead className="bg-[#F5F6F0] text-[#553E53]/70 border-b border-[#553E53]/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Order ID & Receipt</th>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#553E53]/10">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-[#F5F6F0]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono text-[#553E53] font-semibold">{pay.orderId}</div>
                    <div className="text-[10px] text-[#553E53]/60 font-mono">{pay.receipt}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-[#553E53]">{pay.customerName}</div>
                    <div className="text-[10px] text-[#553E53]/60 font-mono">{pay.customerPhone}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-[#553E53]">
                    {formatCurrency(pay.amount / 100, pay.currency)}
                  </td>
                  <td className="p-3.5 text-[#553E53]/80 text-xs">{pay.description}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        pay.status === 'CAPTURED'
                          ? 'bg-[#B6CBDE]/35 text-[#553E53] border-[#553E53]/25'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[#553E53]/70 text-[11px]">
                    {formatDate(pay.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-[#553E53]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-[#553E53]/15 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#553E53]">Generate Razorpay Payment Order</h3>

            {createdOrder ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/20 space-y-2">
                  <div className="flex items-center gap-2 text-[#553E53] font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#553E53]" />
                    <span>Order Created Successfully</span>
                  </div>
                  <div className="text-xs text-[#553E53]/80">
                    Order ID: <strong className="font-mono text-[#553E53]">{createdOrder.orderId}</strong>
                  </div>
                  <div className="text-xs text-[#553E53]/80">
                    Amount: <strong className="font-mono text-[#553E53]">₹{createdOrder.amount / 100}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#553E53] text-[#F5F6F0] font-medium text-xs hover:bg-[#433041]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">Select Patient *</label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">Deposit Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs font-mono focus:outline-none focus:border-[#553E53]"
                  />
                </div>

                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">Payment Purpose</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#F5F6F0] text-[#553E53] font-medium text-xs border border-[#553E53]/15 hover:bg-[#e8ecea]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#553E53] text-[#F5F6F0] font-medium text-xs hover:bg-[#433041]"
                  >
                    Create Razorpay Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
