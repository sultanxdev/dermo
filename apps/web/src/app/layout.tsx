import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dermo.ai — AI Employee for Modern Clinics',
  description:
    "Dermo helps clinics automate WhatsApp patient conversations, lead capture, appointment booking, payments, and human handoff.",
  keywords: [
    'clinic ai employee',
    'whatsapp clinic receptionist',
    'healthcare appointment booking',
    'outpatient clinic automation',
    'medical appointment scheduling',
  ],
  openGraph: {
    title: 'Dermo.ai — AI Employee for Modern Clinics',
    description:
      'Dermo helps clinics automate WhatsApp patient conversations, lead capture, appointment booking, payments, and human handoff.',
    url: 'https://dermo.ai',
    siteName: 'Dermo.ai',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="min-h-screen bg-[#F5F6F0] text-[#553E53] antialiased font-sans selection:bg-[#B6CBDE] selection:text-[#553E53]">
        {children}
      </body>
    </html>
  );
}
