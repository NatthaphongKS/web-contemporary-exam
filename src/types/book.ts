/**
 * Data Model สำหรับระบบจัดการหนังสือห้องสมุด
 * อ้างอิงตามข้อกำหนดการสอบวิชา Web (รองรับ Foreign Key userId เชื่อมโยงกับ Users)
 */

export interface Book {
  id: number;                   // รหัสประจำหนังสือ (Number)
  title: string;                // ชื่อหนังสือ (String)
  author: string;               // ชื่อผู้แต่ง (String)
  publishedYear: number;        // ปีที่พิมพ์ (Number)
  isAvailable: boolean;         // สถานะการยืม (Boolean)
  coverUrl?: string | null;     // ภาพปกหนังสือ (Optional - มาจาก File Upload)
  userId?: number | null;        // Foreign Key ชี้ไปที่ User.id ที่ยืมหนังสือเล่มนี้อยู่ (null = ยังไม่มีคนยืม)
  borrowedAt?: string | null;   // วันเวลาที่ยืม
  borrowerName?: string | null; // ชื่อผู้ยืม (Populated field เพื่อความสะดวกใน UI)
  createdAt?: string;           // วันที่เพิ่มข้อมูล
}

export type CreateBookDto = {
  title: string;
  author: string;
  publishedYear: number;
  isAvailable?: boolean;
  coverUrl?: string | null;
  userId?: number | null;
};

export type UpdateBookDto = Partial<CreateBookDto>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}
