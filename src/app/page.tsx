"use client";

import { useState, useEffect, useCallback } from "react";
import { Book } from "@/types/book";
import { BookCard } from "@/components/book-card";
import { BookTable } from "@/components/book-table";
import { BookModal } from "@/components/book-modal";
import { useToast } from "@/components/toast";
import {
  BookPlus,
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function LibraryDashboardPage() {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAvailable, setFilterAvailable] = useState<"all" | "available" | "borrowed">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  // Fetch books from API (รองรับ isBackground เพื่อดึงข้อมูลเงียบๆ โดยไม่เซ็ต loading)
  const fetchBooks = useCallback(async (isBackground = false) => {
    if (!isBackground) {
      setIsLoading(true);
    }
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (filterAvailable === "available") params.append("isAvailable", "true");
      if (filterAvailable === "borrowed") params.append("isAvailable", "false");

      const res = await fetch(`/api/books?${params.toString()}`);
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลหนังสือได้");
      const data = await res.json();
      setBooks(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ดึงข้อมูลผิดพลาด";
      toast({
        type: "error",
        title: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
        message: msg,
        status: 500,
      });
    } finally {
      if (!isBackground) {
        setIsLoading(false);
      }
    }
  }, [search, filterAvailable, toast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Toggle Borrow / Return Status (Optimistic Update: แก้ไขใน Array ทันที)
  const handleToggleStatus = async (id: number) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;

    const previousStatus = book.isAvailable;
    const newStatus = !previousStatus;

    // 1. Optimistic Update: อัปเดต state ของหนังสือเล่มนั้นใน Array ทันที หน้าจอไม่กระตุก ไม่เลื่อน
    setBooks((prevBooks) =>
      prevBooks.map((b) => (b.id === id ? { ...b, isAvailable: newStatus } : b))
    );

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "อัปเดตสถานะไม่สำเร็จ");

      toast({
        type: "success",
        title: newStatus ? "ทำรายการคืนสำเร็จ" : "ทำรายการยืมสำเร็จ",
        message: `หนังสือ "${data.title}" สถานะคือ: ${newStatus ? "พร้อมให้ยืม" : "ถูกยืมอยู่"}`,
        status: 200,
      });

      // 2. Re-fetch แบบ background เงียบๆ โดยไม่เซ็ต isLoading(true)
      fetchBooks(true);
    } catch (err: unknown) {
      // Rollback กลับสู่สถานะเดิมหากเกิดข้อผิดพลาด
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.id === id ? { ...b, isAvailable: previousStatus } : b))
      );

      const msg = err instanceof Error ? err.message : "เปลี่ยนสถานะล้มเหลว";
      toast({
        type: "error",
        title: "เปลี่ยนสถานะไม่สำเร็จ",
        message: msg,
        status: 404,
      });
    }
  };

  // Delete Book (Optimistic Update)
  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`คุณต้องการลบหนังสือ "${title}" (ID: ${id}) ใช่หรือไม่?`)) {
      return;
    }

    const previousBooks = [...books];

    // ลบออกจาก State ทันทีเพื่อให้ UI ตอบสนองรวดเร็ว
    setBooks((prev) => prev.filter((b) => b.id !== id));

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ลบข้อมูลล้มเหลว");

      toast({
        type: "success",
        title: "ลบหนังสือสำเร็จ",
        message: `ลบ "${title}" ออกจากระบบแล้ว`,
        status: 200,
      });

      fetchBooks(true);
    } catch (err: unknown) {
      // Rollback
      setBooks(previousBooks);

      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบ";
      toast({
        type: "error",
        title: "ลบหนังสือไม่สำเร็จ",
        message: msg,
        status: 404,
      });
    }
  };

  const handleOpenAdd = () => {
    setBookToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setBookToEdit(book);
    setIsModalOpen(true);
  };

  // Statistics
  const totalCount = books.length;
  const availableCount = books.filter((b) => b.isAvailable).length;
  const borrowedCount = totalCount - availableCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ระบบจัดการหนังสือในห้องสมุด
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5" /> Next.js In-Memory Store
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            จำลองระบบ RESTful API (CRUD) ครบตามข้อกำหนด พร้อมอัปโหลดไฟล์ปกหนังสือสำหรับเตรียมสอบ
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-all hover:shadow-indigo-100"
        >
          <BookPlus className="w-4 h-4" />
          <span>เพิ่มหนังสือใหม่ (POST)</span>
        </button>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">หนังสือทั้งหมดในระบบ</p>
            <p className="text-2xl font-bold text-slate-900">{totalCount} เล่ม</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">พร้อมให้ยืม (Available)</p>
            <p className="text-2xl font-bold text-emerald-700">{availableCount} เล่ม</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">กำลังถูกยืม (Borrowed)</p>
            <p className="text-2xl font-bold text-amber-700">{borrowedCount} เล่ม</p>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Filter, View Mode */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อหนังสือ หรือชื่อผู้แต่ง..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Filter and View Toggle */}
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.value as "all" | "available" | "borrowed")}
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="available">เฉพาะพร้อมให้ยืม</option>
            <option value="borrowed">เฉพาะที่ถูกยืมอยู่</option>
          </select>

          {/* Refresh button */}
          <button
            onClick={() => fetchBooks(false)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="รีเฟรชข้อมูล (GET /api/books)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* View mode toggle */}
          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 bg-slate-200/70 rounded-2xl border border-slate-200"></div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">ไม่พบหนังสือที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-slate-400 mt-1">ลองล้างคำค้นหา หรือกดปุ่ม &quot;เพิ่มหนังสือใหม่&quot;</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <BookTable
          books={books}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Add / Edit Modal */}
      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchBooks(true)}
        bookToEdit={bookToEdit}
      />
    </div>
  );
}
