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
 * Status Codes:
 * • 200 OK: สำเร็จ พร้อม JSON Array ของ Users
 * • 500 Internal Server Error: เกิดข้อผิดพลาดที่ไม่คาดคิดบนเซิร์ฟเวอร์
 */
export async function GET() {
  try {
    const users = getAllUsers();
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
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. ตรวจสอบชื่อ-นามสกุล (Validation: ต้องมีค่าและไม่เป็นสตริงว่าง)
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อ-นามสกุล (name) ให้ถูกต้องและไม่เป็นค่าว่าง" },
        { status: 400 }
      );
    }

    // 2. ตรวจสอบรูปแบบอีเมล (Validation: ต้องมีเครื่องหมาย @)
    if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "กรุณาระบุอีเมลที่ถูกต้อง (email ต้องมีเครื่องหมาย @)" },
        { status: 400 }
      );
    }

    // 3. เตรียม DTO ที่ทำความสะอาดข้อมูลแล้ว
    const dto: CreateUserDto = {
      name: body.name.trim(),
      email: body.email.trim(),
    };

    // 4. บันทึกลง Store และตอบกลับด้วย Status 201 Created
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
