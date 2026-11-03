"use client";

/**
 * ==============================================================================
 * CodeBlock Component
 * ==============================================================================
 * คอมโพเนนต์แสดงผลโค้ดตัวอย่าง (Terminal / Shell Commands / JSON Payloads)
 * • ออกแบบมาในธีม Dark Slate สไตล์ Terminal พร้อมแถบหัวเรื่องด้านบน
 * • มีปุ่ม Copy ในตัว พร้อม Feedback แจ้งเตือนเมื่อคัดลอกสำเร็จ
 * • ใช้งานหลักในหน้าคู่มือเตรียมสอบ /guide และ /openapi-guide
 */

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

/**
 * พร็อพส์สำหรับคอมโพเนนต์ CodeBlock
 */
interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

/**
 * CodeBlock
 * แสดงบล็อกโค้ดพร้อมปุ่มคัดลอก (Copy to Clipboard)
 * 
 * @component CodeBlock
 * @param {CodeBlockProps} props - ข้อความโค้ดและหัวเรื่อง
 * @returns {JSX.Element} กล่องโค้ดสไตล์ Terminal
 */
export function CodeBlock({ code, language = "bash", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  /**
   * ฟังก์ชันคัดลอกโค้ดลงในคลิปบอร์ดของผู้ใช้
   * 
   * @function handleCopy
   */
  const handleCopy = async () => {
    try {
      // ขั้นตอนที่ 1: เขียนข้อความโค้ดลง Clipboard ผ่าน Web API
      await navigator.clipboard.writeText(code);

      // ขั้นตอนที่ 2: เปลี่ยนสถานะ copied เป็น true เพื่อสลับไอคอนเป็นเครื่องหมายถูก
      setCopied(true);

      // ขั้นตอนที่ 3: หน่วงเวลา 2 วินาทีแล้วคืนสถานะปุ่มกลับสู่ปกติ
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-md my-4">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-200">{title || language}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            copied
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600"
          }`}
          title="คัดลอกโค้ดลง Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>คัดลอกแล้ว!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>คัดลอก (Copy)</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-sm text-slate-100 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
