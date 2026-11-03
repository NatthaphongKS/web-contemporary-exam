import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * POST /api/upload
 * อัปโหลดไฟล์ (เช่น ภาพปกหนังสือ) ด้วย FormData
 * Content-Type: multipart/form-data
 * Form field: "file"
 * Response: 201 Created (อัปโหลดสำเร็จ), 400 Bad Request (ไม่มีไฟล์หรือไม่ถูกต้อง)
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "กรุณาแนบไฟล์ในฟิลด์ 'file'" },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (จำกัดไม่เกิน 5 MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "ขนาดไฟล์ต้องไม่เกิน 5MB" },
        { status: 400 }
      );
    }

    // สร้างชื่อไฟล์ที่ปลอดภัยและไม่ซ้ำกัน
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // กำหนดปลายทาง public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Sanitize filename & add timestamp prefix
    const originalExt = path.extname(file.name) || ".jpg";
    const cleanBase = path
      .basename(file.name, originalExt)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueFilename = `${Date.now()}_${cleanBase}${originalExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json(
      {
        success: true,
        message: "อัปโหลดไฟล์สำเร็จ",
        url: publicUrl,
        filename: uniqueFilename,
        size: file.size,
        type: file.type,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" },
      { status: 500 }
    );
  }
}
