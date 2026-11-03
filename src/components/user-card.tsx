/**
 * ==============================================================================
 * Component: UserCard (การ์ดแสดงข้อมูลสมาชิกใน Master Column)
 * ==============================================================================
 * การ์ดแสดงสมาชิก 1 คนในฝั่งซ้ายของ Dashboard:
 * • แสดงชื่อ, อีเมล, และจำนวนหนังสือที่ถือครองอยู่ (1:N count badge)
 * • คลิกเลือกการ์ดเพื่อ Filter หนังสือฝั่งขวา
 * • มีปุ่ม Action สำหรับแก้ไข (Modal) และลบ (Cascade Delete)
 */

"use client";

import { User } from "@/types/user";
import { User as UserIcon, BookOpen, Edit2, Trash2 } from "lucide-react";

/**
 * พร็อพส์สำหรับคอมโพเนนต์ UserCard
 */
interface UserCardProps {
  /** ข้อมูลสมาชิก */
  user: User;
  /** สถานะว่ากำลังถูกเลือกอยู่เพื่อ Filter หนังสือหรือไม่ */
  isSelected: boolean;
  /** ฟังก์ชันเมื่อคลิกเลือกการ์ด */
  onSelect: (user: User) => void;
  /** ฟังก์ชันเมื่อคลิกปุ่มแก้ไขสมาชิก */
  onEdit: (user: User) => void;
  /** ฟังก์ชันเมื่อคลิกปุ่มลบสมาชิก (ส่ง id และชื่อสมาชิก) */
  onDelete: (id: number, name: string) => void;
}

/**
 * UserCard
 * แสดงการ์ดข้อมูลสมาชิก 1 คนในฝั่ง Master List
 * 
 * @component UserCard
 * @param {UserCardProps} props - พร็อพส์สำหรับจัดการการ์ดสมาชิก
 * @returns {JSX.Element} การ์ดข้อมูลสมาชิกพร้อมปุ่ม Action
 */
export function UserCard({
  user,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: UserCardProps) {
  // ขั้นตอนที่ 1: เรนเดอร์กล่องการ์ด พร้อมคำนวณสไตล์การ Active เมื่อถูกเลือก
  return (
    <div
      onClick={() => onSelect(user)}
      className={`group relative p-3 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? "bg-indigo-50 border-indigo-500 shadow-xs ring-2 ring-indigo-500/20"
          : "bg-white hover:bg-slate-50 border-slate-200 shadow-2xs"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        {/* ขั้นตอนที่ 2: แสดงไอคอน Avatar พร้อมชื่อและอีเมลของสมาชิก */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isSelected
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
            }`}
          >
            <UserIcon className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* ขั้นตอนที่ 3: ปุ่ม Action (แก้ไข/ลบ) โดยใช้ stopPropagation ป้องกันการ Trigger onSelect */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            onClick={() => onEdit(user)}
            className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100"
            title="แก้ไขสมาชิก"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(user.id, user.name)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
            title="ลบสมาชิก"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ขั้นตอนที่ 4: แสดงสถิติจำนวนหนังสือที่สมาชิกครอบครอง (1:N Books Count) */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1 text-slate-500">
          <BookOpen className="w-3 h-3 text-indigo-500" />
          <span>หนังสือ:</span>
        </div>
        <span
          className={`px-2 py-0.2 rounded-full font-mono font-bold text-[11px] ${
            (user.booksCount || 0) > 0
              ? "bg-indigo-100 text-indigo-800"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {user.booksCount || 0} เล่ม
        </span>
      </div>
    </div>
  );
}
