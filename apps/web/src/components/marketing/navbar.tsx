'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { marketingNav } from '@/config/navigation';
import { IconArrowRight, IconX, IconMenu, DermoLogo } from '@/components/ui/icons';

interface NavbarProps {
  onBookDemo: () => void;
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#553E53] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F6F0]';

export function Navbar({ onBookDemo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#553E53]/10 bg-[#F5F6F0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <Link href="/" className={`group flex items-center gap-2.5 rounded-lg ${focusRing}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#553E53]/15 bg-white p-1 shadow-sm transition-transform group-hover:scale-105">
            <DermoLogo className="h-full w-full" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#553E53]">
            Dermoai<span className="text-[#4B624A]"></span>
          </span>
        </Link>

        {/* Center Navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-7 text-sm font-semibold text-[#553E53]/80 md:flex">
          {marketingNav.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className={`rounded py-1 transition-colors hover:text-[#553E53] ${focusRing}`}
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Right Navigation CTAs */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-[#553E53]/25 text-sm font-semibold text-[#553E53] hover:bg-[#4B624A] hover:text-[#F5F6F0] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B624A]"
          >
            Clinic login
          </Link>
          <button
            type="button"
            onClick={onBookDemo}
            className={`group inline-flex items-center gap-2 rounded-xl bg-[#553E53] px-4 py-2 text-sm font-semibold text-[#F5F6F0] shadow-sm transition-all hover:bg-[#4B624A] active:scale-95 ${focusRing}`}
          >
            <span>Book a Demo</span>
            <IconArrowRight className="h-3.5 w-3.5 text-[#B6CBDE] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onBookDemo}
            className={`rounded-lg bg-[#553E53] px-3 py-1.5 text-xs font-semibold text-[#F5F6F0] active:scale-95 ${focusRing}`}
          >
            Book Demo
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`rounded-lg p-1.5 text-[#553E53] hover:bg-[#553E53]/10 ${focusRing}`}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <IconX className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="space-y-1 border-t border-[#553E53]/10 bg-[#F5F6F0] px-4 py-4 text-sm font-semibold md:hidden"
        >
          {marketingNav.map((item) => (
            <a
              key={item.title}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-2 py-2.5 text-[#553E53]/80 hover:bg-[#553E53]/5 hover:text-[#553E53]"
            >
              {item.title}
            </a>
          ))}
          <div className="mt-2 border-t border-[#553E53]/10 pt-3">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-2 py-2.5 text-[#553E53] hover:bg-[#553E53]/5"
            >
              Clinic Login
              <IconArrowRight className="h-4 w-4 text-[#553E53]/60" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}