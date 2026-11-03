"use client";

/**
 * ==============================================================================
 * Toast Notification System & Context Provider
 * ==============================================================================
 * ระบบแสดงผลการแจ้งเตือน (Toast Notification) แบบ Real-time ทั่วทั้งแอปพลิเคชัน
 * • รองรับการแสดงผล 3 สถานะ: success (เขียว), error (แดง), info (น้ำเงิน)
 * • แสดง HTTP Status Badge เพื่อให้ผู้ใช้/ผู้ตรวจข้อสอบเห็น Response Code ชัดเจน (เช่น 200, 201, 400, 404, 500)
 * • ปิดอัตโนมัติหลังผ่านไป 4.5 วินาที หรือกดปุ่มปิดด้วยตนเอง
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

/**
 * โครงสร้างข้อมูลของการแจ้งเตือน Toast แต่ละรายการ
 */
export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  status?: number; // e.g. 200, 201, 404, 400
}

interface ToastContextType {
  toast: (options: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * ToastProvider
 * คอมโพเนนต์ Context Provider จัดการและเรนเดอร์ Floating Notification Box
 * 
 * @component ToastProvider
 * @param {Object} props - คุณสมบัติของคอมโพเนนต์
 * @param {React.ReactNode} props.children - คอมโพเนนต์ลูกที่อยู่ภายในแอปพลิเคชัน
 * @returns {JSX.Element} Provider และ Floating Toast Container
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  /**
   * ฟังก์ชันเรียกแสดงกล่องแจ้งเตือนใหม่
   * 
   * @function toast
   * @param {Omit<ToastMessage, "id">} options - ข้อมูลแจ้งเตือน (type, title, message, status)
   */
  const toast = useCallback(
    ({ type, title, message, status }: Omit<ToastMessage, "id">) => {
      // ขั้นตอนที่ 1: สร้าง Unique ID ด้วย Timestamp และ Random Number
      const id = `${Date.now()}_${Math.random()}`;
      const newToast: ToastMessage = { id, type, title, message, status };

      // ขั้นตอนที่ 2: บันทึก Toast ใหม่ต่อท้ายรายการ State
      setToasts((prev) => [...prev, newToast]);

      // ขั้นตอนที่ 3: ตั้งเวลา Auto Dismiss ปิดการแจ้งเตือนอัตโนมัติหลัง 4.5 วินาที
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  /**
   * ฟังก์ชันปิดการแจ้งเตือน Toast รายการที่ระบุ
   * 
   * @function removeToast
   * @param {string} id - รหัส ID ของ Toast ที่ต้องการปิด
   */
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * ฟังก์ชันคำนวณและแสดงผลป้าย Badge สำหรับ HTTP Status Code
   * 
   * @function getStatusBadge
   * @param {number} [status] - รหัสสถานะ HTTP (เช่น 200, 201, 400, 404, 500)
   * @returns {JSX.Element | null} ป้ายสัญลักษณ์สถานะ หรือ null หากไม่ได้ระบุ
   */
  const getStatusBadge = (status?: number) => {
    if (!status) return null;
    let color = "bg-slate-100 text-slate-700 border-slate-300";
    if (status >= 200 && status < 300) {
      // 2xx Success: สีเขียว Emerald
      color = "bg-emerald-100 text-emerald-800 border-emerald-300 font-mono";
    } else if (status >= 400 && status < 500) {
      // 4xx Client Error: สีส้ม Amber
      color = "bg-amber-100 text-amber-800 border-amber-300 font-mono";
    } else if (status >= 500) {
      // 5xx Server Error: สีแดง Rose
      color = "bg-rose-100 text-rose-800 border-rose-300 font-mono";
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${color}`}
      >
        HTTP {status}
      </span>
    );
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Floating Container สำหรับแสดง Toast Notifications มุมขวาล่าง */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              t.type === "success"
                ? "bg-white border-emerald-200 text-slate-800 shadow-emerald-50"
                : t.type === "error"
                ? "bg-white border-rose-200 text-slate-800 shadow-rose-50"
                : "bg-white border-indigo-200 text-slate-800 shadow-indigo-50"
            }`}
          >
            {t.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            {t.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            {t.type === "info" && (
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                {getStatusBadge(t.status)}
              </div>
              {t.message && (
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  {t.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Custom Hook สำหรับเรียกใช้งาน Toast Context จากคอมโพเนนต์ใด ๆ ในแอป
 * 
 * @function useToast
 * @returns {ToastContextType} ฟังก์ชัน `toast({ type, title, message, status })`
 * @throws {Error} หากเรียกใช้นอก ToastProvider
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
