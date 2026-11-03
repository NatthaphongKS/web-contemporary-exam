# Next.js Library Management & Practical Web Exam Cheatsheet 📚✨

โปรเจกต์ Next.js (App Router) สำหรับเตรียมสอบปฏิบัติวิชา Web: ระบบจัดการหนังสือในห้องสมุด (Library Management) พร้อม In-Memory Mock Store, RESTful API (CRUD), File Upload, และหน้า Static Study Guide (`/guide`) รวมขั้นตอนและคำสั่งคัดลอก (1-Click Copy)

---

## 🌟 คุณสมบัติเด่นของโปรเจกต์

1. **โครงสร้างอ่านง่าย คลีนตา (Clean & Modular)**: แยก Types, In-Memory Store, API Route Handlers และ UI Components ชัดเจน เหมาะแก่การทำความเข้าใจก่อนเข้าห้องสอบ
2. **ไม่จำเป็นต้องเชื่อมต่อฐานข้อมูล (In-Memory Mock Store)**: ใช้ RAM จำลอง Database พร้อม Seed Data เริ่มต้น 5 เล่ม หมดกังวลเรื่องการตั้งค่า DB ในห้องสอบ
3. **RESTful API สมบูรณ์ตามข้อกำหนด**:
   - `GET /api/books` -> `200 OK` (ดึงรายการทั้งหมด พร้อม Search & Filter)
   - `GET /api/books/:id` -> `200 OK` (ดึงเล่มเดียว) หรือ `404 Not Found` (กรณีไม่พบ ID)
   - `POST /api/books` -> `201 Created` (สร้างเล่มใหม่) หรือ `400 Bad Request` (ข้อมูลไม่ครบ)
   - `PUT /api/books/:id` -> `200 OK` (แก้ไขข้อมูล) หรือ `404 Not Found`
   - `DELETE /api/books/:id` -> `200 OK` (ลบข้อมูล) หรือ `404 Not Found`
4. **ระบบ File Upload (`POST /api/upload`)**:
   - รองรับ `multipart/form-data` บันทึกไฟล์ลง `public/uploads/` พร้อมส่ง URL คืนกลับ `201 Created`
   - หน้า UI มีพรีวิวรูปภาพหน้าปกหนังสือแบบ Real-time
5. **UI ตอบสนองครบถ้วน (Full Interactive UI)**:
   - สลับมุมมองได้ทั้งแบบ **Card Grid View** และ **Table View**
   - Modal Form สำหรับเพิ่ม/แก้ไขข้อมูลหนังสือ พร้อมฟิลด์อัปโหลดรูปภาพ
   - ปุ่มลัด **ยืม/คืนหนังสือ (Toggle Availability)** ในคลิกเดียว
   - Floating Toast Notification แสดงผล HTTP Status Code ชัดเจน (200, 201, 404, 400)
6. **หน้า Static Study Guide (`/guide`)**:
   - บรรจุคำอธิบาย Step-by-Step 7 หัวข้อ พร้อมปุ่ม 1-Click Copy
   - รวบรวมคำสั่ง cURL สำหรับทดสอบ API ทุกเส้น และสรุปกับดักยอดฮิตที่มักพลาดในห้องสอบ
7. **App Router Route Modules ครบตามมาตรฐาน**:
   - ทุกหน้ามี `page.tsx`, `loading.tsx` (Skeleton), และ `error.tsx` (Error Boundary with Retry)

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

| Method | Endpoint | รายละเอียด | Body / Payload | Status Code ที่ส่งกลับ |
|---|---|---|---|---|
| `GET` | `/api/books` | ดึงหนังสือทั้งหมด (รองรับ `?search=` และ `?isAvailable=`) | - | `200 OK` |
| `GET` | `/api/books/:id` | ดึงหนังสือตาม ID | - | `200 OK` / `404 Not Found` |
| `POST` | `/api/books` | เพิ่มหนังสือเล่มใหม่ | `{ title, author, publishedYear, isAvailable?, coverUrl? }` | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/books/:id` | แก้ไขข้อมูลหนังสือ | `{ title?, author?, publishedYear?, isAvailable?, coverUrl? }` | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/books/:id` | ลบหนังสือออกจากระบบ | - | `200 OK` / `404 Not Found` |
| `POST` | `/api/upload` | อัปโหลดไฟล์ (รูปภาพ) | `FormData` field `file` | `201 Created` / `400 Bad Request` |

---

## 🧪 ตัวอย่างคำสั่ง cURL สำหรับทดสอบ

```bash
# 1. ดึงหนังสือทั้งหมด (200 OK)
curl -X GET http://localhost:3000/api/books

# 2. ดึงหนังสือ ID #1 (200 OK)
curl -X GET http://localhost:3000/api/books/1

# 3. ดึงหนังสือ ID ที่ไม่มีในระบบ (404 Not Found)
curl -i -X GET http://localhost:3000/api/books/999

# 4. เพิ่มหนังสือใหม่ (201 Created)
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Architecture",
    "author": "Robert C. Martin",
    "publishedYear": 2017,
    "isAvailable": true
  }'

# 5. แก้ไขสถานะการยืม (200 OK)
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"isAvailable": false}'

# 6. ลบหนังสือ (200 OK)
curl -X DELETE http://localhost:3000/api/books/1

# 7. อัปโหลดไฟล์ (201 Created)
curl -X POST http://localhost:3000/api/upload -F "file=@/path/to/cover.png"
```

---

## 📂 โครงสร้างไฟล์ (File Structure)

```text
projects/web-contemporary-exam/
├── public/
│   └── uploads/                  # ที่เก็บไฟล์ที่ถูกอัปโหลด
├── src/
│   ├── types/
│   │   └── book.ts               # Interface Book, DTOs
│   ├── lib/
│   │   └── books-store.ts        # In-Memory Database + CRUD methods
│   ├── components/
│   │   ├── navbar.tsx            # Header Navigation
│   │   ├── book-card.tsx         # Card View
│   │   ├── book-table.tsx        # Table View
│   │   ├── book-modal.tsx        # Add/Edit Modal
│   │   ├── file-uploader.tsx     # File Upload Component with Preview
│   │   ├── toast.tsx             # HTTP Status Toast Notifications
│   │   └── code-block.tsx        # 1-Click Copy Code Box
│   └── app/
│       ├── layout.tsx            # Root Layout
│       ├── globals.css           # Tailwind CSS
│       ├── page.tsx              # Library Dashboard
│       ├── loading.tsx           # Dashboard Skeleton
│       ├── error.tsx             # Dashboard Error Boundary
│       ├── books/
│       │   └── [id]/
│       │       ├── page.tsx      # Single Book Detail View
│       │       ├── loading.tsx   # Detail Skeleton
│       │       └── error.tsx     # Detail Error Boundary
│       ├── guide/
│       │   ├── page.tsx          # Step-by-Step Study Guide
│       │   ├── loading.tsx   # Guide Skeleton
│       │   └── error.tsx         # Guide Error Boundary
│       └── api/
│           ├── books/
│           │   ├── route.ts      # GET /api/books, POST /api/books
│           │   └── [id]/
│           │       └── route.ts  # GET, PUT, DELETE /api/books/[id]
│           └── upload/
│               └── route.ts      # POST /api/upload
└── package.json
```
