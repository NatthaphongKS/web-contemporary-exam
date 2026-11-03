"use client";

/**
 * ==============================================================================
 * Navbar Component (Top Navigation Bar)
 * ==============================================================================
 * แถบเมนูด้านบนของเว็บไซต์ (Sticky Navigation Bar)
 * • แสดงโลโก้ระบบ Library Exam
 * • ไฮไลต์เมนูที่กำลังเปิดใช้งาน (Active Navigation Link)
 * • ลิงก์ไปยังหน้าหลัก (Dashboard), คู่มือสรุปเนื้อหาสอบ (/guide) และ OpenAPI Guide (/openapi-guide)
 * • ลิงก์ตรงไปยัง GitHub Repository สำหรับส่งงาน
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, BookText, Zap } from "lucide-react";

/**
 * Navbar
 * แสดงส่วนหัวและแถบเมนูนำทางหลักของเว็บไซต์
 * 
 * @component Navbar
 * @returns {JSX.Element} แถบนำทางด้านบน
 */
export function Navbar() {
  // ขั้นตอนที่ 1: ตรวจสอบ URL Path ปัจจุบันเพื่อคำนวณ Active State ของแต่ละแท็บ
  const pathname = usePathname();

  // ขั้นตอนที่ 2: กำหนดรายการเมนูนำทางและเงื่อนไขการ Active
  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/" || pathname.startsWith("/books"),
    },
    {
      href: "/guide",
      label: "คู่มือสอบ",
      icon: BookText,
      active: pathname.startsWith("/guide"),
    },
    {
      href: "/openapi-guide",
      label: "OpenAPI",
      icon: Zap,
      active: pathname.startsWith("/openapi-guide"),
    },
  ];

  // ขั้นตอนที่ 3: เรนเดอร์ Header Navigation Bar
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight">Library Exam</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      item.active
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.active ? "text-indigo-600" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* GitHub repo icon link */}
            <a
              href="https://github.com/NatthaphongKS/web-contemporary-exam.git"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              title="GitHub Repository"
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
