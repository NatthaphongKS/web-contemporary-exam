import { NextResponse } from "next/server";
import { getAllBooks, createBook } from "@/lib/books-store";
import { CreateBookDto } from "@/types/book";

/**
 * GET /api/books
 * ดึงรายการหนังสือทั้งหมด (รองรับ query params: search, isAvailable)
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
 * Body: { title, author, publishedYear, isAvailable?, coverUrl? }
 * Response: 201 Created (สำเร็จ), 400 Bad Request (ข้อมูลไม่ครบถ้วน)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ตรวจสอบความถูกต้องของข้อมูล (Validation)
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อหนังสือ (title)" },
        { status: 400 }
      );
    }

    if (!body.author || typeof body.author !== "string" || body.author.trim() === "") {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อผู้แต่ง (author)" },
        { status: 400 }
      );
    }

    const publishedYear = Number(body.publishedYear);
    if (!publishedYear || isNaN(publishedYear) || publishedYear < 1000 || publishedYear > 2100) {
      return NextResponse.json(
        { error: "กรุณาระบุปีที่พิมพ์ให้ถูกต้อง (publishedYear เป็นตัวเลข ค.ศ.)" },
        { status: 400 }
      );
    }

    const dto: CreateBookDto = {
      title: body.title,
      author: body.author,
      publishedYear,
      isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : true,
      coverUrl: body.coverUrl || null,
      userId: body.userId ? Number(body.userId) : null,
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
