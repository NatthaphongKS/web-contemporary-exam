# Web Contemporary - Practical Exam Companion & Cheatsheet

เว็บไซต์คู่มือสรุปขั้นตอนและคำสั่งคัดลอก (Step-by-Step Cheatsheet) สำหรับเตรียมสอบปฏิบัติวิชา Web Contemporary (การพัฒนาเว็บร่วมสมัย) ครอบคลุมการทำงานแบบ Full-stack ด้วย Laravel, Laragon, MySQL (2 ตารางสัมพันธ์), File Upload, Frontend JavaScript Fetch, และ OpenAPI/Swagger Automation

## คุณสมบัติเด่นสำหรับห้องสอบ

1. **ปลอดภัยต่อการตรวจจับ (Exam-Safe)**: จัดรูปแบบและดีไซน์ในสไตล์สมุดเลกเชอร์/เอกสารสรุปบทเรียนวิชาการ (Academic Revision Notes) ปราศจากคำบ่งชี้ถึงเครื่องมือ AI จึงปลอดภัยต่อการอัดบันทึกหน้าจอ (Screen Recording) และบันทึกประวัติการเข้าใช้งานเครือข่าย (Network Log)
2. **1-Click Copy**: ทุกบล็อกคำสั่งและโค้ดมีปุ่มกดคัดลอกลง Clipboard ได้ทันที ประหยัดเวลาพิมพ์และลด Human Error ในห้องสอบ
3. **100% Offline Ready**: ไม่มี dependency ภายนอก ไม่ต้องต่อเน็ตเพื่อโหลด CDN สามารถดับเบิลคลิกเปิดไฟล์ `index.html` บนเครื่องได้ทันที
4. **ค้นหาด่วน (Quick Search)**: รองรับการกดแป้นพิมพ์ `/` เพื่อค้นหาคำสั่งหรือโค้ดที่ต้องการจากทุกโมดูล
5. **Interactive Checklist**: มีเช็กลิสต์ 10 ข้อยืนยันความพร้อมก่อนส่งงาน พร้อมบันทึกสถานะลง `localStorage` อัตโนมัติ

## สารบัญเนื้อหา (Modules)

- **Module 01**: ติดตั้งโปรเจกต์ & เชื่อมต่อ Database (Laragon, Composer, `.env`, `install:api`)
- **Module 02**: ตั้งค่า Database & สร้าง 2 ตารางสัมพันธ์ (`categories` & `books`, Foreign Key cascade, Eloquent Relations, DatabaseSeeder)
- **Module 03**: Backend RESTful API & File Upload (Resource Routes `api.php`, Controllers, Storage Symlink, Status Code 200, 201, 404)
- **Module 04**: Frontend JavaScript Integration (Vanilla JS Fetch API ผูกเข้ากับ HTML/CSS ของอาจารย์, `FormData`, เทคนิค `_method=PUT`)
- **Module 05**: OpenAPI / Swagger & Postman Automation (นำเข้า Swagger สู่ Postman เพื่อ Gen Code ใน 30 วินาที, Swagger Editor, CLI)
- **Module 06**: กับดักยอดฮิต & เช็กลิสต์ตรวจผลสอบ (แก้ CORS, Storage 404, PHP PUT Multipart, CSRF 419, เช็กลิสต์ 10 ข้อ)

## วิธีการเปิดใช้งาน

### วิธีที่ 1: เปิดไฟล์ตรงบนเครื่อง (แนะนำในห้องสอบ)
ดับเบิลคลิกที่ไฟล์ `index.html` เพื่อเปิดบนเบราว์เซอร์ (Google Chrome, Microsoft Edge, Brave ฯลฯ) ได้ทันที

### วิธีที่ 2: รันผ่าน Local Web Server
```bash
cd projects/web-contemporary-exam
php -S localhost:3000
```
จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

### วิธีที่ 3: Deploy ขึ้น GitHub Pages หรือ Vercel (สำหรับเปิดดูผ่านเน็ต)
- **Vercel**: ติดตั้ง Vercel CLI แล้วรัน `vercel --prod`
- **GitHub Pages**: อัปโหลดขึ้น Repository แล้วเปิดการทำงาน GitHub Pages จาก Branch `main`
