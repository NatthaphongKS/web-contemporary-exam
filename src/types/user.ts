/**
 * Data Model สำหรับระบบผู้ใช้ (Users)
 * ตารางที่ 1 ตามข้อกำหนดการสอบ:
 * • id: Number (Primary Key)
 * • name: String
 * • email: String
 *
 * สัมพันธ์ 1 : N กับ Books (User 1 คน มีหนังสือหลายเล่ม)
 */

export interface User {
  id: number;                  // รหัสประจำตัวผู้ใช้ (Number - Primary Key)
  name: string;                // ชื่อ-นามสกุล (String)
  email: string;               // อีเมล (String)
  role?: "student" | "teacher" | "member"; // บทบาท (Optional สำหรับแสดงผล)
  avatarUrl?: string | null;   // รูปโปรไฟล์ (Optional)
  booksCount?: number;         // จำนวนหนังสือที่ครอบครอง (Computed field)
  borrowedBooksCount?: number; // จำนวนหนังสือที่ครอบครอง (Alias)
  createdAt?: string;          // วันที่สร้างข้อมูล
}

export type CreateUserDto = {
  name: string;
  email: string;
  role?: "student" | "teacher" | "member";
  avatarUrl?: string | null;
};

export type UpdateUserDto = Partial<CreateUserDto>;
