/**
 * ==============================================================================
 * Component: UserModal (ฟอร์มเพิ่ม/แก้ไขสมาชิก)
 * ==============================================================================
 * คอมโพเนนต์ Modal สำหรับจัดการข้อมูลตารางที่ 1 (Users):
 * • สร้างสมาชิกใหม่: `POST /api/users` พร้อมรับ Status `201 Created`
 * • แก้ไขข้อมูลสมาชิก: `PUT /api/users/:id` พร้อมรับ Status `200 OK`
 * • ทำ Client-side Validation ตรวจสอบความถูกต้องของชื่อและอีเมลก่อนส่ง Request
 */

"use client";

import React, { useState, useEffect } from "react";
import { User, CreateUserDto } from "@/types/user";
import { useToast } from "@/components/toast";
import { X, UserPlus, Edit3, Loader2 } from "lucide-react";

/**
 * พร็อพส์สำหรับคอมโพเนนต์ UserModal
 */
interface UserModalProps {
  /** สถานะเปิด/ปิด Modal */
  isOpen: boolean;
  /** ฟังก์ชันสั่งปิด Modal */
  onClose: () => void;
  /** ฟังก์ชัน Callback เมื่อบันทึกสำเร็จ (สั่งให้หน้า Dashboard รีเฟรชข้อมูล) */
  onSuccess: () => void;
  /** สมาชิกที่ต้องการแก้ไข (ถ้าเป็น null หรือ undefined จะเป็นโหมดสร้างสมาชิกใหม่) */
  userToEdit?: User | null;
}

/**
 * UserModal
 * ป๊อปอัปฟอร์มสำหรับสร้างสมาชิกใหม่ (POST) หรือแก้ไขข้อมูลสมาชิกเดิม (PUT)
 * 
 * @component UserModal
 * @param {UserModalProps} props - พร็อพส์ควบคุมสถานะและการส่งข้อมูล
 * @returns {JSX.Element | null} Modal Dialog หรือ null หาก isOpen เป็น false
 */
export function UserModal({
  isOpen,
  onClose,
  onSuccess,
  userToEdit,
}: UserModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Controlled States สำหรับฟอร์ม
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // เติมข้อมูลลงฟอร์มเมื่ออยู่ในโหมดแก้ไข หรือล้างฟอร์มเมื่อโหมดเพิ่มใหม่
  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
    } else {
      setName("");
      setEmail("");
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(userToEdit);

  /**
   * จัดการการกด Submit ฟอร์มสมาชิก (รองรับทั้ง POST และ PUT)
   * 
   * @function handleSubmit
   * @param {React.FormEvent} e - Form Submit Event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // ขั้นตอนที่ 1: ป้องกัน Default Form Submit Behavior ของเบราว์เซอร์
    e.preventDefault();

    // ขั้นตอนที่ 2: Client-side Validation ตรวจสอบค่าว่างของชื่อและอีเมล
    if (!name.trim() || !email.trim()) {
      toast({
        type: "error",
        title: "กรุณากรอกข้อมูลให้ครบ",
        message: "ชื่อ-นามสกุล และอีเมล ห้ามเว้นว่าง",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && userToEdit) {
        // ขั้นตอนที่ 3A: กรณีแก้ไขสมาชิก -> ส่งคำขอ PUT /api/users/:id (200 OK)
        const res = await fetch(`/api/users/${userToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim() }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "แก้ไขสมาชิกไม่สำเร็จ");

        toast({
          type: "success",
          title: "แก้ไขข้อมูลสมาชิกสำเร็จ",
          message: `อัปเดต "${data.name}" เรียบร้อยแล้ว`,
          status: 200,
        });
      } else {
        // ขั้นตอนที่ 3B: กรณีเพิ่มสมาชิกใหม่ -> ส่งคำขอ POST /api/users (201 Created)
        const payload: CreateUserDto = { name: name.trim(), email: email.trim() };
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "เพิ่มสมาชิกไม่สำเร็จ");

        toast({
          type: "success",
          title: "เพิ่มสมาชิกใหม่สำเร็จ",
          message: `สร้างสมาชิก "${data.name}" (ID: ${data.id}) สำเร็จ`,
          status: 201,
        });
      }

      // ขั้นตอนที่ 4: สั่งให้อัปเดตข้อมูลบนหน้าจอ และปิดกล่อง Modal
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast({
        type: "error",
        title: "บันทึกข้อมูลไม่สำเร็จ",
        message: err instanceof Error ? err.message : "Error",
        status: 400,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? `แก้ไขสมาชิก (ID: ${userToEdit?.id})` : "เพิ่มสมาชิกใหม่"}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {isEditing ? `PUT /api/users/${userToEdit?.id}` : "POST /api/users"}
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อ-นามสกุล (name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น สมชาย ใจดี"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              อีเมล (email) <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="เช่น somchai@example.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
              <span>{isEditing ? "บันทึกการแก้ไข" : "สร้างสมาชิก"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
