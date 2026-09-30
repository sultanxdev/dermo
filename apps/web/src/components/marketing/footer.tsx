'use client';

import React from 'react';
import Link from 'next/link';
import { footerNav } from '@/config/navigation';
import { DermoLogo } from '@/components/ui/icons';

type NavItem = { title: string; href?: string };

const linkClass =
  'text-[#553E53]/75 hover:text-[#553E53] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B624A] rounded-sm';

export function Footer() {
  const year = new Date().getFullYear();
  const product = footerNav.product as NavItem[];
  const legal = footerNav.legal as NavItem[];

  return (
    <footer className="bg-[#F5F6F0] border-t border-[#553E53]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-4 max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Dermo.ai home">
              <span className="w-8 h-8 rounded-lg bg-white border border-[#553E53]/15 p-1.5 flex items-center justify-center">
                <DermoLogo className="w-full h-full" />
              </span>
              <span className="font-bold text-lg text-[#553E53]">
                Dermo<span className="text-[#4B624A]">.ai</span>
              </span>
            </Link>
            <p className="text-sm text-[#553E53]/70 leading-relaxed">
              The AI employee for modern clinics. Answers patients on WhatsApp 24/7, with your team in control.
            </p>
          </div>

          {/* Product */}
          <nav aria-label="Product" className="space-y-4">
            <h2 className="text-sm font-bold text-[#553E53]">Product</h2>
            <ul className="space-y-2.5 text-sm">
              {product.map((item) => (
                <li key={item.title}>
                  <a href={item.href ?? '#'} className={linkClass}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal" className="space-y-4">
            <h2 className="text-sm font-bold text-[#553E53]">Legal</h2>
            <ul className="space-y-2.5 text-sm">
              {legal.map((item) => (
                <li key={item.title}>
                  <Link href={item.href ?? '#'} className={linkClass}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account */}
          <nav aria-label="Account" className="space-y-4">
            <h2 className="text-sm font-bold text-[#553E53]">Existing clinics</h2>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-[#553E53]/25 text-sm font-semibold text-[#553E53] hover:bg-[#553E53] hover:text-[#F5F6F0] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B624A]"
            >
              Clinic login
            </Link>
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-[#553E53]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#553E53]/60">
          <p>© {year} Dermo.ai. All rights reserved.</p>
          <p>Built for clinics, with human oversight on every conversation.</p>
        </div>
      </div>
    </footer>
  );
}