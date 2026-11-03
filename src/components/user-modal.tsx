"use client";

import React, { useState, useEffect } from "react";
import { User, CreateUserDto } from "@/types/user";
import { useToast } from "@/components/toast";
import { X, UserPlus, Edit3, Loader2 } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userToEdit?: User | null;
}

export function UserModal({
  isOpen,
  onClose,
  onSuccess,
  userToEdit,
}: UserModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        // PUT /api/users/:id
        const res = await fetch(`/api/users/${userToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
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
        // POST /api/users
        const payload: CreateUserDto = { name, email };
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
        {/* Header */}
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

        {/* Form */}
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
              placeholder="somchai@example.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
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
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? "บันทึก (200 OK)" : "เพิ่มสมาชิก (201 Created)"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
