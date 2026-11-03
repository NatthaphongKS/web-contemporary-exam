/**
 * ==============================================================================
 * Component: FileUploader (คอมโพเนนต์อัปโหลดไฟล์พร้อมพรีวิว)
 * ==============================================================================
 * คอมโพเนนต์สำหรับรับไฟล์รูปภาพหน้าปกหนังสือ:
 * 
 * 💡 เคล็ดลับสำคัญสำหรับข้อสอบปฏิบัติ:
 * 1. ทันทีที่ผู้ใช้เลือกไฟล์ ให้ใช้ `URL.createObjectURL(file)` เพื่อพรีวิวภาพได้ทันทีโดยไม่ต้องรอ Upload เสร็จ
 * 2. ส่งไฟล์ไปยัง API ผ่าน `FormData` โดยใช้ `formData.append("file", file)`
 * 3. ⚠️ ห้ามกำหนด Header `Content-Type: multipart/form-data` ใน fetch เด็ดขาด
 *    ปล่อยให้ Browser จัดการ Boundary อัตโนมัติ
 * 4. เมื่อ API ตอบกลับด้วย Status 201 Created ให้ส่ง `data.url` คืนผ่าน callback `onUploadSuccess`
 */

"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

/**
 * พร็อพส์สำหรับคอมโพเนนต์ FileUploader
 */
interface FileUploaderProps {
  /** URL รูปภาพปัจจุบัน (กรณีเปิดแก้ไขหนังสือเดิม) */
  currentUrl?: string | null;
  /** Callback เมื่ออัปโหลดสำเร็จ ส่ง URL รูปภาพกลับไปยัง Form */
  onUploadSuccess: (url: string) => void;
  /** Callback เมื่อกดลบรูปภาพ */
  onRemove?: () => void;
}

/**
 * FileUploader
 * คอมโพเนนต์อัปโหลดไฟล์รูปภาพหน้าปกหนังสือ พร้อม Instant Preview
 * 
 * @component FileUploader
 * @param {FileUploaderProps} props - พร็อพส์ของคอมโพเนนต์
 * @returns {JSX.Element} ส่วนฟอร์มอัปโหลดรูปภาพ
 */
export function FileUploader({
  currentUrl,
  onUploadSuccess,
  onRemove,
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * ดักจับ Event เมื่อผู้ใช้เลือกไฟล์ผ่าน `<input type="file" />`
   * 
   * @function handleFileChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event ของ Input element
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ขั้นตอนที่ 1: ดึงไฟล์แรกที่ผู้ใช้เลือก
    const file = e.target.files?.[0];
    if (!file) return;

    // ขั้นตอนที่ 2: รีเซ็ตข้อความผิดพลาดเดิม
    setError(null);

    // ขั้นตอนที่ 3: ตรวจสอบขนาดไฟล์เบื้องต้นที่ฝั่ง Client (Client-side validation จำกัด 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("ขนาดไฟล์เกิน 5MB กรุณาเลือกไฟล์ภาพใหม่");
      return;
    }

    // ขั้นตอนที่ 4: สร้าง Local Object URL เพื่อพรีวิวภาพบนหน้าจอทันที (Instant Preview)
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // ขั้นตอนที่ 5: เตรียมข้อมูล FormData สำหรับอัปโหลด
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // ขั้นตอนที่ 6: ส่งคำขอแบบ multipart/form-data ไปยัง POST /api/upload
      // ⚠️ กฎสำคัญ: ห้ามใส่ Content-Type ใน headers เด็ดขาด ปล่อยให้เบราว์เซอร์จัดการ boundary เอง
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการอัปโหลด");
      }

      // ขั้นตอนที่ 7: เมื่อสำเร็จ ส่ง URL ที่เซิร์ฟเวอร์สร้างขึ้นกลับไปให้ฟอร์มแม่ผ่าน callback
      onUploadSuccess(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "อัปโหลดไฟล์ล้มเหลว";
      setError(message);
      // หากอัปโหลดล้มเหลว ให้คืนค่า preview เดิมกลับมา
      setPreviewUrl(currentUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * ล้างรูปภาพที่เลือกและคืนค่าฟอร์มกลับสู่สถานะว่าง
   * 
   * @function handleClear
   */
  const handleClear = () => {
    // ขั้นตอนที่ 1: ล้าง URL พรีวิวและข้อผิดพลาดออกจาก State
    setPreviewUrl(null);
    setError(null);

    // ขั้นตอนที่ 2: รีเซ็ตค่าของ input element เป็นค่าว่าง เพื่อให้เลือกไฟล์เดิมซ้ำได้ถ้าต้องการ
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // ขั้นตอนที่ 3: แจ้งฟอร์มแม่ว่ามีการลบรูปภาพออกแล้ว
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        รูปภาพหน้าปกหนังสือ (File Upload)
      </label>

      {/* Input ซ่อนไว้แล้วคลิกผ่าน UI สวยงาม */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {previewUrl ? (
        // กล่องแสดงผลพรีวิวเมื่อมีรูปภาพแล้ว
        <div className="relative group border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center gap-4">
          <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0 shadow-xs">
            <Image
              src={previewUrl}
              alt="Book cover preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>อัปโหลดรูปภาพพร้อมใช้งาน</span>
            </div>
            <p className="text-xs text-slate-500 truncate font-mono">{previewUrl}</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
              >
                เปลี่ยนรูปใหม่
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleClear}
                disabled={isUploading}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium"
              >
                ลบรูปภาพ
              </button>
            </div>
          </div>

          {/* Loading Overlay ระหว่างที่กำลังส่งไฟล์ */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-xl">
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังอัปโหลดไฟล์...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        // กล่อง Drag & Drop / คลิกเพื่อเลือกไฟล์
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-xl p-5 text-center transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100 text-slate-500 group-hover:text-indigo-600 flex items-center justify-center mx-auto mb-2 transition-colors">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>
          <p className="text-xs font-medium text-slate-700 group-hover:text-indigo-700">
            {isUploading ? "กำลังประมวลผลไฟล์..." : "คลิกเพื่อเลือกไฟล์ หรือลากรูปภาพมาวางที่นี่"}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP สูงสุดไม่เกิน 5MB</p>
        </div>
      )}

      {/* ข้อความแจ้งเตือนข้อผิดพลาดถ้ามี */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
