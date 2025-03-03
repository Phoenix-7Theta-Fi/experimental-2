import { VALID_SECTIONS } from "@/lib/utils/sections";

export default function HealthAnalyticsLoading() {
  const LoadingChart = () => (
    <div className="w-full max-w-3xl mx-auto bg-[#334155] rounded-lg shadow-lg shadow-black/20 border border-[#475569] overflow-hidden">
      <div className="p-6">
        <div className="h-[400px] bg-[#1E293B] rounded-lg"></div>
      </div>
      <div className="p-4 border-t border-[#475569] grid grid-cols-2 gap-4">
        <div>
          <div className="h-6 bg-[#1E293B] rounded w-24 mb-4"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-[#1E293B] rounded w-20"></div>
                <div className="h-4 bg-[#1E293B] rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-6 bg-[#1E293B] rounded w-24 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-[#1E293B] rounded w-20"></div>
                <div className="h-4 bg-[#1E293B] rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="container mx-auto py-8 px-4 mt-20">
      <div className="animate-pulse">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-8 bg-[#334155] rounded w-64 mx-auto"></div>
        </div>

        {/* Section Navigation */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {VALID_SECTIONS.map((sectionId) => (
              <div
                key={sectionId}
                className="flex items-center px-4 py-2 rounded-lg bg-[#1E293B]"
              >
                <div className="w-5 h-5 mr-2 rounded bg-[#334155]"></div>
                <div className="h-4 bg-[#334155] rounded w-20"></div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="h-4 bg-[#334155] rounded w-96"></div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8 py-4">
          <LoadingChart />
        </div>
      </div>
    </main>
  );
}
