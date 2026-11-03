export default function BookDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-5 w-32 bg-slate-200 rounded mb-6"></div>
      <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 h-80 bg-slate-200 rounded-2xl shrink-0"></div>
        <div className="flex-1 space-y-4">
          <div className="h-6 w-24 bg-slate-200 rounded"></div>
          <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
          <div className="h-28 bg-slate-100 rounded-xl"></div>
          <div className="h-10 w-full bg-slate-200 rounded-xl mt-6"></div>
        </div>
      </div>
    </div>
  );
}
