"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BookMarked, Terminal, Sparkles, Zap } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "ระบบจัดการหนังสือ (Dashboard)",
      icon: BookMarked,
      active: pathname === "/" || pathname.startsWith("/books"),
    },
    {
      href: "/guide",
      label: "คู่มือเตรียมสอบ (Study Guide)",
      icon: Terminal,
      active: pathname.startsWith("/guide"),
    },
    {
      href: "/openapi-guide",
      label: "OpenAPI & Postman Gen (ไม่ต้องเริ่มจาก 0)",
      icon: Zap,
      active: pathname.startsWith("/openapi-guide"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Course Tag */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight">Library Exam</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Next.js CRUD
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal">ระบบห้องสมุด & เตรียมสอบปฏิบัติ Web</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    item.active
                      ? "bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? "text-indigo-600" : "text-slate-500"}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.label.split(" ")[0]}</span>
                </Link>
              );
            })}

            <div className="hidden lg:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200 text-xs text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>In-Memory Mock Store</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
