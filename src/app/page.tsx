"use client";

import { useState, useEffect, useCallback } from "react";
import { Book } from "@/types/book";
import { User } from "@/types/user";
import { BookCard } from "@/components/book-card";
import { BookTable } from "@/components/book-table";
import { BookModal } from "@/components/book-modal";
import { UserCard } from "@/components/user-card";
import { UserModal } from "@/components/user-modal";
import { BorrowModal } from "@/components/borrow-modal";
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
  BookCheck,
} from "lucide-react";

export default function LibraryDashboardPage() {
  const { toast } = useToast();

  // Data states
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected User state (Master-Detail selection)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [filterAvailable, setFilterAvailable] = useState<"all" | "available" | "borrowed">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  // Fetch Users from /api/users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
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
        if (filterAvailable === "borrowed") params.append("isAvailable", "false");
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

  // Select a user (คลิกเลือกคนไหน แสดงหนังสือของคนนั้นทันที)
  const handleSelectUser = (user: User) => {
    if (selectedUser?.id === user.id) {
      // Toggle off to view all books
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  // Toggle Borrow / Return Status (Optimistic Update)
  const handleToggleStatus = async (id: number) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;

    const previousStatus = book.isAvailable;
    const newStatus = !previousStatus;

    // 1. Optimistic Update: แก้ไขสถานะใน Array ของ State ทันที หน้าจอไม่กระตุก ไม่เลื่อน
    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.id === id
          ? {
              ...b,
              isAvailable: newStatus,
              userId: newStatus ? null : (selectedUser ? selectedUser.id : 1),
              borrowerName: newStatus ? null : (selectedUser ? selectedUser.name : "สมชาย ใจดี"),
            }
          : b
      )
    );

    try {
      const endpoint = newStatus
        ? `/api/books/${id}/return`
        : `/api/books/${id}/borrow`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newStatus ? undefined : JSON.stringify({ userId: selectedUser ? selectedUser.id : 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "อัปเดตสถานะไม่สำเร็จ");

      toast({
        type: "success",
        title: newStatus ? "ทำรายการคืนสำเร็จ" : "ทำรายการยืมสำเร็จ",
        message: data.message || `หนังสือ "${book.title}" สถานะคือ: ${newStatus ? "พร้อมให้ยืม" : "ถูกยืมอยู่"}`,
        status: 200,
      });

      refreshAll(true);
    } catch (err: unknown) {
      // Rollback
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.id === id ? { ...b, isAvailable: previousStatus } : b))
      );

      const msg = err instanceof Error ? err.message : "เปลี่ยนสถานะล้มเหลว";
      toast({
        type: "error",
        title: "เปลี่ยนสถานะไม่สำเร็จ",
        message: msg,
        status: 400,
      });
    }
  };

  // Delete Book
  const handleDeleteBook = async (id: number, title: string) => {
    if (!confirm(`คุณต้องการลบหนังสือ "${title}" (ID: ${id}) ใช่หรือไม่?`)) return;

    const previousBooks = [...books];
    setBooks((prev) => prev.filter((b) => b.id !== id));

    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ลบข้อมูลล้มเหลว");

      toast({
        type: "success",
        title: "ลบหนังสือสำเร็จ",
        message: `ลบ "${title}" ออกจากระบบแล้ว`,
        status: 200,
      });

      refreshAll(true);
    } catch (err: unknown) {
      setBooks(previousBooks);
      toast({
        type: "error",
        title: "ลบหนังสือไม่สำเร็จ",
        message: err instanceof Error ? err.message : "Error",
        status: 404,
      });
    }
  };

  // Delete User
  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`คุณต้องการลบผู้ใช้ "${name}" (ID: ${id}) ใช่หรือไม่?\nหนังสือที่ผู้ใช้คนนี้ยืมอยู่จะถูกคืนเข้าห้องสมุดอัตโนมัติ`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ลบผู้ใช้ไม่สำเร็จ");

      toast({
        type: "success",
        title: "ลบผู้ใช้สำเร็จ",
        message: `ลบ "${name}" และคืนหนังสือเรียบร้อยแล้ว`,
        status: 200,
      });

      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }
      refreshAll(true);
    } catch (err: unknown) {
      toast({
        type: "error",
        title: "ลบผู้ใช้ไม่สำเร็จ",
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

  // Derived state: Available books for borrow modal
  const availableBooks = books.filter((b) => b.isAvailable);

  // Statistics
  const totalBooksCount = books.length;
  const availableBooksCount = books.filter((b) => b.isAvailable).length;
  const borrowedBooksCount = totalBooksCount - availableBooksCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ระบบจัดการสมาชิก & หนังสือห้องสมุด
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5" /> 2 ตารางสัมพันธ์ (Users & Books)
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            คลิกเลือกผู้ใช้คนไหน ระบบจะแสดงเฉพาะหนังสือที่คนนั้นถือครองอยู่ทันที (Master-Detail Relation)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAddUser}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-2xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ เพิ่มผู้ใช้</span>
          </button>
          <button
            onClick={handleOpenAddBook}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-all"
          >
            <BookPlus className="w-4 h-4" />
            <span>+ เพิ่มหนังสือ</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Master (Left: Users) and Detail (Right: Books) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
        {/* Left Column: Users List (Master) - 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                รายชื่อสมาชิก ({users.length} คน)
              </h2>
            </div>
            <span className="text-xs text-slate-400">คลิกเพื่อดูหนังสือ</span>
          </div>

          {/* View All Books Button */}
          <button
            onClick={() => setSelectedUser(null)}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
              selectedUser === null
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  selectedUser === null ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
                }`}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">ดูหนังสือทั้งหมดในห้องสมุด</p>
                <p className={`text-xs ${selectedUser === null ? "text-slate-300" : "text-slate-500"}`}>
                  แสดงทุกเล่มรวมกัน
                </p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                selectedUser === null ? "bg-white text-slate-900" : "bg-slate-100 text-slate-700"
              }`}
            >
              {totalBooksCount}
            </span>
          </button>

          {/* Users List */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
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

        {/* Right Column: Books Area (Detail) - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Filter Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {selectedUser ? "มุมมองรายบุคคล (User View)" : "ภาพรวมห้องสมุด (Library View)"}
                </span>
                {selectedUser && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                    ID #{selectedUser.id}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {selectedUser
                  ? `หนังสือของ: ${selectedUser.name}`
                  : "รายการหนังสือทั้งหมด"}
                <span className="text-indigo-600 font-normal ml-2 text-base">
                  ({books.length} เล่ม)
                </span>
              </h3>
              {selectedUser && (
                <p className="text-xs text-slate-500 mt-0.5">
                  อีเมล: {selectedUser.email} • สิทธิ์: {selectedUser.role}
                </p>
              )}
            </div>

            {/* Action for selected user */}
            <div className="flex items-center gap-2">
              {selectedUser ? (
                <>
                  <button
                    onClick={() => setIsBorrowModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors"
                  >
                    <BookCheck className="w-4 h-4" />
                    <span>+ ยืมหนังสือให้คนนี้</span>
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    ดูทั้งหมด
                  </button>
                </>
              ) : (
                <button
                  onClick={handleOpenAddBook}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                >
                  <BookPlus className="w-4 h-4" />
                  <span>เพิ่มหนังสือใหม่</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats bar */}
          {!selectedUser && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500">ทั้งหมด</p>
                  <p className="text-lg font-bold text-slate-900">{totalBooksCount} เล่ม</p>
                </div>
                <BookOpen className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500">พร้อมให้ยืม</p>
                  <p className="text-lg font-bold text-emerald-600">{availableBooksCount} เล่ม</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500">ถูกยืมอยู่</p>
                  <p className="text-lg font-bold text-amber-600">{borrowedBooksCount} เล่ม</p>
                </div>
                <XCircle className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          )}

          {/* Search, Filter & View Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อหนังสือ หรือชื่อผู้แต่ง..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.value as "all" | "available" | "borrowed")}
                className="px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="available">เฉพาะพร้อมให้ยืม</option>
                <option value="borrowed">เฉพาะถูกยืมอยู่</option>
              </select>

              <button
                onClick={() => refreshAll(false)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
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

          {/* Books List Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-slate-200/70 rounded-2xl border border-slate-200"></div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">
                {selectedUser
                  ? `${selectedUser.name} ยังไม่มีหนังสือที่ยืมอยู่`
                  : "ไม่พบหนังสือที่ตรงกับเงื่อนไข"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedUser ? (
                  <button
                    onClick={() => setIsBorrowModalOpen(true)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold underline mt-2 inline-flex items-center gap-1"
                  >
                    <span>คลิกที่นี่เพื่อยืมหนังสือให้ {selectedUser.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  "ลองเปลี่ยนคำค้นหา หรือกดปุ่มเพิ่มหนังสือใหม่"
                )}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
        </div>
      </div>

      {/* Book Add/Edit Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSuccess={() => refreshAll(true)}
        bookToEdit={bookToEdit}
      />

      {/* User Add/Edit Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={() => refreshAll(true)}
        userToEdit={userToEdit}
      />

      {/* Borrow Book to User Modal */}
      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        onSuccess={() => refreshAll(true)}
        targetUser={selectedUser}
        availableBooks={availableBooks}
      />
    </div>
  );
}
