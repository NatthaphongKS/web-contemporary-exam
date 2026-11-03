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
 * @function getAllUsers
 * @returns {User[]} อาร์เรย์ของ User ทั้งหมดพร้อมฟิลด์ booksCount ที่คำนวณแล้ว
 * 
 * @example
 * const users = getAllUsers();
 * console.log(users[0].booksCount); // 2
 */
export function getAllUsers(): User[] {
  // ขั้นตอนที่ 1: อ่านข้อมูลผู้ใช้และหนังสือจาก Global Memory
  const users = globalThis.__libraryUsersStore || [];
  const books = globalThis.__libraryBooksStore || [];

  // ขั้นตอนที่ 2: วนลูป map เพื่อนับจำนวนหนังสือที่มี foreign key `userId` ตรงกับ `id` ของผู้ใช้แต่ละคน
  return users.map((u) => ({
    ...u,
    booksCount: books.filter((b) => b.userId === u.id).length,
  }));
}

/**
 * ดึงข้อมูลผู้ใช้ตาม ID (READ ONE)
 * 
 * @function getUserById
 * @param {number} id - รหัสประจำตัวผู้ใช้ (Number)
 * @returns {User | undefined} ข้อมูล User พร้อม booksCount หรือ undefined หากไม่พบ
 * 
 * @example
 * const user = getUserById(1);
 * if (!user) throw new Error("Not found");
 */
export function getUserById(id: number): User | undefined {
  // ขั้นตอนที่ 1: ค้นหาผู้ใช้ที่มี id ตรงกัน
  const user = (globalThis.__libraryUsersStore || []).find((u) => u.id === id);
  if (!user) return undefined;

  // ขั้นตอนที่ 2: ดึงข้อมูลหนังสือมานับยอดเพื่อใส่ในฟิลด์ booksCount
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
 * @function createUser
 * @param {CreateUserDto} dto - ข้อมูลชื่อและอีเมลของผู้ใช้ใหม่
 * @returns {User} User ใหม่ที่สร้างเสร็จสมบูรณ์
 * 
 * @example
 * const newUser = createUser({ name: "วีระชัย รักเรียน", email: "v@test.com" });
 */
export function createUser(dto: CreateUserDto): User {
  // ขั้นตอนที่ 1: คำนวณ Auto-increment ID ถัดไป
  const nextId = globalThis.__libraryNextUserId || (globalThis.__libraryUsersStore?.length || 0) + 1;
  globalThis.__libraryNextUserId = nextId + 1;

  // ขั้นตอนที่ 2: ประกอบ Object สมาชิกใหม่
  const newUser: User = {
    id: nextId,
    name: dto.name.trim(),
    email: dto.email.trim(),
    booksCount: 0,
  };

  // ขั้นตอนที่ 3: บันทึกลงใน Array ของ Store
  globalThis.__libraryUsersStore = [...(globalThis.__libraryUsersStore || []), newUser];
  return newUser;
}

/**
 * แก้ไขข้อมูลผู้ใช้ (UPDATE)
 * 
 * @function updateUser
 * @param {number} id - รหัสผู้ใช้ที่ต้องการแก้ไข
 * @param {UpdateUserDto} dto - ข้อมูลส่วนที่ต้องการอัปเดต (name, email)
 * @returns {User | undefined} ข้อมูล User หลังแก้ไข หรือ undefined หากไม่พบ ID
 * 
 * @example
 * const updated = updateUser(1, { name: "สมชาย รักดี" });
 */
export function updateUser(id: number, dto: UpdateUserDto): User | undefined {
  // ขั้นตอนที่ 1: ตรวจสอบหา Index ของผู้ใช้ใน Array
  const users = globalThis.__libraryUsersStore || [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;

  // ขั้นตอนที่ 2: อัปเดตเฉพาะฟิลด์ที่มีการส่งค่าเข้ามา
  const current = users[index];
  users[index] = {
    ...current,
    name: dto.name !== undefined ? dto.name.trim() : current.name,
    email: dto.email !== undefined ? dto.email.trim() : current.email,
  };

  // ขั้นตอนที่ 3: บันทึกคืนค่า Store และส่งข้อมูลล่าสุดกลับ
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
 * @function deleteUser
 * @param {number} id - รหัสผู้ใช้ที่ต้องการลบ
 * @returns {boolean} true หากลบสำเร็จ, false หากไม่พบผู้ใช้
 * 
 * @example
 * const success = deleteUser(1);
 */
export function deleteUser(id: number): boolean {
  // ขั้นตอนที่ 1: ตรวจสอบหาผู้ใช้ก่อนลบ
  const users = globalThis.__libraryUsersStore || [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  // ขั้นตอนที่ 2 (Cascade Delete): ลบหนังสือทั้งหมดของ User คนนี้ออกจาก Books Store
  if (globalThis.__libraryBooksStore) {
    globalThis.__libraryBooksStore = globalThis.__libraryBooksStore.filter((b) => b.userId !== id);
  }

  // ขั้นตอนที่ 3: ลบ User ออกจาก Users Store
  users.splice(index, 1);
  globalThis.__libraryUsersStore = [...users];
  return true;
}

/**
 * ตรวจสอบความมีอยู่ของ User (Foreign Key Integrity Check)
 * ฟังก์ชันนี้ใช้ใน Books Store และ Books API เพื่อยืนยันว่า `userId` ที่ส่งมามีตัวตนอยู่จริง
 * 
 * @function userExists
 * @param {number} id - รหัสผู้ใช้ที่ต้องการตรวจสอบ
 * @returns {boolean} true หากมีผู้ใช้คนนี้อยู่ในระบบ, false หากไม่พบ
 * 
 * @example
 * if (!userExists(dto.userId)) throw new Error("Invalid Foreign Key");
 */
export function userExists(id: number): boolean {
  return (globalThis.__libraryUsersStore || []).some((u) => u.id === id);
}

/**
 * รีเซ็ตข้อมูล Users Store กลับเป็นค่าเริ่มต้น (สำหรับ Testing หรือ Reset Demo)
 * 
 * @function resetUsersStore
 * @returns {void}
 */
export function resetUsersStore(): void {
  globalThis.__libraryUsersStore = [...initialUsers];
  globalThis.__libraryNextUserId = 4;
}
