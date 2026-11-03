"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function LibraryDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        เกิดข้อผิดพลาดในการแสดงผลหน้าแดชบอร์ด
      </h2>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {error.message || "ไม่สามารถโหลดข้อมูลระบบจัดการหนังสือได้ กรุณาลองใหม่อีกครั้ง"}
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
      >
        <RotateCcw className="w-4 h-4" />
        <span>ลองใหม่อีกครั้ง (Retry)</span>
      </button>
    </div>
  );
}
