import { Navbar } from '@/components/navbar';

export default function Loading() {
  return (
    <>
      <Navbar userEmail="Loading..." userRole="patient" />
      <main className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 w-48 bg-[#1E293B] rounded animate-pulse" />
            <div className="h-6 w-24 bg-[#1E293B] rounded animate-pulse" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#334155] p-4 rounded-lg shadow-lg shadow-black/20 border border-[#475569] flex items-center gap-4"
              >
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-[#1E293B] rounded mb-2 animate-pulse" />
                  <div className="h-4 w-1/3 bg-[#1E293B] rounded mb-2 animate-pulse" />
                  <div className="h-5 w-16 bg-[#1E293B] rounded animate-pulse" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#1E293B] rounded animate-pulse" />
                  <div className="w-8 h-8 bg-[#1E293B] rounded animate-pulse" />
                  <div className="w-8 h-8 bg-[#1E293B] rounded animate-pulse" />
                </div>

                <div className="w-16 h-8 bg-[#1E293B] rounded animate-pulse" />
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#1E293B] p-4 rounded-lg border border-[#475569]">
            <div className="flex justify-between items-center">
              <div className="h-6 w-16 bg-[#334155] rounded animate-pulse" />
              <div className="h-6 w-24 bg-[#334155] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
