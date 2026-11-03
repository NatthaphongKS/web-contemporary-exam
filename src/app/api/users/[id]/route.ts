/**
 * ==============================================================================
 * Route Handler: /api/users/[id]
 * ==============================================================================
 * จัดการ Resource ผู้ใช้รายบุคคล (Individual Resource Level):
 * • GET    /api/users/:id -> ดึงข้อมูลผู้ใช้ตาม ID (200 OK / 404 Not Found)
 * • PUT    /api/users/:id -> แก้ไขข้อมูลผู้ใช้ (200 OK / 404 Not Found)
 * • DELETE /api/users/:id -> ลบผู้ใช้ และ Cascade ลบหนังสือของเขา (200 OK / 404 Not Found)
 * 
 * ⚠️ กับดักสำคัญในห้องสอบ (Next.js 15+ Breaking Change):
 * ใน Next.js 15+ ตัวแปร `params` ถูกเปลี่ยนเป็น `Promise`
 * ต้องประกาศ Type: `params: Promise<{ id: string }>` และเขียน `const { id } = await params;` เสมอ
 */

import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/lib/users-store";
import { UpdateUserDto } from "@/types/user";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/users/:id
 * ดึงข้อมูลผู้ใช้รายบุคคล
 * 
 * Status Codes:
 * • 200 OK: พบผู้ใช้
 * • 400 Bad Request: ID ไม่ใช่ตัวเลข
 * • 404 Not Found: ไม่พบผู้ใช้รหัสนี้ในระบบ
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    // ถอดรหัส Params แบบ Async ตามมาตรฐาน Next.js 15+
    const { id: rawId } = await params;
    const id = Number(rawId);

    // ตรวจสอบว่า ID เป็นตัวเลขที่ถูกต้องหรือไม่
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "รหัสผู้ใช้ (ID) ใน URL ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    const user = getUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: `ไม่พบผู้ใช้งานรหัส ID = ${id} ในระบบ` },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/:id error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/:id
 * แก้ไขข้อมูลผู้ใช้
 * 
 * Status Codes:
 * • 200 OK: แก้ไขสำเร็จ
 * • 400 Bad Request: ID หรือรูปแบบ JSON ไม่ถูกต้อง
 * • 404 Not Found: ไม่พบผู้ใช้ที่ต้องการแก้ไข
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "รหัสผู้ใช้ (ID) ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามีผู้ใช้นี้อยู่ก่อนหรือไม่
    const existing = getUserById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `ไม่พบผู้ใช้งานรหัส ID = ${id} เพื่อทำการแก้ไขข้อมูล` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const dto: UpdateUserDto = {};

    if (body.name !== undefined) dto.name = String(body.name).trim();
    if (body.email !== undefined) dto.email = String(body.email).trim();

    const updated = updateUser(id, dto);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users/:id error:", error);
    return NextResponse.json(
      { error: "รูปแบบ JSON ใน Request Body ไม่ถูกต้อง หรือเกิดข้อผิดพลาดในการแก้ไข" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/users/:id
 * ลบผู้ใช้ และทำ Cascade Delete ลบหนังสือของสมาชิกคนนี้ออกด้วยทั้งหมด
 * 
 * Status Codes:
 * • 200 OK: ลบผู้ใช้และหนังสือที่เกี่ยวข้องสำเร็จ
 * • 400 Bad Request: ID ไม่ถูกต้อง
 * • 404 Not Found: ไม่พบผู้ใช้ที่ต้องการลบ
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "รหัสผู้ใช้ (ID) ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    const existing = getUserById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `ไม่พบผู้ใช้งานรหัส ID = ${id} เพื่อทำการลบ` },
        { status: 404 }
      );
    }

    // ดำเนินการลบผู้ใช้ (ในฟังก์ชัน deleteUser จะจัดการ Cascade ลบหนังสือด้วยอัตโนมัติ)
    deleteUser(id);

    return NextResponse.json(
      {
        message: `ลบผู้ใช้ ID = ${id} สำเร็จ (ระบบได้ทำ Cascade ลบหนังสือทั้งหมดของสมาชิกคนนี้แล้ว)`,
        id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/users/:id error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
