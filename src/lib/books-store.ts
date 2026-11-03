import { Book, CreateBookDto, UpdateBookDto } from "@/types/book";

/**
 * ข้อมูลจำลองเริ่มต้น (Seed Books)
 * สัมพันธ์กับ Users (User #1: สมชาย, User #2: อลิสา)
 */
const initialBooks: Book[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    publishedYear: 2008,
    isAvailable: true,
    coverUrl: null,
    userId: null,
    borrowedAt: null,
    createdAt: new Date("2026-01-15T08:00:00Z").toISOString(),
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    publishedYear: 1999,
    isAvailable: false,
    coverUrl: null,
    userId: 1, // ยืมโดย สมชาย ใจดี
    borrowedAt: new Date("2026-02-10T10:30:00Z").toISOString(),
    createdAt: new Date("2026-02-10T10:30:00Z").toISOString(),
  },
  {
    id: 3,
    title: "Refactoring: Improving the Design of Existing Code",
    author: "Martin Fowler",
    publishedYear: 2018,
    isAvailable: true,
    coverUrl: null,
    userId: null,
    borrowedAt: null,
    createdAt: new Date("2026-03-05T14:15:00Z").toISOString(),
  },
  {
    id: 4,
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    publishedYear: 1994,
    isAvailable: true,
    coverUrl: null,
    userId: null,
    borrowedAt: null,
    createdAt: new Date("2026-03-20T09:00:00Z").toISOString(),
  },
  {
    id: 5,
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    publishedYear: 2020,
    isAvailable: false,
    coverUrl: null,
    userId: 2, // ยืมโดย อลิสา มั่นคง
    borrowedAt: new Date("2026-03-15T11:45:00Z").toISOString(),
    createdAt: new Date("2026-04-01T11:45:00Z").toISOString(),
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __libraryBooksStore: Book[] | undefined;
  // eslint-disable-next-line no-var
  var __libraryNextId: number | undefined;
}

if (!globalThis.__libraryBooksStore) {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 6;
}

/**
 * เติมชื่อผู้ยืม (borrowerName) จาก User Store ให้หนังสือ
 */
function enrichBookWithBorrower(book: Book): Book {
  if (!book.userId || !globalThis.__libraryUsersStore) {
    return { ...book, borrowerName: null };
  }
  const user = globalThis.__libraryUsersStore.find((u) => u.id === book.userId);
  return {
    ...book,
    borrowerName: user ? user.name : `ผู้ใช้รหัส #${book.userId}`,
  };
}

/**
 * ดึงรายการหนังสือทั้งหมด (รองรับ Search, isAvailable, และ userId filter)
 */
export function getAllBooks(filter?: {
  search?: string;
  isAvailable?: boolean;
  userId?: number;
}): Book[] {
  let list = [...(globalThis.__libraryBooksStore || [])];

  if (filter?.userId !== undefined) {
    list = list.filter((b) => b.userId === filter.userId);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  if (filter?.isAvailable !== undefined) {
    list = list.filter((b) => b.isAvailable === filter.isAvailable);
  }

  return list.map(enrichBookWithBorrower);
}

/**
 * ค้นหาหนังสือตาม ID (Number)
 */
export function getBookById(id: number): Book | undefined {
  const book = (globalThis.__libraryBooksStore || []).find((b) => b.id === id);
  return book ? enrichBookWithBorrower(book) : undefined;
}

/**
 * ดึงรายการหนังสือเฉพาะที่ผู้ใช้คนนั้นยืมอยู่
 */
export function getBooksByUserId(userId: number): Book[] {
  return getAllBooks({ userId });
}

/**
 * เพิ่มหนังสือใหม่
 */
export function createBook(dto: CreateBookDto): Book {
  const nextId = globalThis.__libraryNextId || (globalThis.__libraryBooksStore?.length || 0) + 1;
  globalThis.__libraryNextId = nextId + 1;

  const hasUser = Boolean(dto.userId);

  const newBook: Book = {
    id: nextId,
    title: dto.title.trim(),
    author: dto.author.trim(),
    publishedYear: Number(dto.publishedYear),
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : !hasUser,
    coverUrl: dto.coverUrl || null,
    userId: dto.userId || null,
    borrowedAt: hasUser ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
  };

  globalThis.__libraryBooksStore = [...(globalThis.__libraryBooksStore || []), newBook];
  return enrichBookWithBorrower(newBook);
}

/**
 * แก้ไขหนังสือตาม ID
 */
export function updateBook(id: number, dto: UpdateBookDto): Book | undefined {
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  const current = books[index];
  const newUserId = dto.userId !== undefined ? dto.userId : current.userId;
  const isNowAvailable = dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : (newUserId ? false : current.isAvailable);

  const updatedBook: Book = {
    ...current,
    title: dto.title !== undefined ? dto.title.trim() : current.title,
    author: dto.author !== undefined ? dto.author.trim() : current.author,
    publishedYear: dto.publishedYear !== undefined ? Number(dto.publishedYear) : current.publishedYear,
    isAvailable: isNowAvailable,
    coverUrl: dto.coverUrl !== undefined ? dto.coverUrl : current.coverUrl,
    userId: isNowAvailable ? null : newUserId,
    borrowedAt: !isNowAvailable && newUserId && !current.borrowedAt ? new Date().toISOString() : (isNowAvailable ? null : current.borrowedAt),
  };

  books[index] = updatedBook;
  globalThis.__libraryBooksStore = [...books];
  return enrichBookWithBorrower(updatedBook);
}

/**
 * ทำรายการยืมหนังสือให้ผู้ใช้ (Borrow Book to User)
 */
export function borrowBook(bookId: number, userId: number): { success: boolean; book?: Book; error?: string } {
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) {
    return { success: false, error: "ไม่พบหนังสือที่ระบุ" };
  }

  const book = books[index];
  if (!book.isAvailable || book.userId) {
    return { success: false, error: "หนังสือเล่มนี้กำลังถูกยืมอยู่แล้ว ไม่สามารถยืมซ้ำได้" };
  }

  const updated: Book = {
    ...book,
    isAvailable: false,
    userId,
    borrowedAt: new Date().toISOString(),
  };

  books[index] = updated;
  globalThis.__libraryBooksStore = [...books];
  return { success: true, book: enrichBookWithBorrower(updated) };
}

/**
 * ทำรายการคืนหนังสือ (Return Book to Library)
 */
export function returnBook(bookId: number): { success: boolean; book?: Book; error?: string } {
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) {
    return { success: false, error: "ไม่พบหนังสือที่ระบุ" };
  }

  const book = books[index];
  const updated: Book = {
    ...book,
    isAvailable: true,
    userId: null,
    borrowedAt: null,
  };

  books[index] = updated;
  globalThis.__libraryBooksStore = [...books];
  return { success: true, book: enrichBookWithBorrower(updated) };
}

/**
 * ลบหนังสือตาม ID
 */
export function deleteBook(id: number): boolean {
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return false;

  books.splice(index, 1);
  globalThis.__libraryBooksStore = [...books];
  return true;
}

/**
 * สลับสถานะการยืม (isAvailable) แบบด่วน
 */
export function toggleAvailability(id: number): Book | undefined {
  const book = getBookById(id);
  if (!book) return undefined;
  if (book.isAvailable) {
    // Default assign to User #1 if no user specified
    return borrowBook(id, 1).book;
  } else {
    return returnBook(id).book;
  }
}

/**
 * รีเซ็ตข้อมูลกลับเป็น Seed Data เริ่มต้น
 */
export function resetBooksStore(): void {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 6;
}
