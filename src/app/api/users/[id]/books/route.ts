/**
 * ==============================================================================
 * Route Handler: /api/users/[id]/books (Relational 1:N Endpoint)
 * ==============================================================================
 * ดึงรายการหนังสือเฉพาะที่ผูกกับผู้ใช้งาน ID นั้นๆ (One-to-Many Relationship)
 * ตามข้อสอบ: ระบบต้องสามารถแสดงหนังสือทั้งหมดที่เป็นของสมาชิกรายคนได้
 * 
 * ตัวอย่างการเรียกใช้:
 * • GET /api/users/1/books -> ดึงเฉพาะหนังสือของสมชาย ใจดี (ID = 1)
 */

import { NextResponse } from "next/server";
import { getUserById } from "@/lib/users-store";
import { getBooksByUserId } from "@/lib/books-store";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/users/:id/books
 * ดึงรายการหนังสือเฉพาะของสมาชิกรายบุคคล
 * 
 * @function GET
 * @param {Request} request - HTTP Request object
 * @param {RouteParams} context - URL dynamic params promise
 * @returns {Promise<NextResponse>} Envelope object ที่มี { user, booksCount, books } (200) หรือ Error (400, 404)
 * 
 * Status Codes:
 * • 200 OK: พบผู้ใช้ และส่งคืนรายการหนังสือของคนนั้น (อาจเป็นอาเรย์ว่างหากยังไม่มีหนังสือ)
 * • 400 Bad Request: ID ไม่ใช่ตัวเลข
 * • 404 Not Found: ไม่พบผู้ใช้งานรหัสนี้
 */
export async function GET(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    // ขั้นตอนที่ 1: แกะและตรวจสอบ ID จาก URL
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "รหัสผู้ใช้ (ID) ใน URL ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 2: ตรวจสอบว่ามีผู้ใช้นี้อยู่ในระบบหรือไม่
    const user = getUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: `ไม่พบผู้ใช้งาน ID = ${id} ในระบบ` },
        { status: 404 }
      );
    }

    // ขั้นตอนที่ 3: ดึงหนังสือทั้งหมดที่มี `userId === id`
    const books = getBooksByUserId(id);

    // ขั้นตอนที่ 4: ห่อ Response Object (Envelope) ให้มีทั้งข้อมูลผู้ใช้และรายการหนังสือ
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        booksCount: books.length,
        books,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/users/:id/books error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ในการดึงข้อมูลหนังสือของผู้ใช้" },
      { status: 500 }
    );
  }
}
