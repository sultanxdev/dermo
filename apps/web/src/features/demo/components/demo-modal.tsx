'use client';

import React from 'react';
import { DemoModalProps } from '../types';
import { DemoForm } from './demo-form';
import { IconX } from '@/components/ui/icons';

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#553E53]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#F5F6F0] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#553E53]/20 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#B6CBDE]/30 text-[#553E53]/70 hover:text-[#553E53] transition-colors"
          aria-label="Close modal"
        >
          <IconX className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B6CBDE]/30 text-[#4B624A] text-[10px] font-bold uppercase tracking-wider mb-2">
              Managed Clinic Onboarding
            </div>
            <h3 className="text-xl font-extrabold text-[#553E53]">Book a Clinic Demo</h3>
            <p className="text-xs text-[#553E53]/70 mt-1 font-medium">
              Discuss your clinic workflow and see Dermo handle real WhatsApp patient inquiries.
            </p>
          </div>

          <DemoForm isModal onSuccess={() => {}} />
        </div>
      </div>
    </div>
  );
}
