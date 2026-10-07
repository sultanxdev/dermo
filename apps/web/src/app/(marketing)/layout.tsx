import React from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F6F0] text-[#553E53] selection:bg-[#B6CBDE] selection:text-[#553E53]">
      {children}
    </div>
  );
}
