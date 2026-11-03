import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/lib/users-store";
import { UpdateUserDto } from "@/types/user";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/users/:id
 * ดึงข้อมูลผู้ใช้รายบุคคล
 * Response: 200 OK / 404 Not Found
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID ต้องเป็นตัวเลขเท่านั้น" }, { status: 400 });
    }

    const user = getUserById(id);
    if (!user) {
      return NextResponse.json({ error: `ไม่พบผู้ใช้ ID = ${id}` }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/:id error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PUT /api/users/:id
 * แก้ไขข้อมูลผู้ใช้
 * Response: 200 OK / 404 Not Found
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID ต้องเป็นตัวเลขเท่านั้น" }, { status: 400 });
    }

    const existing = getUserById(id);
    if (!existing) {
      return NextResponse.json({ error: `ไม่พบผู้ใช้ ID = ${id}` }, { status: 404 });
    }

    const body = await request.json();
    const dto: UpdateUserDto = {};

    if (body.name !== undefined) dto.name = body.name;
    if (body.email !== undefined) dto.email = body.email;

    const updated = updateUser(id, dto);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users/:id error:", error);
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}

/**
 * DELETE /api/users/:id
 * ลบผู้ใช้ และลบหนังสือของสมาชิกคนนี้ออกด้วย (Cascade)
 * Response: 200 OK / 404 Not Found
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID ต้องเป็นตัวเลขเท่านั้น" }, { status: 400 });
    }

    const existing = getUserById(id);
    if (!existing) {
      return NextResponse.json({ error: `ไม่พบผู้ใช้ ID = ${id}` }, { status: 404 });
    }

    deleteUser(id);
    return NextResponse.json({ message: "ลบผู้ใช้สำเร็จ (Cascade ลบหนังสือของสมาชิกนี้ทั้งหมดแล้ว)", id }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/users/:id error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
