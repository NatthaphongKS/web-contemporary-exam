import { NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/lib/users-store";
import { CreateUserDto } from "@/types/user";

/**
 * GET /api/users
 * ดึงรายชื่อสมาชิกทั้งหมด
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
 * เพิ่มสมาชิกใหม่
 * Body: { name, email }
 * Response: 201 Created / 400 Bad Request
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

    const dto: CreateUserDto = {
      name: body.name.trim(),
      email: body.email.trim(),
    };

    const newUser = createUser(dto);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}
