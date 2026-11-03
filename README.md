# Next.js Library Management & Practical Web Exam Cheatsheet 📚✨

โปรเจกต์ Next.js (App Router + TypeScript + Tailwind CSS) สำหรับเตรียมสอบปฏิบัติวิชา Web: ระบบจัดการสมาชิกและหนังสือในห้องสมุด (2 ตารางสัมพันธ์ Users & Books 1:N) พร้อม In-Memory Mock Store (`globalThis`), RESTful API (CRUD), File Upload, Master-Detail Dashboard, และหน้า Static Study Guide (`/guide`) รวมขั้นตอนและคำสั่งคัดลอก (1-Click Copy)

---

## 🌟 คุณสมบัติเด่นของโปรเจกต์

1. **2 ตารางสัมพันธ์ (Relational Data 1:N)**:
   - ตาราง `users` (ตารางที่ 1): เก็บข้อมูลสมาชิกห้องสมุด (`id`, `name`, `email`, `booksCount`)
   - ตาราง `books` (ตารางที่ 2): เชื่อมต่อผ่าน Foreign Key `userId` ระบุสมาชิกผู้ถือครองหนังสือ
   - ระบบตรวจสอบ Foreign Key: ป้องกันการสร้างหนังสือที่ระบุ `userId` ไม่มีตัวตนในระบบ
   - ระบบ Cascade Delete: เมื่อลบสมาชิก หนังสือทั้งหมดของคนนั้นจะถูกลบออกจากระบบโดยอัตโนมัติ
2. **Master-Detail Interactive UI**:
   - ด้านซ้าย (Master Column): รายชื่อสมาชิกทั้งหมด คลิกเลือกคนไหน ด้านขวาจะแสดงเฉพาะหนังสือที่คนนั้นถือครองอยู่ทันที
   - ปุ่ม **"ดูหนังสือทั้งหมด (ทุกคน)"**: ล้างตัวกรองเพื่อกลับมาดูภาพรวมหนังสือทุกเล่มในระบบ
   - การ์ดสมาชิกแสดง Badge นับจำนวนหนังสือที่ถือครองอยู่แบบ Real-time
3. **In-Memory Store (ไม่ต้องต่อฐานข้อมูลจริง)**:
   - ข้อมูลทั้งหมดเก็บใน RAM ผ่าน `globalThis` ป้องกันการสูญหายของข้อมูลเมื่อ Next.js ทำ Fast Refresh
   - มี Seed Users 3 คน และ Seed Books 4 เล่ม พร้อมใช้งานได้ทันทีเมื่อเปิดเครื่อง
4. **RESTful API สมบูรณ์ตามมาตรฐาน**:
   - **Users API**: `GET /api/users`, `POST /api/users`, `GET /api/users/:id`, `PUT /api/users/:id`, `DELETE /api/users/:id` (Cascade)
   - **Relational 1:N API**: `GET /api/users/:id/books` (ดึงหนังสือเฉพาะของสมาชิกคนนั้น)
   - **Books API**: `GET /api/books` (รองรับ Query filters: `?search=`, `?isAvailable=`, `?userId=`), `POST /api/books` (ตรวจ FK), `GET /api/books/:id`, `PUT /api/books/:id`, `DELETE /api/books/:id`
   - **Upload API**: `POST /api/upload` (รับไฟล์ภาพ `multipart/form-data` บันทึกลง `public/uploads/`)
5. **Optimistic Updates & Silent Background Sync**:
   - สลับสถานะหนังสือ (`isAvailable`) และลบหนังสือแบบ Optimistic Update ทันทีในระดับมิลลิวินาที หน้าจอไม่กระตุก ไม่เกิด Layout Shift และ sync ข้อมูลกับเซิร์ฟเวอร์ใน Background พร้อม Rollback อัตโนมัติหากเกิดข้อผิดพลาด
6. **หน้า Static Study Guide (`/guide`)**:
   - คู่มือติวสอบ 8 หัวข้อ พร้อมแบนเนอร์ **6 ขั้นตอนปฏิบัติจริงในห้องสอบ (Step-by-Step Roadmap)**, โค้ดจริงทุกไฟล์, และคำสั่ง cURL พร้อมปุ่ม 1-Click Copy

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

### หมวด Users (ตารางที่ 1: สมาชิก)
| Method | Endpoint | รายละเอียด | Status Code |
|---|---|---|---|
| `GET` | `/api/users` | ดึงสมาชิกทั้งหมด พร้อมจำนวนหนังสือที่ถือครอง | `200 OK` |
| `GET` | `/api/users/:id` | ดึงข้อมูลสมาชิกตาม ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/users` | เพิ่มสมาชิกใหม่ (`{ name, email }`) | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/users/:id` | แก้ไขข้อมูลสมาชิก | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/users/:id` | ลบสมาชิก และ Cascade ลบหนังสือของสมาชิกนี้ทั้งหมด | `200 OK` / `404 Not Found` |
| `GET` | `/api/users/:id/books` | ดึงหนังสือเฉพาะที่สมาชิกคนนี้ถือครอง (1:N) | `200 OK` / `404 Not Found` |

### หมวด Books (ตารางที่ 2: หนังสือ)
| Method | Endpoint | รายละเอียด | Status Code |
|---|---|---|---|
| `GET` | `/api/books` | ดึงหนังสือทั้งหมด (รองรับ `?search=`, `?isAvailable=`, `?userId=`) | `200 OK` |
| `GET` | `/api/books/:id` | ดึงหนังสือตาม ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/books` | เพิ่มหนังสือใหม่ (ต้องระบุ `title`, `author`, `userId`) | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/books/:id` | แก้ไขข้อมูลหนังสือ (รองรับ Partial update) | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/books/:id` | ลบหนังสือออกจากระบบ | `200 OK` / `404 Not Found` |
| `POST` | `/api/upload` | อัปโหลดรูปภาพปกหนังสือ (`multipart/form-data`) | `201 Created` / `400 Bad Request` |

---

## 🧪 ตัวอย่างคำสั่ง cURL สำหรับทดสอบ API

```bash
# 1. ดึงรายชื่อสมาชิกทั้งหมด (200 OK)
curl -X GET http://localhost:3000/api/users

# 2. เพิ่มสมาชิกใหม่ (201 Created)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "วีระชัย รักเรียน", "email": "veerachai.r@example.com"}'

# 3. ดึงหนังสือเฉพาะของสมาชิก ID #1 (200 OK)
curl -X GET http://localhost:3000/api/users/1/books

# 4. ดึงรายการหนังสือทั้งหมด (200 OK)
curl -X GET http://localhost:3000/api/books

# 5. เพิ่มหนังสือใหม่ โดยผูกกับสมาชิก ID #1 (201 Created)
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Architecture",
    "author": "Robert C. Martin",
    "userId": 1,
    "publishedYear": 2017,
    "isAvailable": true
  }'

# 6. ดึงหนังสือตาม ID #1 (200 OK)
curl -X GET http://localhost:3000/api/books/1

# 7. สลับสถานะหนังสือ (PUT 200 OK)
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"isAvailable": false}'

# 8. อัปโหลดไฟล์รูปภาพหน้าปก (201 Created)
curl -X POST http://localhost:3000/api/upload -F "file=@/path/to/cover.png"

# 9. ลบหนังสือ (DELETE 200 OK)
curl -X DELETE http://localhost:3000/api/books/1

# 10. ลบสมาชิก ID #1 พร้อมทดสอบ Cascade Delete หนังสือ (DELETE 200 OK)
curl -X DELETE http://localhost:3000/api/users/1
```

---

## 📂 โครงสร้างไฟล์ (File Structure)

```text
projects/web-contemporary-exam/
├── public/
│   └── uploads/                  # โฟลเดอร์เก็บไฟล์ภาพที่อัปโหลด
├── src/
│   ├── types/
│   │   ├── user.ts               # Interface User, DTOs (ตารางที่ 1)
│   │   └── book.ts               # Interface Book, DTOs (ตารางที่ 2 มี FK userId)
│   ├── lib/
│   │   ├── users-store.ts        # In-Memory Database สมาชิก + Cascade Delete
│   │   └── books-store.ts        # In-Memory Database หนังสือ + 1:N Foreign Key
│   ├── components/
│   │   ├── navbar.tsx            # Header Navigation
│   │   ├── user-card.tsx         # การ์ดแสดงสมาชิก (Master Column ฝั่งซ้าย)
│   │   ├── user-modal.tsx        # Modal เพิ่ม/แก้ไขสมาชิก
│   │   ├── book-card.tsx         # การ์ดแสดงหนังสือ (Detail Column ฝั่งขวา)
│   │   ├── book-table.tsx        # ตารางแสดงหนังสือ (Table View)
│   │   ├── book-modal.tsx        # Modal เพิ่ม/แก้ไขหนังสือ
│   │   ├── file-uploader.tsx     # File Upload Component พร้อม Instant Preview
│   │   ├── toast.tsx             # Notification Toast (HTTP Status)
│   │   └── code-block.tsx        # กล่องโค้ดพร้อมปุ่ม 1-Click Copy
│   └── app/
│       ├── layout.tsx            # Root Layout
│       ├── globals.css           # Tailwind CSS
│       ├── page.tsx              # Master-Detail Dashboard (หน้าหลัก)
│       ├── guide/
│       │   └── page.tsx          # Step-by-Step Study Guide (คู่มือเตรียมสอบ)
│       ├── openapi-guide/
│       │   └── page.tsx          # คู่มือ OpenAPI / Swagger & Postman
│       └── api/
│           ├── users/
│           │   ├── route.ts      # GET /api/users, POST /api/users
│           │   └── [id]/
│           │       ├── route.ts  # GET, PUT, DELETE /api/users/[id] (Cascade)
│           │       └── books/
│           │           └── route.ts # GET /api/users/[id]/books (1:N Relations)
│           ├── books/
│           │   ├── route.ts      # GET /api/books (Filters), POST /api/books (FK check)
│           │   └── [id]/
│           │       └── route.ts  # GET, PUT, DELETE /api/books/[id]
│           └── upload/
│               └── route.ts      # POST /api/upload (FormData File Upload)
└── package.json
```
