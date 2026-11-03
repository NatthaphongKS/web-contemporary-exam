/**
 * ==============================================================================
 * Component: BookModal (ฟอร์มเพิ่ม/แก้ไขหนังสือ)
 * ==============================================================================
 * คอมโพเนนต์ Modal Popup สำหรับจัดการข้อมูลหนังสือ:
 * • รองรับ 2 โหมดใน Component เดียว:
 *   - Create Mode (`bookToEdit === null`): เรียก `POST /api/books` (201 Created)
 *   - Edit Mode (`bookToEdit !== null`): เรียก `PUT /api/books/:id` (200 OK)
 * • ดึงรายชื่อสมาชิก (`GET /api/users`) มาแสดงใน `<select>` เพื่อผูก Foreign Key `userId`
 * • มีคอมโพเนนต์ `FileUploader` สำหรับอัปโหลดและพรีวิวภาพหน้าปกหนังสือ
 */

"use client";

import React, { useState, useEffect } from "react";
import { Book, CreateBookDto } from "@/types/book";
import { User } from "@/types/user";
import { useToast } from "@/components/toast";
import { FileUploader } from "@/components/file-uploader";
import { X, BookPlus, Edit3, Loader2 } from "lucide-react";

interface BookModalProps {
  isOpen: boolean;                  // สถานะเปิด/ปิด Modal
  onClose: () => void;              // ฟังก์ชันปิด Modal
  onSuccess: () => void;            // ฟังก์ชัน Callback เมื่อบันทึกสำเร็จ (ให้หน้าหลักรีเฟรชข้อมูล)
  bookToEdit?: Book | null;         // หนังสือที่ส่งมาแก้ไข (ถ้าไม่มี = สร้างใหม่)
  defaultUserId?: number | null;    // รหัส User เริ่มต้นที่จะเลือกใน Dropdown (เช่น จาก Master Column)
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

  // ---------------------------------------------------------------------------
  // Form Controlled States (สถานะของฟิลด์ในฟอร์ม)
  // ---------------------------------------------------------------------------
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [userId, setUserId] = useState<number>(1);
  const [publishedYear, setPublishedYear] = useState<number | "">("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  // รายชื่อผู้ใช้สำหรับใส่ใน Dropdown ให้เลือก Foreign Key userId
  const [users, setUsers] = useState<User[]>([]);

  // 1. ดึงรายชื่อสมาชิกทั้งหมดเมื่อ Modal เปิดขึ้นมา
  useEffect(() => {
    if (isOpen) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data: User[]) => {
          if (Array.isArray(data)) {
            setUsers(data);
            // ถ้าเป็นการสร้างใหม่ ให้ตั้งค่า defaultUserId ที่ส่งมา หรือคนแรกในระบบ
            if (!bookToEdit) {
              setUserId(defaultUserId || (data.length > 0 ? data[0].id : 1));
            }
          }
        })
        .catch(console.error);
    }
  }, [isOpen, defaultUserId, bookToEdit]);

  // 2. เติมข้อมูลลงฟอร์ม (Prefill Form) เมื่ออยู่ในโหมดแก้ไข หรือล้างฟอร์มเมื่อโหมดสร้างใหม่
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

  /**
   * จัดการการ Submit ฟอร์ม
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ตรวจสอบความถูกต้องเบื้องต้น (Client-side Validation)
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

      // เลือกว่าจะส่งคำขอไปที่ URL และ Method ใด ตามโหมด (Create หรือ Edit)
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

      onSuccess(); // สั่งให้หน้าหลักอัปเดตข้อมูล
      onClose();   // ปิด Modal
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
        {/* Header Modal */}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ชื่อหนังสือ */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อหนังสือ (Title) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น Clean Code, The Pragmatic Programmer"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* ชื่อผู้แต่ง */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อผู้แต่ง (Author) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="เช่น Robert C. Martin, Martin Fowler"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* สมาชิกเจ้าของหนังสือ (Foreign Key userId) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              สมาชิกเจ้าของหนังสือ (Foreign Key: userId) <span className="text-rose-500">*</span>
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  ID #{u.id}: {u.name} ({u.email})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              * ข้อมูลจะผูกกับสมาชิกคนนี้ และจะถูก Cascade Delete หากสมาชิกถูกลบ
            </p>
          </div>

          {/* ปีที่พิมพ์ และ สถานะความพร้อม */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ปีที่พิมพ์ (ค.ศ.)
              </label>
              <input
                type="number"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value ? Number(e.target.value) : "")}
                placeholder="2024"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานะหนังสือ
              </label>
              <select
                value={isAvailable ? "true" : "false"}
                onChange={(e) => setIsAvailable(e.target.value === "true")}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="true">พร้อมใช้งาน</option>
                <option value="false">ไม่พร้อมใช้งาน</option>
              </select>
            </div>
          </div>

          {/* คอมโพเนนต์อัปโหลดรูปภาพปก (File Upload) */}
          <div className="pt-1">
            <FileUploader
              currentUrl={coverUrl}
              onUploadSuccess={(url) => setCoverUrl(url)}
              onRemove={() => setCoverUrl(null)}
            />
          </div>

          {/* ปุ่มบันทึกและยกเลิก */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditing ? "บันทึกการแก้ไข" : "เพิ่มหนังสือ"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
