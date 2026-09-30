import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clinic Login — Dermo.ai',
  description: 'Sign in to your Dermo clinic operations dashboard.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F6F0] text-[#553E53] flex items-center justify-center relative overflow-hidden selection:bg-[#B6CBDE] selection:text-[#553E53]">
      <div className="relative z-10 w-full max-w-md px-4 py-8">{children}</div>
    </div>
  );
}
