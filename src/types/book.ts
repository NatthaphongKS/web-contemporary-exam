/**
 * Data Model สำหรับระบบจัดการหนังสือ (Books)
 * ตารางที่ 2 ตามข้อกำหนดการสอบ:
 * • id: Number (Primary Key)
 * • title: String
 * • author: String
 * • userId: Number (Foreign Key ชี้กลับไปที่ Users)
 * • coverUrl: String (เก็บ Path รูป เช่น "/uploads/cover-1.jpg")
 * • isAvailable: Boolean
 */

export interface Book {
  id: number;              // รหัสประจำหนังสือ (Primary Key)
  title: string;           // ชื่อหนังสือ
  author: string;          // ชื่อผู้แต่ง
  userId: number;          // Foreign Key ชี้กลับไปที่ Users (1:N)
  coverUrl: string | null; // Path รูปภาพปกจาก File Upload
  isAvailable: boolean;    // สถานะหนังสือ (true = พร้อมใช้งาน, false = ไม่พร้อมใช้งาน)
  publishedYear?: number;  // ปีที่พิมพ์ (Optional)
  userName?: string | null;// ชื่อสมาชิกเจ้าของหนังสือ (Helper สำหรับ UI)
}

export type CreateBookDto = {
  title: string;
  author: string;
  userId: number;
  coverUrl?: string | null;
  isAvailable?: boolean;
  publishedYear?: number;
};

export type UpdateBookDto = Partial<CreateBookDto>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}
