/**
 * ==============================================================================
 * Data Model: ตารางที่ 1 — ผู้ใช้งาน/สมาชิก (Users)
 * ==============================================================================
 * ไฟล์นี้ใช้กำหนดโครงสร้างข้อมูล (TypeScript Interfaces) และ Data Transfer Objects (DTO)
 * สำหรับตาราง Users ตามข้อกำหนดการสอบปฏิบัติวิชา Web Contemporary
 *
 * สถาปัตยกรรมความสัมพันธ์ (1 : N Relation):
 * • User 1 คน สามารถถือครอง/เป็นเจ้าของหนังสือ (Book) ได้หลายเล่ม (1 to Many)
 * • ฝั่ง Books จะเก็บ Foreign Key `userId` ชี้กลับมาที่ `User.id`
 * • เมื่อ User ถูกลบ ระบบจะทำ Cascade Delete ลบหนังสือของ User นั้นออกด้วยทั้งหมด
 */

/**
 * Interface ข้อมูลผู้ใช้หลัก (Entity ใน Database จำลอง)
 * 
 * @interface User
 * @property {number} id - รหัสประจำตัวผู้ใช้ (Primary Key) ต้องเป็นตัวเลข Number เสมอ
 * @property {string} name - ชื่อ-นามสกุล ของสมาชิก
 * @property {string} email - อีเมลของสมาชิก ใช้ระบุตัวตน
 * @property {number} [booksCount] - จำนวนหนังสือที่สมาชิกคนนี้ถือครองอยู่ (Computed Field จาก Books Store)
 */
export interface User {
  /**
   * รหัสประจำตัวผู้ใช้ (Primary Key)
   * หมายเหตุในการสอบ: ค่า id ต้องเป็น Number ห้ามใช้ String เพื่อให้ตรงกับมาตรฐาน DB
   */
  id: number;

  /**
   * ชื่อ-นามสกุล ของผู้ใช้หรือสมาชิก
   */
  name: string;

  /**
   * อีเมลของผู้ใช้ (ใช้สำหรับติดต่อหรือระบุตัวตน)
   */
  email: string;

  /**
   * จำนวนหนังสือทั้งหมดที่สมาชิกคนนี้ถือครองอยู่ (Computed Field)
   * คำนวณแบบ Dynamic จาก booksStore เมื่อเรียกดูรายชื่อสมาชิก (1 : N Relation)
   */
  booksCount?: number;
}

/**
 * Data Transfer Object (DTO) สำหรับสร้างผู้ใช้ใหม่ (POST /api/users)
 * ไม่รวมฟิลด์ `id` เพราะเซิร์ฟเวอร์จะเป็นผู้สร้าง Auto Increment ให้เอง
 * 
 * @typedef {Object} CreateUserDto
 * @property {string} name - ชื่อ-นามสกุลของผู้ใช้ใหม่ (บังคับ)
 * @property {string} email - อีเมลของผู้ใช้ใหม่ (บังคับ)
 */
export type CreateUserDto = {
  name: string;
  email: string;
};

/**
 * Data Transfer Object (DTO) สำหรับแก้ไขข้อมูลผู้ใช้ (PUT /api/users/:id)
 * ใช้ Partial เพื่อให้สามารถแก้ไขเฉพาะฟิลด์ที่ส่งมาได้ (Optional Fields)
 * 
 * @typedef {Partial<CreateUserDto>} UpdateUserDto
 */
export type UpdateUserDto = Partial<CreateUserDto>;
