"use client";

import React, { useState } from "react";
import { User } from "@/types/user";
import { Book } from "@/types/book";
import { useToast } from "@/components/toast";
import { X, BookPlus, Loader2, CheckCircle2, BookOpen } from "lucide-react";

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetUser: User | null;
  availableBooks: Book[];
}

export function BorrowModal({
  isOpen,
  onClose,
  onSuccess,
  targetUser,
  availableBooks,
}: BorrowModalProps) {
  const { toast } = useToast();
  const [selectedBookId, setSelectedBookId] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBookId) {
      toast({
        type: "error",
        title: "กรุณาเลือกหนังสือ",
        message: "เลือกหนังสือเล่มที่ต้องการยืมจากรายการ",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/books/${selectedBookId}/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUser.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ทำรายการยืมหนังสือไม่สำเร็จ");

      toast({
        type: "success",
        title: "ทำรายการยืมสำเร็จ (200 OK)",
        message: `ยืม "${data.book?.title}" ให้ ${targetUser.name} เรียบร้อยแล้ว`,
        status: 200,
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast({
        type: "error",
        title: "ยืมหนังสือไม่สำเร็จ",
        message: err instanceof Error ? err.message : "Error",
        status: 400,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <BookPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                ยืมหนังสือให้ {targetUser.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                POST /api/books/:id/borrow (User ID #{targetUser.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">ผู้ยืม:</span> {targetUser.name} ({targetUser.email})
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              เลือกหนังสือที่พร้อมให้ยืม (มีว่าง {availableBooks.length} เล่ม)
            </label>

            {availableBooks.length === 0 ? (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs text-center">
                ขณะนี้ไม่มีหนังสือว่างในระบบห้องสมุดเลย
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {availableBooks.map((book) => (
                  <label
                    key={book.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedBookId === book.id
                        ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="book"
                        value={book.id}
                        checked={selectedBookId === book.id}
                        onChange={() => setSelectedBookId(book.id)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{book.title}</p>
                        <p className="text-xs text-slate-500">
                          {book.author} ({book.publishedYear})
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" /> ว่าง
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedBookId || availableBooks.length === 0}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <BookOpen className="w-4 h-4" />
              <span>ยืนยันการยืมหนังสือ (200 OK)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
