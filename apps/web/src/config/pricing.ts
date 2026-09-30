export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'single-doctor',
    name: 'Single Doctor Clinic',
    price: '₹4,999',
    period: '/ month',
    description: 'For solo practitioners and boutique outpatient practices.',
    features: [
      '1 WhatsApp Clinic Number',
      '1 Doctor Shift Schedule',
      'Grounded Clinic Knowledge Base',
      'Appointment Slot Booking',
    ],
    ctaText: 'Book a Demo',
    popular: false,
  },
  {
    id: 'multi-doctor',
    name: 'Multi-Doctor Clinic',
    price: '₹9,999',
    period: '/ month',
    description: 'For busy specialty clinics with multiple providers and rooms.',
    features: [
      'Up to 5 Doctor Shift Schedules',
      'Advance Booking Deposits',
      '1-Click Human Receptionist Takeover',
      'Dedicated Clinic Setup & Knowledge Tuning',
    ],
    ctaText: 'Book a Demo',
    popular: true,
  },
  {
    id: 'growing-clinic',
    name: 'Growing Clinic / Multi-Branch',
    price: 'Custom',
    description: 'For clinic chains with multi-branch routing or custom EMR sync.',
    features: [
      'Multi-Branch WhatsApp Routing',
      'Custom EMR & PMS API Integration',
      'Dedicated Account Manager & SLA',
    ],
    ctaText: 'Book a Demo',
    popular: false,
  },
];
