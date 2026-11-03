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
 * Response: 200 OK (พบข้อมูล), 404 Not Found (ไม่พบข้อมูล)
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    const book = getBookById(id);
    if (!book) {
      return NextResponse.json(
        { error: `ไม่พบหนังสือที่มี ID = ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error("GET /api/books/:id error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/books/:id
 * แก้ไขข้อมูลหนังสือตาม ID
 * Response: 200 OK (แก้ไขสำเร็จ), 404 Not Found (ไม่พบหนังสือ), 400 Bad Request
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID ต้องเป็นตัวเลขเท่านั้น" },
        { status: 400 }
      );
    }

    const existing = getBookById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `ไม่พบหนังสือที่มี ID = ${id} เพื่อทำการแก้ไข` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const dto: UpdateBookDto = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim() === "") {
        return NextResponse.json({ error: "ชื่อหนังสือต้องไม่เป็นค่าว่าง" }, { status: 400 });
      }
      dto.title = body.title;
    }

    if (body.author !== undefined) {
      if (typeof body.author !== "string" || body.author.trim() === "") {
        return NextResponse.json({ error: "ชื่อผู้แต่งต้องไม่เป็นค่าว่าง" }, { status: 400 });
      }
      dto.author = body.author;
    }

    if (body.userId !== undefined) {
      const uId = Number(body.userId);
      if (isNaN(uId) || !userExists(uId)) {
        return NextResponse.json({ error: `ไม่พบผู้ใช้รหัส #${body.userId} ในระบบ (Foreign Key ไม่ถูกต้อง)` }, { status: 400 });
      }
      dto.userId = uId;
    }

    if (body.publishedYear !== undefined) {
      const year = Number(body.publishedYear);
      if (isNaN(year) || year < 1000 || year > 2100) {
        return NextResponse.json({ error: "ปีที่พิมพ์ต้องเป็นตัวเลข ค.ศ. ที่ถูกต้อง" }, { status: 400 });
      }
      dto.publishedYear = year;
    }

    if (body.isAvailable !== undefined) {
      dto.isAvailable = Boolean(body.isAvailable);
    }

    if (body.coverUrl !== undefined) {
      dto.coverUrl = body.coverUrl;
    }

    const updated = updateBook(id, dto);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/books/:id error:", error);
    return NextResponse.json(
      { error: "รูปแบบ JSON ไม่ถูกต้อง หรือเกิดข้อผิดพลาดในการแก้ไข" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/books/:id
 * ลบหนังสือตาม ID
 * Response: 200 OK (ลบสำเร็จ), 404 Not Found (ไม่พบหนังสือ)
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID ต้องเป็นตัวเลขเท่านั้น" },
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
        { error: "เกิดข้อผิดพลาดในการลบข้อมูล" },
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
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
