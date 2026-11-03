import { NextResponse } from "next/server";
import { returnBook, getBookById } from "@/lib/books-store";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/books/:id/return
 * คืนหนังสือกลับเข้าห้องสมุด (ปลด userId = null, isAvailable = true)
 * Response: 200 OK / 404 Not Found
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const bookId = Number(rawId);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Book ID ต้องเป็นตัวเลขเท่านั้น" }, { status: 400 });
    }

    const existingBook = getBookById(bookId);
    if (!existingBook) {
      return NextResponse.json({ error: `ไม่พบหนังสือ ID = ${bookId}` }, { status: 404 });
    }

    const result = returnBook(bookId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: `ทำรายการคืนหนังสือ "${result.book?.title}" กลับสู่ห้องสมุดสำเร็จ`,
        book: result.book,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/books/:id/return error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
