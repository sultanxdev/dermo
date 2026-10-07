import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — Dermo',
  description: 'Sign in to your Dermo clinic dashboard.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F6F0] text-[#553E53] flex items-center justify-center relative overflow-hidden selection:bg-[#B6CBDE] selection:text-[#553E53]">
      {/* Calm ambient background orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#B6CBDE]/35 to-[#553E53]/10 blur-[130px] animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[520px] h-[520px] rounded-full bg-gradient-to-tl from-[#B6CBDE]/30 to-[#553E53]/12 blur-[110px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-[35%] right-[20%] w-[320px] h-[320px] rounded-full bg-gradient-to-r from-[#B6CBDE]/25 to-transparent blur-[90px]" />

      {/* Subtle geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#553E53 1px, transparent 1px), linear-gradient(90deg, #553E53 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">{children}</div>
    </div>
  );
}
