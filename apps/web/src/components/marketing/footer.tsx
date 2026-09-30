'use client';

import React from 'react';
import Link from 'next/link';
import { footerNav } from '@/config/navigation';

export function Footer() {
  return (
    <footer className="py-12 bg-[#F5F6F0] text-[#553E53]/70 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#553E53]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md overflow-hidden bg-[#553E53] p-1 flex items-center justify-center">
                <img src="/logo.png" alt="Dermo" className="w-full h-full object-contain filter brightness-110" />
              </div>
              <span className="font-bold text-base text-[#553E53]">Dermo.ai</span>
            </div>
            <p className="text-xs text-[#553E53]/70 font-medium">
              The AI Employee for Modern Clinics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold text-[#553E53]/80">
            {footerNav.product.map((item) => (
              <a key={item.title} href={item.href} className="hover:text-[#553E53] transition-colors">
                {item.title}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#553E53]/60 font-medium">
          <div className="flex items-center gap-4">
            <span>Existing Clinics:</span>
            <Link href="/auth/login" className="font-bold text-[#553E53] hover:underline">
              Clinic Login
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {footerNav.legal.map((item, idx) => (
              <React.Fragment key={item.title}>
                <span className="hover:text-[#553E53] cursor-pointer">{item.title}</span>
                {idx < footerNav.legal.length - 1 && <span>•</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
