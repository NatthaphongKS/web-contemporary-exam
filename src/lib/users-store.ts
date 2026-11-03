import { User, CreateUserDto, UpdateUserDto } from "@/types/user";

/**
 * ข้อมูลจำลองผู้ใช้เริ่มต้น (Seed Users)
 * ตารางที่ 1: Users (id, name, email)
 */
const initialUsers: User[] = [
  { id: 1, name: "สมชาย ใจดี", email: "somchai.j@example.com" },
  { id: 2, name: "อลิสา มั่นคง", email: "alisa.m@example.com" },
  { id: 3, name: "Robert C. Martin", email: "unclebob@cleancode.org" },
];

declare global {
  // eslint-disable-next-line no-var
  var __libraryUsersStore: User[] | undefined;
  // eslint-disable-next-line no-var
  var __libraryNextUserId: number | undefined;
}

if (!globalThis.__libraryUsersStore) {
  globalThis.__libraryUsersStore = [...initialUsers];
  globalThis.__libraryNextUserId = 4;
}

/**
 * ดึงรายชื่อผู้ใช้ทั้งหมด (พร้อมนับจำนวนหนังสือแบบ 1:N)
 */
export function getAllUsers(): User[] {
  const users = globalThis.__libraryUsersStore || [];
  const books = globalThis.__libraryBooksStore || [];

  return users.map((u) => ({
    ...u,
    booksCount: books.filter((b) => b.userId === u.id).length,
  }));
}

/**
 * ดึงข้อมูลผู้ใช้ตาม ID
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
 * เพิ่มผู้ใช้ใหม่ (POST)
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
 * แก้ไขข้อมูลผู้ใช้ (PUT)
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
 * ลบผู้ใช้ (DELETE - พร้อมลบหนังสือของคนนั้นแบบ Cascade)
 */
export function deleteUser(id: number): boolean {
  const users = globalThis.__libraryUsersStore || [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  // Cascade delete: ลบหนังสือทั้งหมดของ User คนนี้ออกด้วย
  if (globalThis.__libraryBooksStore) {
    globalThis.__libraryBooksStore = globalThis.__libraryBooksStore.filter((b) => b.userId !== id);
  }

  users.splice(index, 1);
  globalThis.__libraryUsersStore = [...users];
  return true;
}

/**
 * ตรวจสอบความมีอยู่ของ User (Foreign Key Check)
 */
export function userExists(id: number): boolean {
  return (globalThis.__libraryUsersStore || []).some((u) => u.id === id);
}

/**
 * รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้น
 */
export function resetUsersStore(): void {
  globalThis.__libraryUsersStore = [...initialUsers];
  globalThis.__libraryNextUserId = 4;
}
