'use client';

import React from 'react';
import Link from 'next/link';
import { footerNav } from '@/config/navigation';
import { DermoLogo } from '@/components/ui/icons';
import { TextHoverEffect } from '@/components/ui/text-hover-effect';

type NavItem = { title: string; href?: string };

const linkClass =
  'rounded-sm text-[#553E53]/70 transition-colors hover:text-[#553E53] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B624A]';

const headingClass = 'mb-4 text-sm font-semibold text-[#553E53]';

export function Footer() {
  const year = new Date().getFullYear();
  const product = footerNav.product as NavItem[];
  const legal = footerNav.legal as NavItem[];

  return (
    <footer className="overflow-hidden border-t border-[#553E53]/10 bg-[#F5F6F0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Link grid: 2 columns on mobile, 12-column grid from md up */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-12 pt-14 md:grid-cols-12 md:gap-x-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Dermo.ai home">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#553E53]/15 bg-white p-1.5">
                <DermoLogo className="h-full w-full" />
              </span>
              <span className="text-lg font-bold text-[#553E53]">
                Dermoai<span className="text-[#4B624A]"></span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#553E53]/70">
              The AI employee for modern clinics. Answers patients on WhatsApp 24/7, with your team in control.
            </p>
          </div>

          {/* Product */}
          <nav aria-label="Product" className="md:col-span-2 md:col-start-7">
            <h2 className={headingClass}>Product</h2>
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
          <nav aria-label="Legal" className="md:col-span-2">
            <h2 className={headingClass}>Legal</h2>
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
          <div className="col-span-2 md:col-span-2">
            <h2 className={headingClass}>Existing clinics</h2>
            <Link
              href="/auth/login"
              className="inline-flex h-10 items-center rounded-lg border border-[#553E53]/25 px-4 text-sm font-semibold text-[#553E53] transition-colors hover:bg-[#553E53] hover:text-[#F5F6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B624A]"
            >
              Clinic login
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-1.5 border-t border-[#553E53]/10 py-6 text-xs text-[#553E53]/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Dermoai. All rights reserved.</p>
          <p>Built for clinics, with human oversight on every conversation.</p>
        </div>

        {/* Wordmark: same left and right edges as everything above it */}
        <div className="select-none pb-6 pt-4 text-[#553E53] sm:pb-8">
          <TextHoverEffect text="DERMOAI" />
        </div>
      </div>
    </footer>
  );
}