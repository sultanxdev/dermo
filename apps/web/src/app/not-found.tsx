import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F6F0] text-[#553E53] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 mb-6 rounded-3xl bg-[#B6CBDE]/30 border border-[#553E53]/15 flex items-center justify-center shadow-sm">
        <span className="text-3xl font-extrabold text-[#553E53]">404</span>
      </div>
      <h1 className="text-4xl font-serif font-bold text-[#553E53] mb-3">
        Page Not Found
      </h1>
      <p className="text-[#553E53]/70 max-w-md mb-8 text-sm">
        The clinic management page or consultation resource you are looking for does not exist or has moved.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-3 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-medium transition shadow-sm hover:shadow-md"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
