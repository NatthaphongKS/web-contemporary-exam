"use client";

import { useState, useEffect, useCallback } from "react";
import { Book } from "@/types/book";
import { User } from "@/types/user";
import { BookCard } from "@/components/book-card";
import { BookTable } from "@/components/book-table";
import { BookModal } from "@/components/book-modal";
import { UserCard } from "@/components/user-card";
import { UserModal } from "@/components/user-modal";
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
  Users,
  UserPlus,
  Layers,
} from "lucide-react";

export default function LibraryDashboardPage() {
  const { toast } = useToast();

  // Data states
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [filterAvailable, setFilterAvailable] = useState<"all" | "available" | "unavailable">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) setUsers(await res.json());
    } catch (err) {
      console.error("fetchUsers error:", err);
    }
  }, []);

  // Fetch Books
  const fetchBooks = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append("search", search.trim());
        if (filterAvailable === "available") params.append("isAvailable", "true");
        if (filterAvailable === "unavailable") params.append("isAvailable", "false");
        if (selectedUser) params.append("userId", String(selectedUser.id));

        const res = await fetch(`/api/books?${params.toString()}`);
        if (res.ok) setBooks(await res.json());
      } catch (err) {
        console.error("fetchBooks error:", err);
      } finally {
        if (!isBackground) setIsLoading(false);
      }
    },
    [search, filterAvailable, selectedUser]
  );

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, [fetchUsers, fetchBooks]);

  const refreshAll = (isBackground = true) => {
    fetchUsers();
    fetchBooks(isBackground);
  };

  // Toggle Availability Status (Optimistic Update)
  const handleToggleStatus = async (id: number) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;

    const newStatus = !book.isAvailable;
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, isAvailable: newStatus } : b)));

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      if (!res.ok) throw new Error();

      toast({
        type: "success",
        title: "เปลี่ยนสถานะสำเร็จ",
        message: `สถานะคือ: ${newStatus ? "พร้อมใช้งาน" : "ไม่พร้อมใช้งาน"}`,
        status: 200,
      });
      refreshAll(true);
    } catch {
      setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, isAvailable: !newStatus } : b)));
      toast({ type: "error", title: "เกิดข้อผิดพลาด", message: "เปลี่ยนสถานะไม่สำเร็จ", status: 400 });
    }
  };

  // Delete Book
  const handleDeleteBook = async (id: number, title: string) => {
    if (!confirm(`คุณต้องการลบหนังสือ "${title}" ใช่หรือไม่?`)) return;

    const prevBooks = [...books];
    setBooks((prev) => prev.filter((b) => b.id !== id));

    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ type: "success", title: "ลบสำเร็จ", message: `ลบ "${title}" แล้ว`, status: 200 });
      refreshAll(true);
    } catch {
      setBooks(prevBooks);
      toast({ type: "error", title: "ลบไม่สำเร็จ", message: "เกิดข้อผิดพลาด", status: 400 });
    }
  };

  // Delete User
  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`คุณต้องการลบสมาชิก "${name}" ใช่หรือไม่?`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ type: "success", title: "ลบสมาชิกสำเร็จ", message: `ลบ "${name}" แล้ว`, status: 200 });
      if (selectedUser?.id === id) setSelectedUser(null);
      refreshAll(true);
    } catch {
      toast({ type: "error", title: "ลบไม่สำเร็จ", message: "เกิดข้อผิดพลาด", status: 400 });
    }
  };

  // Stats
  const availableCount = books.filter((b) => b.isAvailable).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              ระบบจัดการสมาชิก & หนังสือ
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              1 : N Relational
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            เลือกสมาชิกฝั่งซ้ายเพื่อดูหนังสือของคนนั้นฝั่งขวา หรือกดดูทั้งหมด
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setUserToEdit(null); setIsUserModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ เพิ่มสมาชิก</span>
          </button>
          <button
            onClick={() => { setBookToEdit(null); setIsBookModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <BookPlus className="w-3.5 h-3.5" />
            <span>+ เพิ่มหนังสือ</span>
          </button>
        </div>
      </div>

      {/* 2-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Users Selector */}
        <aside className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">สมาชิก (ตารางที่ 1)</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 font-mono">
              {users.length} คน
            </span>
          </div>

          {/* "View All" Button */}
          <button
            onClick={() => setSelectedUser(null)}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all mb-2.5 text-xs ${
              selectedUser === null
                ? "bg-indigo-600 text-white border-indigo-600 font-semibold"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>ดูหนังสือทั้งหมด (ทุกคน)</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-black/10">All</span>
          </button>

          {/* Users List */}
          <div className="flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-0.5">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={selectedUser?.id === user.id}
                onSelect={(u) => setSelectedUser(selectedUser?.id === u.id ? null : u)}
                onEdit={(u) => { setUserToEdit(u); setIsUserModalOpen(true); }}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>
        </aside>

        {/* Right: Books Display */}
        <main className="lg:col-span-8 flex flex-col gap-3">
          {/* Header & Stats */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ตารางที่ 2: Books
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {selectedUser ? `หนังสือของ: ${selectedUser.name}` : "รายการหนังสือทั้งหมด"}
                <span className="text-xs font-normal text-slate-500 ml-2">({books.length} เล่ม)</span>
              </h2>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> พร้อมใช้งาน: {availableCount}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                <XCircle className="w-3.5 h-3.5" /> ไม่พร้อมใช้งาน: {books.length - availableCount}
              </span>
            </div>
          </div>

          {/* Search & View Toolbar */}
          <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อหนังสือ หรือผู้แต่ง..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.value as "all" | "available" | "unavailable")}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-700"
            >
              <option value="all">ทั้งหมด</option>
              <option value="available">พร้อมใช้งาน</option>
              <option value="unavailable">ไม่พร้อมใช้งาน</option>
            </select>

            <button
              onClick={() => refreshAll(false)}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="รีเฟรชข้อมูล"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-400"}`}
                title="Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1 rounded ${viewMode === "table" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-400"}`}
                title="Table"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Books List Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-60 bg-slate-100 rounded-2xl border border-slate-200"></div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">ไม่พบหนังสือ</p>
              <p className="text-xs text-slate-400 mt-0.5">ลองเปลี่ยนคำค้นหา หรือกดปุ่มเพิ่มหนังสือใหม่</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={(b) => { setBookToEdit(b); setIsBookModalOpen(true); }}
                  onDelete={handleDeleteBook}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          ) : (
            <BookTable
              books={books}
              onEdit={(b) => { setBookToEdit(b); setIsBookModalOpen(true); }}
              onDelete={handleDeleteBook}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSuccess={() => refreshAll(true)}
        bookToEdit={bookToEdit}
        defaultUserId={selectedUser?.id}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={() => refreshAll(true)}
        userToEdit={userToEdit}
      />
    </div>
  );
}
