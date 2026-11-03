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
 * @function GET
 * @param {Request} request - HTTP Request object
 * @param {RouteParams} context - อ็อบเจกต์ params แบบ Promise ตาม Next.js 15+
 * @returns {Promise<NextResponse>} JSON ข้อมูลหนังสือ หรือข้อความแจ้งเตือนข้อผิดพลาด
 * 
 * Status Codes:
 * • 200 OK: พบหนังสือ ส่งคืน Book object พร้อม User เจ้าของ
 * • 400 Bad Request: ID ไม่ใช่ตัวเลข
 * • 404 Not Found: ไม่พบหนังสือรหัสนี้
 * • 500 Internal Server Error: เกิดข้อผิดพลาดในเซิร์ฟเวอร์
 */
export async function GET(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    // ขั้นตอนที่ 1: ดึง rawId จาก async params (Next.js 15+)
    const { id: rawId } = await params;
    const id = Number(rawId);

    // ขั้นตอนที่ 2: ตรวจสอบความถูกต้องของ ID ว่าเป็นตัวเลขหรือไม่
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "รหัสหนังสือ (ID) ใน URL ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 3: ค้นหาข้อมูลหนังสือจาก Store ตาม ID
    const book = getBookById(id);
    if (!book) {
      return NextResponse.json(
        { error: `ไม่พบหนังสือที่มีรหัส ID = ${id} ในระบบ` },
        { status: 404 }
      );
    }

    // ขั้นตอนที่ 4: ส่งคืนข้อมูลหนังสือพร้อมสถานะ 200 OK
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
 * @function PUT
 * @param {Request} request - HTTP Request object พร้อม JSON body
 * @param {RouteParams} context - อ็อบเจกต์ params แบบ Promise ตาม Next.js 15+
 * @returns {Promise<NextResponse>} JSON ข้อมูลหนังสือหลังแก้ไขเสร็จสมบูรณ์
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
export async function PUT(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    // ขั้นตอนที่ 1: ดึงและตรวจสอบ ID จาก async params
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "รหัสหนังสือ (ID) ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 2: ตรวจสอบว่ามีหนังสือเล่มนี้อยู่ก่อนหรือไม่
    const existing = getBookById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `ไม่พบหนังสือรหัส ID = ${id} เพื่อทำการแก้ไข` },
        { status: 404 }
      );
    }

    // ขั้นตอนที่ 3: อ่านข้อมูล JSON Request Body
    const body = await request.json();
    const dto: UpdateBookDto = {};

    // ขั้นตอนที่ 4: ตรวจสอบและแมปฟิลด์ title (ถ้ามีส่งมา)
    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim() === "") {
        return NextResponse.json({ error: "ชื่อหนังสือต้องไม่เป็นค่าว่าง" }, { status: 400 });
      }
      dto.title = body.title.trim();
    }

    // ขั้นตอนที่ 5: ตรวจสอบและแมปฟิลด์ author (ถ้ามีส่งมา)
    if (body.author !== undefined) {
      if (typeof body.author !== "string" || body.author.trim() === "") {
        return NextResponse.json({ error: "ชื่อผู้แต่งต้องไม่เป็นค่าว่าง" }, { status: 400 });
      }
      dto.author = body.author.trim();
    }

    // ขั้นตอนที่ 6: ตรวจสอบและยืนยัน Foreign Key userId กับ users-store
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

    // ขั้นตอนที่ 7: ตรวจสอบและแมปฟิลด์ publishedYear (ถ้ามีส่งมา)
    if (body.publishedYear !== undefined) {
      const year = Number(body.publishedYear);
      if (isNaN(year) || year < 1000 || year > 2100) {
        return NextResponse.json({ error: "ปีที่พิมพ์ต้องเป็นตัวเลข ค.ศ. ที่สมเหตุสมผล" }, { status: 400 });
      }
      dto.publishedYear = year;
    }

    // ขั้นตอนที่ 8: แมปค่า isAvailable และ coverUrl
    if (body.isAvailable !== undefined) {
      dto.isAvailable = Boolean(body.isAvailable);
    }

    if (body.coverUrl !== undefined) {
      dto.coverUrl = body.coverUrl;
    }

    // ขั้นตอนที่ 9: สั่งอัปเดตข้อมูลหนังสือใน Memory Store และส่งคืนผลลัพธ์
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
 * @function DELETE
 * @param {Request} request - HTTP Request object
 * @param {RouteParams} context - อ็อบเจกต์ params แบบ Promise ตาม Next.js 15+
 * @returns {Promise<NextResponse>} JSON แจ้งผลการลบสำเร็จและข้อมูลหนังสือที่ถูกลบ
 * 
 * Status Codes:
 * • 200 OK: ลบสำเร็จ
 * • 400 Bad Request: ID ไม่ถูกต้อง
 * • 404 Not Found: ไม่พบหนังสือที่ต้องการลบ
 * • 500 Internal Server Error: เกิดข้อผิดพลาดในเซิร์ฟเวอร์
 */
export async function DELETE(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    // ขั้นตอนที่ 1: ดึงและตรวจสอบ ID จาก async params
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "รหัสหนังสือ (ID) ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 2: ตรวจสอบว่าหนังสือเล่มนี้มีอยู่จริงหรือไม่
    const existing = getBookById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `ไม่พบหนังสือที่มี ID = ${id} เพื่อทำการลบ` },
        { status: 404 }
      );
    }

    // ขั้นตอนที่ 3: ดำเนินการลบหนังสือออกจาก Store
    const deleted = deleteBook(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการลบข้อมูลหนังสือ" },
        { status: 500 }
      );
    }

    // ขั้นตอนที่ 4: ส่งคืนสถานะ 200 OK พร้อมข้อมูลหนังสือที่ถูกลบ
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
