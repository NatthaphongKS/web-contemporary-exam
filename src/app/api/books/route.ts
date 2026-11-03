/**
 * ==============================================================================
 * Route Handler: /api/books
 * ==============================================================================
 * จัดการ Resource หนังสือ (Collection Level):
 * • GET  /api/books -> ดึงรายการหนังสือทั้งหมด รองรับ Query Params: ?search=, ?userId=, ?isAvailable=
 * • POST /api/books -> สร้างหนังสือเล่มใหม่ พร้อมตรวจสอบ Foreign Key (userId) ว่ามีในตาราง Users หรือไม่
 */

import { NextResponse } from "next/server";
import { getAllBooks, createBook } from "@/lib/books-store";
import { userExists } from "@/lib/users-store";
import { CreateBookDto } from "@/types/book";

/**
 * GET /api/books
 * ดึงรายการหนังสือทั้งหมด พร้อมรองรับการค้นหาและตัวกรอง
 * 
 * @function GET
 * @param {Request} request - HTTP Request object พร้อม Query string
 * @returns {Promise<NextResponse>} JSON Array ของรายการหนังสือ (200 OK)
 * 
 * Query Parameters (ตัวอย่าง: /api/books?search=clean&isAvailable=true&userId=1):
 * • search: คำค้นหาชื่อหนังสือหรือชื่อผู้แต่ง (string)
 * • isAvailable: กรองสถานะความพร้อม ("true" หรือ "false")
 * • userId: กรองเฉพาะหนังสือของผู้ใช้รหัสนี้ (number)
 * 
 * Status Codes:
 * • 200 OK: สำเร็จ พร้อม JSON Array ของ Books
 * • 500 Internal Server Error: เกิดข้อผิดพลาดของเซิร์ฟเวอร์
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // ขั้นตอนที่ 1: ดึง URL Search Parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const isAvailableParam = searchParams.get("isAvailable");
    const userIdParam = searchParams.get("userId");
    
    // ขั้นตอนที่ 2: แปลง string query parameter เป็น boolean
    let isAvailable: boolean | undefined = undefined;
    if (isAvailableParam !== null) {
      isAvailable = isAvailableParam === "true";
    }

    // ขั้นตอนที่ 3: แปลง string query parameter เป็น number
    const userId = userIdParam ? Number(userIdParam) : undefined;

    // ขั้นตอนที่ 4: ดึงข้อมูลจาก Store และส่งออก
    const books = getAllBooks({ search, isAvailable, userId });
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("GET /api/books error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ในการดึงข้อมูลหนังสือ" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/books
 * เพิ่มหนังสือใหม่ลงในระบบ
 * 
 * @function POST
 * @param {Request} request - HTTP Request พร้อม JSON Body
 * @returns {Promise<NextResponse>} Book object ที่สร้างใหม่ (201) หรือ Error (400)
 * 
 * Request Headers:
 * • Content-Type: application/json
 * 
 * Request Body (JSON):
 * • title: string (บังคับ)
 * • author: string (บังคับ)
 * • userId: number (บังคับ - ต้องมีอยู่ในตาราง Users)
 * • coverUrl: string | null (ไม่บังคับ - ได้จาก POST /api/upload)
 * • isAvailable: boolean (ไม่บังคับ - ค่าเริ่มต้น true)
 * • publishedYear: number (ไม่บังคับ - ค่าเริ่มต้นปีปัจจุบัน)
 * 
 * Status Codes:
 * • 201 Created: บันทึกหนังสือใหม่สำเร็จ
 * • 400 Bad Request: ข้อมูลไม่ครบถ้วน หรือ Foreign Key ไม่ถูกต้อง
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // ขั้นตอนที่ 1: ถอดรหัส JSON Body
    const body = await request.json();

    // ขั้นตอนที่ 2: ตรวจสอบชื่อหนังสือ (Validation: title)
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อหนังสือ (title) และต้องไม่เป็นค่าว่าง" },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 3: ตรวจสอบชื่อผู้แต่ง (Validation: author)
    if (!body.author || typeof body.author !== "string" || body.author.trim() === "") {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อผู้แต่ง (author) และต้องไม่เป็นค่าว่าง" },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 4: ตรวจสอบ Foreign Key: userId (หัวใจสำคัญของข้อสอบ 2 ตารางสัมพันธ์)
    if (body.userId === undefined || body.userId === null || isNaN(Number(body.userId))) {
      return NextResponse.json(
        { error: "กรุณาระบุรหัสสมาชิกเจ้าของหนังสือ (userId) เป็นตัวเลข" },
        { status: 400 }
      );
    }

    const userId = Number(body.userId);
    // ตรวจสอบว่าผู้ใช้รหัสนี้มีตัวตนอยู่ใน Users Store จริงหรือไม่
    if (!userExists(userId)) {
      return NextResponse.json(
        { error: `ไม่พบสมาชิกที่มีรหัส ID = ${userId} ในระบบ (Foreign Key Integrity Error)` },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 5: จัดเตรียม DTO สำหรับบันทึก
    const publishedYear = body.publishedYear ? Number(body.publishedYear) : new Date().getFullYear();

    const dto: CreateBookDto = {
      title: body.title.trim(),
      author: body.author.trim(),
      userId,
      coverUrl: body.coverUrl || null,
      isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : true,
      publishedYear,
    };

    // ขั้นตอนที่ 6: สร้างหนังสือใหม่และตอบกลับ Status 201 Created
    const newBook = createBook(dto);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("POST /api/books error:", error);
    return NextResponse.json(
      { error: "รูปแบบ JSON ใน Request Body ไม่ถูกต้อง หรือเกิดข้อผิดพลาดในการประมวลผล" },
      { status: 400 }
    );
  }
}
