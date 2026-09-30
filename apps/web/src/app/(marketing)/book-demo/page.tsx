'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DemoForm } from '@/features/demo/components/demo-form';
import { DemoModal } from '@/features/demo/components/demo-modal';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { IconCalendar } from '@/components/ui/icons';

export default function BookDemoPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar onBookDemo={() => setModalOpen(true)} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="mb-8 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6CBDE]/30 border border-[#553E53]/10 text-[#4B624A] text-xs font-semibold tracking-wide">
            <IconCalendar className="w-3.5 h-3.5" />
            <span>Managed Clinic Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#553E53]">
            Book a Clinic Walkthrough
          </h1>
          <p className="text-sm sm:text-base text-[#553E53]/75 max-w-xl mx-auto font-medium">
            See how Dermo automates WhatsApp patient inquiries, real-time doctor availability, and deposit collection for your clinic.
          </p>
        </div>

        <div className="bg-[#F5F6F0] rounded-3xl border border-[#553E53]/15 shadow-sm p-6 sm:p-10 relative overflow-hidden">
          <DemoForm />
        </div>
      </main>
      <Footer />
      <DemoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
