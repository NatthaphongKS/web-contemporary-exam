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

  // Users list for dropdown
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data: User[]) => {
          if (Array.isArray(data)) {
            setUsers(data);
            if (!bookToEdit && defaultUserId) {
              setUserId(defaultUserId);
            } else if (!bookToEdit && data.length > 0) {
              setUserId(data[0].id);
            }
          }
        })
        .catch(console.error);
    }
  }, [isOpen, defaultUserId, bookToEdit]);

  // Reset or fill data when modal opens
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
      if (defaultUserId) {
        setUserId(defaultUserId);
      }
    }
  }, [bookToEdit, isOpen, defaultUserId]);

  if (!isOpen) return null;

  const isEditing = Boolean(bookToEdit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !userId) {
      toast({
        type: "error",
        title: "กรุณากรอกข้อมูลให้ครบ",
        message: "ชื่อหนังสือ, ชื่อผู้แต่ง และผู้ใช้ (userId) ห้ามเว้นว่าง",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && bookToEdit) {
        // PUT /api/books/:id
        const res = await fetch(`/api/books/${bookToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            author,
            userId: Number(userId),
            publishedYear: publishedYear ? Number(publishedYear) : new Date().getFullYear(),
            isAvailable,
            coverUrl,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "แก้ไขข้อมูลล้มเหลว");
        }

        toast({
          type: "success",
          title: "แก้ไขหนังสือสำเร็จ",
          message: `อัปเดต "${data.title}" เรียบร้อยแล้ว`,
          status: 200,
        });
      } else {
        // POST /api/books
        const payload: CreateBookDto = {
          title,
          author,
          userId: Number(userId),
          publishedYear: publishedYear ? Number(publishedYear) : new Date().getFullYear(),
          isAvailable,
          coverUrl,
        };

        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "เพิ่มหนังสือล้มเหลว");
        }

        toast({
          type: "success",
          title: "เพิ่มหนังสือเล่มใหม่สำเร็จ",
          message: `บันทึก "${data.title}" (ID: ${data.id}) ลงระบบแล้ว`,
          status: 201,
        });
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการบันทึก";
      toast({
        type: "error",
        title: "บันทึกข้อมูลไม่สำเร็จ",
        message: msg,
        status: isEditing ? 404 : 400,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <BookPlus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? `แก้ไขหนังสือ (ID: ${bookToEdit?.id})` : "เพิ่มหนังสือเล่มใหม่"}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User Select (Foreign Key: userId) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ผู้ใช้ / เจ้าของหนังสือ (userId - Foreign Key) <span className="text-rose-500">*</span>
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  #{u.id} {u.name} ({u.email})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              ตาราง Books เชื่อมโยงแบบ 1:N กับ Users ผ่าน Foreign Key <code className="font-mono text-indigo-600">userId</code>
            </p>
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
              placeholder="เช่น Clean Code, Design Patterns..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อผู้แต่ง (author) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="เช่น Robert C. Martin..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ปีที่พิมพ์ (publishedYear)
              </label>
              <input
                type="number"
                min={1000}
                max={2100}
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="2008"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะหนังสือ (isAvailable)
              </label>
              <div className="flex items-center h-10 px-3.5 rounded-xl border border-slate-300 bg-slate-50/50">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                  />
                  <span>{isAvailable ? "พร้อมใช้งาน (Available)" : "ไม่พร้อมใช้งาน (Unavailable)"}</span>
                </label>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="pt-2 border-t border-slate-100">
            <FileUploader
              currentUrl={coverUrl}
              onUploadSuccess={(url) => setCoverUrl(url)}
              onRemove={() => setCoverUrl(null)}
            />
          </div>

          {/* Modal Actions */}
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
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? "บันทึกการแก้ไข (200 OK)" : "เพิ่มหนังสือ (201 Created)"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
