/**
 * Data Model สำหรับระบบผู้ใช้ (Users)
 * ตารางสัมพันธ์ 1:N กับ Books (1 User สามารถยืมหนังสือได้หลายเล่ม)
 */

export interface User {
  id: number;                   // รหัสประจำตัวผู้ใช้ (Number)
  name: string;                // ชื่อ-นามสกุล (String)
  email: string;               // อีเมล (String)
  role: "student" | "teacher" | "member"; // บทบาท/ประเภทผู้ใช้
  avatarUrl?: string | null;    // รูปโปรไฟล์ (Optional)
  borrowedBooksCount?: number;  // จำนวนหนังสือที่ยืมอยู่ปัจจุบัน (Computed field)
  createdAt?: string;           // วันที่สร้างบัญชี
}

export type CreateUserDto = {
  name: string;
  email: string;
  role: "student" | "teacher" | "member";
  avatarUrl?: string | null;
};

export type UpdateUserDto = Partial<CreateUserDto>;
