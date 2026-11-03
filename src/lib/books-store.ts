import { Book, CreateBookDto, UpdateBookDto } from "@/types/book";

/**
 * ข้อมูลจำลองเริ่มต้น (Seed Books)
 * ตารางที่ 2: Books (id, title, author, userId, coverUrl, isAvailable)
 * สัมพันธ์ 1:N กับ Users (User 1 คน มีหนังสือหลายเล่ม)
 */
const initialBooks: Book[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    publishedYear: 2008,
    userId: 1, // ผู้ใช้ #1: สมชาย ใจดี
    coverUrl: "/uploads/1793674702785_blog-details2_1.png",
    isAvailable: true,
    createdAt: new Date("2026-01-15T08:00:00Z").toISOString(),
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    publishedYear: 1999,
    userId: 1, // ผู้ใช้ #1: สมชาย ใจดี (เล่มที่ 2)
    coverUrl: null,
    isAvailable: false,
    createdAt: new Date("2026-02-10T10:30:00Z").toISOString(),
  },
  {
    id: 3,
    title: "Refactoring: Improving the Design of Existing Code",
    author: "Martin Fowler",
    publishedYear: 2018,
    userId: 2, // ผู้ใช้ #2: อลิสา มั่นคง
    coverUrl: null,
    isAvailable: true,
    createdAt: new Date("2026-03-05T14:15:00Z").toISOString(),
  },
  {
    id: 4,
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    publishedYear: 1994,
    userId: 2, // ผู้ใช้ #2: อลิสา มั่นคง (เล่มที่ 2)
    coverUrl: null,
    isAvailable: true,
    createdAt: new Date("2026-03-20T09:00:00Z").toISOString(),
  },
  {
    id: 5,
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    publishedYear: 2020,
    userId: 3, // ผู้ใช้ #3: Robert C. Martin
    coverUrl: null,
    isAvailable: false,
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
 * เติมชื่อ User เจ้าของหนังสือ (userName) จาก User Store
 */
function enrichBookWithUser(book: Book): Book {
  if (!globalThis.__libraryUsersStore) {
    return { ...book, userName: null, borrowerName: null };
  }
  const user = globalThis.__libraryUsersStore.find((u) => u.id === book.userId);
  const name = user ? user.name : `User #${book.userId}`;
  return {
    ...book,
    userName: name,
    borrowerName: name, // รักษา backward compatibility ให้ UI
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

  return list.map(enrichBookWithUser);
}

/**
 * ค้นหาหนังสือตาม ID (Number)
 */
export function getBookById(id: number): Book | undefined {
  const book = (globalThis.__libraryBooksStore || []).find((b) => b.id === id);
  return book ? enrichBookWithUser(book) : undefined;
}

/**
 * ดึงรายการหนังสือทั้งหมดของ User คนนั้น (1:N)
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

  const newBook: Book = {
    id: nextId,
    title: dto.title.trim(),
    author: dto.author.trim(),
    publishedYear: dto.publishedYear ? Number(dto.publishedYear) : new Date().getFullYear(),
    userId: Number(dto.userId),
    coverUrl: dto.coverUrl || null,
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : true,
    createdAt: new Date().toISOString(),
  };

  globalThis.__libraryBooksStore = [...(globalThis.__libraryBooksStore || []), newBook];
  return enrichBookWithUser(newBook);
}

/**
 * แก้ไขหนังสือตาม ID
 */
export function updateBook(id: number, dto: UpdateBookDto): Book | undefined {
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  const current = books[index];
  const updatedBook: Book = {
    ...current,
    title: dto.title !== undefined ? dto.title.trim() : current.title,
    author: dto.author !== undefined ? dto.author.trim() : current.author,
    publishedYear: dto.publishedYear !== undefined ? Number(dto.publishedYear) : current.publishedYear,
    userId: dto.userId !== undefined ? Number(dto.userId) : current.userId,
    coverUrl: dto.coverUrl !== undefined ? dto.coverUrl : current.coverUrl,
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : current.isAvailable,
  };

  books[index] = updatedBook;
  globalThis.__libraryBooksStore = [...books];

  return getBookById(id);
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
 * ยืมหนังสือ (เปลี่ยนสถานะ isAvailable และผูก userId)
 */
export function borrowBook(bookId: number, userId: number): { success: boolean; error?: string; book?: Book } {
  const book = (globalThis.__libraryBooksStore || []).find((b) => b.id === bookId);
  if (!book) {
    return { success: false, error: "ไม่พบหนังสือเล่มนี้ในระบบ" };
  }

  if (!book.isAvailable) {
    return { success: false, error: "หนังสือเล่มนี้กำลังถูกยืมอยู่" };
  }

  const updated = updateBook(bookId, {
    userId,
    isAvailable: false,
  });

  return { success: true, book: updated };
}

/**
 * คืนหนังสือ (เปลี่ยนสถานะ isAvailable = true)
 */
export function returnBook(bookId: number): { success: boolean; error?: string; book?: Book } {
  const book = (globalThis.__libraryBooksStore || []).find((b) => b.id === bookId);
  if (!book) {
    return { success: false, error: "ไม่พบหนังสือเล่มนี้ในระบบ" };
  }

  const updated = updateBook(bookId, {
    isAvailable: true,
  });

  return { success: true, book: updated };
}

/**
 * รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้น (Seed)
 */
export function resetBooksStore(): void {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 6;
}
