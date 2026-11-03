"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import {
  Terminal,
  Layers,
  FileCode,
  Upload,
  Globe,
  AlertTriangle,
  BookmarkCheck,
  Sparkles,
  Users,
} from "lucide-react";

export default function StudyGuidePage() {
  const [activeTab, setActiveTab] = useState<
    "setup" | "model" | "api" | "upload" | "frontend" | "curl" | "pitfalls" | "relations"
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
          สรุปขั้นตอนและโค้ดฉบับเต็มเหมือนโค้ดจริงในโปรเจกต์ทุกประการ: การสร้างโปรเจกต์ Next.js, การจำลองข้อมูล In-Memory Store,
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
          { id: "frontend", label: "5. Frontend & Optimistic UI", icon: Globe },
          { id: "relations", label: "6. 2 ตารางสัมพันธ์ (Users & Books)", icon: Users },
          { id: "curl", label: "7. cURL Test Commands", icon: BookmarkCheck },
          { id: "pitfalls", label: "8. กับดัก & ข้อควรระวัง", icon: AlertTriangle },
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
              คำสั่งสร้างโปรเจกต์ Next.js ตามเอกสารทางการล่าสุด (create-next-app)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              รันคำสั่งเดียวสร้างโปรเจกต์ Next.js (App Router + TypeScript + Tailwind CSS) พร้อมใช้งานทันทีในห้องสอบ:
            </p>

            <CodeBlock
              title="Terminal Commands — การติดตั้งโปรเจกต์จากศูนย์"
              language="bash"
              code={`# 1. รันคำสั่งสร้างโปรเจกต์แบบอัตโนมัติ (Next.js 16/15 + App Router + TypeScript + Tailwind)
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

# 3. ติดตั้ง lucide-react สำหรับไอคอน UI
npm install lucide-react

# 4. สร้างโฟลเดอร์สำหรับเก็บไฟล์รูปภาพที่อัปโหลด
mkdir -p public/uploads

# 5. เริ่มต้น Development Server
npm run dev`}
            />

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">โครงสร้างไฟล์โปรเจกต์จริง (File Structure):</p>
              <pre className="font-mono text-slate-700">
{`my-library-exam/
├── public/
│   └── uploads/                  # โฟลเดอร์เก็บไฟล์ภาพที่อัปโหลด
├── src/
│   ├── types/
│   │   └── book.ts               # Data Model & DTOs
│   ├── lib/
│   │   └── books-store.ts        # In-Memory Database จำลอง
│   ├── components/
│   │   ├── navbar.tsx            # Header Navigation
│   │   ├── book-card.tsx         # Card View
│   │   ├── book-table.tsx        # Table View
│   │   ├── book-modal.tsx        # Form Modal เพิ่ม/แก้ไข
│   │   ├── file-uploader.tsx     # คอมโพเนนต์อัปโหลดไฟล์
│   │   ├── toast.tsx             # Notification Toast (HTTP Status)
│   │   └── code-block.tsx        # กล่องโค้ดพร้อมปุ่ม 1-Click Copy
│   └── app/
│       ├── layout.tsx            # Root Layout
│       ├── globals.css           # Tailwind CSS
│       ├── page.tsx              # Library Dashboard (หน้าหลัก)
│       ├── books/
│       │   └── [id]/
│       │       └── page.tsx      # รายละเอียดหนังสือรายเล่ม (GET by ID)
│       ├── guide/
│       │   └── page.tsx          # หน้าคู่มือเตรียมสอบ
│       └── api/
│           ├── books/
│           │   ├── route.ts      # GET /api/books, POST /api/books
│           │   └── [id]/
│           │       └── route.ts  # GET, PUT, DELETE /api/books/[id]
│           └── upload/
│               └── route.ts      # POST /api/upload
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
              โค้ดจริง: Data Model (src/types/book.ts)
            </h2>
            <p className="text-sm text-slate-600">
              กำหนด Interface ของข้อมูลหนังสือ, DTO สำหรับ Create/Update และ ApiResponse Type:
            </p>

            <CodeBlock
              title="src/types/book.ts (โค้ดจริงในโปรเจกต์)"
              language="typescript"
              code={`/**
 * Data Model สำหรับระบบจัดการหนังสือห้องสมุด
 * อ้างอิงตามข้อกำหนดการสอบวิชา Web
 */

export interface Book {
  id: number;              // รหัสประจำหนังสือ (Number)
  title: string;           // ชื่อหนังสือ (String)
  author: string;          // ชื่อผู้แต่ง (String)
  publishedYear: number;   // ปีที่พิมพ์ (Number)
  isAvailable: boolean;    // สถานะการยืม (Boolean)
  coverUrl?: string | null;// ภาพปกหนังสือ (Optional - มาจาก File Upload)
  createdAt?: string;      // วันที่เพิ่มข้อมูล
}

export type CreateBookDto = {
  title: string;
  author: string;
  publishedYear: number;
  isAvailable?: boolean;
  coverUrl?: string | null;
};

export type UpdateBookDto = Partial<CreateBookDto>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">3</span>
              โค้ดจริง: In-Memory Mock Store (src/lib/books-store.ts)
            </h2>
            <p className="text-sm text-slate-600">
              เก็บข้อมูลจำลองใน RAM โดยใช้ <code className="font-mono text-indigo-600">globalThis</code> ป้องกันข้อมูลหายตอน Next.js รีโหลด พร้อม Seed Data 5 เล่ม และฟังก์ชัน CRUD ครบ:
            </p>

            <CodeBlock
              title="src/lib/books-store.ts (โค้ดจริงในโปรเจกต์)"
              language="typescript"
              code={`import { Book, CreateBookDto, UpdateBookDto } from "@/types/book";

/**
 * ข้อมูลจำลองเริ่มต้น (Seed Data)
 */
const initialBooks: Book[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    publishedYear: 2008,
    isAvailable: true,
    coverUrl: null,
    createdAt: new Date("2026-01-15T08:00:00Z").toISOString(),
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    publishedYear: 1999,
    isAvailable: false,
    coverUrl: null,
    createdAt: new Date("2026-02-10T10:30:00Z").toISOString(),
  },
  {
    id: 3,
    title: "Refactoring: Improving the Design of Existing Code",
    author: "Martin Fowler",
    publishedYear: 2018,
    isAvailable: true,
    coverUrl: null,
    createdAt: new Date("2026-03-05T14:15:00Z").toISOString(),
  },
  {
    id: 4,
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    publishedYear: 1994,
    isAvailable: true,
    coverUrl: null,
    createdAt: new Date("2026-03-20T09:00:00Z").toISOString(),
  },
  {
    id: 5,
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    publishedYear: 2020,
    isAvailable: false,
    coverUrl: null,
    createdAt: new Date("2026-04-01T11:45:00Z").toISOString(),
  },
];

// เก็บข้อมูลใน globalThis เพื่อไม่ให้ข้อมูลหายเมื่อมี Fast Refresh ใน dev mode
declare global {
  // eslint-disable-next-line no-var
  var __libraryBooksStore: Book[] | undefined;
  // eslint-disable-next-line no-var
  var __libraryNextId: number | undefined;
}

if (!globalThis.__libraryBooksStore) {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 6;
}

/**
 * ดึงรายการหนังสือทั้งหมด (รองรับ Search & Filter)
 */
export function getAllBooks(filter?: { search?: string; isAvailable?: boolean }): Book[] {
  let list = [...(globalThis.__libraryBooksStore || [])];

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  if (filter?.isAvailable !== undefined) {
    list = list.filter((b) => b.isAvailable === filter.isAvailable);
  }

  return list;
}

/**
 * ค้นหาหนังสือตาม ID (Number)
 */
export function getBookById(id: number): Book | undefined {
  return (globalThis.__libraryBooksStore || []).find((b) => b.id === id);
}

/**
 * เพิ่มหนังสือใหม่
 */
export function createBook(dto: CreateBookDto): Book {
  const nextId = globalThis.__libraryNextId || (globalThis.__libraryBooksStore?.length || 0) + 1;
  globalThis.__libraryNextId = nextId + 1;

  const newBook: Book = {
    id: nextId,
    title: dto.title.trim(),
    author: dto.author.trim(),
    publishedYear: Number(dto.publishedYear),
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : true,
    coverUrl: dto.coverUrl || null,
    createdAt: new Date().toISOString(),
  };

  globalThis.__libraryBooksStore = [...(globalThis.__libraryBooksStore || []), newBook];
  return newBook;
}

/**
 * แก้ไขหนังสือตาม ID
 */
export function updateBook(id: number, dto: UpdateBookDto): Book | undefined {
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  const current = books[index];
  const updatedBook: Book = {
    ...current,
    title: dto.title !== undefined ? dto.title.trim() : current.title,
    author: dto.author !== undefined ? dto.author.trim() : current.author,
    publishedYear: dto.publishedYear !== undefined ? Number(dto.publishedYear) : current.publishedYear,
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : current.isAvailable,
    coverUrl: dto.coverUrl !== undefined ? dto.coverUrl : current.coverUrl,
  };

  books[index] = updatedBook;
  globalThis.__libraryBooksStore = [...books];
  return updatedBook;
}

/**
 * ลบหนังสือตาม ID
 */
export function deleteBook(id: number): boolean {
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return false;

  books.splice(index, 1);
  globalThis.__libraryBooksStore = [...books];
  return true;
}

/**
 * สลับสถานะการยืม (isAvailable)
 */
export function toggleAvailability(id: number): Book | undefined {
  const book = getBookById(id);
  if (!book) return undefined;
  return updateBook(id, { isAvailable: !book.isAvailable });
}

/**
 * รีเซ็ตข้อมูลกลับเป็น Seed Data เริ่มต้น
 */
export function resetBooksStore(): void {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 6;
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
              โค้ดจริง: GET /api/books & POST /api/books (src/app/api/books/route.ts)
            </h2>
            <p className="text-sm text-slate-600">
              ดึงรายการหนังสือทั้งหมด (200 OK) และเพิ่มหนังสือเล่มใหม่พร้อม Validation (201 Created / 400 Bad Request):
            </p>

            <CodeBlock
              title="src/app/api/books/route.ts (โค้ดจริงในโปรเจกต์)"
              language="typescript"
              code={`import { NextResponse } from "next/server";
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
    
    let isAvailable: boolean | undefined = undefined;
    if (isAvailableParam !== null) {
      isAvailable = isAvailableParam === "true";
    }

    const books = getAllBooks({ search, isAvailable });
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
}`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">5</span>
              โค้ดจริง: GET, PUT, DELETE /api/books/:id (src/app/api/books/[id]/route.ts)
            </h2>
            <p className="text-sm text-slate-600">
              จัดการหนังสือรายเล่มตาม ID รองรับการดึง (200/404), แก้ไข (200/404), และลบ (200/404):
            </p>

            <CodeBlock
              title="src/app/api/books/[id]/route.ts (โค้ดจริงในโปรเจกต์)"
              language="typescript"
              code={`import { NextResponse } from "next/server";
import { getBookById, updateBook, deleteBook } from "@/lib/books-store";
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
        { error: \`ไม่พบหนังสือที่มี ID = \${id}\` },
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
 * Response: 200 OK (แก้ไขสำเร็จ), 404 Not Found (ไม่พบหนังสือ)
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
        { error: \`ไม่พบหนังสือที่มี ID = \${id} เพื่อทำการแก้ไข\` },
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

    const book = getBookById(id);
    if (!book) {
      return NextResponse.json(
        { error: \`ไม่พบหนังสือที่มี ID = \${id} เพื่อทำการลบ\` },
        { status: 404 }
      );
    }

    const success = deleteBook(id);
    if (!success) {
      return NextResponse.json(
        { error: "ไม่สามารถลบหนังสือได้" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "ลบข้อมูลหนังสือสำเร็จ",
        deletedId: id,
        deletedBook: book,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/books/:id error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
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
              โค้ดจริง: File Upload Route Handler (src/app/api/upload/route.ts)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              รับไฟล์ผ่าน <code className="font-mono text-indigo-600">request.formData()</code>, ตรวจสอบขนาดไม่เกิน 5MB, สร้างชื่อไฟล์แบบ unique ด้วย timestamp และเขียนลง <code className="font-mono text-indigo-600">public/uploads/</code>:
            </p>

            <CodeBlock
              title="src/app/api/upload/route.ts (โค้ดจริงในโปรเจกต์)"
              language="typescript"
              code={`import { NextResponse } from "next/server";
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
    const uniqueFilename = \`\${Date.now()}_\${cleanBase}\${originalExt}\`;
    const filePath = path.join(uploadDir, uniqueFilename);

    await writeFile(filePath, buffer);

    const publicUrl = \`/uploads/\${uniqueFilename}\`;

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
}`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">7</span>
              โค้ดจริง: React File Uploader Component (src/components/file-uploader.tsx)
            </h2>
            <p className="text-sm text-slate-600">
              คอมโพเนนต์สำหรับให้ผู้ใช้เลือกไฟล์, แสดง Preview ทันที, ส่ง `FormData` ไปยัง `/api/upload` และส่ง URL กลับมา:
            </p>

            <CodeBlock
              title="src/components/file-uploader.tsx (โค้ดจริงในโปรเจกต์)"
              language="typescript"
              code={`"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

interface FileUploaderProps {
  currentUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
}

export function FileUploader({
  currentUrl,
  onUploadSuccess,
  onRemove,
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > 5 * 1024 * 1024) {
      setError("ขนาดไฟล์เกิน 5MB กรุณาเลือกไฟล์ใหม่");
      return;
    }

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to /api/upload using FormData
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // สำคัญ: ห้ามตั้ง Content-Type เมื่อส่ง FormData ใน fetch!
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "เกิดข้อผิดพลาดในการอัปโหลด");

      onUploadSuccess(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "อัปโหลดไฟล์ล้มเหลว";
      setError(message);
      setPreviewUrl(currentUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onRemove) onRemove();
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        รูปภาพหน้าปกหนังสือ (File Upload)
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center gap-4">
          <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0 shadow-xs">
            <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>อัปโหลดรูปภาพพร้อมใช้งาน</span>
            </div>
            <p className="text-xs text-slate-500 truncate">{previewUrl}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
              >
                เปลี่ยนรูปใหม่
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleClear}
                disabled={isUploading}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium"
              >
                ลบรูปภาพ
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-xl p-5 text-center transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100 text-slate-500 group-hover:text-indigo-600 flex items-center justify-center mx-auto mb-2 transition-colors">
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-indigo-600" /> : <UploadCloud className="w-5 h-5" />}
          </div>
          <p className="text-xs font-medium text-slate-700 group-hover:text-indigo-700">
            คลิกเพื่อเลือกไฟล์ หรือลากรูปภาพมาวางที่นี่
          </p>
          <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP สูงสุด 5MB</p>
        </div>
      )}
    </div>
  );
}`}
            />
          </div>
        </section>
      )}

      {/* Tab 5: Frontend & Optimistic UI */}
      {activeTab === "frontend" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">8</span>
              โค้ดจริง: Optimistic Update & Silent Background Fetch
            </h2>
            <p className="text-sm text-slate-600">
              โค้ดจริงจาก <code className="font-mono text-indigo-600">src/app/page.tsx</code> สำหรับสลับสถานะยืม/คืนหนังสือแบบทันที ไม่กระตุก ไม่เลื่อน และดึงข้อมูลจริงมา sync ใน background:
            </p>

            <CodeBlock
              title="Optimistic Update & Background Fetch Logic ใน src/app/page.tsx"
              language="typescript"
              code={`// 1. ฟังก์ชันดึงข้อมูลที่รองรับ parameter isBackground
const fetchBooks = useCallback(async (isBackground = false) => {
  // หากเป็น background re-fetch จะไม่เซ็ต isLoading(true) หน้าจอจึงไม่วูบหรือมี skeleton กะพริบ
  if (!isBackground) {
    setIsLoading(true);
  }
  try {
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    if (filterAvailable === "available") params.append("isAvailable", "true");
    if (filterAvailable === "borrowed") params.append("isAvailable", "false");

    const res = await fetch(\`/api/books?\${params.toString()}\`);
    if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลหนังสือได้");
    const data = await res.json();
    setBooks(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "ดึงข้อมูลผิดพลาด";
    toast({
      type: "error",
      title: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
      message: msg,
      status: 500,
    });
  } finally {
    if (!isBackground) {
      setIsLoading(false);
    }
  }
}, [search, filterAvailable, toast]);

// 2. Toggle Status แบบ Optimistic Update
const handleToggleStatus = async (id: number) => {
  const book = books.find((b) => b.id === id);
  if (!book) return;

  const previousStatus = book.isAvailable;
  const newStatus = !previousStatus;

  // ก้าวที่ 1: Optimistic Update - แก้ไขสถานะใน Array ของ State ทันที UI เปลี่ยนทันใจ ไม่กระตุก ไม่เลื่อน
  setBooks((prevBooks) =>
    prevBooks.map((b) => (b.id === id ? { ...b, isAvailable: newStatus } : b))
  );

  try {
    const res = await fetch(\`/api/books/\${id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: newStatus }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "อัปเดตสถานะไม่สำเร็จ");

    toast({
      type: "success",
      title: newStatus ? "ทำรายการคืนสำเร็จ" : "ทำรายการยืมสำเร็จ",
      message: \`หนังสือ "\${data.title}" สถานะคือ: \${newStatus ? "พร้อมให้ยืม" : "ถูกยืมอยู่"}\`,
      status: 200,
    });

    // ก้าวที่ 2: ดึงข้อมูลล่าสุดจาก Server มา sync ใน background เงียบๆ โดยไม่เซ็ต loading
    fetchBooks(true);
  } catch (err: unknown) {
    // ก้าวที่ 3: หาก API ส่ง Error ให้ Rollback ค่าเดิมกลับคืน
    setBooks((prevBooks) =>
      prevBooks.map((b) => (b.id === id ? { ...b, isAvailable: previousStatus } : b))
    );

    const msg = err instanceof Error ? err.message : "เปลี่ยนสถานะล้มเหลว";
    toast({
      type: "error",
      title: "เปลี่ยนสถานะไม่สำเร็จ",
      message: msg,
      status: 404,
    });
  }
};`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">9</span>
              โค้ดจริง: Delete Book แบบ Optimistic Update
            </h2>
            <p className="text-sm text-slate-600">
              ลบหนังสือออกจาก State ทันที เมื่อ API สำเร็จให้ Background sync:
            </p>

            <CodeBlock
              title="Delete Book Optimistic Pattern"
              language="typescript"
              code={`const handleDelete = async (id: number, title: string) => {
  if (!confirm(\`คุณต้องการลบหนังสือ "\${title}" (ID: \${id}) ใช่หรือไม่?\`)) {
    return;
  }

  const previousBooks = [...books];

  // ก้าวที่ 1: ลบออกจาก State ทันทีเพื่อให้ UI ตอบสนองรวดเร็ว
  setBooks((prev) => prev.filter((b) => b.id !== id));

  try {
    const res = await fetch(\`/api/books/\${id}\`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "ลบข้อมูลล้มเหลว");

    toast({
      type: "success",
      title: "ลบหนังสือสำเร็จ",
      message: \`ลบ "\${title}" ออกจากระบบแล้ว\`,
      status: 200,
    });

    // ก้าวที่ 2: Sync ข้อมูลจริงใน background
    fetchBooks(true);
  } catch (err: unknown) {
    // ก้าวที่ 3: Rollback หากเกิดข้อผิดพลาด
    setBooks(previousBooks);

    const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบ";
    toast({
      type: "error",
      title: "ลบหนังสือไม่สำเร็จ",
      message: msg,
      status: 404,
    });
  }
};`}
            />
          </div>
        </section>
      )}

      {/* Tab 6: 2-Table Relations (Users & Books) */}
      {activeTab === "relations" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">10</span>
              โค้ดจริง: Model ผู้ใช้ (src/types/user.ts)
            </h2>
            <p className="text-sm text-slate-600">
              กำหนด User Model สำหรับเชื่อมโยงกับ Books (1:N Relation):
            </p>

            <CodeBlock
              title="src/types/user.ts (โค้ดจริงในโปรเจกต์)"
              language="typescript"
              code={`export interface User {
  id: number;                   // รหัสประจำตัวผู้ใช้ (Number)
  name: string;                // ชื่อ-นามสกุล (String)
  email: string;               // อีเมล (String)
  role: "student" | "teacher" | "member"; // บทบาท/ประเภทผู้ใช้
  avatarUrl?: string | null;    // รูปโปรไฟล์ (Optional)
  borrowedBooksCount?: number;  // จำนวนหนังสือที่ยืมอยู่ปัจจุบัน (Computed field)
  createdAt?: string;           // วันที่สร้างบัญชี
}

export type CreateUserDto = {
  name: string;
  email: string;
  role: "student" | "teacher" | "member";
  avatarUrl?: string | null;
};

export type UpdateUserDto = Partial<CreateUserDto>;`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">11</span>
              โค้ดจริง: In-Memory Users Store (src/lib/users-store.ts)
            </h2>
            <p className="text-sm text-slate-600">
              จัดการผู้ใช้ พร้อมคำนวณจำนวนหนังสือที่ถือครองอยู่แบบ dynamic:
            </p>

            <CodeBlock
              title="src/lib/users-store.ts (โค้ดจริงในโปรเจกต์)"
              language="typescript"
              code={`import { User, CreateUserDto, UpdateUserDto } from "@/types/user";

const initialUsers: User[] = [
  { id: 1, name: "สมชาย ใจดี", email: "somchai.j@example.com", role: "student", createdAt: "2026-01-10T09:00:00Z" },
  { id: 2, name: "อลิสา มั่นคง", email: "alisa.m@example.com", role: "student", createdAt: "2026-01-12T11:30:00Z" },
  { id: 3, name: "Robert C. Martin", email: "unclebob@cleancode.org", role: "teacher", createdAt: "2026-01-05T08:00:00Z" },
  { id: 4, name: "Dan Abramov", email: "dan@overreacted.io", role: "member", createdAt: "2026-01-20T14:00:00Z" },
];

declare global {
  var __libraryUsersStore: User[] | undefined;
  var __libraryNextUserId: number | undefined;
}

if (!globalThis.__libraryUsersStore) {
  globalThis.__libraryUsersStore = [...initialUsers];
  globalThis.__libraryNextUserId = 5;
}

export function getAllUsers(): User[] {
  const users = globalThis.__libraryUsersStore || [];
  const books = globalThis.__libraryBooksStore || [];

  return users.map((u) => ({
    ...u,
    borrowedBooksCount: books.filter((b) => b.userId === u.id).length,
  }));
}

export function getUserById(id: number): User | undefined {
  const user = (globalThis.__libraryUsersStore || []).find((u) => u.id === id);
  if (!user) return undefined;

  const books = globalThis.__libraryBooksStore || [];
  return {
    ...user,
    borrowedBooksCount: books.filter((b) => b.userId === user.id).length,
  };
}

export function createUser(dto: CreateUserDto): User {
  const nextId = globalThis.__libraryNextUserId || 5;
  globalThis.__libraryNextUserId = nextId + 1;

  const newUser: User = {
    id: nextId,
    name: dto.name.trim(),
    email: dto.email.trim(),
    role: dto.role || "student",
    borrowedBooksCount: 0,
    createdAt: new Date().toISOString(),
  };

  globalThis.__libraryUsersStore = [...(globalThis.__libraryUsersStore || []), newUser];
  return newUser;
}

export function deleteUser(id: number): boolean {
  const users = globalThis.__libraryUsersStore || [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  // คืนหนังสือที่ผู้ใช้คนนี้ยืมอยู่ทั้งหมด (Cascade)
  if (globalThis.__libraryBooksStore) {
    globalThis.__libraryBooksStore = globalThis.__libraryBooksStore.map((book) =>
      book.userId === id ? { ...book, userId: null, isAvailable: true, borrowedAt: null } : book
    );
  }

  users.splice(index, 1);
  globalThis.__libraryUsersStore = [...users];
  return true;
}`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">12</span>
              โค้ดจริง: Route Handlers ยืม & คืนหนังสือ
            </h2>
            <p className="text-sm text-slate-600">
              สร้าง Route Handler สำหรับยืมหนังสือให้ผู้ใช้ (`/api/books/:id/borrow`) และคืนหนังสือ (`/api/books/:id/return`):
            </p>

            <CodeBlock
              title="src/app/api/books/[id]/borrow/route.ts & return/route.ts"
              language="typescript"
              code={`// POST /api/books/:id/borrow
// Body: { userId: number }
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const result = borrowBook(Number(id), Number(body.userId));

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ message: "ยืมหนังสือสำเร็จ", book: result.book }, { status: 200 });
}

// POST /api/books/:id/return
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = returnBook(Number(id));

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ message: "คืนหนังสือสำเร็จ", book: result.book }, { status: 200 });
}`}
            />
          </div>
        </section>
      )}

      {/* Tab 7: cURL Test Commands */}
      {activeTab === "curl" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">10</span>
              คำสั่ง cURL จริงสำหรับทดสอบ API ทุกเส้น (1-Click Copy)
            </h2>
            <p className="text-sm text-slate-600">
              ทดสอบผ่าน Terminal หรือนำไปใช้สร้าง Request ใน Postman / Thunder Client ได้ทันที:
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

            <CodeBlock
              title="8. ดึงรายชื่อผู้ใช้ทั้งหมด (GET /api/users -> 200 OK)"
              language="bash"
              code="curl -X GET http://localhost:3000/api/users"
            />

            <CodeBlock
              title="9. ดึงหนังสือที่ผู้ใช้คนนี้ยืมอยู่ (GET /api/users/1/books -> 200 OK)"
              language="bash"
              code="curl -X GET http://localhost:3000/api/users/1/books"
            />

            <CodeBlock
              title="10. ทำรายการยืมหนังสือให้ผู้ใช้ (POST /api/books/1/borrow -> 200 OK)"
              language="bash"
              code={`curl -X POST http://localhost:3000/api/books/1/borrow \\
  -H "Content-Type: application/json" \\
  -d '{"userId": 1}'`}
            />

            <CodeBlock
              title="11. ทำรายการคืนหนังสือเข้าห้องสมุด (POST /api/books/1/return -> 200 OK)"
              language="bash"
              code="curl -X POST http://localhost:3000/api/books/1/return"
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
