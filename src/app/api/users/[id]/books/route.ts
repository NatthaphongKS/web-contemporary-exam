import { NextResponse } from "next/server";
import { getUserById } from "@/lib/users-store";
import { getBooksByUserId } from "@/lib/books-store";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/users/:id/books
 * ดึงเฉพาะหนังสือที่ผู้ใช้คนนี้ยืมอยู่
 * Response: 200 OK / 404 Not Found (กรณีไม่พบผู้ใช้)
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

    const books = getBooksByUserId(id);
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        booksCount: books.length,
        books,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/users/:id/books error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
