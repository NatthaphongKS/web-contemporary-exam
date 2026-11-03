/**
 * ==============================================================================
 * Component: BookCard (การ์ดแสดงผลหนังสือในมุมมอง Grid)
 * ==============================================================================
 * แสดงรายละเอียดหนังสือ 1 เล่ม:
 * • แสดงภาพปกหนังสือ (จาก coverUrl หรือไอคอน Placeholder)
 * • แสดงชื่อหนังสือ, ผู้แต่ง, ปีที่พิมพ์, และชื่อสมาชิกเจ้าของหนังสือ (1:N relation)
 * • ปุ่มสลับสถานะพร้อมใช้งาน (Trigger Optimistic Update)
 * • ปุ่มแก้ไข (เปิด BookModal) และปุ่มลบหนังสือ
 */

"use client";

import Image from "next/image";
import { Book } from "@/types/book";
import {
  Book as BookIcon,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  ArrowRightLeft,
  UserCheck,
} from "lucide-react";

/**
 * พร็อพส์สำหรับคอมโพเนนต์ BookCard
 */
interface BookCardProps {
  /** ข้อมูลหนังสือ 1 เล่ม */
  book: Book;
  /** ฟังก์ชันเมื่อคลิกแก้ไขหนังสือ */
  onEdit: (book: Book) => void;
  /** ฟังก์ชันเมื่อคลิกลบหนังสือ */
  onDelete: (id: number, title: string) => void;
  /** ฟังก์ชันเมื่อคลิกสลับสถานะพร้อมใช้งาน (Toggle Availability) */
  onToggleStatus: (id: number) => void;
}

/**
 * BookCard
 * แสดงการ์ดหนังสือ 1 เล่มในรูปแบบตารางกริด (Grid View)
 * 
 * @component BookCard
 * @param {BookCardProps} props - พร็อพส์สำหรับจัดการและแสดงข้อมูลหนังสือ
 * @returns {JSX.Element} การ์ดแสดงผลข้อมูลหนังสือ
 */
export function BookCard({ book, onEdit, onDelete, onToggleStatus }: BookCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden group">
      {/* ขั้นตอนที่ 1: ส่วนหัวการ์ด - รูปภาพหน้าปกหนังสือ (Cover Image) พร้อม ID และสถานะความพร้อม */}
      <div
        onClick={() => onEdit(book)}
        className="relative h-44 w-full bg-linear-to-br from-slate-100 to-indigo-50/50 flex items-center justify-center border-b border-slate-100 overflow-hidden cursor-pointer"
        title="คลิกเพื่อแก้ไขหรือดูรายละเอียด"
      >
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300">
            <BookIcon className="w-12 h-12 stroke-1 text-slate-400 mb-1" />
            <span className="text-[11px] font-medium text-slate-400">ไม่มีรูปภาพปก</span>
          </div>
        )}

        {/* ID Badge */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-900/80 text-white backdrop-blur-xs">
          ID #{book.id}
        </span>

        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-xs border shadow-xs ${
            book.isAvailable
              ? "bg-emerald-500/90 text-white border-emerald-400"
              : "bg-slate-700/90 text-white border-slate-600"
          }`}
        >
          {book.isAvailable ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              <span>พร้อมใช้งาน</span>
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" />
              <span>ไม่พร้อมใช้งาน</span>
            </>
          )}
        </span>
      </div>

      {/* ขั้นตอนที่ 2: ข้อมูลเนื้อหาหนังสือ (ชื่อ, ผู้แต่ง, ปีที่พิมพ์ และ Foreign Key สมาชิกเจ้าของ) */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="block text-left text-base font-bold text-slate-900 hover:text-indigo-600 line-clamp-1 transition-colors w-full cursor-pointer"
            title="คลิกเพื่อแก้ไขหรือดูรายละเอียด"
          >
            {book.title}
          </button>

          <div className="mt-2 space-y-1 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{book.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>ปีที่พิมพ์: {book.publishedYear}</span>
            </div>

            {/* User / Owner (Foreign Key: userId) */}
            <div className="flex items-center gap-1.5 pt-1 text-indigo-700 font-medium truncate">
              <UserCheck className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
              <span className="truncate">ผู้ใช้: #{book.userId} {book.userName || ""}</span>
            </div>
          </div>
        </div>

        {/* ขั้นตอนที่ 3: ปุ่มปฏิบัติการ (Toggle Availability, Edit Modal, Delete) */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
          {/* Toggle Availability Status */}
          <button
            onClick={() => onToggleStatus(book.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              book.isAvailable
                ? "text-slate-700 bg-slate-100 hover:bg-slate-200"
                : "text-emerald-800 bg-emerald-100 hover:bg-emerald-200"
            }`}
            title="สลับสถานะพร้อมใช้งาน (isAvailable)"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{book.isAvailable ? "ปิดใช้งาน" : "เปิดใช้งาน"}</span>
          </button>

          {/* Edit & Delete */}
          <div className="flex items-center gap-1">
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
              title="ลบหนังสือ (DELETE /api/books/:id)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
