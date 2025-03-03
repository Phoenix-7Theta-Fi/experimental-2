export default function Loading() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto p-4">
      <div className="animate-pulse">
        {/* Profile header skeleton */}
        <div className="bg-[#1E293B] p-6 rounded-lg shadow-lg border border-[#334155] mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-[#334155] rounded-full"></div>
            <div className="flex-1">
              <div className="h-8 w-48 bg-[#334155] rounded mb-2"></div>
              <div className="h-4 w-32 bg-[#334155] rounded mb-2"></div>
              <div className="h-4 w-24 bg-[#334155] rounded"></div>
            </div>
          </div>
        </div>

        {/* Tweets skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#1E293B] p-6 rounded-lg shadow-lg border border-[#334155] mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-[#334155] rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-[#334155] rounded mb-2"></div>
                <div className="h-16 bg-[#334155] rounded mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-6 w-20 bg-[#334155] rounded"></div>
                  <div className="h-6 w-16 bg-[#334155] rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
