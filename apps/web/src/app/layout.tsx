import type { Metadata } from 'next';
import AuthSessionProvider from '@/components/providers/session-provider';
import './globals.css';

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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0A0A0A] text-cream-100 antialiased selection:bg-orange-500 selection:text-white">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
