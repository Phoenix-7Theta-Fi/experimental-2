import { Navbar } from '@/components/navbar';

export default function Loading() {
  return (
    <>
      <Navbar userEmail="Loading..." userRole="patient" />
      <main className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-[#1E293B] rounded animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-24 bg-[#1E293B] rounded animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-[#334155] rounded-lg shadow-lg shadow-black/20 overflow-hidden border border-[#475569]"
            >
              <div className="h-48 bg-[#1E293B] animate-pulse" />
              <div className="p-4">
                <div className="h-6 w-3/4 bg-[#1E293B] rounded mb-2 animate-pulse" />
                <div className="h-4 w-full bg-[#1E293B] rounded mb-2 animate-pulse" />
                <div className="h-4 w-2/3 bg-[#1E293B] rounded mb-4 animate-pulse" />
                <div className="flex justify-between mb-4">
                  <div className="h-6 w-20 bg-[#1E293B] rounded animate-pulse" />
                  <div className="h-6 w-24 bg-[#1E293B] rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 flex-1 bg-[#1E293B] rounded animate-pulse" />
                  <div className="h-10 flex-1 bg-[#1E293B] rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </main>
    </>
  );
}
