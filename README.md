# Next.js Library Management & Practical Web Exam Cheatsheet 📚✨

โปรเจกต์ Next.js (App Router) สำหรับเตรียมสอบปฏิบัติวิชา Web: ระบบจัดการสมาชิกและหนังสือในห้องสมุด (2 ตารางสัมพันธ์ Users & Books 1:N) พร้อม In-Memory Mock Store, RESTful API (CRUD), File Upload, Master-Detail UI และหน้า Static Study Guide (`/guide`) รวมขั้นตอนและคำสั่งคัดลอก (1-Click Copy)

---

## 🌟 คุณสมบัติเด่นของโปรเจกต์

1. **2 ตารางสัมพันธ์ (Relational Data 1:N)**:
   - ตาราง `users`: เก็บข้อมูลสมาชิกห้องสมุด (id, name, email, role, borrowedBooksCount)
   - ตาราง `books`: เชื่อมต่อผ่าน Foreign Key `userId` ระบุว่าใครเป็นผู้ยืม
2. **Master-Detail Interactive UI**:
   - ด้านซ้าย: รายชื่อสมาชิกทั้งหมด คลิกเลือกคนไหน ด้านขวาจะแสดงเฉพาะหนังสือที่คนนั้นถือครองอยู่ทันที
   - ปุ่มลัด **"ยืมหนังสือให้คนนี้"**: เลือกจากหนังสือที่ว่างในระบบมากำหนดสิทธิ์ให้ผู้ใช้
   - ปุ่มลัด **"คืนหนังสือ"**: ปลดสถานะกลับสู่ห้องสมุดทันที
   - ปุ่ม **"ดูหนังสือทั้งหมดในห้องสมุด"**: สลับกลับมาดูภาพรวมทุกเล่ม
3. **In-Memory Store (ไม่ต้องต่อฐานข้อมูลจริง)**:
   - ข้อมูลทั้งหมดเก็บใน RAM ผ่าน `globalThis` พร้อม Seed Users 4 คน และ Seed Books 5 เล่ม
4. **RESTful API สมบูรณ์ตามข้อกำหนด**:
   - **Users API**: `GET /api/users`, `POST /api/users`, `GET/PUT/DELETE /api/users/:id`, `GET /api/users/:id/books`
   - **Books API**: `GET /api/books` (รองรับ filter `?userId=`), `POST /api/books`, `GET/PUT/DELETE /api/books/:id`
   - **Borrow/Return API**: `POST /api/books/:id/borrow`, `POST /api/books/:id/return`
   - **Upload API**: `POST /api/upload` (บันทึกรูปภาพลง `public/uploads/`)
5. **Optimistic Updates & Silent Background Sync**:
   - อัปเดต UI ทันทีในระดับมิลลิวินาที หน้าจอไม่กระตุก ไม่เกิด Layout Shift และ sync ข้อมูลกับเซิร์ฟเวอร์ใน background
6. **หน้า Static Study Guide (`/guide`)**:
   - คู่มือติวสอบ 8 หัวข้อ พร้อมคำสั่ง Shell, โค้ดจริงทุกไฟล์, และคำสั่ง cURL พร้อมปุ่ม 1-Click Copy

---

## 🚀 วิธีการเริ่มต้นใช้งาน (Quick Start)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโหมด Development
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

### 3. Build สำหรับ Production
```bash
npm run build
npm run start
```

---

## 📡 สรุป API Endpoints & Status Codes

### หมวด Users (สมาชิก)
| Method | Endpoint | รายละเอียด | Status Code |
|---|---|---|---|
| `GET` | `/api/users` | ดึงสมาชิกทั้งหมด พร้อมจำนวนหนังสือที่ยืมอยู่ | `200 OK` |
| `GET` | `/api/users/:id` | ดึงข้อมูลสมาชิกตาม ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/users` | เพิ่มสมาชิกใหม่ (`{ name, email, role }`) | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/users/:id` | แก้ไขข้อมูลสมาชิก | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/users/:id` | ลบสมาชิก (และคืนหนังสือที่คนนั้นยืมอยู่) | `200 OK` / `404 Not Found` |
| `GET` | `/api/users/:id/books` | ดึงหนังสือเฉพาะที่สมาชิกคนนี้ยืมอยู่ | `200 OK` / `404 Not Found` |

### หมวด Books (หนังสือ) & การยืม/คืน
| Method | Endpoint | รายละเอียด | Status Code |
|---|---|---|---|
| `GET` | `/api/books` | ดึงหนังสือทั้งหมด (รองรับ `?search=`, `?isAvailable=`, `?userId=`) | `200 OK` |
| `GET` | `/api/books/:id` | ดึงหนังสือตาม ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/books` | เพิ่มหนังสือเล่มใหม่ | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/books/:id` | แก้ไขข้อมูลหนังสือ | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/books/:id` | ลบหนังสือออกจากระบบ | `200 OK` / `404 Not Found` |
| `POST` | `/api/books/:id/borrow` | ยืมหนังสือให้สมาชิก (`{ userId: number }`) | `200 OK` / `400 Bad Request` |
| `POST` | `/api/books/:id/return` | คืนหนังสือกลับเข้าห้องสมุด | `200 OK` / `404 Not Found` |
| `POST` | `/api/upload` | อัปโหลดรูปภาพปกหนังสือ (`FormData`) | `201 Created` / `400 Bad Request` |

---

## 🧪 ตัวอย่างคำสั่ง cURL สำหรับทดสอบ

```bash
# 1. ดึงรายชื่อสมาชิกทั้งหมด (200 OK)
curl -X GET http://localhost:3000/api/users

# 2. ดึงหนังสือที่สมาชิก ID #1 ยืมอยู่ (200 OK)
curl -X GET http://localhost:3000/api/users/1/books

# 3. ยืมหนังสือ ID #1 ให้สมาชิก ID #2 (200 OK)
curl -X POST http://localhost:3000/api/books/1/borrow \
  -H "Content-Type: application/json" \
  -d '{"userId": 2}'

# 4. คืนหนังสือ ID #1 (200 OK)
curl -X POST http://localhost:3000/api/books/1/return

# 5. ดึงหนังสือทั้งหมด (200 OK)
curl -X GET http://localhost:3000/api/books

# 6. อัปโหลดไฟล์รูปภาพ (201 Created)
curl -X POST http://localhost:3000/api/upload -F "file=@/path/to/cover.png"
```

---

## 📂 โครงสร้างไฟล์ (File Structure)

```text
projects/web-contemporary-exam/
├── public/
│   └── uploads/                  # โฟลเดอร์เก็บไฟล์ภาพที่อัปโหลด
├── src/
│   ├── types/
│   │   ├── book.ts               # Interface Book, DTOs
│   │   └── user.ts               # Interface User, DTOs
│   ├── lib/
│   │   ├── books-store.ts        # In-Memory Database หนังสือ + ยืม/คืน
│   │   └── users-store.ts        # In-Memory Database สมาชิก
│   ├── components/
│   │   ├── navbar.tsx            # Header Navigation
│   │   ├── user-card.tsx         # การ์ดแสดงสมาชิกและจำนวนเล่มที่ยืม
│   │   ├── user-modal.tsx        # Modal เพิ่ม/แก้ไขสมาชิก
│   │   ├── borrow-modal.tsx      # Modal เลือกหนังสือว่างมายืมให้สมาชิก
│   │   ├── book-card.tsx         # Card View หนังสือ
│   │   ├── book-table.tsx        # Table View หนังสือ
│   │   ├── book-modal.tsx        # Modal เพิ่ม/แก้ไขหนังสือ
│   │   ├── file-uploader.tsx     # File Upload Component with Preview
│   │   ├── toast.tsx             # Notification Toast (HTTP Status)
│   │   └── code-block.tsx        # 1-Click Copy Code Box
│   └── app/
│       ├── layout.tsx            # Root Layout
│       ├── globals.css           # Tailwind CSS
│       ├── page.tsx              # Master-Detail Dashboard (หน้าหลัก)
│       ├── books/
│       │   └── [id]/
│       │       └── page.tsx      # Single Book Detail View
│       ├── guide/
│       │   └── page.tsx          # Step-by-Step Study Guide
│       └── api/
│           ├── users/
│           │   ├── route.ts      # GET /api/users, POST /api/users
│           │   └── [id]/
│           │       ├── route.ts  # GET, PUT, DELETE /api/users/[id]
│           │       └── books/
│           │           └── route.ts # GET /api/users/[id]/books
│           ├── books/
│           │   ├── route.ts      # GET /api/books, POST /api/books
│           │   └── [id]/
│           │       ├── route.ts  # GET, PUT, DELETE /api/books/[id]
│           │       ├── borrow/
│           │       │   └── route.ts # POST /api/books/[id]/borrow
│           │       └── return/
│           │           └── route.ts # POST /api/books/[id]/return
│           └── upload/
│               └── route.ts      # POST /api/upload
└── package.json
```
