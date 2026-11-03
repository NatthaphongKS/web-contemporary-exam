/**
 * ==============================================================================
 * Data Model: ตารางที่ 2 — หนังสือ (Books)
 * ==============================================================================
 * ไฟล์นี้ใช้กำหนดโครงสร้างข้อมูลหนังสือ และ DTOs สำหรับระบบ RESTful API
 * อ้างอิงตามข้อกำหนดการสอบปฏิบัติวิชา Web Contemporary:
 * 
 * คุณสมบัติสำคัญของตาราง Books:
 * 1. Primary Key: `id` (Number)
 * 2. Foreign Key: `userId` (Number) ชี้กลับไปยัง User เจ้าของหนังสือ (1 : N Relation)
 * 3. File Upload Field: `coverUrl` (String | null) เก็บ URL พาธรูปภาพปก เช่น "/uploads/cover.jpg"
 * 4. Boolean Flag: `isAvailable` (Boolean) สถานะพร้อมใช้งาน/ยืม
 */

/**
 * Interface ข้อมูลหนังสือหลัก (Entity ใน Database จำลอง)
 * 
 * @interface Book
 * @property {number} id - รหัสประจำหนังสือ (Primary Key)
 * @property {string} title - ชื่อหนังสือ
 * @property {string} author - ชื่อผู้แต่ง
 * @property {number} userId - Foreign Key ชี้กลับไปยัง User เจ้าของหนังสือ (1 : N)
 * @property {string | null} coverUrl - พาธของรูปภาพหน้าปกจาก File Upload API
 * @property {boolean} isAvailable - สถานะความพร้อมของหนังสือ (true = พร้อมใช้งาน, false = ไม่พร้อมใช้งาน)
 * @property {number} [publishedYear] - ปีที่พิมพ์ (ค.ศ.)
 * @property {string | null} [userName] - ชื่อ User เจ้าของหนังสือ (Enriched Helper สำหรับ UI)
 */
export interface Book {
  /**
   * รหัสประจำหนังสือ (Primary Key)
   */
  id: number;

  /**
   * ชื่อหนังสือ (Title)
   */
  title: string;

  /**
   * ชื่อผู้แต่ง (Author)
   */
  author: string;

  /**
   * Foreign Key ชี้กลับไปยัง `User.id` เพื่อระบุผู้ถือครองหนังสือ (1 : N Relation)
   * กฎการสอบ: ต้องตรวจสอบว่า `userId` มีอยู่ในตาราง Users ก่อนบันทึกเสมอ (Foreign Key Integrity)
   */
  userId: number;

  /**
   * พาธของรูปภาพหน้าปกที่ได้จากการอัปโหลดผ่าน File Upload API (POST /api/upload)
   * ค่าเป็น null หากยังไม่ได้อัปโหลดรูปภาพ
   */
  coverUrl: string | null;

  /**
   * สถานะความพร้อมของหนังสือ (true = พร้อมใช้งาน, false = ไม่พร้อมใช้งาน)
   */
  isAvailable: boolean;

  /**
   * ปีที่จัดพิมพ์ (ค.ศ.) - ฟิลด์เสริม (Optional)
   */
  publishedYear?: number;

  /**
   * ชื่อของ User เจ้าของหนังสือ (Populated / Enriched Field)
   * เติมค่าอัตโนมัติจาก Users Store เพื่อให้ UI นำไปแสดงผลได้ทันทีโดยไม่ต้อง Query ซ้ำ
   */
  userName?: string | null;
}

/**
 * Data Transfer Object (DTO) สำหรับสร้างหนังสือเล่มใหม่ (POST /api/books)
 * ข้อสอบเน้นย้ำ: ต้องมี `title`, `author` และ `userId` เสมอ
 * 
 * @typedef {Object} CreateBookDto
 * @property {string} title - ชื่อหนังสือ (บังคับ)
 * @property {string} author - ชื่อผู้แต่ง (บังคับ)
 * @property {number} userId - รหัสสมาชิกเจ้าของหนังสือ (Foreign Key - บังคับ)
 * @property {string | null} [coverUrl] - URL รูปภาพหน้าปก
 * @property {boolean} [isAvailable] - สถานะความพร้อมใช้งาน (ค่าเริ่มต้น: true)
 * @property {number} [publishedYear] - ปีที่พิมพ์ ค.ศ.
 */
export type CreateBookDto = {
  title: string;
  author: string;
  userId: number;
  coverUrl?: string | null;
  isAvailable?: boolean;
  publishedYear?: number;
};

/**
 * Data Transfer Object (DTO) สำหรับแก้ไขข้อมูลหนังสือ (PUT /api/books/:id)
 * ยอมรับเฉพาะฟิลด์ที่ต้องการเปลี่ยนแปลง (Partial update)
 * 
 * @typedef {Partial<CreateBookDto>} UpdateBookDto
 */
export type UpdateBookDto = Partial<CreateBookDto>;

/**
 * Standard API Response Wrapper
 * โครงสร้างมาตรฐานสำหรับการตอบกลับ JSON Response
 * 
 * @template T
 * @interface ApiResponse
 * @property {boolean} success - สถานะสำเร็จหรือไม่
 * @property {T} [data] - ข้อมูล payload ที่ส่งกลับ
 * @property {string} [message] - ข้อความแจ้งเตือนผลลัพธ์
 * @property {string} [error] - ข้อความอธิบายข้อผิดพลาด
 * @property {number} [status] - รหัสสถานะ HTTP (เช่น 200, 201, 400, 404)
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}
