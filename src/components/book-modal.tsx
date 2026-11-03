"use client";

import React, { useState, useEffect } from "react";
import { Book, CreateBookDto } from "@/types/book";
import { User } from "@/types/user";
import { useToast } from "@/components/toast";
import { FileUploader } from "@/components/file-uploader";
import { X, BookPlus, Edit3, Loader2 } from "lucide-react";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookToEdit?: Book | null;
  defaultUserId?: number | null;
}

export function BookModal({
  isOpen,
  onClose,
  onSuccess,
  bookToEdit,
  defaultUserId,
}: BookModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [userId, setUserId] = useState<number>(1);
  const [publishedYear, setPublishedYear] = useState<number | "">("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  // Users dropdown
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data: User[]) => {
          if (Array.isArray(data)) {
            setUsers(data);
            if (!bookToEdit) {
              setUserId(defaultUserId || (data.length > 0 ? data[0].id : 1));
            }
          }
        })
        .catch(console.error);
    }
  }, [isOpen, defaultUserId, bookToEdit]);

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setUserId(bookToEdit.userId);
      setPublishedYear(bookToEdit.publishedYear || new Date().getFullYear());
      setIsAvailable(bookToEdit.isAvailable);
      setCoverUrl(bookToEdit.coverUrl || null);
    } else {
      setTitle("");
      setAuthor("");
      setPublishedYear(new Date().getFullYear());
      setIsAvailable(true);
      setCoverUrl(null);
      if (defaultUserId) setUserId(defaultUserId);
    }
  }, [bookToEdit, isOpen, defaultUserId]);

  if (!isOpen) return null;

  const isEditing = Boolean(bookToEdit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !userId) {
      toast({
        type: "error",
        title: "ข้อมูลไม่ครบถ้วน",
        message: "กรุณาระบุชื่อหนังสือ, ผู้แต่ง และเลือกสมาชิกเจ้าของหนังสือ",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateBookDto = {
        title: title.trim(),
        author: author.trim(),
        userId: Number(userId),
        publishedYear: publishedYear ? Number(publishedYear) : new Date().getFullYear(),
        isAvailable,
        coverUrl,
      };

      const url = isEditing && bookToEdit ? `/api/books/${bookToEdit.id}` : "/api/books";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "บันทึกข้อมูลล้มเหลว");

      toast({
        type: "success",
        title: isEditing ? "แก้ไขหนังสือสำเร็จ" : "เพิ่มหนังสือสำเร็จ",
        message: `บันทึก "${data.title}" สำเร็จ`,
        status: isEditing ? 200 : 201,
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast({
        type: "error",
        title: "เกิดข้อผิดพลาด",
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <BookPlus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? `แก้ไขหนังสือ (ID: ${bookToEdit?.id})` : "เพิ่มหนังสือใหม่"}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {isEditing ? `PUT /api/books/${bookToEdit?.id}` : "POST /api/books"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User Select (Foreign Key: userId) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              สมาชิกเจ้าของหนังสือ (userId - Foreign Key) <span className="text-rose-500">*</span>
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  #{u.id} {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อหนังสือ (title) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น Clean Code"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อผู้แต่ง (author) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Robert C. Martin"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ปีที่พิมพ์ (publishedYear)
              </label>
              <input
                type="number"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="2008"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700 mt-1">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
              />
              <span>สถานะ: {isAvailable ? "พร้อมใช้งาน (Available)" : "ไม่พร้อมใช้งาน (Unavailable)"}</span>
            </label>
          </div>

          {/* File Upload Section */}
          <div className="pt-2 border-t border-slate-100">
            <FileUploader
              currentUrl={coverUrl}
              onUploadSuccess={(url) => setCoverUrl(url)}
              onRemove={() => setCoverUrl(null)}
            />
          </div>

          {/* Actions */}
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
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? "บันทึก (200 OK)" : "เพิ่มหนังสือ (201 Created)"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
