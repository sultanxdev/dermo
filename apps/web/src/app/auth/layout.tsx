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
    <div className="min-h-screen bg-[#060606] flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-600/20 to-amber-500/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-orange-500/15 to-rose-500/10 blur-[100px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-amber-400/10 to-orange-600/5 blur-[80px] animate-pulse [animation-delay:4s]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">{children}</div>
    </div>
  );
}
