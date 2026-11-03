import { NextResponse } from "next/server";
import { getAllBooks, createBook } from "@/lib/books-store";
import { userExists } from "@/lib/users-store";
import { CreateBookDto } from "@/types/book";

/**
 * GET /api/books
 * ดึงรายการหนังสือทั้งหมด (รองรับ query params: search, isAvailable, userId)
 * Response: 200 OK
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const isAvailableParam = searchParams.get("isAvailable");
    const userIdParam = searchParams.get("userId");
    
    let isAvailable: boolean | undefined = undefined;
    if (isAvailableParam !== null) {
      isAvailable = isAvailableParam === "true";
    }

    const userId = userIdParam ? Number(userIdParam) : undefined;

    const books = getAllBooks({ search, isAvailable, userId });
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("GET /api/books error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/books
 * เพิ่มหนังสือเล่มใหม่
 * Body: { title, author, userId, coverUrl?, isAvailable?, publishedYear? }
 * Response: 201 Created (สำเร็จ), 400 Bad Request (ข้อมูลไม่ครบถ้วน / Foreign Key ผิด)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. ตรวจสอบชื่อหนังสือ (title)
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อหนังสือ (title)" },
        { status: 400 }
      );
    }

    // 2. ตรวจสอบชื่อผู้แต่ง (author)
    if (!body.author || typeof body.author !== "string" || body.author.trim() === "") {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อผู้แต่ง (author)" },
        { status: 400 }
      );
    }

    // 3. ตรวจสอบ Foreign Key (userId ชี้กลับไปที่ Users)
    if (body.userId === undefined || body.userId === null || isNaN(Number(body.userId))) {
      return NextResponse.json(
        { error: "กรุณาระบุรหัสผู้ใช้เจ้าของหนังสือ (userId)" },
        { status: 400 }
      );
    }

    const userId = Number(body.userId);
    if (!userExists(userId)) {
      return NextResponse.json(
        { error: `ไม่พบผู้ใช้รหัส #${userId} ในระบบ (Foreign Key ไม่ถูกต้อง)` },
        { status: 400 }
      );
    }

    const publishedYear = body.publishedYear ? Number(body.publishedYear) : new Date().getFullYear();

    const dto: CreateBookDto = {
      title: body.title,
      author: body.author,
      userId,
      coverUrl: body.coverUrl || null,
      isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : true,
      publishedYear,
    };

    const newBook = createBook(dto);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("POST /api/books error:", error);
    return NextResponse.json(
      { error: "รูปแบบ JSON ไม่ถูกต้อง หรือเกิดข้อผิดพลาดภายในระบบ" },
      { status: 400 }
    );
  }
}
