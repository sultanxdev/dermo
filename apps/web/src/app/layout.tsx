import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dermo.ai — The 24/7 AI Employee for Modern Clinics',
  description:
    "Dermo handles patient conversations on WhatsApp, captures leads, answers questions using your clinic's verified information, checks real provider availability, books appointments, collects payments, and hands conversations to your team when needed.",
  keywords: ['clinic ai employee', 'whatsapp clinic receptionist', 'healthcare appointment booking', 'outpatient clinic automation', 'medical appointment scheduling'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#F5F6F0] text-[#553E53] antialiased font-sans selection:bg-[#B6CBDE] selection:text-[#553E53]">
        {children}
      </body>
    </html>
  );
}
