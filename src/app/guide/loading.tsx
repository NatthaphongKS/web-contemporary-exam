export default function StudyGuideLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="h-6 w-48 bg-slate-200 rounded-full"></div>
        <div className="h-8 w-80 bg-slate-200 rounded-lg"></div>
        <div className="h-4 w-96 bg-slate-200 rounded-md"></div>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-32 bg-slate-200 rounded-xl"></div>
        ))}
      </div>
      <div className="h-96 bg-white rounded-2xl border border-slate-200"></div>
    </div>
  );
}
