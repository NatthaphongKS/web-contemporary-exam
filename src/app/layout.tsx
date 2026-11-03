/**
 * ==============================================================================
 * RootLayout: โครงสร้างหลักของแอปพลิเคชัน (src/app/layout.tsx)
 * ==============================================================================
 * ทำหน้าที่เป็น Shell ครอบทุกหน้าของแอปพลิเคชัน:
 * • กำหนดฟอนต์, สีพื้นหลัง, และภาษาภาษาไทย (lang="th")
 * • กำหนดค่า Metadata (Title & Description) สำหรับ SEO
 * • ห่อหุ้ม ToastProvider เพื่อให้บริการระบบแจ้งเตือนแบบ Floating Toast ทั่วทั้งแอป
 * • แสดง Navbar นำทางด้านบน และ Suspense Boundary สำหรับป้องกันปัญหา SSR/Streaming
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ToastProvider } from "@/components/toast";

/**
 * ข้อมูล Metadata ประจำเว็บไซต์
 */
export const metadata: Metadata = {
  title: "ระบบจัดการหนังสือห้องสมุด (Library Management) | Web Contemporary Exam",
  description: "โปรเจกต์ Next.js ระบบจัดการหนังสือห้องสมุด CRUD, File Upload และ Cheatsheet สำหรับเตรียมสอบปฏิบัติ",
};

/**
 * RootLayout
 * เลย์เอาต์หลักครอบทุกหน้าเว็บในโปรเจกต์
 * 
 * @component RootLayout
 * @param {Object} props - คุณสมบัติของคอมโพเนนต์
 * @param {React.ReactNode} props.children - หน้าเว็บลูกที่กำลังแสดงผล
 * @returns {JSX.Element} โครงสร้าง HTML พื้นฐานของแอปพลิเคชัน
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* ขั้นตอนที่ 1: ห่อหุ้มด้วย ToastProvider เพื่อให้ทุกคอมโพเนนต์เรียกใช้ useToast() ได้ */}
        <ToastProvider>
          {/* ขั้นตอนที่ 2: เรนเดอร์แถบนำทาง Navbar ด้านบน พร้อม Suspense Fallback */}
          <Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white" />}>
            <Navbar />
          </Suspense>

          {/* ขั้นตอนที่ 3: เรนเดอร์เนื้อหาหน้าเว็บหลัก (children) ภายในแท็ก <main> */}
          <main className="flex-1">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
