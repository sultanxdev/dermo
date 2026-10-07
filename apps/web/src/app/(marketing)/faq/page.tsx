'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/marketing/navbar';
import { FAQ } from '@/components/marketing/faq';
import { FinalCTA } from '@/components/marketing/final-cta';
import { Footer } from '@/components/marketing/footer';
import { DemoModal } from '@/features/demo/components/demo-modal';

export default function FAQPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar onBookDemo={() => setModalOpen(true)} />
      <main className="pt-8">
        <FAQ />
        <FinalCTA onBookDemo={() => setModalOpen(true)} />
      </main>
      <Footer />
      <DemoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
