'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Stethoscope,
  Filter,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { Appointment, Doctor, Service, Lead } from '@dermo/types';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Filter State
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Modals
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<Appointment | null>(null);

  // New Booking State
  const [bookLeadId, setBookLeadId] = useState('');
  const [bookDoctorId, setBookDoctorId] = useState('');
  const [bookServiceId, setBookServiceId] = useState('');
  const [bookDate, setBookDate] = useState(selectedDate);
  const [bookTime, setBookTime] = useState('');
  const [bookNotes, setBookNotes] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Reschedule State
  const [reschedDate, setReschedDate] = useState(selectedDate);
  const [reschedTime, setReschedTime] = useState('');
  const [reschedReason, setReschedReason] = useState('');

  // Cancel State
  const [cancelReason, setCancelReason] = useState('Patient requested cancellation');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      loadAvailability(selectedDoctorId, selectedDate);
    }
  }, [selectedDoctorId, selectedDate]);

  async function loadInitialData() {
    try {
      const [apts, docs, svcs, lds] = await Promise.all([
        api.getAppointments(),
        api.getDoctors(),
        api.getServices(),
        api.getLeads(),
      ]);
      setAppointments(apts);
      setDoctors(docs);
      setServices(svcs);
      setLeads(lds);

      if (docs.length > 0) {
        setSelectedDoctorId(docs[0].id);
        setBookDoctorId(docs[0].id);
      }
      if (svcs.length > 0) setBookServiceId(svcs[0].id);
      if (lds.length > 0) setBookLeadId(lds[0].id);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }

  async function loadAvailability(doctorId: string, date: string) {
    setLoadingSlots(true);
    try {
      const res = await api.getAppointmentAvailability({ date, doctorId });
      setAvailabilitySlots(res?.slots || []);
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  }

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    if (!bookLeadId || !bookDoctorId || !bookServiceId || !bookDate || !bookTime) {
      setBookingError('Please fill in all required fields.');
      return;
    }

    try {
      await api.createAppointment({
        leadId: bookLeadId,
        doctorId: bookDoctorId,
        serviceId: bookServiceId,
        date: bookDate,
        startTime: bookTime,
        notes: bookNotes,
        bookedVia: 'DASHBOARD_STAFF',
      });
      setShowBookingModal(false);
      const updated = await api.getAppointments();
      setAppointments(updated);
      loadAvailability(selectedDoctorId, selectedDate);
    } catch (err: any) {
      setBookingError(err.message || 'Booking conflict or error.');
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRescheduleModal || !reschedDate || !reschedTime) return;

    try {
      await api.rescheduleAppointment(showRescheduleModal.id, {
        date: reschedDate,
        startTime: reschedTime,
        reason: reschedReason,
      });
      setShowRescheduleModal(null);
      const updated = await api.getAppointments();
      setAppointments(updated);
      loadAvailability(selectedDoctorId, selectedDate);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCancelModal || !cancelReason) return;

    try {
      await api.cancelAppointment(showCancelModal.id, cancelReason);
      setShowCancelModal(null);
      const updated = await api.getAppointments();
      setAppointments(updated);
      loadAvailability(selectedDoctorId, selectedDate);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#553E53] flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#553E53]" />
            <span>Doctor Appointments & Slot Manager</span>
          </h1>
          <p className="text-xs text-[#553E53]/70 mt-1">
            Check real-time shift availability, doctor breaks, and atomic slot reservations.
          </p>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-medium text-xs flex items-center gap-2 shadow-sm transition-all self-start"
        >
          <Plus className="w-4 h-4 text-[#B6CBDE]" />
          <span>Book In-Clinic Slot</span>
        </button>
      </div>

      {/* Live Availability Inspector Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#553E53]/10 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#553E53]/10">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#553E53]" />
            <h3 className="font-serif font-bold text-sm text-[#553E53]">Live Slot Availability Inspector</h3>
          </div>

          {/* Doctor & Date Pickers */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-1.5">
              <Stethoscope className="w-4 h-4 text-[#553E53]" />
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="bg-transparent text-[#553E53] font-medium focus:outline-none"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id} className="bg-white text-[#553E53]">
                    {d.name} ({d.title})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-1.5">
              <CalendarIcon className="w-4 h-4 text-[#553E53]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-[#553E53] font-medium focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Slot Grid */}
        {loadingSlots ? (
          <div className="text-center py-8 text-xs text-[#553E53]/70 animate-pulse font-medium">
            Calculating real-time doctor shifts and break intervals...
          </div>
        ) : availabilitySlots.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
            {availabilitySlots.map((slot, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex flex-col justify-center transition-all ${
                  slot.available
                    ? 'bg-[#B6CBDE]/30 border-[#553E53]/25 text-[#553E53] hover:scale-105'
                    : 'bg-[#F5F6F0] border-[#553E53]/10 text-[#553E53]/40'
                }`}
              >
                <div className="font-mono">{slot.startTime}</div>
                <div className="text-[9px] mt-0.5 font-normal">
                  {slot.available ? 'Available' : slot.reason || 'Booked'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#553E53]/60">
            Doctor is not working on this selected day.
          </div>
        )}
      </div>

      {/* Confirmed Appointments Table */}
      <div className="bg-white rounded-2xl border border-[#553E53]/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#553E53]/10 bg-[#F5F6F0]/60 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-[#553E53]">All Clinic Appointments ({appointments.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#553E53]">
            <thead className="bg-[#F5F6F0] text-[#553E53]/70 border-b border-[#553E53]/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Doctor</th>
                <th className="p-3.5">Treatment</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Deposit</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#553E53]/10">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#F5F6F0]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-[#553E53]">{apt.leadName}</div>
                    <div className="text-[10px] text-[#553E53]/60 font-mono">{apt.leadPhone}</div>
                  </td>
                  <td className="p-3.5 text-[#553E53] font-medium">{apt.doctorName}</td>
                  <td className="p-3.5 text-[#553E53]/90">{apt.serviceName}</td>
                  <td className="p-3.5">
                    <div className="font-mono text-[#553E53] font-medium">{formatDate(apt.date)}</div>
                    <div className="text-[10px] text-[#553E53]/60 font-mono">{apt.startTime} – {apt.endTime}</div>
                  </td>
                  <td className="p-3.5">
                    {apt.paymentStatus === 'PAID' ? (
                      <span className="px-2 py-0.5 rounded bg-[#553E53] text-[#F5F6F0] text-[10px] font-bold">
                        ₹{apt.depositPaid} (Razorpay)
                      </span>
                    ) : (
                      <span className="text-[#553E53]/50 text-[10px]">Unpaid</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-[#B6CBDE]/35 text-[#553E53] border-[#553E53]/25'
                          : apt.status === 'BOOKED'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : apt.status === 'RESCHEDULED'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {apt.status !== 'CANCELLED' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowRescheduleModal(apt);
                            setReschedDate(apt.date);
                            setReschedTime(apt.startTime);
                          }}
                          className="text-[11px] text-[#553E53] hover:underline font-semibold"
                        >
                          Reschedule
                        </button>
                        <span className="text-[#553E53]/30">|</span>
                        <button
                          onClick={() => setShowCancelModal(apt)}
                          className="text-[11px] text-rose-600 hover:underline font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-[#553E53]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full border border-[#553E53]/15 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#553E53]">Book In-Clinic Appointment</h3>
            {bookingError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{bookingError}</span>
              </div>
            )}
            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Select Patient *</label>
                <select
                  value={bookLeadId}
                  onChange={(e) => setBookLeadId(e.target.value)}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">Doctor *</label>
                  <select
                    value={bookDoctorId}
                    onChange={(e) => setBookDoctorId(e.target.value)}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">Treatment / Procedure *</label>
                  <select
                    value={bookServiceId}
                    onChange={(e) => setBookServiceId(e.target.value)}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (₹{s.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                  />
                </div>
                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">Slot Time (HH:mm) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11:00"
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs font-mono focus:outline-none focus:border-[#553E53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Clinical Notes</label>
                <textarea
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  placeholder="Special instructions or initial complaints..."
                  rows={2}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl p-2.5 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F6F0] text-[#553E53] font-medium text-xs hover:bg-[#e8ecea] border border-[#553E53]/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#553E53] text-[#F5F6F0] font-medium text-xs hover:bg-[#433041]"
                >
                  Confirm & Reserve Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-[#553E53]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-[#553E53]/15 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#553E53]">Reschedule Appointment</h3>
            <p className="text-xs text-[#553E53]/70">
              Rescheduling for <strong className="text-[#553E53]">{showRescheduleModal.leadName}</strong> with {showRescheduleModal.doctorName}.
            </p>
            <form onSubmit={handleReschedule} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">New Date *</label>
                  <input
                    type="date"
                    required
                    value={reschedDate}
                    onChange={(e) => setReschedDate(e.target.value)}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#553E53]/80 font-medium mb-1">New Start Time *</label>
                  <input
                    type="text"
                    required
                    value={reschedTime}
                    onChange={(e) => setReschedTime(e.target.value)}
                    className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Reason</label>
                <input
                  type="text"
                  value={reschedReason}
                  onChange={(e) => setReschedReason(e.target.value)}
                  placeholder="Patient requested different timing"
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#F5F6F0] text-[#553E53] font-medium text-xs border border-[#553E53]/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#553E53] text-[#F5F6F0] font-medium text-xs hover:bg-[#433041]"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-[#553E53]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-[#553E53]/15 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-rose-600">Cancel Appointment</h3>
            <p className="text-xs text-[#553E53]/80">
              Are you sure you want to cancel the booking for <strong className="text-[#553E53]">{showCancelModal.leadName}</strong> on {showCancelModal.date} at {showCancelModal.startTime}?
            </p>
            <form onSubmit={handleCancel} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Cancellation Reason *</label>
                <input
                  type="text"
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#F5F6F0] text-[#553E53] font-medium text-xs border border-[#553E53]/15"
                >
                  Keep Slot
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-medium text-xs hover:bg-rose-500"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
