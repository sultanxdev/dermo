'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/marketing/navbar';
import { Features } from '@/components/marketing/features';
import { CapabilityStrip } from '@/components/marketing/capability-strip';
import { Workflow } from '@/components/marketing/workflow';
import { FinalCTA } from '@/components/marketing/final-cta';
import { Footer } from '@/components/marketing/footer';
import { DemoModal } from '@/features/demo/components/demo-modal';

export default function FeaturesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar onBookDemo={() => setModalOpen(true)} />
      <main className="pt-8">
        <Features />
        <CapabilityStrip />
        <Workflow />
        <FinalCTA onBookDemo={() => setModalOpen(true)} />
      </main>
      <Footer />
      <DemoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
