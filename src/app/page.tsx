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
  ArrowRight,
  Layers,
} from "lucide-react";

export default function LibraryDashboardPage() {
  const { toast } = useToast();

  // Data states
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected User state (Master-Detail selection: null = ดูทั้งหมด)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [filterAvailable, setFilterAvailable] = useState<"all" | "available" | "unavailable">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Fetch Users from /api/users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลสมาชิกได้");
      const data = await res.json();
      setUsers(data);
    } catch (err: unknown) {
      console.error(err);
    }
  }, []);

  // Fetch Books from /api/books (รองรับ isBackground และ userId filter)
  const fetchBooks = useCallback(
    async (isBackground = false) => {
      if (!isBackground) {
        setIsLoading(true);
      }
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append("search", search.trim());
        if (filterAvailable === "available") params.append("isAvailable", "true");
        if (filterAvailable === "unavailable") params.append("isAvailable", "false");
        if (selectedUser) params.append("userId", String(selectedUser.id));

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
    },
    [search, filterAvailable, selectedUser, toast]
  );

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, [fetchUsers, fetchBooks]);

  // Synchronize both data sources
  const refreshAll = useCallback(
    (isBackground = true) => {
      fetchUsers();
      fetchBooks(isBackground);
    },
    [fetchUsers, fetchBooks]
  );

  // Select a user (คลิกเลือกคนไหน แสดงหนังสือของคนนั้นฝั่งขวา)
  const handleSelectUser = (user: User) => {
    if (selectedUser?.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  // Toggle Availability Status (Optimistic Update)
  const handleToggleStatus = async (id: number) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;

    const previousStatus = book.isAvailable;
    const newStatus = !previousStatus;

    // 1. Optimistic Update
    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.id === id
          ? {
              ...b,
              isAvailable: newStatus,
            }
          : b
      )
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
        title: "เปลี่ยนสถานะหนังสือสำเร็จ",
        message: `หนังสือ "${book.title}" สถานะคือ: ${newStatus ? "พร้อมใช้งาน" : "ไม่พร้อมใช้งาน"}`,
        status: 200,
      });

      refreshAll(true);
    } catch (err: unknown) {
      // Rollback
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.id === id ? { ...b, isAvailable: previousStatus } : b))
      );

      const msg = err instanceof Error ? err.message : "เปลี่ยนสถานะไม่สำเร็จ";
      toast({
        type: "error",
        title: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ",
        message: msg,
        status: 400,
      });
    }
  };

  // Delete Book (Optimistic Update)
  const handleDeleteBook = async (id: number, title: string) => {
    if (!confirm(`คุณต้องการลบหนังสือ "${title}" (ID: ${id}) ใช่หรือไม่?`)) {
      return;
    }

    const previousBooks = [...books];
    setBooks((prev) => prev.filter((b) => b.id !== id));

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ลบข้อมูลล้มเหลว");
      }

      toast({
        type: "success",
        title: "ลบหนังสือสำเร็จ",
        message: `ลบ "${title}" ออกจากระบบแล้ว`,
        status: 200,
      });

      refreshAll(true);
    } catch (err: unknown) {
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

  // Delete User
  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`คุณต้องการลบสมาชิก "${name}" (ID: ${id}) ใช่หรือไม่?\nหนังสือทั้งหมดของสมาชิกคนนี้จะถูกลบออกจากระบบด้วย`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ลบสมาชิกไม่สำเร็จ");

      toast({
        type: "success",
        title: "ลบสมาชิกสำเร็จ",
        message: `ลบ "${name}" ออกจากระบบแล้ว`,
        status: 200,
      });

      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }
      refreshAll(true);
    } catch (err: unknown) {
      toast({
        type: "error",
        title: "ลบสมาชิกไม่สำเร็จ",
        message: err instanceof Error ? err.message : "Error",
        status: 404,
      });
    }
  };

  // Modals helpers
  const handleOpenAddBook = () => {
    setBookToEdit(null);
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book: Book) => {
    setBookToEdit(book);
    setIsBookModalOpen(true);
  };

  const handleOpenAddUser = () => {
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  // Statistics
  const totalBooksCount = books.length;
  const availableBooksCount = books.filter((b) => b.isAvailable).length;
  const unavailableBooksCount = totalBooksCount - availableBooksCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ระบบจัดการสมาชิก & หนังสือ
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              1 : N Relational
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            เลือกสมาชิกฝั่งซ้ายเพื่อดูหนังสือของคนนั้นฝั่งขวา หรือกดดูทั้งหมด
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenAddUser}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-600" />
            <span>+ เพิ่มสมาชิก</span>
          </button>
          <button
            onClick={handleOpenAddBook}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-xs transition-colors"
          >
            <BookPlus className="w-3.5 h-3.5" />
            <span>+ เพิ่มหนังสือ</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN MASTER-DETAIL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: USERS LIST (เลือกคนฝั่งซ้าย) */}
        <aside className="lg:col-span-4 xl:col-span-4 flex flex-col gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  สมาชิก (ตารางที่ 1: Users)
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 font-mono">
                {users.length} คน
              </span>
            </div>

            {/* "All Users" Option */}
            <button
              onClick={() => setSelectedUser(null)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all mb-3 select-none ${
                selectedUser === null
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs font-medium"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-normal"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${selectedUser === null ? "text-white" : "text-slate-500"}`} />
                <span className="text-xs font-bold">ดูหนังสือทั้งหมด (ทุกคน)</span>
              </div>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                  selectedUser === null ? "bg-indigo-700 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                All
              </span>
            </button>

            {/* Vertical Users List */}
            <div className="flex flex-col gap-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-0.5">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isSelected={selectedUser?.id === user.id}
                  onSelect={handleSelectUser}
                  onEdit={handleOpenEditUser}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: BOOKS LIST (แสดงหนังสือฝั่งขวา) */}
        <main className="lg:col-span-8 xl:col-span-8 flex flex-col gap-4">
          {/* Header of Right Side: Selected User Info & Actions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  ตารางที่ 2: Books
                </span>
                {selectedUser && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    ID #{selectedUser.id}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-2 flex-wrap">
                <span>
                  {selectedUser
                    ? `หนังสือของ: ${selectedUser.name}`
                    : "รายการหนังสือทั้งหมด (All Books)"}
                </span>
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {books.length} เล่ม
                </span>
              </h2>
              {selectedUser && (
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  อีเมล: {selectedUser.email}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleOpenAddBook}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs transition-colors"
              >
                <BookPlus className="w-3.5 h-3.5" />
                <span>{selectedUser ? `+ เพิ่มหนังสือให้ ${selectedUser.name.split(" ")[0]}` : "+ เพิ่มหนังสือใหม่"}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Toolbar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
              <div>
                <p className="text-[11px] text-slate-500">ทั้งหมด</p>
                <p className="text-base sm:text-lg font-bold text-slate-900">{totalBooksCount} เล่ม</p>
              </div>
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
              <div>
                <p className="text-[11px] text-slate-500">พร้อมใช้งาน</p>
                <p className="text-base sm:text-lg font-bold text-emerald-600">{availableBooksCount} เล่ม</p>
              </div>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
              <div>
                <p className="text-[11px] text-slate-500">ไม่พร้อมใช้งาน</p>
                <p className="text-base sm:text-lg font-bold text-slate-600">{unavailableBooksCount} เล่ม</p>
              </div>
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            </div>
          </div>

          {/* Search, Filter & View Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อหนังสือ หรือผู้แต่ง..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.value as "all" | "available" | "unavailable")}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="available">เฉพาะพร้อมใช้งาน</option>
                <option value="unavailable">เฉพาะไม่พร้อมใช้งาน</option>
              </select>

              <button
                onClick={() => refreshAll(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                title="รีเฟรชข้อมูล"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white text-indigo-600 shadow-xs font-semibold" : "text-slate-500"
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "table" ? "bg-white text-indigo-600 shadow-xs font-semibold" : "text-slate-500"
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Books List Content (Grid or Table) */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-slate-200/70 rounded-2xl border border-slate-200"></div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">
                {selectedUser
                  ? `${selectedUser.name} ยังไม่มีหนังสือในระบบ`
                  : "ไม่พบหนังสือที่ตรงกับเงื่อนไข"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedUser ? (
                  <button
                    onClick={handleOpenAddBook}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold underline mt-2 inline-flex items-center gap-1"
                  >
                    <span>คลิกที่นี่เพื่อเพิ่มหนังสือให้ {selectedUser.name}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  "ลองเปลี่ยนคำค้นหา หรือกดปุ่มเพิ่มหนังสือใหม่"
                )}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleOpenEditBook}
                  onDelete={handleDeleteBook}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          ) : (
            <BookTable
              books={books}
              onEdit={handleOpenEditBook}
              onDelete={handleDeleteBook}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </main>
      </div>

      {/* Book Add/Edit Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSuccess={() => refreshAll(true)}
        bookToEdit={bookToEdit}
        defaultUserId={selectedUser?.id}
      />

      {/* User Add/Edit Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={() => refreshAll(true)}
        userToEdit={userToEdit}
      />
    </div>
  );
}
