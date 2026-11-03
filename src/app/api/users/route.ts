import { NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/lib/users-store";
import { CreateUserDto } from "@/types/user";

/**
 * GET /api/users
 * ดึงรายชื่อผู้ใช้ทั้งหมด พร้อมจำนวนหนังสือที่ยืมอยู่ (borrowedBooksCount)
 * Response: 200 OK
 */
export async function GET() {
  try {
    const users = getAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/users
 * เพิ่มผู้ใช้ใหม่
 * Body: { name, email, role, avatarUrl? }
 * Response: 201 Created, 400 Bad Request
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "กรุณาระบุชื่อ-นามสกุล (name)" }, { status: 400 });
    }

    if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
      return NextResponse.json({ error: "กรุณาระบุอีเมลที่ถูกต้อง (email)" }, { status: 400 });
    }

    const role = body.role || "student";
    if (!["student", "teacher", "member"].includes(role)) {
      return NextResponse.json(
        { error: "role ต้องเป็น student, teacher หรือ member เท่านั้น" },
        { status: 400 }
      );
    }

    const dto: CreateUserDto = {
      name: body.name,
      email: body.email,
      role,
      avatarUrl: body.avatarUrl || null,
    };

    const newUser = createUser(dto);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}
