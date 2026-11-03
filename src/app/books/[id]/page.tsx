"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";
import { BookModal } from "@/components/book-modal";
import { useToast } from "@/components/toast";
import {
  ArrowLeft,
  Book as BookIcon,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  ArrowRightLeft,
  AlertCircle,
  Clock,
  Code2,
} from "lucide-react";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { toast } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch single book from GET /api/books/:id
  const fetchBook = async () => {
    if (!id) return;
    setIsLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/books/${id}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) {
        throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ");
      }
      const data = await res.json();
      setBook(data);
    } catch (err: unknown) {
      console.error(err);
      toast({
        type: "error",
        title: "โหลดข้อมูลล้มเหลว",
        message: err instanceof Error ? err.message : "Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Toggle Borrow / Return Status
  const handleToggleStatus = async () => {
    if (!book) return;
    const newStatus = !book.isAvailable;

    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เปลี่ยนสถานะไม่สำเร็จ");

      setBook(data);
      toast({
        type: "success",
        title: newStatus ? "ทำรายการคืนสำเร็จ" : "ทำรายการยืมสำเร็จ",
        message: `หนังสือ "${data.title}" สถานะคือ: ${newStatus ? "พร้อมให้ยืม" : "ถูกยืมอยู่"}`,
        status: 200,
      });
    } catch (err: unknown) {
      toast({
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: err instanceof Error ? err.message : "Error",
        status: 404,
      });
    }
  };

  // Delete Book
  const handleDelete = async () => {
    if (!book) return;
    if (!confirm(`คุณต้องการลบหนังสือ "${book.title}" (ID: ${book.id}) ใช่หรือไม่?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ลบหนังสือไม่สำเร็จ");

      toast({
        type: "success",
        title: "ลบข้อมูลสำเร็จ (200 OK)",
        message: `ลบ "${book.title}" ออกจากระบบแล้ว`,
        status: 200,
      });

      router.push("/");
    } catch (err: unknown) {
      toast({
        type: "error",
        title: "ลบหนังสือไม่สำเร็จ",
        message: err instanceof Error ? err.message : "Error",
        status: 404,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded mb-6"></div>
        <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 h-80 bg-slate-200 rounded-2xl shrink-0"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
            <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
            <div className="h-20 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Case: 404 Not Found
  if (notFound || !book) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
          HTTP 404 Not Found
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          ไม่พบข้อมูลหนังสือรหัส #{id}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          หนังสือเล่มนี้อาจถูกลบไปแล้ว หรือไม่มีรหัสประจำหนังสือ (ID: {id}) ในระบบ In-Memory Store
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้ารายการหนังสือ</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังหน้ารายการหนังสือ</span>
        </Link>
      </div>

      {/* Book Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
          {/* Cover Image */}
          <div className="w-full md:w-64 shrink-0">
            <div className="relative h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300">
                  <BookIcon className="w-16 h-16 stroke-1 text-slate-400 mb-2" />
                  <span className="text-xs font-medium text-slate-400">ไม่มีรูปภาพปก</span>
                </div>
              )}

              {/* Status Pill on Cover */}
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs ${
                    book.isAvailable
                      ? "bg-emerald-500/90 text-white"
                      : "bg-amber-500/90 text-white"
                  }`}
                >
                  {book.isAvailable ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>พร้อมให้ยืม</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>ถูกยืมอยู่</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-900 text-white">
                  ID #{book.id}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Code2 className="w-3 h-3" /> GET /api/books/{book.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {book.title}
              </h1>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-700">ผู้แต่ง:</span>
                  <span>{book.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-700">ปีที่พิมพ์ (ค.ศ.):</span>
                  <span className="font-mono">{book.publishedYear}</span>
                </div>

                {book.createdAt && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>เพิ่มข้อมูลเมื่อ: {new Date(book.createdAt).toLocaleString("th-TH")}</span>
                  </div>
                )}
              </div>

              {/* JSON preview for studying */}
              <div className="mt-6 p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                <p className="text-slate-400 mb-1.5 font-sans font-semibold text-[11px]">
                  ตัวอย่าง JSON Response (200 OK):
                </p>
                <pre>{JSON.stringify(book, null, 2)}</pre>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleToggleStatus}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  book.isAvailable
                    ? "bg-amber-100 hover:bg-amber-200 text-amber-800"
                    : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                }`}
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>{book.isAvailable ? "ทำรายการยืม (Borrow)" : "ทำรายการคืน (Return)"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-slate-600" />
                  <span>แก้ไขข้อมูล (PUT)</span>
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>ลบหนังสือ (DELETE)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBook}
        bookToEdit={book}
      />
    </div>
  );
}
