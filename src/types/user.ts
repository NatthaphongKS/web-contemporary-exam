/**
 * Data Model สำหรับระบบผู้ใช้ (Users)
 * ตารางที่ 1 ตามข้อกำหนดการสอบ:
 * • id: Number (Primary Key)
 * • name: String
 * • email: String
 */

export interface User {
  id: number;          // รหัสประจำตัวผู้ใช้ (Primary Key)
  name: string;        // ชื่อ-นามสกุล
  email: string;       // อีเมล
  booksCount?: number; // จำนวนหนังสือที่ถือครอง (Computed field สำหรับแสดงผล)
}

export type CreateUserDto = {
  name: string;
  email: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;
