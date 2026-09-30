'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { marketingNav } from '@/config/navigation';
import { IconArrowRight, IconX, IconMenu, DermoLogo } from '@/components/ui/icons';

interface NavbarProps {
  onBookDemo: () => void;
}

export function Navbar({ onBookDemo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#553E53]/10 bg-[#F5F6F0]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#553E53]/15 shadow-xs p-1 flex items-center justify-center transition-transform group-hover:scale-105">
            <DermoLogo className="w-full h-full" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#553E53]">
              Dermo<span className="text-[#4B624A]">.ai</span>
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#553E53]/80">
          {marketingNav.map((item) => (
            <a key={item.title} href={item.href} className="hover:text-[#553E53] transition-colors py-1">
              {item.title}
            </a>
          ))}
        </nav>

        {/* Right Navigation CTAs */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-[#553E53]/80 hover:text-[#553E53] transition-colors py-1.5 px-2"
          >
            Clinic Login
          </Link>
          <button
            onClick={onBookDemo}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0] font-semibold text-xs transition-all shadow-sm active:scale-95"
          >
            <span>Book a Demo</span>
            <IconArrowRight className="w-3.5 h-3.5 text-[#B6CBDE] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onBookDemo}
            className="px-3 py-1.5 rounded-lg bg-[#553E53] text-[#F5F6F0] font-semibold text-xs"
          >
            Book Demo
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-[#553E53] hover:bg-[#553E53]/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#553E53]/10 bg-[#F5F6F0] px-4 py-4 space-y-3 text-xs font-semibold">
          {marketingNav.map((item) => (
            <a
              key={item.title}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#553E53]/80 hover:text-[#553E53]"
            >
              {item.title}
            </a>
          ))}
          <div className="pt-2 border-t border-[#553E53]/10 flex items-center justify-between">
            <Link
              href="/auth/login"
              className="text-xs font-semibold text-[#553E53] py-1"
            >
              Clinic Login →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
