'use client';

import React from 'react';
import { dashboardNav } from '@/config/navigation';
import { useInView } from '@/hooks/use-in-view';

export function DashboardPreview() {
  const { ref, isInView } = useInView();

  return (
    <section id="dashboard" className="py-20 border-b border-[#553E53]/12" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
            Operations Control
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
            Your Clinic. One Operational Dashboard.
          </h2>
          <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
            A clean, functional SaaS portal built for clinic owners and reception staff to monitor patient conversations, confirmed bookings, and revenue in real time.
          </p>
        </div>

        {/* Realistic SaaS Dashboard Mockup */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#F5F6F0] border-2 border-[#553E53]/20 shadow-md overflow-hidden text-xs">
          {/* Window bar */}
          <div className="bg-[#553E53] px-4 py-3 flex items-center justify-between text-[#F5F6F0] border-b border-[#553E53]/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B6CBDE]/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#B6CBDE]/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#B6CBDE]/40" />
              <span className="text-[11px] font-bold text-[#F5F6F0] ml-2">
                Dermo Clinic Management — Nova Skin Clinic
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#B6CBDE]">
              <span className="w-2 h-2 rounded-full bg-[#4B624A]" />
              <span>WhatsApp Live</span>
            </div>
          </div>

          <div className="grid md:grid-cols-12 min-h-[460px]">
            {/* Sidebar Navigation */}
            <div className="md:col-span-3 bg-[#F5F6F0] border-r border-[#553E53]/15 p-3 space-y-1 font-semibold text-[#553E53]/80">
              <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-[#553E53]/50 font-bold">
                Navigation
              </div>
              {dashboardNav.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs ${
                    item.title === 'Overview'
                      ? 'bg-[#553E53] text-[#F5F6F0] font-bold'
                      : 'hover:bg-[#B6CBDE]/25 text-[#553E53]'
                  }`}
                >
                  <span>{item.title}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                        item.title === 'Overview'
                          ? 'bg-[#4B624A] text-[#F5F6F0]'
                          : 'bg-[#B6CBDE]/50 text-[#553E53]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Main Dashboard Panel */}
            <div className="md:col-span-9 p-5 sm:p-6 space-y-5 bg-[#F5F6F0]">
              {/* Metric Summary Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#553E53]/70">Today&apos;s Inquiries</span>
                  <div className="text-2xl font-extrabold text-[#553E53]">28 Active</div>
                  <span className="text-[10px] text-[#4B624A] font-semibold">24 handled by Dermo AI</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#553E53]/70">Appointments Booked</span>
                  <div className="text-2xl font-extrabold text-[#553E53]">14 Confirmed</div>
                  <span className="text-[10px] text-[#4B624A] font-semibold">Tomorrow schedule locked</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#B6CBDE]/20 border border-[#553E53]/15 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#553E53]/70">Deposits Collected</span>
                  <div className="text-2xl font-extrabold text-[#553E53]">₹7,000</div>
                  <span className="text-[10px] text-[#4B624A] font-semibold">14 deposits @ ₹500 verified</span>
                </div>
              </div>

              {/* Live Conversation Stream Table */}
              <div className="rounded-2xl border border-[#553E53]/15 bg-[#F5F6F0] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#553E53]/10 pb-2">
                  <span className="font-bold text-xs text-[#553E53]">Recent Patient Conversations</span>
                  <span className="text-[10px] text-[#553E53]/60 font-semibold">Real-Time Sync</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#B6CBDE]/20 border border-[#553E53]/10">
                    <div>
                      <div className="font-bold text-xs text-[#553E53]">Ananya V. (+91 98201 ••••)</div>
                      <div className="text-[11px] text-[#553E53]/70">HydraFacial with Dr. Priya Sharma · Tomorrow 11:00 AM</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#4B624A]/20 text-[#4B624A] text-[10px] font-bold">
                        Deposit Paid
                      </span>
                      <button className="px-2.5 py-1 rounded-lg bg-[#553E53] text-[#F5F6F0] text-[10px] font-semibold">
                        View
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10">
                    <div>
                      <div className="font-bold text-xs text-[#553E53]">Rahul M. (+91 98112 ••••)</div>
                      <div className="text-[11px] text-[#553E53]/70">Inquired about Acne Scar Laser pricing & post-care</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#B6CBDE]/40 text-[#553E53] text-[10px] font-bold">
                        AI Handled
                      </span>
                      <button className="px-2.5 py-1 rounded-lg bg-[#553E53] text-[#F5F6F0] text-[10px] font-semibold">
                        Take Over
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10">
                    <div>
                      <div className="font-bold text-xs text-[#553E53]">Kavita S. (+91 99341 ••••)</div>
                      <div className="text-[11px] text-[#553E53]/70">Requested consultation with senior dermatologist</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#553E53]/15 text-[#553E53] text-[10px] font-bold">
                        Human Takeover
                      </span>
                      <button className="px-2.5 py-1 rounded-lg bg-[#4B624A] text-[#F5F6F0] text-[10px] font-semibold">
                        Staff Chatting
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
