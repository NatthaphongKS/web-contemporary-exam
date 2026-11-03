/**
 * ==============================================================================
 * Route Handler: /api/users
 * ==============================================================================
 * จัดการ Resource ผู้ใช้งาน/สมาชิก (Collection Level):
 * • GET  /api/users -> ดึงรายชื่อสมาชิกทั้งหมด (200 OK)
 * • POST /api/users -> สร้างสมาชิกใหม่พร้อม Validate ข้อมูล (201 Created / 400 Bad Request)
 */

import { NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/lib/users-store";
import { CreateUserDto } from "@/types/user";

/**
 * GET /api/users
 * ดึงรายชื่อสมาชิกทั้งหมด พร้อมจำนวนหนังสือที่แต่ละคนถือครองอยู่
 * 
 * @function GET
 * @returns {Promise<NextResponse>} JSON Array ของ User ทั้งหมด
 * 
 * Status Codes:
 * • 200 OK: สำเร็จ พร้อม JSON Array ของ Users
 * • 500 Internal Server Error: เกิดข้อผิดพลาดที่ไม่คาดคิดบนเซิร์ฟเวอร์
 */
export async function GET(): Promise<NextResponse> {
  try {
    // ขั้นตอนที่ 1: เรียกอ่านข้อมูลผู้ใช้ทั้งหมดจาก Users Store
    const users = getAllUsers();

    // ขั้นตอนที่ 2: ตอบกลับด้วย Status 200 OK และ JSON Array
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ในการดึงข้อมูลผู้ใช้" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * เพิ่มสมาชิกใหม่เข้าสู่ระบบ
 * 
 * @function POST
 * @param {Request} request - HTTP Request object ที่มี JSON Body { name, email }
 * @returns {Promise<NextResponse>} User object ที่สร้างใหม่ (201) หรือ Error message (400)
 * 
 * Request Headers:
 * • Content-Type: application/json
 * 
 * Request Body (JSON):
 * • name: string (บังคับ - ต้องไม่เป็นค่าว่าง)
 * • email: string (บังคับ - ต้องมีรูปแบบอีเมลที่ถูกต้อง)
 * 
 * Status Codes:
 * • 201 Created: บันทึกสมาชิกใหม่สำเร็จ
 * • 400 Bad Request: ข้อมูลที่ส่งมาไม่ถูกต้อง หรือ JSON ผิดรูปแบบ
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // ขั้นตอนที่ 1: ถอดรหัส JSON Body จาก Request
    const body = await request.json();

    // ขั้นตอนที่ 2: ตรวจสอบความถูกต้องของชื่อ-นามสกุล (Validation)
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อ-นามสกุล (name) ให้ถูกต้องและไม่เป็นค่าว่าง" },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 3: ตรวจสอบความถูกต้องของอีเมล (Validation)
    if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "กรุณาระบุอีเมลที่ถูกต้อง (email ต้องมีเครื่องหมาย @)" },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 4: เตรียม DTO ที่ทำความสะอาดข้อมูลแล้ว
    const dto: CreateUserDto = {
      name: body.name.trim(),
      email: body.email.trim(),
    };

    // ขั้นตอนที่ 5: บันทึกลง Store และตอบกลับด้วย Status 201 Created
    const newUser = createUser(dto);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "รูปแบบ JSON ใน Request Body ไม่ถูกต้อง" },
      { status: 400 }
    );
  }
}
