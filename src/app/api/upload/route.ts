/**
 * ==============================================================================
 * Route Handler: /api/upload (File Upload API)
 * ==============================================================================
 * จัดการการอัปโหลดไฟล์รูปภาพ (เช่น ภาพปกหนังสือ)
 * 
 * 💡 สิ่งที่ต้องจำขึ้นใจในห้องสอบ (FormData Rule):
 * 1. ฝั่ง Client (fetch) ห้ามใส่ Header `Content-Type: multipart/form-data` เด็ดขาด
 *    เพราะ Browser จะเป็นผู้คำนวณและแนบ `boundary string` ให้อัตโนมัติ
 * 2. ฝั่ง Server (Next.js) ใช้วิธี `await request.formData()` ในการดึงไฟล์
 * 3. บันทึกไฟล์ลงในโฟลเดอร์ `public/uploads/` เพื่อให้เบราว์เซอร์เข้าถึงรูปภาพได้ทันทีผ่านพาธ `/uploads/...`
 */

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * POST /api/upload
 * รับและบันทึกไฟล์รูปภาพไปยังโฟลเดอร์ public/uploads/
 * 
 * @function POST
 * @param {Request} request - HTTP Request object ที่มี multipart/form-data payload
 * @returns {Promise<NextResponse>} JSON แจ้งผลการอัปโหลด พร้อม URL สัมพัทธ์สำหรับเรียกดูรูปภาพ
 * 
 * Request:
 * • Content-Type: multipart/form-data (Browser จัดการ Boundary ให้อัตโนมัติ)
 * • Body (FormData): ฟิลด์ "file" บรรจุไฟล์รูปภาพ
 * 
 * Status Codes:
 * • 201 Created: อัปโหลดสำเร็จ ส่งคืน URL ที่เข้าถึงรูปภาพได้
 * • 400 Bad Request: ไม่มีไฟล์แนบมา หรือไฟล์มีขนาดเกิน 5MB
 * • 500 Internal Server Error: เกิดข้อผิดพลาดของระบบไฟล์ (Filesystem I/O)
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // ขั้นตอนที่ 1: ดึง FormData จาก Request
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // ขั้นตอนที่ 2: ตรวจสอบว่ามีไฟล์แนบมาหรือไม่
    if (!file) {
      return NextResponse.json(
        { error: "กรุณาแนบไฟล์ในฟิลด์ 'file'" },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 3: ตรวจสอบขนาดไฟล์ (จำกัดไม่เกิน 5 MB ตามเกณฑ์มาตรฐาน)
    const MAX_SIZE = 5 * 1024 * 1024; // 5 Megabytes
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "ขนาดไฟล์ต้องไม่เกิน 5MB" },
        { status: 400 }
      );
    }

    // ขั้นตอนที่ 4: แปลงไฟล์เป็น Buffer เพื่อเตรียมเขียนลงดิสก์
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ขั้นตอนที่ 5: กำหนดโฟลเดอร์ปลายทาง public/uploads และสร้างถ้ายังไม่มี (recursive: true)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // ขั้นตอนที่ 6: ทำความสะอาดชื่อไฟล์เดิม (Sanitize) และเติม Timestamp เพื่อป้องกันชื่อซ้ำ
    const originalExt = path.extname(file.name) || ".jpg";
    const cleanBase = path
      .basename(file.name, originalExt)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueFilename = `${Date.now()}_${cleanBase}${originalExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // ขั้นตอนที่ 7: เขียนไฟล์ลงในโฟลเดอร์ public/uploads
    await writeFile(filePath, buffer);

    // ขั้นตอนที่ 8: สร้าง Public URL สำหรับให้อ้างอิงในเบราว์เซอร์
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
      { error: "เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการอัปโหลดไฟล์" },
      { status: 500 }
    );
  }
}
