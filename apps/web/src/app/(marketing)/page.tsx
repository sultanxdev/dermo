'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/marketing/navbar';
import { Hero } from '@/components/marketing/hero';
import { CapabilityStrip } from '@/components/marketing/capability-strip';
import { Problem } from '@/components/marketing/problem';
import { Workflow } from '@/components/marketing/workflow';
import { Features } from '@/components/marketing/features';
import { DashboardPreview } from '@/components/marketing/dashboard-preview';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { ClinicTypes } from '@/components/marketing/clinic-types';
import { Pricing } from '@/components/marketing/pricing';
import { FAQ } from '@/components/marketing/faq';
import { FinalCTA } from '@/components/marketing/final-cta';
import { Footer } from '@/components/marketing/footer';
import { DemoModal } from '@/features/demo/components/demo-modal';

export default function MarketingPage() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <>
      <Navbar onBookDemo={() => setShowDemoModal(true)} />
      <main>
        <Hero onBookDemo={() => setShowDemoModal(true)} />
        <CapabilityStrip />
        <Problem />
        <Workflow />
        <Features />
        <DashboardPreview />
        <HowItWorks onBookDemo={() => setShowDemoModal(true)} />
        <ClinicTypes />
        <Pricing onBookDemo={() => setShowDemoModal(true)} />
        <FAQ />
        <FinalCTA onBookDemo={() => setShowDemoModal(true)} />
      </main>
      <Footer />
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </>
  );
}
