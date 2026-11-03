import { Book, CreateBookDto, UpdateBookDto } from "@/types/book";

/**
 * ข้อมูลจำลองหนังสือเริ่มต้น (Seed Books)
 * ตารางที่ 2: Books (id, title, author, userId, coverUrl, isAvailable)
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
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    publishedYear: 1999,
    userId: 1, // ผู้ใช้ #1: สมชาย ใจดี (เล่มที่ 2)
    coverUrl: null,
    isAvailable: false,
  },
  {
    id: 3,
    title: "Refactoring: Improving Code Design",
    author: "Martin Fowler",
    publishedYear: 2018,
    userId: 2, // ผู้ใช้ #2: อลิสา มั่นคง
    coverUrl: null,
    isAvailable: true,
  },
  {
    id: 4,
    title: "Design Patterns: Elements of Reusable Software",
    author: "Erich Gamma et al.",
    publishedYear: 1994,
    userId: 3, // ผู้ใช้ #3: Robert C. Martin
    coverUrl: null,
    isAvailable: true,
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
  globalThis.__libraryNextId = 5;
}

/**
 * เติมชื่อ User เจ้าของหนังสือ (userName) จาก Users Store
 */
function enrichBookWithUser(book: Book): Book {
  if (!globalThis.__libraryUsersStore) return book;
  const user = globalThis.__libraryUsersStore.find((u) => u.id === book.userId);
  return {
    ...book,
    userName: user ? user.name : `User #${book.userId}`,
  };
}

/**
 * ดึงรายการหนังสือทั้งหมด (รองรับ Search, userId, isAvailable filter)
 */
export function getAllBooks(filter?: {
  search?: string;
  userId?: number;
  isAvailable?: boolean;
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
 * ดึงหนังสือตาม ID
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
 * เพิ่มหนังสือใหม่ (POST)
 */
export function createBook(dto: CreateBookDto): Book {
  const nextId = globalThis.__libraryNextId || (globalThis.__libraryBooksStore?.length || 0) + 1;
  globalThis.__libraryNextId = nextId + 1;

  const newBook: Book = {
    id: nextId,
    title: dto.title.trim(),
    author: dto.author.trim(),
    userId: Number(dto.userId),
    coverUrl: dto.coverUrl || null,
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : true,
    publishedYear: dto.publishedYear ? Number(dto.publishedYear) : new Date().getFullYear(),
  };

  globalThis.__libraryBooksStore = [...(globalThis.__libraryBooksStore || []), newBook];
  return enrichBookWithUser(newBook);
}

/**
 * แก้ไขข้อมูลหนังสือ (PUT)
 */
export function updateBook(id: number, dto: UpdateBookDto): Book | undefined {
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  const current = books[index];
  books[index] = {
    ...current,
    title: dto.title !== undefined ? dto.title.trim() : current.title,
    author: dto.author !== undefined ? dto.author.trim() : current.author,
    userId: dto.userId !== undefined ? Number(dto.userId) : current.userId,
    coverUrl: dto.coverUrl !== undefined ? dto.coverUrl : current.coverUrl,
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : current.isAvailable,
    publishedYear: dto.publishedYear !== undefined ? Number(dto.publishedYear) : current.publishedYear,
  };

  globalThis.__libraryBooksStore = [...books];
  return getBookById(id);
}

/**
 * ลบหนังสือตาม ID (DELETE)
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
 * รีเซ็ตข้อมูลหนังสือกลับเป็นค่าเริ่มต้น
 */
export function resetBooksStore(): void {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 5;
}
