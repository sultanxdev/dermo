export interface NavItem {
  title: string;
  href: string;
  badge?: string;
  external?: boolean;
}

export const marketingNav: NavItem[] = [
  { title: 'Features', href: '#features' },
  { title: 'How It Works', href: '#how-it-works' },
  { title: 'Demo', href: '#demo' },
  { title: 'Dashboard', href: '#dashboard' },
  { title: 'Pricing', href: '#pricing' },
  { title: 'FAQ', href: '#faq' },
];

export const footerNav = {
  product: [
    { title: 'Features', href: '#features' },
    { title: 'How It Works', href: '#how-it-works' },
    { title: 'Pricing', href: '#pricing' },
    { title: 'FAQ', href: '#faq' },
    { title: 'Book a Demo', href: '/book-demo' },
  ],
  clinic: [
    { title: 'Clinic Login', href: '/login' },
    { title: 'Dashboard Shell', href: '/dashboard' },
  ],
  legal: [
    { title: 'Privacy', href: '/privacy' },
    { title: 'Terms', href: '/terms' },
    { title: 'Refund Policy', href: '/refund' },
    { title: 'Medical Safety', href: '/medical-safety' },
    { title: 'Contact', href: '/contact' },
  ],
};

export const dashboardNav: NavItem[] = [
  { title: 'Overview', href: '/dashboard' },
  { title: 'Conversations', href: '/dashboard/conversations', badge: '3' },
  { title: 'Patients', href: '/dashboard/patients' },
  { title: 'Leads', href: '/dashboard/leads', badge: '12' },
  { title: 'Appointments', href: '/dashboard/appointments', badge: '5 Today' },
  { title: 'Providers', href: '/dashboard/providers' },
  { title: 'Services', href: '/dashboard/services' },
  { title: 'Knowledge', href: '/dashboard/knowledge' },
  { title: 'Payments', href: '/dashboard/payments' },
  { title: 'WhatsApp', href: '/dashboard/whatsapp' },
  { title: 'AI Employee', href: '/dashboard/ai' },
  { title: 'Settings', href: '/dashboard/settings' },
];
