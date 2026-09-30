'use client';

import React from 'react';
import { pricingTiers } from '@/config/pricing';
import { IconCheck } from '@/components/ui/icons';
import { useInView } from '@/hooks/use-in-view';

interface PricingProps {
  onBookDemo: () => void;
}

export function Pricing({ onBookDemo }: PricingProps) {
  const { ref, isInView } = useInView();

  return (
    <section id="pricing" className="py-20 border-b border-[#553E53]/12" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#4B624A] font-bold">
            Predictable Investment
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight">
            Simple Pricing for Growing Clinics.
          </h2>
          <p className="text-[#553E53]/75 text-sm sm:text-base font-medium">
            Transparent monthly pricing with managed onboarding. No hidden implementation fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`p-8 rounded-3xl bg-[#F5F6F0] flex flex-col justify-between space-y-6 relative shadow-sm ${
                tier.popular
                  ? 'border-2 border-[#553E53] shadow-md'
                  : 'border border-[#553E53]/20'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#553E53] text-[#F5F6F0] text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="space-y-4 pt-1">
                <div>
                  <h3 className="text-lg font-bold text-[#553E53]">{tier.name}</h3>
                  <p className="text-xs text-[#553E53]/70 font-medium mt-1">
                    {tier.description}
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#553E53]">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-xs text-[#553E53]/60 font-semibold">{tier.period}</span>
                  )}
                </div>
                <ul className="space-y-2.5 text-xs text-[#553E53]/85 font-medium border-t border-[#553E53]/10 pt-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <IconCheck className="w-4 h-4 text-[#4B624A] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onBookDemo}
                className={`w-full py-3.5 rounded-xl font-bold text-xs transition-colors shadow-xs ${
                  tier.popular
                    ? 'bg-[#553E53] hover:bg-[#4B624A] text-[#F5F6F0]'
                    : 'bg-[#F5F6F0] hover:bg-[#B6CBDE]/30 border border-[#553E53]/25 text-[#553E53]'
                }`}
              >
                {tier.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
