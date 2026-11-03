import { NextResponse } from "next/server";
import { borrowBook, getBookById } from "@/lib/books-store";
import { getUserById } from "@/lib/users-store";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/books/:id/borrow
 * ยืมหนังสือให้ผู้ใช้คนใดคนหนึ่ง
 * Body: { userId: number }
 * Response: 200 OK / 400 Bad Request / 404 Not Found
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

    const body = await request.json();
    const userId = Number(body.userId);

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "กรุณาระบุ userId ของผู้ยืม" }, { status: 400 });
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: `ไม่พบผู้ใช้ ID = ${userId}` }, { status: 404 });
    }

    const result = borrowBook(bookId, userId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: `ทำรายการยืมหนังสือ "${result.book?.title}" ให้ ${user.name} สำเร็จ`,
        book: result.book,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/books/:id/borrow error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
