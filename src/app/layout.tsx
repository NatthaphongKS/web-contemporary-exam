import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: "ระบบจัดการหนังสือห้องสมุด (Library Management) | Web Contemporary Exam",
  description: "โปรเจกต์ Next.js ระบบจัดการหนังสือห้องสมุด CRUD, File Upload และ Cheatsheet สำหรับเตรียมสอบปฏิบัติ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <ToastProvider>
          <Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">
            <Suspense fallback={null}>{children}</Suspense>
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
