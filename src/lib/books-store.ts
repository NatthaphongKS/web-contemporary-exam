import { Book, CreateBookDto, UpdateBookDto } from "@/types/book";

/**
 * ข้อมูลจำลองเริ่มต้น (Seed Data)
 */
const initialBooks: Book[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    publishedYear: 2008,
    isAvailable: true,
    coverUrl: null,
    createdAt: new Date("2026-01-15T08:00:00Z").toISOString(),
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    publishedYear: 1999,
    isAvailable: false,
    coverUrl: null,
    createdAt: new Date("2026-02-10T10:30:00Z").toISOString(),
  },
  {
    id: 3,
    title: "Refactoring: Improving the Design of Existing Code",
    author: "Martin Fowler",
    publishedYear: 2018,
    isAvailable: true,
    coverUrl: null,
    createdAt: new Date("2026-03-05T14:15:00Z").toISOString(),
  },
  {
    id: 4,
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    publishedYear: 1994,
    isAvailable: true,
    coverUrl: null,
    createdAt: new Date("2026-03-20T09:00:00Z").toISOString(),
  },
  {
    id: 5,
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    publishedYear: 2020,
    isAvailable: false,
    coverUrl: null,
    createdAt: new Date("2026-04-01T11:45:00Z").toISOString(),
  },
];

// เก็บข้อมูลใน globalThis เพื่อไม่ให้ข้อมูลหายเมื่อมี Fast Refresh ใน dev mode
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
 * ดึงรายการหนังสือทั้งหมด (รองรับ Search & Filter)
 */
export function getAllBooks(filter?: { search?: string; isAvailable?: boolean }): Book[] {
  let list = [...(globalThis.__libraryBooksStore || [])];

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  if (filter?.isAvailable !== undefined) {
    list = list.filter((b) => b.isAvailable === filter.isAvailable);
  }

  return list;
}

/**
 * ค้นหาหนังสือตาม ID (Number)
 */
export function getBookById(id: number): Book | undefined {
  return (globalThis.__libraryBooksStore || []).find((b) => b.id === id);
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
    publishedYear: Number(dto.publishedYear),
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : true,
    coverUrl: dto.coverUrl || null,
    createdAt: new Date().toISOString(),
  };

  globalThis.__libraryBooksStore = [...(globalThis.__libraryBooksStore || []), newBook];
  return newBook;
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
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : current.isAvailable,
    coverUrl: dto.coverUrl !== undefined ? dto.coverUrl : current.coverUrl,
  };

  books[index] = updatedBook;
  globalThis.__libraryBooksStore = [...books];
  return updatedBook;
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
 * สลับสถานะการยืม (isAvailable)
 */
export function toggleAvailability(id: number): Book | undefined {
  const book = getBookById(id);
  if (!book) return undefined;
  return updateBook(id, { isAvailable: !book.isAvailable });
}

/**
 * รีเซ็ตข้อมูลกลับเป็น Seed Data เริ่มต้น
 */
export function resetBooksStore(): void {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 6;
}
