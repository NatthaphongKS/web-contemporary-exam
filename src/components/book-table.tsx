"use client";

import Link from "next/link";
import Image from "next/image";
import { Book } from "@/types/book";
import { Book as BookIcon, CheckCircle2, XCircle, Edit3, Trash2, ArrowRightLeft, ExternalLink, UserCheck } from "lucide-react";

interface BookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number, title: string) => void;
  onToggleStatus: (id: number) => void;
}

export function BookTable({
  books,
  onEdit,
  onDelete,
  onToggleStatus,
}: BookTableProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <BookIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-base font-medium text-slate-700">ไม่พบข้อมูลหนังสือ</p>
        <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือกดเพิ่มหนังสือเล่มใหม่</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3.5 w-16 text-center">ID</th>
            <th className="px-4 py-3.5 w-20">หน้าปก</th>
            <th className="px-4 py-3.5">ชื่อหนังสือ</th>
            <th className="px-4 py-3.5">ผู้แต่ง</th>
            <th className="px-4 py-3.5 text-center w-24">ปีที่พิมพ์</th>
            <th className="px-4 py-3.5 text-center w-36">สถานะหนังสือ</th>
            <th className="px-4 py-3.5 w-44">ผู้ใช้ (userId)</th>
            <th className="px-4 py-3.5 text-right w-36">การจัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-4 py-3 text-center font-mono font-bold text-slate-500 text-xs">
                #{book.id}
              </td>

              {/* Cover thumbnail */}
              <td className="px-4 py-3">
                <div className="relative w-12 h-16 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <BookIcon className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                </div>
              </td>

              {/* Title & Detail Link */}
              <td className="px-4 py-3 font-semibold text-slate-900">
                <Link
                  href={`/books/${book.id}`}
                  className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors group"
                >
                  <span>{book.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                </Link>
              </td>

              {/* Author */}
              <td className="px-4 py-3 text-slate-600 text-xs sm:text-sm">
                {book.author}
              </td>

              {/* Year */}
              <td className="px-4 py-3 text-center font-mono text-slate-600 text-xs sm:text-sm">
                {book.publishedYear}
              </td>

              {/* Status Badge */}
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    book.isAvailable
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {book.isAvailable ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>พร้อมให้ยืม</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-amber-600" />
                      <span>ถูกยืมอยู่</span>
                    </>
                  )}
                </span>
              </td>

              {/* User / Owner (Foreign Key: userId) */}
              <td className="px-4 py-3 text-xs">
                {book.userName ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium bg-indigo-50 text-indigo-800 border border-indigo-200">
                    <UserCheck className="w-3 h-3 text-indigo-600" />
                    <span>#{book.userId} {book.userName}</span>
                  </span>
                ) : (
                  <span className="text-slate-400 font-mono">#{book.userId}</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onToggleStatus(book.id)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title={book.isAvailable ? "ทำรายการยืมหนังสือ" : "ทำรายการคืนหนังสือ"}
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(book)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="แก้ไขข้อมูล (PUT /api/books/:id)"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(book.id, book.title)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="ลบข้อมูล (DELETE /api/books/:id)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
