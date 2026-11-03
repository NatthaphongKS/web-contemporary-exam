import { User, CreateUserDto, UpdateUserDto } from "@/types/user";

/**
 * ข้อมูลจำลองผู้ใช้เริ่มต้น (Seed Users)
 * ตารางที่ 1: Users (id, name, email)
 */
const initialUsers: User[] = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    email: "somchai.j@example.com",
    role: "student",
    createdAt: new Date("2026-01-10T09:00:00Z").toISOString(),
  },
  {
    id: 2,
    name: "อลิสา มั่นคง",
    email: "alisa.m@example.com",
    role: "student",
    createdAt: new Date("2026-01-12T11:30:00Z").toISOString(),
  },
  {
    id: 3,
    name: "Robert C. Martin",
    email: "unclebob@cleancode.org",
    role: "teacher",
    createdAt: new Date("2026-01-05T08:00:00Z").toISOString(),
  },
  {
    id: 4,
    name: "Dan Abramov",
    email: "dan@overreacted.io",
    role: "member",
    createdAt: new Date("2026-01-20T14:00:00Z").toISOString(),
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __libraryUsersStore: User[] | undefined;
  // eslint-disable-next-line no-var
  var __libraryNextUserId: number | undefined;
}

if (!globalThis.__libraryUsersStore) {
  globalThis.__libraryUsersStore = [...initialUsers];
  globalThis.__libraryNextUserId = 5;
}

/**
 * ดึงรายชื่อผู้ใช้ทั้งหมด (พร้อมคำนวณจำนวนหนังสือที่แต่ละคนมีแบบ 1:N)
 */
export function getAllUsers(): User[] {
  const users = globalThis.__libraryUsersStore || [];
  const books = globalThis.__libraryBooksStore || [];

  return users.map((u) => {
    const count = books.filter((b) => b.userId === u.id).length;
    return {
      ...u,
      booksCount: count,
    };
  });
}

/**
 * ดึงข้อมูลผู้ใช้ตาม ID
 */
export function getUserById(id: number): User | undefined {
  const user = (globalThis.__libraryUsersStore || []).find((u) => u.id === id);
  if (!user) return undefined;

  const books = globalThis.__libraryBooksStore || [];
  const count = books.filter((b) => b.userId === user.id).length;

  return {
    ...user,
    booksCount: count,
  };
}

/**
 * เพิ่มผู้ใช้ใหม่
 */
export function createUser(dto: CreateUserDto): User {
  const nextId = globalThis.__libraryNextUserId || (globalThis.__libraryUsersStore?.length || 0) + 1;
  globalThis.__libraryNextUserId = nextId + 1;

  const newUser: User = {
    id: nextId,
    name: dto.name.trim(),
    email: dto.email.trim(),
    role: dto.role || "student",
    avatarUrl: dto.avatarUrl || null,
    booksCount: 0,
    createdAt: new Date().toISOString(),
  };

  globalThis.__libraryUsersStore = [...(globalThis.__libraryUsersStore || []), newUser];
  return newUser;
}

/**
 * แก้ไขข้อมูลผู้ใช้
 */
export function updateUser(id: number, dto: UpdateUserDto): User | undefined {
  const users = globalThis.__libraryUsersStore || [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;

  const current = users[index];
  const updatedUser: User = {
    ...current,
    name: dto.name !== undefined ? dto.name.trim() : current.name,
    email: dto.email !== undefined ? dto.email.trim() : current.email,
    role: dto.role !== undefined ? dto.role : current.role,
    avatarUrl: dto.avatarUrl !== undefined ? dto.avatarUrl : current.avatarUrl,
  };

  users[index] = updatedUser;
  globalThis.__libraryUsersStore = [...users];

  return getUserById(id);
}

/**
 * ลบผู้ใช้ (พร้อมลบหนังสือที่ผูกกับ User คนนี้ตามหลัก Cascade Relation)
 */
export function deleteUser(id: number): boolean {
  const users = globalThis.__libraryUsersStore || [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  // Cascade delete: ลบหนังสือทั้งหมดของ User คนนี้ออกจาก Store
  if (globalThis.__libraryBooksStore) {
    globalThis.__libraryBooksStore = globalThis.__libraryBooksStore.filter((book) => book.userId !== id);
  }

  users.splice(index, 1);
  globalThis.__libraryUsersStore = [...users];
  return true;
}

/**
 * ตรวจสอบว่ามี User รหัสนี้ในระบบหรือไม่ (Foreign Key check)
 */
export function userExists(id: number): boolean {
  return (globalThis.__libraryUsersStore || []).some((u) => u.id === id);
}

/**
 * รีเซ็ตข้อมูลผู้ใช้กลับเป็นค่าเริ่มต้น
 */
export function resetUsersStore(): void {
  globalThis.__libraryUsersStore = [...initialUsers];
  globalThis.__libraryNextUserId = 5;
}
