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
 * @function enrichBookWithUser
 * @param {Book} book - ข้อมูลหนังสือต้นฉบับ
 * @returns {Book} ข้อมูลหนังสือที่แนบฟิลด์ userName เรียบร้อยแล้ว
 */
export function enrichBookWithUser(book: Book): Book {
  // ขั้นตอนที่ 1: ตรวจสอบว่า Users Store พร้อมใช้งานหรือไม่
  if (!globalThis.__libraryUsersStore) return book;

  // ขั้นตอนที่ 2: ค้นหา User ตาม Foreign Key userId
  const user = globalThis.__libraryUsersStore.find((u) => u.id === book.userId);

  // ขั้นตอนที่ 3: แนบชื่อ User หรือ Fallback เป็นรหัส User หากไม่พบ
  return {
    ...book,
    userName: user ? user.name : `User #${book.userId}`,
  };
}

/**
 * ดึงรายการหนังสือทั้งหมด (READ ALL with Filters)
 * รองรับการค้นหาตามข้อความ (search), การกรองตามสถานะ (isAvailable) และกรองตามผู้ใช้ (userId)
 * 
 * @function getAllBooks
 * @param {Object} [filter] - ตัวกรองที่ส่งมาจาก Query Parameters ใน URL
 * @param {string} [filter.search] - คำค้นหาชื่อหนังสือหรือผู้แต่ง
 * @param {number} [filter.userId] - รหัสสมาชิกเพื่อกรองหนังสือเฉพาะคนนั้น (1:N Master-Detail)
 * @param {boolean} [filter.isAvailable] - กรองตามสถานะความพร้อม
 * @returns {Book[]} อาร์เรย์ของหนังสือที่ตรงตามเงื่อนไข พร้อมชื่อเจ้าของ
 * 
 * @example
 * const availableBooks = getAllBooks({ isAvailable: true });
 */
export function getAllBooks(filter?: {
  search?: string;
  userId?: number;
  isAvailable?: boolean;
}): Book[] {
  // ขั้นตอนที่ 1: คัดลอก Array ของหนังสือจาก Store
  let list = [...(globalThis.__libraryBooksStore || [])];

  // ขั้นตอนที่ 2: กรองตามเจ้าของหนังสือ (1 : N Master-Detail View)
  if (filter?.userId !== undefined) {
    list = list.filter((b) => b.userId === filter.userId);
  }

  // ขั้นตอนที่ 3: กรองตามคำค้นหา (Case-insensitive ทั้ง Title และ Author)
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  // ขั้นตอนที่ 4: กรองตามสถานะความพร้อมของหนังสือ
  if (filter?.isAvailable !== undefined) {
    list = list.filter((b) => b.isAvailable === filter.isAvailable);
  }

  // ขั้นตอนที่ 5: เติมฟิลด์ userName ให้กับทุกเล่มก่อนส่งออกไป
  return list.map(enrichBookWithUser);
}

/**
 * ดึงหนังสือเล่มเดียวตาม ID (READ ONE)
 * 
 * @function getBookById
 * @param {number} id - รหัสประจำหนังสือ (Number)
 * @returns {Book | undefined} หนังสือเล่มนั้นพร้อม userName หรือ undefined หากไม่พบ
 * 
 * @example
 * const book = getBookById(1);
 */
export function getBookById(id: number): Book | undefined {
  // ขั้นตอนที่ 1: ค้นหาหนังสือตาม Primary Key id
  const book = (globalThis.__libraryBooksStore || []).find((b) => b.id === id);

  // ขั้นตอนที่ 2: เติมชื่อผู้ใช้และส่งคืน
  return book ? enrichBookWithUser(book) : undefined;
}

/**
 * ดึงรายการหนังสือทั้งหมดที่ผูกกับ User ID นั้นๆ (1 : N Relationship Helper)
 * 
 * @function getBooksByUserId
 * @param {number} userId - รหัสประจำตัวสมาชิก
 * @returns {Book[]} อาร์เรย์ของหนังสือที่สมาชิกคนนี้ถือครอง
 * 
 * @example
 * const userBooks = getBooksByUserId(1);
 */
export function getBooksByUserId(userId: number): Book[] {
  return getAllBooks({ userId });
}

/**
 * เพิ่มหนังสือใหม่ (CREATE)
 * 
 * @function createBook
 * @param {CreateBookDto} dto - ข้อมูลหนังสือใหม่
 * @returns {Book} หนังสือที่บันทึกสำเร็จ พร้อม ID ที่ Generate ให้อัตโนมัติ
 * 
 * @example
 * const newBook = createBook({ title: "Clean Arch", author: "Uncle Bob", userId: 1 });
 */
export function createBook(dto: CreateBookDto): Book {
  // ขั้นตอนที่ 1: สร้าง Auto-increment ID ถัดไป
  const nextId = globalThis.__libraryNextId || (globalThis.__libraryBooksStore?.length || 0) + 1;
  globalThis.__libraryNextId = nextId + 1;

  // ขั้นตอนที่ 2: จัดเตรียม Object ข้อมูลหนังสือ
  const newBook: Book = {
    id: nextId,
    title: dto.title.trim(),
    author: dto.author.trim(),
    userId: Number(dto.userId),
    coverUrl: dto.coverUrl || null,
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : true,
    publishedYear: dto.publishedYear ? Number(dto.publishedYear) : new Date().getFullYear(),
  };

  // ขั้นตอนที่ 3: บันทึกลงใน Store และส่งข้อมูลที่ Join ชื่อ User เรียบร้อยแล้วกลับไป
  globalThis.__libraryBooksStore = [...(globalThis.__libraryBooksStore || []), newBook];
  return enrichBookWithUser(newBook);
}

/**
 * แก้ไขข้อมูลหนังสือ (UPDATE)
 * 
 * @function updateBook
 * @param {number} id - รหัสหนังสือที่ต้องการแก้ไข
 * @param {UpdateBookDto} dto - ข้อมูลที่ต้องการอัปเดต (รองรับ Partial)
 * @returns {Book | undefined} ข้อมูลหนังสือล่าสุด หรือ undefined หากไม่พบ ID
 * 
 * @example
 * const updated = updateBook(1, { isAvailable: false });
 */
export function updateBook(id: number, dto: UpdateBookDto): Book | undefined {
  // ขั้นตอนที่ 1: ค้นหา Index ของหนังสือใน Store
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  // ขั้นตอนที่ 2: ผสานข้อมูลเดิมกับค่าใหม่ที่ส่งมา (Partial Updates)
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

  // ขั้นตอนที่ 3: บันทึกคืน Store และดึงข้อมูลพร้อม userName ส่งกลับ
  globalThis.__libraryBooksStore = [...books];
  return getBookById(id);
}

/**
 * ลบหนังสือตาม ID (DELETE)
 * 
 * @function deleteBook
 * @param {number} id - รหัสหนังสือที่ต้องการลบ
 * @returns {boolean} true หากลบสำเร็จ, false หากไม่พบหนังสือ
 * 
 * @example
 * const success = deleteBook(1);
 */
export function deleteBook(id: number): boolean {
  // ขั้นตอนที่ 1: ค้นหา Index ของหนังสือ
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return false;

  // ขั้นตอนที่ 2: ตัดข้อมูลออกจาก Array
  books.splice(index, 1);
  globalThis.__libraryBooksStore = [...books];
  return true;
}

/**
 * รีเซ็ตข้อมูล Books Store กลับเป็นค่าเริ่มต้น
 * 
 * @function resetBooksStore
 * @returns {void}
 */
export function resetBooksStore(): void {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 5;
}
