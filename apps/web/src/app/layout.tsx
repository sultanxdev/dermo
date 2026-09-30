import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dermo — Managed WhatsApp AI Employee for Dermatology & Aesthetic Clinics',
  description:
    'Grounded 24/7 AI employee for dermatology clinics. Handles WhatsApp inquiries, RAG knowledge retrieval, real doctor slot booking, Razorpay deposits, and seamless human handoff.',
  keywords: ['dermatology ai', 'whatsapp clinic bot', 'aesthetic clinic automation', 'medical appointment booking', 'langchain clinic ai'],
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
