"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";

export default function BookDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("BookDetail Error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        เกิดข้อผิดพลาดในการโหลดรายละเอียดหนังสือ
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        {error.message || "ไม่สามารถแสดงผลข้อมูลหนังสือได้ กรุณาลองใหม่อีกครั้ง"}
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าหลัก</span>
        </Link>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>ลองใหม่ (Retry)</span>
        </button>
      </div>
    </div>
  );
}
