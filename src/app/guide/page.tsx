"use client";

import { useState } from "react";
import Link from "next/link";
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
  Zap,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  ListOrdered,
  BookOpen,
  Database,
} from "lucide-react";

export default function StudyGuidePage() {
  const [activeTab, setActiveTab] = useState<
    "setup" | "model" | "api" | "upload" | "frontend" | "relations" | "curl" | "pitfalls"
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
          สรุปขั้นตอนและโค้ดฉบับเต็มเหมือนโค้ดจริงในโปรเจกต์ทุกประการ: ระบบ 2 ตารางสัมพันธ์ (Users & Books 1:N), การจำลองข้อมูล In-Memory Store ด้วย globalThis,
          การสร้าง RESTful API (CRUD) ครบทุก Status Code, การทำ File Upload, Master-Detail Dashboard, และตัวอย่างคำสั่ง cURL พร้อมปุ่มกดคัดลอก (1-Click Copy)
        </p>

        {/* GitHub Link */}
        <div className="mt-3.5 flex items-center gap-2 flex-wrap">
          <a
            href="https://github.com/NatthaphongKS/web-contemporary-exam.git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors group"
          >
            <svg className="w-4 h-4 text-slate-900 fill-current shrink-0" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="font-semibold text-slate-900">GitHub Repository:</span>
            <span className="font-mono text-indigo-600 underline font-normal">
              https://github.com/NatthaphongKS/web-contemporary-exam.git
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
          </a>
        </div>

        {/* 6-Step Exam Roadmap Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <ListOrdered className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-indigo-900">
              6 ขั้นตอนปฏิบัติจริงในห้องสอบ (Recommended Exam Workflow)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <button
              onClick={() => setActiveTab("setup")}
              className="p-2.5 rounded-xl bg-white border border-indigo-100 hover:border-indigo-400 hover:shadow-2xs text-left transition-all group"
            >
              <span className="font-bold text-indigo-600 block mb-0.5">Step 1</span>
              <span className="font-semibold text-slate-800 block">Setup & Folder</span>
              <span className="text-[11px] text-slate-500">สร้างโปรเจกต์ & จัดโฟลเดอร์</span>
            </button>

            <button
              onClick={() => setActiveTab("model")}
              className="p-2.5 rounded-xl bg-white border border-indigo-100 hover:border-indigo-400 hover:shadow-2xs text-left transition-all group"
            >
              <span className="font-bold text-indigo-600 block mb-0.5">Step 2</span>
              <span className="font-semibold text-slate-800 block">Model & Store</span>
              <span className="text-[11px] text-slate-500">2 ตาราง + globalThis</span>
            </button>

            <button
              onClick={() => setActiveTab("api")}
              className="p-2.5 rounded-xl bg-white border border-indigo-100 hover:border-indigo-400 hover:shadow-2xs text-left transition-all group"
            >
              <span className="font-bold text-indigo-600 block mb-0.5">Step 3</span>
              <span className="font-semibold text-slate-800 block">RESTful APIs</span>
              <span className="text-[11px] text-slate-500">CRUD + Status Codes</span>
            </button>

            <button
              onClick={() => setActiveTab("upload")}
              className="p-2.5 rounded-xl bg-white border border-indigo-100 hover:border-indigo-400 hover:shadow-2xs text-left transition-all group"
            >
              <span className="font-bold text-indigo-600 block mb-0.5">Step 4</span>
              <span className="font-semibold text-slate-800 block">File Upload</span>
              <span className="text-[11px] text-slate-500">FormData & public/uploads</span>
            </button>

            <button
              onClick={() => setActiveTab("curl")}
              className="p-2.5 rounded-xl bg-white border border-indigo-100 hover:border-indigo-400 hover:shadow-2xs text-left transition-all group"
            >
              <span className="font-bold text-indigo-600 block mb-0.5">Step 5</span>
              <span className="font-semibold text-slate-800 block">cURL / Testing</span>
              <span className="text-[11px] text-slate-500">ยิงทดสอบครบทุก Status</span>
            </button>

            <button
              onClick={() => setActiveTab("frontend")}
              className="p-2.5 rounded-xl bg-white border border-indigo-100 hover:border-indigo-400 hover:shadow-2xs text-left transition-all group"
            >
              <span className="font-bold text-indigo-600 block mb-0.5">Step 6</span>
              <span className="font-semibold text-slate-800 block">Master-Detail UI</span>
              <span className="text-[11px] text-slate-500">Optimistic State Update</span>
            </button>
          </div>
        </div>

        {/* OpenAPI Banner Tip */}
        <div className="mt-3.5 p-3.5 rounded-xl bg-linear-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>เคล็ดลับจากอาจารย์:</strong> มีไฟล์ Swagger / OpenAPI มาให้? ไปดูวิธี Gen Code ใน 30 วิ ไม่ต้องเริ่ม Backend จาก 0
            </span>
          </div>
          <Link
            href="/openapi-guide"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <span>ดูคู่มือ OpenAPI & Postman</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
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

      {/* ==================================================================== */}
      {/* Tab 1: Setup & Config                                                */}
      {/* ==================================================================== */}
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
              <p className="font-semibold text-slate-800">
                โครงสร้างไฟล์โปรเจกต์จริงแบบ 2 ตารางสัมพันธ์ (2-Table Master-Detail Structure):
              </p>
              <pre className="font-mono text-slate-700">
{`my-library-exam/
├── public/
│   └── uploads/                  # โฟลเดอร์เก็บไฟล์ภาพที่อัปโหลด (Static Files)
├── src/
│   ├── types/
│   │   ├── user.ts               # Data Model ตารางที่ 1: Users & DTOs
│   │   └── book.ts               # Data Model ตารางที่ 2: Books & DTOs
│   ├── lib/
│   │   ├── users-store.ts        # In-Memory Store สมาชิก (globalThis + Cascade Delete)
│   │   └── books-store.ts        # In-Memory Store หนังสือ (globalThis + 1:N Foreign Key)
│   ├── components/
│   │   ├── navbar.tsx            # Header Navigation
│   │   ├── user-card.tsx         # การ์ดแสดงสมาชิก (Master Column ฝั่งซ้าย)
│   │   ├── user-modal.tsx        # Modal เพิ่ม/แก้ไขสมาชิก
│   │   ├── book-card.tsx         # การ์ดแสดงหนังสือ (Detail Column ฝั่งขวา)
│   │   ├── book-table.tsx        # ตารางแสดงหนังสือ (Table View)
│   │   ├── book-modal.tsx        # Modal เพิ่ม/แก้ไขหนังสือ (พร้อม Dropdown เลือก User)
│   │   ├── file-uploader.tsx     # คอมโพเนนต์อัปโหลดรูปภาพพร้อม Preview
│   │   ├── toast.tsx             # Notification Toast (HTTP Status)
│   │   └── code-block.tsx        # กล่องโค้ดพร้อมปุ่ม 1-Click Copy
│   └── app/
│       ├── layout.tsx            # Root Layout
│       ├── globals.css           # Tailwind CSS
│       ├── page.tsx              # Master-Detail Dashboard (หน้าหลัก)
│       ├── guide/
│       │   └── page.tsx          # หน้าคู่มือเตรียมสอบ
│       ├── openapi-guide/
│       │   └── page.tsx          # หน้าคู่มือ OpenAPI & Swagger
│       └── api/
│           ├── users/
│           │   ├── route.ts      # GET /api/users, POST /api/users
│           │   └── [id]/
│           │       ├── route.ts  # GET, PUT, DELETE /api/users/[id] (Cascade)
│           │       └── books/
│           │           └── route.ts # GET /api/users/[id]/books (1 : N Endpoint)
│           ├── books/
│           │   ├── route.ts      # GET /api/books (filters), POST /api/books (FK check)
│           │   └── [id]/
│           │       └── route.ts  # GET, PUT, DELETE /api/books/[id]
│           └── upload/
│               └── route.ts      # POST /api/upload (FormData File Upload)
└── package.json`}
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* Tab 2: Data Model & Store                                            */}
      {/* ==================================================================== */}
      {activeTab === "model" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">2.1</span>
              Data Models: ตารางที่ 1 (src/types/user.ts) & ตารางที่ 2 (src/types/book.ts)
            </h2>
            <p className="text-sm text-slate-600">
              กำหนด Interface ของ Entity ทั้ง 2 ตาราง พร้อม DTOs สำหรับการรับส่งข้อมูลผ่าน API:
            </p>

            <CodeBlock
              title="src/types/user.ts — ตารางที่ 1: ผู้ใช้งาน/สมาชิก"
              language="typescript"
              code={`export interface User {
  id: number;          // รหัสประจำตัวผู้ใช้ (Primary Key)
  name: string;        // ชื่อ-นามสกุล
  email: string;       // อีเมล
  booksCount?: number; // จำนวนหนังสือที่ถือครอง (Computed 1:N)
}

export type CreateUserDto = {
  name: string;
  email: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;`}
            />

            <CodeBlock
              title="src/types/book.ts — ตารางที่ 2: หนังสือ (มี Foreign Key userId ชี้หา Users)"
              language="typescript"
              code={`export interface Book {
  id: number;              // รหัสประจำหนังสือ (Primary Key)
  title: string;           // ชื่อหนังสือ
  author: string;          // ชื่อผู้แต่ง
  userId: number;          // Foreign Key ชี้กลับไปที่ Users (1:N)
  coverUrl: string | null; // Path รูปภาพปก เช่น "/uploads/1234_cover.jpg"
  isAvailable: boolean;    // สถานะหนังสือ (true = พร้อมใช้งาน)
  publishedYear?: number;  // ปีที่พิมพ์ (Optional)
  userName?: string | null;// ชื่อเจ้าของหนังสือ (Enriched Helper สำหรับ UI)
}

export type CreateBookDto = {
  title: string;
  author: string;
  userId: number;
  coverUrl?: string | null;
  isAvailable?: boolean;
  publishedYear?: number;
};

export type UpdateBookDto = Partial<CreateBookDto>;`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">2.2</span>
              In-Memory Stores: จัดเก็บใน RAM ผ่าน globalThis พร้อม Cascade Delete
            </h2>
            <p className="text-sm text-slate-600">
              💡 <strong>ทำไมต้องใช้ globalThis?</strong> ใน Next.js โหมด Dev หากประกาศตัวแปรระดับโมดูลปกติ ค่าจะถูก Reset ทุกครั้งที่ไฟล์ถูกเซฟ การผูกกับ <code className="font-mono text-indigo-600">globalThis</code> จะทำให้ข้อมูลใน RAM คงอยู่ตลอดการทดสอบ:
            </p>

            <CodeBlock
              title="src/lib/users-store.ts — Users Store พร้อม Cascade Delete"
              language="typescript"
              code={`import { User, CreateUserDto, UpdateUserDto } from "@/types/user";

const initialUsers: User[] = [
  { id: 1, name: "สมชาย ใจดี", email: "somchai.j@example.com" },
  { id: 2, name: "อลิสา มั่นคง", email: "alisa.m@example.com" },
  { id: 3, name: "Robert C. Martin", email: "unclebob@cleancode.org" },
];

declare global {
  var __libraryUsersStore: User[] | undefined;
  var __libraryNextUserId: number | undefined;
}

if (!globalThis.__libraryUsersStore) {
  globalThis.__libraryUsersStore = [...initialUsers];
  globalThis.__libraryNextUserId = 4;
}

// ดึงผู้ใช้ทั้งหมด พร้อมคำนวณจำนวนหนังสือของแต่ละคน (Dynamic 1:N)
export function getAllUsers(): User[] {
  const users = globalThis.__libraryUsersStore || [];
  const books = globalThis.__libraryBooksStore || [];
  return users.map((u) => ({
    ...u,
    booksCount: books.filter((b) => b.userId === u.id).length,
  }));
}

export function getUserById(id: number): User | undefined {
  const user = (globalThis.__libraryUsersStore || []).find((u) => u.id === id);
  if (!user) return undefined;
  const books = globalThis.__libraryBooksStore || [];
  return { ...user, booksCount: books.filter((b) => b.userId === user.id).length };
}

export function createUser(dto: CreateUserDto): User {
  const nextId = globalThis.__libraryNextUserId || 4;
  globalThis.__libraryNextUserId = nextId + 1;

  const newUser: User = { id: nextId, name: dto.name.trim(), email: dto.email.trim(), booksCount: 0 };
  globalThis.__libraryUsersStore = [...(globalThis.__libraryUsersStore || []), newUser];
  return newUser;
}

// ⚠️ สำคัญมาก: ลบ User พร้อมทำ Cascade Delete ลบหนังสือของ User คนนี้ด้วย
export function deleteUser(id: number): boolean {
  const users = globalThis.__libraryUsersStore || [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  // Cascade: กรองเอาหนังสือของ User คนนี้ออกจาก booksStore
  if (globalThis.__libraryBooksStore) {
    globalThis.__libraryBooksStore = globalThis.__libraryBooksStore.filter((b) => b.userId !== id);
  }

  users.splice(index, 1);
  globalThis.__libraryUsersStore = [...users];
  return true;
}

export function userExists(id: number): boolean {
  return (globalThis.__libraryUsersStore || []).some((u) => u.id === id);
}`}
            />

            <CodeBlock
              title="src/lib/books-store.ts — Books Store พร้อม Foreign Key & Filters"
              language="typescript"
              code={`import { Book, CreateBookDto, UpdateBookDto } from "@/types/book";

const initialBooks: Book[] = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", userId: 1, coverUrl: "/uploads/cover1.jpg", isAvailable: true, publishedYear: 2008 },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", userId: 1, coverUrl: null, isAvailable: false, publishedYear: 1999 },
  { id: 3, title: "Refactoring", author: "Martin Fowler", userId: 2, coverUrl: null, isAvailable: true, publishedYear: 2018 },
  { id: 4, title: "Design Patterns", author: "Erich Gamma", userId: 3, coverUrl: null, isAvailable: true, publishedYear: 1994 },
];

declare global {
  var __libraryBooksStore: Book[] | undefined;
  var __libraryNextId: number | undefined;
}

if (!globalThis.__libraryBooksStore) {
  globalThis.__libraryBooksStore = [...initialBooks];
  globalThis.__libraryNextId = 5;
}

function enrichBookWithUser(book: Book): Book {
  if (!globalThis.__libraryUsersStore) return book;
  const user = globalThis.__libraryUsersStore.find((u) => u.id === book.userId);
  return { ...book, userName: user ? user.name : \`User #\${book.userId}\` };
}

export function getAllBooks(filter?: { search?: string; userId?: number; isAvailable?: boolean }): Book[] {
  let list = [...(globalThis.__libraryBooksStore || [])];
  if (filter?.userId !== undefined) list = list.filter((b) => b.userId === filter.userId);
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }
  if (filter?.isAvailable !== undefined) list = list.filter((b) => b.isAvailable === filter.isAvailable);
  return list.map(enrichBookWithUser);
}

export function getBookById(id: number): Book | undefined {
  const book = (globalThis.__libraryBooksStore || []).find((b) => b.id === id);
  return book ? enrichBookWithUser(book) : undefined;
}

export function getBooksByUserId(userId: number): Book[] {
  return getAllBooks({ userId });
}

export function createBook(dto: CreateBookDto): Book {
  const nextId = globalThis.__libraryNextId || 5;
  globalThis.__libraryNextId = nextId + 1;
  const newBook: Book = {
    id: nextId,
    title: dto.title.trim(),
    author: dto.author.trim(),
    userId: Number(dto.userId),
    coverUrl: dto.coverUrl || null,
    isAvailable: dto.isAvailable !== undefined ? Boolean(dto.isAvailable) : true,
    publishedYear: dto.publishedYear ? Number(dto.publishedYear) : new Date().getFullYear(),
  };
  globalThis.__libraryBooksStore = [...(globalThis.__libraryBooksStore || []), newBook];
  return enrichBookWithUser(newBook);
}

export function deleteBook(id: number): boolean {
  const books = globalThis.__libraryBooksStore || [];
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return false;
  books.splice(index, 1);
  globalThis.__libraryBooksStore = [...books];
  return true;
}`}
            />
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* Tab 3: RESTful API Routes                                            */}
      {/* ==================================================================== */}
      {activeTab === "api" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">3.1</span>
              Users API: CRUD สมาชิก (ตารางที่ 1)
            </h2>
            <p className="text-sm text-slate-600">
              สร้าง Route Handlers สำหรับสมาชิก: GET/POST ที่ <code className="font-mono text-indigo-600">/api/users</code> และ GET/PUT/DELETE ที่ <code className="font-mono text-indigo-600">/api/users/[id]</code>:
            </p>

            <CodeBlock
              title="src/app/api/users/route.ts (GET & POST)"
              language="typescript"
              code={`import { NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/lib/users-store";
import { CreateUserDto } from "@/types/user";

// GET /api/users -> 200 OK
export async function GET() {
  const users = getAllUsers();
  return NextResponse.json(users, { status: 200 });
}

// POST /api/users -> 201 Created / 400 Bad Request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "กรุณาระบุชื่อ-นามสกุล (name)" }, { status: 400 });
    }
    if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
      return NextResponse.json({ error: "กรุณาระบุอีเมลที่ถูกต้อง (email)" }, { status: 400 });
    }

    const newUser = createUser({ name: body.name.trim(), email: body.email.trim() });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}`}
            />

            <CodeBlock
              title="src/app/api/users/[id]/route.ts (Next.js 15 Async Params & Cascade Delete)"
              language="typescript"
              code={`import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/lib/users-store";

interface RouteParams {
  params: Promise<{ id: string }>; // ⚠️ Next.js 15+ ต้องเป็น Promise
}

// GET /api/users/:id -> 200 OK / 404 Not Found
export async function GET(request: Request, { params }: RouteParams) {
  const { id: rawId } = await params; // ⚠️ ต้อง await params เสมอ
  const id = Number(rawId);
  if (isNaN(id)) return NextResponse.json({ error: "ID ต้องเป็นตัวเลข" }, { status: 400 });

  const user = getUserById(id);
  if (!user) return NextResponse.json({ error: \`ไม่พบผู้ใช้ ID = \${id}\` }, { status: 404 });
  return NextResponse.json(user, { status: 200 });
}

// DELETE /api/users/:id -> 200 OK (Cascade ลบหนังสือของสมาชิกนี้ด้วย)
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const existing = getUserById(id);
  if (!existing) return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });

  deleteUser(id);
  return NextResponse.json({ message: "ลบผู้ใช้สำเร็จ (Cascade ลบหนังสือแล้ว)" }, { status: 200 });
}`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">3.2</span>
              Books API: ตรวจสอบ Foreign Key userId ก่อนบันทึก
            </h2>
            <p className="text-sm text-slate-600">
              เมื่อสร้างหนังสือใหม่ (POST) ต้องตรวจสอบว่า <code className="font-mono text-indigo-600">userExists(userId)</code> เป็นจริง เพื่อรักษาความสมบูรณ์ของฐานข้อมูล (Referential Integrity):
            </p>

            <CodeBlock
              title="src/app/api/books/route.ts (GET & POST พร้อมตรวจสอบ Foreign Key)"
              language="typescript"
              code={`import { NextResponse } from "next/server";
import { getAllBooks, createBook } from "@/lib/books-store";
import { userExists } from "@/lib/users-store";
import { CreateBookDto } from "@/types/book";

// GET /api/books (รองรับ ?search=, ?isAvailable=, ?userId=)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const isAvailableParam = searchParams.get("isAvailable");
  const userIdParam = searchParams.get("userId");
  
  let isAvailable: boolean | undefined = undefined;
  if (isAvailableParam !== null) isAvailable = isAvailableParam === "true";
  const userId = userIdParam ? Number(userIdParam) : undefined;

  const books = getAllBooks({ search, isAvailable, userId });
  return NextResponse.json(books, { status: 200 });
}

// POST /api/books -> 201 Created / 400 Bad Request
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json({ error: "กรุณาระบุชื่อหนังสือ (title)" }, { status: 400 });
    }
    if (!body.author || typeof body.author !== "string" || body.author.trim() === "") {
      return NextResponse.json({ error: "กรุณาระบุชื่อผู้แต่ง (author)" }, { status: 400 });
    }

    // ⚠️ ตรวจสอบ Foreign Key (userId)
    if (body.userId === undefined || isNaN(Number(body.userId))) {
      return NextResponse.json({ error: "กรุณาระบุรหัสสมาชิกเจ้าของหนังสือ (userId)" }, { status: 400 });
    }
    const userId = Number(body.userId);
    if (!userExists(userId)) {
      return NextResponse.json({ error: \`ไม่พบสมาชิก ID = \${userId} (Foreign Key Error)\` }, { status: 400 });
    }

    const dto: CreateBookDto = {
      title: body.title.trim(),
      author: body.author.trim(),
      userId,
      coverUrl: body.coverUrl || null,
      isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : true,
      publishedYear: body.publishedYear ? Number(body.publishedYear) : new Date().getFullYear(),
    };

    const newBook = createBook(dto);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">3.3</span>
              Relational Endpoint: ดึงหนังสือตามสมาชิก (GET /api/users/:id/books)
            </h2>

            <CodeBlock
              title="src/app/api/users/[id]/books/route.ts (Nested 1:N Resource)"
              language="typescript"
              code={`import { NextResponse } from "next/server";
import { getUserById } from "@/lib/users-store";
import { getBooksByUserId } from "@/lib/books-store";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  const user = getUserById(id);
  if (!user) return NextResponse.json({ error: \`ไม่พบผู้ใช้ ID = \${id}\` }, { status: 404 });

  const books = getBooksByUserId(id);
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
    booksCount: books.length,
    books,
  }, { status: 200 });
}`}
            />
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* Tab 4: File Upload API                                               */}
      {/* ==================================================================== */}
      {activeTab === "upload" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">4.1</span>
              Server Route: POST /api/upload (รับไฟล์ FormData และบันทึกลง public/uploads)
            </h2>
            <p className="text-sm text-slate-600">
              รับไฟล์รูปภาพจาก <code className="font-mono text-indigo-600">request.formData()</code>, ตรวจสอบขนาดไม่เกิน 5MB, ป้องกันชื่อไฟล์ซ้ำด้วย Timestamp และบันทึกลงดิสก์:
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

    if (!file) return NextResponse.json({ error: "กรุณาแนบไฟล์ในฟิลด์ 'file'" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "ขนาดไฟล์ต้องไม่เกิน 5MB" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const originalExt = path.extname(file.name) || ".jpg";
    const cleanBase = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const uniqueFilename = \`\${Date.now()}_\${cleanBase}\${originalExt}\`;
    const filePath = path.join(uploadDir, uniqueFilename);

    await writeFile(filePath, buffer);
    const publicUrl = \`/uploads/\${uniqueFilename}\`;

    return NextResponse.json({
      success: true,
      message: "อัปโหลดไฟล์สำเร็จ",
      url: publicUrl,
      filename: uniqueFilename,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" }, { status: 500 });
  }
}`}
            />

            <h2 className="text-lg font-bold text-slate-900 pt-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">4.2</span>
              Client Component: FileUploader พร้อมพรีวิวรูปภาพทันที
            </h2>
            <p className="text-sm text-slate-600">
              💡 <strong>กฎเหล็กการส่ง FormData ใน fetch:</strong> ห้ามใส่ <code className="font-mono text-rose-600">headers: &#123; &apos;Content-Type&apos;: &apos;multipart/form-data&apos; &#125;</code> เด็ดขาด ปล่อยให้ Browser ใส่ boundary ให้อัตโนมัติ:
            </p>

            <CodeBlock
              title="วิธีส่ง FormData ใน Client Component"
              language="typescript"
              code={`// 1. สร้าง Local Preview ทันทีที่เลือกไฟล์ (Instant UI)
const objectUrl = URL.createObjectURL(file);
setPreviewUrl(objectUrl);

// 2. สร้าง FormData และยิง API
const formData = new FormData();
formData.append("file", file);

const res = await fetch("/api/upload", {
  method: "POST",
  body: formData, // ห้ามใส่ Header Content-Type!
});

const data = await res.json();
if (res.ok) {
  onUploadSuccess(data.url); // ได้ URL เช่น "/uploads/1730000000_cover.jpg"
}`}
            />
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* Tab 5: Frontend & Optimistic UI                                      */}
      {/* ==================================================================== */}
      {activeTab === "frontend" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">5</span>
              Master-Detail State Management & Optimistic Updates 3 จังหวะ
            </h2>
            <p className="text-sm text-slate-600">
              สถาปัตยกรรม UI ที่ให้คะแนน UX สูงสุดในห้องสอบ: คลิกเลือก User ฝั่งซ้ายเพื่อกรองฝั่งขวา และสลับสถานะหนังสือแบบทันใจ (Optimistic Update) โดยไม่กระตุก:
            </p>

            <CodeBlock
              title="Optimistic Toggle Status ใน src/app/page.tsx"
              language="typescript"
              code={`// สลับสถานะความพร้อมของหนังสือแบบ 3 จังหวะ
const handleToggleStatus = async (id: number) => {
  const book = books.find((b) => b.id === id);
  if (!book) return;

  const previousStatus = book.isAvailable;
  const newStatus = !previousStatus;

  // จังหวะที่ 1: Optimistic Update เปลี่ยน State ทันทีในเสี้ยววินาที
  setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, isAvailable: newStatus } : b)));

  try {
    // จังหวะที่ 2: ยิง PUT API เบื้องหลัง
    const res = await fetch(\`/api/books/\${id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: newStatus }),
    });
    if (!res.ok) throw new Error();

    toast({ type: "success", title: "เปลี่ยนสถานะสำเร็จ", status: 200 });

    // จังหวะที่ 3 (สำเร็จ): Background Sync ข้อมูลจริงเงียบๆ โดยไม่เซ็ต loading
    fetchBooks(true);
  } catch {
    // จังหวะที่ 3 (ล้มเหลว): Rollback คืนค่าเดิมทันทีเมื่อเกิดข้อผิดพลาด
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, isAvailable: previousStatus } : b)));
    toast({ type: "error", title: "เปลี่ยนสถานะล้มเหลว", status: 400 });
  }
};`}
            />
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* Tab 6: 2 ตารางสัมพันธ์ (Users & Books)                                */}
      {/* ==================================================================== */}
      {activeTab === "relations" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200">
            <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              โครงสร้างความสัมพันธ์ 2 ตาราง (1 : N Relational Model)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-600" /> ตารางที่ 1: Users (1)
                </p>
                <p className="text-slate-600">• id: Number (Primary Key)</p>
                <p className="text-slate-600">• name: String (ชื่อ-นามสกุล)</p>
                <p className="text-slate-600">• email: String (อีเมล)</p>
                <p className="text-indigo-600 font-semibold">• booksCount: Number (Computed)</p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> ตารางที่ 2: Books (N)
                </p>
                <p className="text-slate-600">• id: Number (Primary Key)</p>
                <p className="text-slate-600">• title: String, author: String</p>
                <p className="text-indigo-600 font-bold">• userId: Number (Foreign Key -&gt; Users.id)</p>
                <p className="text-emerald-600 font-semibold">• coverUrl: String (File Upload Path)</p>
                <p className="text-slate-600">• isAvailable: Boolean</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">6</span>
              การทำงานของ Cascade Delete เมื่อลบสมาชิก
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              เมื่อทำการลบสมาชิก <code className="font-mono text-indigo-600">DELETE /api/users/:id</code> ระบบจะทำการ Cascade Delete ลบหนังสือทุกเล่มที่มี <code className="font-mono text-indigo-600">userId</code> ตรงกับสมาชิกคนนั้นออกจากตาราง Books อัตโนมัติ เพื่อป้องกัน Orphaned Records (ข้อมูลหนังสือที่ไม่มีเจ้าของ):
            </p>

            <CodeBlock
              title="กลไก Cascade Delete ใน src/lib/users-store.ts"
              language="typescript"
              code={`// ลบ User และ Cascade หนังสือของคนนั้น
export function deleteUser(id: number): boolean {
  const users = globalThis.__libraryUsersStore || [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  // 1. ลบหนังสือทั้งหมดของ User คนนี้
  if (globalThis.__libraryBooksStore) {
    globalThis.__libraryBooksStore = globalThis.__libraryBooksStore.filter((b) => b.userId !== id);
  }

  // 2. ลบ User
  users.splice(index, 1);
  globalThis.__libraryUsersStore = [...users];
  return true;
}`}
            />
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* Tab 7: cURL Test Commands                                            */}
      {/* ==================================================================== */}
      {activeTab === "curl" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">7</span>
              คำสั่ง cURL จริงสำหรับทดสอบ API ทุกเส้น (มี userId ถูกต้อง 100%)
            </h2>
            <p className="text-sm text-slate-600">
              ทดสอบผ่าน Terminal หรือนำไปใช้สร้าง Request ใน Postman / Thunder Client ได้ทันที:
            </p>

            <div className="space-y-3">
              <CodeBlock
                title="1. ดึงสมาชิกทั้งหมด (GET /api/users -> 200 OK)"
                language="bash"
                code="curl -X GET http://localhost:3000/api/users"
              />

              <CodeBlock
                title="2. เพิ่มสมาชิกใหม่ (POST /api/users -> 201 Created)"
                language="bash"
                code={`curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "วีระชัย รักเรียน",
    "email": "veerachai.r@example.com"
  }'`}
              />

              <CodeBlock
                title="3. ดึงหนังสือของสมาชิก ID #1 (GET /api/users/1/books -> 200 OK)"
                language="bash"
                code="curl -X GET http://localhost:3000/api/users/1/books"
              />

              <CodeBlock
                title="4. ดึงหนังสือทั้งหมด (GET /api/books -> 200 OK)"
                language="bash"
                code="curl -X GET http://localhost:3000/api/books"
              />

              <CodeBlock
                title="5. เพิ่มหนังสือใหม่ (POST /api/books -> 201 Created) *ต้องมี userId"
                language="bash"
                code={`curl -X POST http://localhost:3000/api/books \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Clean Architecture",
    "author": "Robert C. Martin",
    "userId": 1,
    "publishedYear": 2017,
    "isAvailable": true
  }'`}
              />

              <CodeBlock
                title="6. ดึงหนังสือตาม ID (GET /api/books/1 -> 200 OK)"
                language="bash"
                code="curl -X GET http://localhost:3000/api/books/1"
              />

              <CodeBlock
                title="7. แก้ไขข้อมูลหนังสือ (PUT /api/books/1 -> 200 OK)"
                language="bash"
                code={`curl -X PUT http://localhost:3000/api/books/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "isAvailable": false
  }'`}
              />

              <CodeBlock
                title="8. ลบหนังสือ (DELETE /api/books/1 -> 200 OK)"
                language="bash"
                code="curl -X DELETE http://localhost:3000/api/books/1"
              />

              <CodeBlock
                title="9. อัปโหลดไฟล์รูปภาพ (POST /api/upload -> 201 Created)"
                language="bash"
                code="curl -X POST http://localhost:3000/api/upload -F 'file=@/path/to/cover.png'"
              />

              <CodeBlock
                title="10. ทดสอบ Cascade Delete: ลบสมาชิก ID #1 (DELETE /api/users/1 -> 200 OK)"
                language="bash"
                code="curl -X DELETE http://localhost:3000/api/users/1"
              />
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* Tab 8: Pitfalls & Traps                                              */}
      {/* ==================================================================== */}
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
                  ใน Next.js 15 ขึ้นไป <code className="font-mono">params</code> ใน Route Handler และ Page เป็น Promise ต้องเขียน <code className="font-mono font-bold">const &#123; id &#125; = await params;</code> เสมอ มิฉะนั้นค่าจะเป็น undefined หรือเกิด Type error
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                <p className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  2. ลืมแปลง String เป็น Number (ID & FK)
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  ค่า ID ที่ได้จาก URL params หรือ Request body บางครั้งส่งมาเป็น string แต่ใน Store กำหนดเป็น number ต้องแปลงด้วย <code className="font-mono font-bold">Number(id)</code> ก่อนนำไปเปรียบเทียบ มิฉะนั้น <code className="font-mono">1 === &quot;1&quot;</code> จะได้ false
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                <p className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  3. อย่าใส่ Content-Type เมื่อส่ง FormData
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  ตอนใช้ <code className="font-mono">fetch(&apos;/api/upload&apos;, &#123; body: formData &#125;)</code> ห้ามใส่ Header <code className="font-mono">&apos;Content-Type&apos;: &apos;multipart/form-data&apos;</code> เด็ดขาด! เพราะจะทำให้ขาด boundary string และเซิร์ฟเวอร์จะ parse ไฟล์ไม่สำเร็จ
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                <p className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  4. ตรวจสอบ Foreign Key (userId) ก่อนบันทึก
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  เมื่อทำ 2 ตารางสัมพันธ์ ใน <code className="font-mono">POST /api/books</code> ต้องเรียก <code className="font-mono font-bold">userExists(userId)</code> เสมอ หากไม่มีผู้ใช้นี้ในระบบ ต้องส่ง <code className="font-mono font-bold text-rose-700">400 Bad Request</code> ทันที
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                <p className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  5. อย่าลืม Status Code ตาม REST
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  อย่าลืมส่ง Status ให้ถูกตามเกณฑ์ตรวจ: POST สำเร็จส่ง <code className="font-mono font-bold text-emerald-700">201 Created</code>, GET/PUT/DELETE สำเร็จส่ง <code className="font-mono font-bold text-emerald-700">200 OK</code>, และถ้าหา ID ไม่เจอส่ง <code className="font-mono font-bold text-rose-700">404 Not Found</code>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                <p className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  6. ลืมทำ Cascade Delete เมื่อลบ Parent
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  เมื่อสั่งลบผู้ใช้ (Users) หนังสือของคนนั้นต้องถูกลบออกจาก Books Store ด้วย มิฉะนั้นเวลาหน้าจอแสดงผลจะเกิด Bug หรือแสดง <code className="font-mono">&quot;User #999&quot;</code> ที่ไม่มีตัวตนอยู่จริง
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
