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
  id: number;                   // รหัสประจำหนังสือ (Number - Primary Key)
  title: string;                // ชื่อหนังสือ (String)
  author: string;               // ชื่อผู้แต่ง (String)
  userId: number;               // Foreign Key ชี้กลับไปที่ Users (User 1 คน มีหนังสือหลายเล่ม)
  coverUrl: string | null;      // เก็บ Path รูป เช่น "/uploads/cover-1.jpg" (มาจาก File Upload)
  isAvailable: boolean;         // สถานะหนังสือ (Boolean: true = ว่าง/ยืมได้, false = ไม่ว่าง)
  publishedYear?: number;       // ปีที่พิมพ์ (Optional)
  userName?: string | null;     // ชื่อ User เจ้าของหนังสือ (Populated helper สำหรับ UI)
  borrowerName?: string | null; // Alias สำหรับความเข้ากันได้ของ UI
  borrowedAt?: string | null;   // วันเวลาที่ทำการยืมหรือเพิ่ม
  createdAt?: string;           // วันที่เพิ่มข้อมูล
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
