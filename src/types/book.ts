/**
 * Data Model สำหรับระบบจัดการหนังสือห้องสมุด
 * อ้างอิงตามข้อกำหนดการสอบวิชา Web
 */

export interface Book {
  id: number;              // รหัสประจำหนังสือ (Number)
  title: string;           // ชื่อหนังสือ (String)
  author: string;          // ชื่อผู้แต่ง (String)
  publishedYear: number;   // ปีที่พิมพ์ (Number)
  isAvailable: boolean;    // สถานะการยืม (Boolean)
  coverUrl?: string | null;// ภาพปกหนังสือ (Optional - มาจาก File Upload)
  createdAt?: string;      // วันที่เพิ่มข้อมูล
}

export type CreateBookDto = {
  title: string;
  author: string;
  publishedYear: number;
  isAvailable?: boolean;
  coverUrl?: string | null;
};

export type UpdateBookDto = Partial<CreateBookDto>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}
