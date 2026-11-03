/**
 * ==============================================================================
 * In-Memory Mock Store: ตารางที่ 2 — หนังสือ (Books Store)
 * ==============================================================================
 * ทำหน้าที่จำลองฐานข้อมูลตาราง Books ในหน่วยความจำ RAM ของ Node.js ผ่าน `globalThis`
 * พร้อมการเชื่อมโยงความสัมพันธ์ 1:N กับตาราง Users ผ่าน Foreign Key `userId`
 */

import { Book, CreateBookDto, UpdateBookDto } from "@/types/book";

/**
 * ข้อมูลจำลองหนังสือเริ่มต้น (Seed Books)
 * ตารางที่ 2: Books (id, title, author, userId, coverUrl, isAvailable, publishedYear)
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

// ขยาย Global Namespace เพื่อรองรับตัวแปร Store ของเราใน TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __libraryBooksStore: Book[] | undefined;
  // eslint-disable-next-line no-var
  var __libraryNextId: number | undefined;
}

// กำหนดค่าเริ่มต้นเพียงครั้งเดียวเมื่อแอปพลิเคชันเริ่มรัน
if (!globalThis.__libraryBooksStore) {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 5; // รหัสถัดไปที่จะถูกสร้าง
}

/**
 * ฟังก์ชันช่วยเติมชื่อเจ้าของหนังสือ (userName) จาก Users Store
 * จำลองพฤติกรรม SQL JOIN หรือ Eloquent with('user') ในระดับ In-Memory
 * 
 * @param book - ข้อมูลหนังสือ
 * @returns ข้อมูลหนังสือที่แนบฟิลด์ userName เรียบร้อยแล้ว
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
 * ดึงรายการหนังสือทั้งหมด (READ ALL with Filters)
 * รองรับการค้นหาตามข้อความ (search), การกรองตามสถานะ (isAvailable) และกรองตามผู้ใช้ (userId)
 * 
 * @param filter - ตัวกรองที่ส่งมาจาก Query Parameters ใน URL
 * @returns อาร์เรย์ของหนังสือที่ตรงตามเงื่อนไข พร้อมชื่อเจ้าของ
 */
export function getAllBooks(filter?: {
  search?: string;
  userId?: number;
  isAvailable?: boolean;
}): Book[] {
  let list = [...(globalThis.__libraryBooksStore || [])];

  // กรองตามเจ้าของหนังสือ (1 : N Master-Detail View)
  if (filter?.userId !== undefined) {
    list = list.filter((b) => b.userId === filter.userId);
  }

  // กรองตามคำค้นหา (Case-insensitive ทั้ง Title และ Author)
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  // กรองตามสถานะความพร้อมของหนังสือ
  if (filter?.isAvailable !== undefined) {
    list = list.filter((b) => b.isAvailable === filter.isAvailable);
  }

  // แนบชื่อ User ในทุกเล่ม
  return list.map(enrichBookWithUser);
}

/**
 * ดึงหนังสือเล่มเดียวตาม ID (READ ONE)
 * 
 * @param id - รหัสประจำหนังสือ (Number)
 * @returns หนังสือเล่มนั้น หรือ undefined หากไม่พบ
 */
export function getBookById(id: number): Book | undefined {
  const book = (globalThis.__libraryBooksStore || []).find((b) => b.id === id);
  return book ? enrichBookWithUser(book) : undefined;
}

/**
 * ดึงรายการหนังสือทั้งหมดที่ผูกกับ User ID นั้นๆ (1 : N Relationship Helper)
 * 
 * @param userId - รหัสประจำตัวสมาชิก
 * @returns อาร์เรย์ของหนังสือที่สมาชิกคนนี้ถือครอง
 */
export function getBooksByUserId(userId: number): Book[] {
  return getAllBooks({ userId });
}

/**
 * เพิ่มหนังสือใหม่ (CREATE)
 * 
 * @param dto - ข้อมูลหนังสือใหม่
 * @returns หนังสือที่บันทึกสำเร็จ พร้อม ID ที่ Generate ให้อัตโนมัติ
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
 * แก้ไขข้อมูลหนังสือ (UPDATE)
 * 
 * @param id - รหัสหนังสือที่ต้องการแก้ไข
 * @param dto - ข้อมูลที่ต้องการอัปเดต (รองรับ Partial)
 * @returns ข้อมูลหนังสือล่าสุด หรือ undefined หากไม่พบ ID
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
 * 
 * @param id - รหัสหนังสือที่ต้องการลบ
 * @returns true หากลบสำเร็จ, false หากไม่พบหนังสือ
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
 * รีเซ็ตข้อมูล Books Store กลับเป็นค่าเริ่มต้น
 */
export function resetBooksStore(): void {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 5;
}
