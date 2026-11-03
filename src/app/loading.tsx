export default function LibraryDashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="h-8 w-64 bg-slate-200 rounded-lg mb-2"></div>
          <div className="h-4 w-96 bg-slate-200 rounded-md"></div>
        </div>
        <div className="h-10 w-44 bg-slate-200 rounded-xl"></div>
      </div>

      {/* Counters Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 h-24 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
            <div className="space-y-2">
              <div className="h-3 w-28 bg-slate-200 rounded"></div>
              <div className="h-6 w-16 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Skeleton */}
      <div className="h-16 bg-white rounded-2xl border border-slate-200 mb-6"></div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 h-80"></div>
        ))}
      </div>
    </div>
  );
}
