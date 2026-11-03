/**
 * ==============================================================================
 * In-Memory Mock Store: ตารางที่ 1 — ผู้ใช้งาน/สมาชิก (Users Store)
 * ==============================================================================
 * ทำหน้าที่จำลองฐานข้อมูล (Database Layer) ในหน่วยความจำ RAM ของ Node.js
 * 
 * 💡 ทำไมต้องใช้ `globalThis`?
 * ใน Next.js โหมด Development เซิร์ฟเวอร์จะทำ Fast Refresh / Hot Reload ทุกครั้งที่เซฟไฟล์
 * หากประกาศตัวแปรระดับโมดูลปกติ (`let users = [...]`) ค่าจะถูก Reset กลับเป็นค่าเริ่มต้นตลอดเวลา
 * การผูกตัวแปรไว้กับ `globalThis` จะช่วยรักษาข้อมูลไว้ใน RAM ได้ตราบเท่าที่ Node.js Process ยังรันอยู่
 */

import { User, CreateUserDto, UpdateUserDto } from "@/types/user";

/**
 * ข้อมูลจำลองสมาชิกเริ่มต้น (Seed Users)
 * ตารางที่ 1: Users (id, name, email)
 */
const initialUsers: User[] = [
  { id: 1, name: "สมชาย ใจดี", email: "somchai.j@example.com" },
  { id: 2, name: "อลิสา มั่นคง", email: "alisa.m@example.com" },
  { id: 3, name: "Robert C. Martin", email: "unclebob@cleancode.org" },
];

// ขยาย Global Namespace เพื่อรองรับตัวแปร Store ของเราใน TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __libraryUsersStore: User[] | undefined;
  // eslint-disable-next-line no-var
  var __libraryNextUserId: number | undefined;
}

// กำหนดค่าเริ่มต้นเพียงครั้งเดียวเมื่อแอปพลิเคชันเริ่มรัน
if (!globalThis.__libraryUsersStore) {
  globalThis.__libraryUsersStore = [...initialUsers];
  globalThis.__libraryNextUserId = 4; // รหัสถัดไปที่จะถูกสร้าง
}

/**
 * ดึงรายชื่อผู้ใช้ทั้งหมด (READ ALL)
 * พร้อมคำนวณจำนวนหนังสือที่แต่ละคนถือครองอยู่ (booksCount) จาก Books Store (1 : N Relation)
 * 
 * @returns อาร์เรย์ของ User ทั้งหมดพร้อมฟิลด์ booksCount
 */
export function getAllUsers(): User[] {
  const users = globalThis.__libraryUsersStore || [];
  const books = globalThis.__libraryBooksStore || [];

  return users.map((u) => ({
    ...u,
    // นับจำนวนหนังสือที่มี foreign key `userId` ตรงกับ `id` ของผู้ใช้คนนี้
    booksCount: books.filter((b) => b.userId === u.id).length,
  }));
}

/**
 * ดึงข้อมูลผู้ใช้ตาม ID (READ ONE)
 * 
 * @param id - รหัสประจำตัวผู้ใช้ (Number)
 * @returns ข้อมูล User หรือ undefined หากไม่พบ
 */
export function getUserById(id: number): User | undefined {
  const user = (globalThis.__libraryUsersStore || []).find((u) => u.id === id);
  if (!user) return undefined;

  const books = globalThis.__libraryBooksStore || [];
  return {
    ...user,
    booksCount: books.filter((b) => b.userId === user.id).length,
  };
}

/**
 * เพิ่มผู้ใช้ใหม่ (CREATE)
 * สร้าง ID ให้อัตโนมัติ (Auto-increment) และบันทึกลง Store
 * 
 * @param dto - ข้อมูลชื่อและอีเมล
 * @returns User ใหม่ที่สร้างเสร็จสมบูรณ์
 */
export function createUser(dto: CreateUserDto): User {
  const nextId = globalThis.__libraryNextUserId || (globalThis.__libraryUsersStore?.length || 0) + 1;
  globalThis.__libraryNextUserId = nextId + 1;

  const newUser: User = {
    id: nextId,
    name: dto.name.trim(),
    email: dto.email.trim(),
    booksCount: 0,
  };

  globalThis.__libraryUsersStore = [...(globalThis.__libraryUsersStore || []), newUser];
  return newUser;
}

/**
 * แก้ไขข้อมูลผู้ใช้ (UPDATE)
 * 
 * @param id - รหัสผู้ใช้ที่ต้องการแก้ไข
 * @param dto - ข้อมูลส่วนที่ต้องการอัปเดต
 * @returns ข้อมูล User หลังแก้ไข หรือ undefined หากไม่พบ ID
 */
export function updateUser(id: number, dto: UpdateUserDto): User | undefined {
  const users = globalThis.__libraryUsersStore || [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;

  const current = users[index];
  users[index] = {
    ...current,
    name: dto.name !== undefined ? dto.name.trim() : current.name,
    email: dto.email !== undefined ? dto.email.trim() : current.email,
  };

  globalThis.__libraryUsersStore = [...users];
  return getUserById(id);
}

/**
 * ลบผู้ใช้ตาม ID (DELETE with CASCADE)
 * 
 * ⚠️ หัวใจสำคัญของการสอบ (Cascade Delete):
 * เมื่อผู้ใช้ถูกลบออกจากระบบ หนังสือทุกเล่มที่มี `userId` ตรงกับผู้ใช้นี้
 * จะต้องถูกลบออกจาก Books Store ด้วย เพื่อรักษาความสอดคล้องของข้อมูล (Referential Integrity)
 * 
 * @param id - รหัสผู้ใช้ที่ต้องการลบ
 * @returns true หากลบสำเร็จ, false หากไม่พบผู้ใช้
 */
export function deleteUser(id: number): boolean {
  const users = globalThis.__libraryUsersStore || [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  // ขั้นตอน Cascade Delete: ลบหนังสือทั้งหมดของ User คนนี้ออกจาก Books Store
  if (globalThis.__libraryBooksStore) {
    globalThis.__libraryBooksStore = globalThis.__libraryBooksStore.filter((b) => b.userId !== id);
  }

  // ลบ User ออกจาก Users Store
  users.splice(index, 1);
  globalThis.__libraryUsersStore = [...users];
  return true;
}

/**
 * ตรวจสอบความมีอยู่ของ User (Foreign Key Integrity Check)
 * ฟังก์ชันนี้ใช้ใน Books Store และ Books API เพื่อยืนยันว่า `userId` ที่ส่งมามีตัวตนอยู่จริง
 * 
 * @param id - รหัสผู้ใช้ที่ต้องการตรวจสอบ
 * @returns true หากมีผู้ใช้คนนี้อยู่ในระบบ, false หากไม่พบ
 */
export function userExists(id: number): boolean {
  return (globalThis.__libraryUsersStore || []).some((u) => u.id === id);
}

/**
 * รีเซ็ตข้อมูล Users Store กลับเป็นค่าเริ่มต้น (สำหรับ Testing หรือ Reset Demo)
 */
export function resetUsersStore(): void {
  globalThis.__libraryUsersStore = [...initialUsers];
  globalThis.__libraryNextUserId = 4;
}
