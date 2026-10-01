'use client';

import React from 'react';
import { pricingTiers } from '@/config/pricing';
import { IconCheck } from '@/components/ui/icons';

interface PricingProps {
  onBookDemo: () => void;
}

export function Pricing({ onBookDemo }: PricingProps) {
  return (
    <section id="pricing" className="py-20 sm:py-24 border-b border-[#553E53]/10 bg-[#F5F6F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <p className="text-sm font-semibold text-[#4B624A]">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#553E53] tracking-tight text-balance">
            Simple monthly pricing for growing clinics
          </h2>
          <p className="text-base text-[#553E53]/75 leading-relaxed">
            Managed onboarding is included. No hidden implementation fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {pricingTiers.map((tier) => {
            const featured = !!tier.popular;
            return (
              <div
                key={tier.id}
                className={`relative flex flex-col p-8 rounded-3xl ${featured
                  ? 'bg-[#4B624A] text-[#F5F6F0] md:-my-3 md:py-11 shadow-lg'
                  : 'bg-white border border-[#553E53]/15 text-[#553E53]'
                  }`}
              >
                {featured && (
                  <span className="absolute top-5 right-5 px-3 py-1 rounded-full bg-[#B6CBDE] text-[#553E53] text-xs font-bold">
                    Most popular
                  </span>
                )}

                <h3 className="text-lg font-bold">{tier.name}</h3>
                <p className={`text-sm mt-1.5 leading-relaxed ${featured ? 'text-[#F5F6F0]/75' : 'text-[#553E53]/70'}`}>
                  {tier.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                  {tier.period && (
                    <span className={`text-sm font-medium ${featured ? 'text-[#F5F6F0]/65' : 'text-[#553E53]/60'}`}>
                      {tier.period}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onBookDemo}
                  className={`mt-6 w-full py-3 rounded-xl text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6CBDE] ${featured
                    ? 'bg-[#F5F6F0] text-[#553E53] hover:bg-white'
                    : 'bg-[#553E53] text-[#F5F6F0] hover:bg-[#4B624A]'
                    }`}
                >
                  {tier.ctaText}
                </button>

                <ul
                  className={`mt-7 pt-6 space-y-3 text-sm border-t ${featured ? 'border-[#F5F6F0]/15' : 'border-[#553E53]/10'
                    }`}
                >
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-snug">
                      <IconCheck
                        className={`w-4 h-4 shrink-0 mt-0.5 ${featured ? 'text-[#B6CBDE]' : 'text-[#4B624A]'}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-[#553E53]/65">
          Not sure which plan fits? Book a demo and we&apos;ll recommend one based on your WhatsApp volume.
        </p>
      </div>
    </section>
  );
}