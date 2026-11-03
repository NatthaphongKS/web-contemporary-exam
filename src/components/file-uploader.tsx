"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface FileUploaderProps {
  currentUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
}

export function FileUploader({
  currentUrl,
  onUploadSuccess,
  onRemove,
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setError(null);

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("ขนาดไฟล์เกิน 5MB กรุณาเลือกไฟล์ใหม่");
      return;
    }

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to /api/upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการอัปโหลด");
      }

      onUploadSuccess(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "อัปโหลดไฟล์ล้มเหลว";
      setError(message);
      setPreviewUrl(currentUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        รูปภาพหน้าปกหนังสือ (File Upload)
      </label>

      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {previewUrl ? (
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
            <p className="text-xs text-slate-500 truncate">{previewUrl}</p>

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

          {isUploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-xl">
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังอัปโหลด...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
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
            คลิกเพื่อเลือกไฟล์ หรือลากรูปภาพมาวางที่นี่
          </p>
          <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP สูงสุด 5MB</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
