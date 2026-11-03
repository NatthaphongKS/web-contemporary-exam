"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import {
  Terminal,
  Layers,
  FileCode,
  Upload,
  Globe,
  CheckCircle2,
  AlertTriangle,
  BookmarkCheck,
  Sparkles,
} from "lucide-react";

export default function StudyGuidePage() {
  const [activeTab, setActiveTab] = useState<
    "setup" | "model" | "api" | "upload" | "frontend" | "curl" | "pitfalls"
  >("setup");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5" /> Static Study Companion
          </span>
          <span className="text-xs text-slate-400 font-mono">Next.js App Router (TypeScript)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          คู่มือเตรียมสอบปฏิบัติวิชา Web (Step-by-Step Cheatsheet)
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          สรุปขั้นตอนการสร้างโปรเจกต์ Next.js ตั้งแต่เริ่มต้น, การจำลองข้อมูล In-Memory Store,
          การสร้าง RESTful API (CRUD) ครบทุก Status Code, การทำ File Upload, และตัวอย่างคำสั่ง cURL พร้อมปุ่มกดคัดลอก (1-Click Copy)
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-slate-200 scrollbar-none">
        {[
          { id: "setup", label: "1. Setup & Config", icon: Terminal },
          { id: "model", label: "2. Data Model & Store", icon: Layers },
          { id: "api", label: "3. RESTful API Routes", icon: FileCode },
          { id: "upload", label: "4. File Upload API", icon: Upload },
          { id: "frontend", label: "5. Frontend Fetch & Form", icon: Globe },
          { id: "curl", label: "6. cURL Test Commands", icon: BookmarkCheck },
          { id: "pitfalls", label: "7. กับดัก & ข้อควรระวัง", icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Setup & Config */}
      {activeTab === "setup" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">1</span>
              การติดตั้งโปรเจกต์ Next.js ด้วยคำสั่งทางการ (create-next-app)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              ใช้คำสั่งตามเอกสารทางการของ Next.js โดยระบุ Flag ครบถ้วนเพื่อไม่ต้องกดตอบ Interactive Prompt ในห้องสอบ:
            </p>

            <CodeBlock
              title="Terminal Command — สร้างโปรเจกต์ Next.js App Router"
              language="bash"
              code={`# 1. รันคำสั่งสร้างโปรเจกต์แบบอัตโนมัติ (Next.js 15/16 + App Router + TypeScript + Tailwind)
npx create-next-app@latest my-library-exam \\
  --typescript \\
  --tailwind \\
  --eslint \\
  --app \\
  --src-dir \\
  --import-alias "@/*" \\
  --use-npm \\
  --yes

# 2. ย้ายเข้าโฟลเดอร์โปรเจกต์
cd my-library-exam

# 3. ติดตั้งไอคอนสำหรับ UI (lucide-react)
npm install lucide-react

# 4. สร้างโฟลเดอร์สำหรับเก็บไฟล์อัปโหลด
mkdir -p public/uploads

# 5. เริ่มต้น Development Server
npm run dev`}
            />

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">โครงสร้างไดเรกทอรีที่ได้ (Directory Structure):</p>
              <pre className="font-mono text-slate-700">
{`my-library-exam/
├── public/
│   └── uploads/            # ที่เก็บไฟล์ภาพที่อัปโหลด
├── src/
│   ├── types/book.ts       # โมเดลข้อมูล
│   ├── lib/books-store.ts  # In-memory database จำลอง
│   ├── components/         # คอมโพเนนต์ UI
│   └── app/
│       ├── layout.tsx      # Root Layout
│       ├── page.tsx        # หน้า Dashboard
│       └── api/
│           ├── books/route.ts      # GET /api/books, POST /api/books
│           ├── books/[id]/route.ts # GET, PUT, DELETE /api/books/:id
│           └── upload/route.ts     # POST /api/upload
└── package.json`}
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Data Model & Store */}
      {activeTab === "model" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">2</span>
              การกำหนด Data Model (TypeScript Interface)
            </h2>
            <p className="text-sm text-slate-600">
              สร้างไฟล์ <code className="font-mono text-indigo-600">src/types/book.ts</code> เพื่อระบุโครงสร้างตามโจทย์ข้อสอบ:
            </p>

            <CodeBlock
              title="src/types/book.ts"
              language="typescript"
              code={`export interface Book {
  id: number;              // รหัสประจำหนังสือ (Number)
  title: string;           // ชื่อหนังสือ (String)
  author: string;          // ชื่อผู้แต่ง (String)
  publishedYear: number;   // ปีที่พิมพ์ (Number)
  isAvailable: boolean;    // สถานะการยืม (Boolean)
  coverUrl?: string | null;// รูปภาพปก (Optional จาก Upload)
  createdAt?: string;
}

export type CreateBookDto = {
  title: string;
  author: string;
  publishedYear: number;
  isAvailable?: boolean;
  coverUrl?: string | null;
};

export type UpdateBookDto = Partial<CreateBookDto>;`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">3</span>
              การสร้าง In-Memory Mock Store (ไม่ต้องต่อ DB)
            </h2>
            <p className="text-sm text-slate-600">
              สร้างไฟล์ <code className="font-mono text-indigo-600">src/lib/books-store.ts</code> ใช้ <code className="font-mono">globalThis</code> ป้องกันข้อมูลหายตอน Next.js รีโหลด:
            </p>

            <CodeBlock
              title="src/lib/books-store.ts"
              language="typescript"
              code={`import { Book, CreateBookDto, UpdateBookDto } from "@/types/book";

// Seed ข้อมูลเริ่มต้น
const initialBooks: Book[] = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", publishedYear: 2008, isAvailable: true },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", publishedYear: 1999, isAvailable: false },
  { id: 3, title: "Refactoring", author: "Martin Fowler", publishedYear: 2018, isAvailable: true },
];

declare global {
  var __libraryBooksStore: Book[] | undefined;
  var __libraryNextId: number | undefined;
}

if (!globalThis.__libraryBooksStore) {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 4;
}

export function getAllBooks() {
  return [...(globalThis.__libraryBooksStore || [])];
}

export function getBookById(id: number) {
  return (globalThis.__libraryBooksStore || []).find((b) => b.id === id);
}

export function createBook(dto: CreateBookDto): Book {
  const nextId = globalThis.__libraryNextId || 4;
  globalThis.__libraryNextId = nextId + 1;

  const newBook: Book = {
    id: nextId,
    title: dto.title.trim(),
    author: dto.author.trim(),
    publishedYear: Number(dto.publishedYear),
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : true,
    coverUrl: dto.coverUrl || null,
  };

  globalThis.__libraryBooksStore = [...(globalThis.__libraryBooksStore || []), newBook];
  return newBook;
}

export function updateBook(id: number, dto: UpdateBookDto): Book | undefined {
  const books = globalThis.__libraryBooksStore || [];
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;

  const updated: Book = { ...books[idx], ...dto };
  books[idx] = updated;
  globalThis.__libraryBooksStore = [...books];
  return updated;
}

export function deleteBook(id: number): boolean {
  const books = globalThis.__libraryBooksStore || [];
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return false;

  books.splice(idx, 1);
  globalThis.__libraryBooksStore = [...books];
  return true;
}`}
            />
          </div>
        </section>
      )}

      {/* Tab 3: RESTful API Routes */}
      {activeTab === "api" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">4</span>
              Route Handler: GET /api/books & POST /api/books
            </h2>
            <p className="text-sm text-slate-600">
              สร้างไฟล์ <code className="font-mono text-indigo-600">src/app/api/books/route.ts</code> รองรับการดึงทั้งหมด (200 OK) และเพิ่มเล่มใหม่ (201 Created):
            </p>

            <CodeBlock
              title="src/app/api/books/route.ts"
              language="typescript"
              code={`import { NextResponse } from "next/server";
import { getAllBooks, createBook } from "@/lib/books-store";

// GET /api/books -> 200 OK
export async function GET() {
  const books = getAllBooks();
  return NextResponse.json(books, { status: 200 });
}

// POST /api/books -> 201 Created หรือ 400 Bad Request
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    if (!body.title || !body.author || !body.publishedYear) {
      return NextResponse.json(
        { error: "กรุณาระบุ title, author และ publishedYear ให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const newBook = createBook({
      title: body.title,
      author: body.author,
      publishedYear: Number(body.publishedYear),
      isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : true,
      coverUrl: body.coverUrl || null,
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">5</span>
              Route Handler: GET, PUT, DELETE /api/books/[id]
            </h2>
            <p className="text-sm text-slate-600">
              สร้างไฟล์ <code className="font-mono text-indigo-600">src/app/api/books/[id]/route.ts</code> จัดการรายเล่ม:
            </p>

            <CodeBlock
              title="src/app/api/books/[id]/route.ts"
              language="typescript"
              code={`import { NextResponse } from "next/server";
import { getBookById, updateBook, deleteBook } from "@/lib/books-store";

interface Context {
  params: Promise<{ id: string }>;
}

// GET /api/books/:id -> 200 OK หรือ 404 Not Found
export async function GET(req: Request, { params }: Context) {
  const { id } = await params;
  const book = getBookById(Number(id));

  if (!book) {
    return NextResponse.json({ error: "ไม่พบหนังสือในระบบ" }, { status: 404 });
  }
  return NextResponse.json(book, { status: 200 });
}

// PUT /api/books/:id -> 200 OK หรือ 404 Not Found
export async function PUT(req: Request, { params }: Context) {
  const { id } = await params;
  const bookId = Number(id);

  const existing = getBookById(bookId);
  if (!existing) {
    return NextResponse.json({ error: "ไม่พบหนังสือที่ต้องการแก้ไข" }, { status: 404 });
  }

  const body = await req.json();
  const updated = updateBook(bookId, body);
  return NextResponse.json(updated, { status: 200 });
}

// DELETE /api/books/:id -> 200 OK หรือ 404 Not Found
export async function DELETE(req: Request, { params }: Context) {
  const { id } = await params;
  const bookId = Number(id);

  const existing = getBookById(bookId);
  if (!existing) {
    return NextResponse.json({ error: "ไม่พบหนังสือที่ต้องการลบ" }, { status: 404 });
  }

  deleteBook(bookId);
  return NextResponse.json({ message: "ลบหนังสือสำเร็จ", id: bookId }, { status: 200 });
}`}
            />
          </div>
        </section>
      )}

      {/* Tab 4: File Upload API */}
      {activeTab === "upload" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">6</span>
              Route Handler สำหรับ File Upload: POST /api/upload
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              ใน Next.js App Router รับไฟล์ผ่าน <code className="font-mono text-indigo-600">request.formData()</code> แล้วเขียนไฟล์ลงโฟลเดอร์ <code className="font-mono text-indigo-600">public/uploads/</code>:
            </p>

            <CodeBlock
              title="src/app/api/upload/route.ts"
              language="typescript"
              code={`import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "กรุณาแนบไฟล์ในฟิลด์ file" }, { status: 400 });
    }

    // แปลง File เป็น Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ปลายทาง public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = \`\${Date.now()}_\${file.name.replace(/\\s+/g, "_")}\`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    // คืน URL สาธารณะที่หน้าเว็บสามารถนำไป render ได้ทันที
    return NextResponse.json(
      {
        success: true,
        message: "อัปโหลดสำเร็จ",
        url: \`/uploads/\${filename}\`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "อัปโหลดล้มเหลว" }, { status: 500 });
  }
}`}
            />
          </div>
        </section>
      )}

      {/* Tab 5: Frontend Fetch & Form */}
      {activeTab === "frontend" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">7</span>
              สูตร Fetch API ฝั่งหน้าบ้าน (Client Component)
            </h2>
            <p className="text-sm text-slate-600">
              ตัวอย่างฟังก์ชัน Fetch แบบสั้นกระชับ สามารถก๊อปปี้ไปวางในหน้า <code className="font-mono">page.tsx</code> ได้ทันที:
            </p>

            <CodeBlock
              title="Snippets: CRUD + Upload Fetch Functions"
              language="typescript"
              code={`// 1. ดึงหนังสือทั้งหมด (GET)
async function fetchBooks() {
  const res = await fetch("/api/books");
  const data = await res.json();
  return data; // Book[]
}

// 2. ดึงหนังสือเล่มเดียว (GET by ID)
async function fetchBookById(id: number) {
  const res = await fetch(\`/api/books/\${id}\`);
  if (res.status === 404) return null;
  return await res.json();
}

// 3. เพิ่มหนังสือใหม่ (POST)
async function addBook(title: string, author: string, year: number, coverUrl?: string) {
  const res = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      author,
      publishedYear: year,
      isAvailable: true,
      coverUrl,
    }),
  });
  return await res.json(); // 201 Created
}

// 4. แก้ไขหนังสือ (PUT)
async function updateBook(id: number, updatedFields: object) {
  const res = await fetch(\`/api/books/\${id}\`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedFields),
  });
  return await res.json(); // 200 OK
}

// 5. ลบหนังสือ (DELETE)
async function deleteBook(id: number) {
  const res = await fetch(\`/api/books/\${id}\`, { method: "DELETE" });
  return await res.json(); // 200 OK
}

// 6. อัปโหลดไฟล์รูปภาพ (POST FormData)
async function uploadCoverImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  // สำคัญ: ห้ามตั้ง Header "Content-Type" เองเมื่อส่ง FormData! เบราว์เซอร์จะจัดการ boundary ให้อัตโนมัติ
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.url; // e.g. "/uploads/1700000000_cover.png"
}`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">✨</span>
              เทคนิค Optimistic Update & Background Fetching (หน้าจอไม่กระตุก ไม่เลื่อน)
            </h2>
            <p className="text-sm text-slate-600">
              เมื่อกดปุ่มยืม/คืนหนังสือ ให้แก้สถานะใน Array ของ State ทันที และ Sync ข้อมูลกับ Server ใน Background:
            </p>

            <CodeBlock
              title="Optimistic Update & Silent Background Fetch Pattern"
              language="typescript"
              code={`// 1. ฟังก์ชันดึงข้อมูลที่รองรับโหมด Background
const fetchBooks = async (isBackground = false) => {
  if (!isBackground) setIsLoading(true);
  try {
    const res = await fetch("/api/books");
    const data = await res.json();
    setBooks(data);
  } finally {
    if (!isBackground) setIsLoading(false);
  }
};

// 2. สลับสถานะ isAvailable แบบ Optimistic Update
const handleToggleStatus = async (id: number) => {
  const book = books.find((b) => b.id === id);
  if (!book) return;

  const previousStatus = book.isAvailable;
  const newStatus = !previousStatus;

  // ก้าวที่ 1: อัปเดต State ใน Array ทันที -> UI เปลี่ยนทันที ไม่กระตุก ไม่เลื่อน
  setBooks((prev) =>
    prev.map((b) => (b.id === id ? { ...b, isAvailable: newStatus } : b))
  );

  try {
    const res = await fetch(\`/api/books/\${id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: newStatus }),
    });
    if (!res.ok) throw new Error("Update failed");

    // ก้าวที่ 2: Sync ข้อมูลจริงจาก Server แบบเงียบๆ ไม่โชว์ loading skeleton
    fetchBooks(true);
  } catch (error) {
    // ก้าวที่ 3: หาก API ส่ง Error ให้ Rollback คืนค่าเดิม
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isAvailable: previousStatus } : b))
    );
  }
};`}
            />
          </div>
        </section>
      )}

      {/* Tab 6: cURL Test Commands */}
      {activeTab === "curl" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">8</span>
              คำสั่ง cURL สำหรับทดสอบ API ทุกเส้น (1-Click Copy)
            </h2>
            <p className="text-sm text-slate-600">
              ทดสอบผ่าน Terminal หรือนำไปใช้สร้าง Request ใน Postman / Thunder Client:
            </p>

            <CodeBlock
              title="1. ดึงหนังสือทั้งหมด (GET /api/books -> 200 OK)"
              language="bash"
              code="curl -X GET http://localhost:3000/api/books"
            />

            <CodeBlock
              title="2. ดึงหนังสือตาม ID ที่มีอยู่ (GET /api/books/1 -> 200 OK)"
              language="bash"
              code="curl -X GET http://localhost:3000/api/books/1"
            />

            <CodeBlock
              title="3. ดึงหนังสือตาม ID ที่ไม่มีในระบบ (GET /api/books/999 -> 404 Not Found)"
              language="bash"
              code="curl -i -X GET http://localhost:3000/api/books/999"
            />

            <CodeBlock
              title="4. เพิ่มหนังสือใหม่ (POST /api/books -> 201 Created)"
              language="bash"
              code={`curl -X POST http://localhost:3000/api/books \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Clean Architecture",
    "author": "Robert C. Martin",
    "publishedYear": 2017,
    "isAvailable": true
  }'`}
            />

            <CodeBlock
              title="5. แก้ไขข้อมูลหนังสือ (PUT /api/books/1 -> 200 OK)"
              language="bash"
              code={`curl -X PUT http://localhost:3000/api/books/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "isAvailable": false
  }'`}
            />

            <CodeBlock
              title="6. ลบหนังสือ (DELETE /api/books/1 -> 200 OK)"
              language="bash"
              code="curl -X DELETE http://localhost:3000/api/books/1"
            />

            <CodeBlock
              title="7. อัปโหลดไฟล์รูปภาพ (POST /api/upload -> 201 Created)"
              language="bash"
              code="curl -X POST http://localhost:3000/api/upload -F 'file=@/path/to/image.png'"
            />
          </div>
        </section>
      )}

      {/* Tab 7: Pitfalls & Traps */}
      {activeTab === "pitfalls" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">⚠️</span>
              กับดักและข้อผิดพลาดคลาสสิกในห้องสอบ (Exam Pitfalls)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                <p className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  1. Next.js 15+ Params เป็น Promise
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  ใน Next.js 15 ขึ้นไป <code className="font-mono">params</code> ใน Route Handler และ Page เป็น Promise ต้องเขียน <code className="font-mono font-bold">const &#123; id &#125; = await params;</code> เสมอ มิฉะนั้นค่าจะเป็น undefined หรือ type error
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                <p className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  2. แปลง String เป็น Number (ID)
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  ค่า ID ที่ได้จาก URL params เป็น string เสมอ แต่ใน Data Model กำหนดเป็น number ต้องแปลงด้วย <code className="font-mono font-bold">Number(id)</code> ก่อนนำไป <code className="font-mono">find()</code> มิฉะนั้น <code className="font-mono">1 === &quot;1&quot;</code> จะได้ false
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                <p className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  3. อย่าใส่ Content-Type เมื่อส่ง FormData
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  ตอนใช้ <code className="font-mono">fetch(&apos;/api/upload&apos;, &#123; body: formData &#125;)</code> ห้ามใส่ Header <code className="font-mono">&apos;Content-Type&apos;: &apos;multipart/form-data&apos;</code> เด็ดขาด! เพราะจะทำให้หาย boundary string และเซิร์ฟเวอร์จะ parse ไฟล์ไม่สำเร็จ
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                <p className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  4. ลืม Status Code ตาม REST
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  อย่าลืมส่ง Status: POST สำเร็จต้องส่ง <code className="font-mono font-bold text-emerald-700">201 Created</code>, ดึง/แก้/ลบสำเร็จส่ง <code className="font-mono font-bold text-emerald-700">200 OK</code>, และถ้าหา ID ไม่เจอต้องส่ง <code className="font-mono font-bold text-rose-700">404 Not Found</code>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
