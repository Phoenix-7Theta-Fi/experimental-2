import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#F8FAFC]">404</h1>
        <p className="text-xl mb-4 text-[#94A3B8]">
          Hmm...this profile doesn't exist
        </p>
        <Link 
          href="/feed" 
          className="inline-block px-4 py-2 bg-[#1E293B] text-[#F97316] rounded-lg border border-[#334155] hover:bg-[#334155] transition-colors"
        >
          Back to Feed
        </Link>
      </div>
    </div>
  );
}
