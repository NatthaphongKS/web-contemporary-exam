"use client";

import { User } from "@/types/user";
import { User as UserIcon, BookOpen, GraduationCap, Briefcase, Users, Edit2, Trash2 } from "lucide-react";

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number, name: string) => void;
}

export function UserCard({
  user,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: UserCardProps) {
  const getRoleBadge = (role?: string) => {
    if (!role) return null;
    switch (role) {
      case "student":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <GraduationCap className="w-3 h-3" />
            <span>นักศึกษา</span>
          </span>
        );
      case "teacher":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Briefcase className="w-3 h-3" />
            <span>อาจารย์</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Users className="w-3 h-3" />
            <span>สมาชิก</span>
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(user)}
      className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
        isSelected
          ? "bg-indigo-50/90 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20"
          : "bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-indigo-200 shadow-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar Icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isSelected
                ? "bg-indigo-600 text-white font-bold"
                : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
            }`}
          >
            <UserIcon className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              {getRoleBadge(user.role)}
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Action icons */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            onClick={() => onEdit(user)}
            className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-200/60"
            title="แก้ไขผู้ใช้"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(user.id, user.name)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
            title="ลบผู้ใช้"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer: Borrowed Count Badge */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-slate-600">หนังสือที่ถือครอง:</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full font-mono font-bold text-xs ${
            (user.borrowedBooksCount || 0) > 0
              ? "bg-amber-100 text-amber-800 border border-amber-200"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {user.borrowedBooksCount || 0} เล่ม
        </span>
      </div>
    </div>
  );
}
