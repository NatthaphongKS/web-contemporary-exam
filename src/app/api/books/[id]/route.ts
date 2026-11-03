/**
 * ==============================================================================
 * Route Handler: /api/books/[id]
 * ==============================================================================
 * จัดการ Resource หนังสือรายเล่ม (Individual Resource Level):
 * • GET    /api/books/:id -> ดึงข้อมูลหนังสือตาม ID (200 OK / 404 Not Found)
 * • PUT    /api/books/:id -> แก้ไขข้อมูลหนังสือ (200 OK / 400 Bad Request / 404 Not Found)
 * • DELETE /api/books/:id -> ลบหนังสือออกจากระบบ (200 OK / 404 Not Found)
 * 
 * ⚠️ Next.js 15+ Async Params:
 * `params` เป็น Promise ต้องใช้ `const { id: rawId } = await params;` เสมอ
 */

import { NextResponse } from "next/server";
import { getBookById, updateBook, deleteBook } from "@/lib/books-store";
import { userExists } from "@/lib/users-store";
import { UpdateBookDto } from "@/types/book";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/books/:id
 * ดึงข้อมูลหนังสือเล่มเดียวตาม ID
 * 
 * Status Codes:
 * • 200 OK: พบหนังสือ
 * • 400 Bad Request: ID ไม่ใช่ตัวเลข
 * • 404 Not Found: ไม่พบหนังสือรหัสนี้
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "รหัสหนังสือ (ID) ใน URL ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    const book = getBookById(id);
    if (!book) {
      return NextResponse.json(
        { error: `ไม่พบหนังสือที่มีรหัส ID = ${id} ในระบบ` },
        { status: 404 }
      );
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error("GET /api/books/:id error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ในการดึงข้อมูลหนังสือ" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/books/:id
 * แก้ไขข้อมูลหนังสือตาม ID
 * 
 * Request Body (รองรับ Partial Fields):
 * • title?: string
 * • author?: string
 * • userId?: number (หากส่งมา จะตรวจสอบว่ามี User นี้จริง)
 * • coverUrl?: string | null
 * • isAvailable?: boolean
 * • publishedYear?: number
 * 
 * Status Codes:
 * • 200 OK: แก้ไขสำเร็จ
 * • 400 Bad Request: ข้อมูลไม่ถูกต้อง หรือ Foreign Key ผิด
 * • 404 Not Found: ไม่พบหนังสือที่ต้องการแก้ไข
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "รหัสหนังสือ (ID) ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    // 1. ตรวจสอบว่ามีหนังสือเล่มนี้อยู่ก่อนหรือไม่
    const existing = getBookById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `ไม่พบหนังสือรหัส ID = ${id} เพื่อทำการแก้ไข` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const dto: UpdateBookDto = {};

    // Validate & Map title
    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim() === "") {
        return NextResponse.json({ error: "ชื่อหนังสือต้องไม่เป็นค่าว่าง" }, { status: 400 });
      }
      dto.title = body.title.trim();
    }

    // Validate & Map author
    if (body.author !== undefined) {
      if (typeof body.author !== "string" || body.author.trim() === "") {
        return NextResponse.json({ error: "ชื่อผู้แต่งต้องไม่เป็นค่าว่าง" }, { status: 400 });
      }
      dto.author = body.author.trim();
    }

    // Validate & Map Foreign Key userId
    if (body.userId !== undefined) {
      const uId = Number(body.userId);
      if (isNaN(uId) || !userExists(uId)) {
        return NextResponse.json(
          { error: `ไม่พบสมาชิกที่มีรหัส #${body.userId} ในระบบ (Foreign Key ไม่ถูกต้อง)` },
          { status: 400 }
        );
      }
      dto.userId = uId;
    }

    // Validate & Map publishedYear
    if (body.publishedYear !== undefined) {
      const year = Number(body.publishedYear);
      if (isNaN(year) || year < 1000 || year > 2100) {
        return NextResponse.json({ error: "ปีที่พิมพ์ต้องเป็นตัวเลข ค.ศ. ที่สมเหตุสมผล" }, { status: 400 });
      }
      dto.publishedYear = year;
    }

    // Map isAvailable flag
    if (body.isAvailable !== undefined) {
      dto.isAvailable = Boolean(body.isAvailable);
    }

    // Map coverUrl
    if (body.coverUrl !== undefined) {
      dto.coverUrl = body.coverUrl;
    }

    const updated = updateBook(id, dto);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/books/:id error:", error);
    return NextResponse.json(
      { error: "รูปแบบ JSON ใน Request Body ไม่ถูกต้อง หรือเกิดข้อผิดพลาดในการแก้ไข" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/books/:id
 * ลบหนังสือตาม ID
 * 
 * Status Codes:
 * • 200 OK: ลบสำเร็จ
 * • 400 Bad Request: ID ไม่ถูกต้อง
 * • 404 Not Found: ไม่พบหนังสือที่ต้องการลบ
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "รหัสหนังสือ (ID) ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    const existing = getBookById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `ไม่พบหนังสือที่มี ID = ${id} เพื่อทำการลบ` },
        { status: 404 }
      );
    }

    const deleted = deleteBook(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการลบข้อมูลหนังสือ" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `ลบหนังสือ ID = ${id} สำเร็จ`, deletedBook: existing },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/books/:id error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ในการลบหนังสือ" },
      { status: 500 }
    );
  }
}
