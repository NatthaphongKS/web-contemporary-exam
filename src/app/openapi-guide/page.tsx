"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import {
  FileCode,
  Zap,
  Download,
  ExternalLink,
  Layers,
  Terminal,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Globe,
} from "lucide-react";

/**
 * ==============================================================================
 * OpenApiGuidePage: คู่มือการประยุกต์ใช้ OpenAPI / Swagger & Postman
 * ==============================================================================
 * หน้าสรุปขั้นตอนและกลยุทธ์การแปลง OpenAPI 3.0 Document ให้กลายเป็น:
 * 1. Postman Collection & Automated Request Snippets
 * 2. Postman Mock Server สำหรับจำลอง API Backend ก่อนโค้ดจริงเสร็จ
 * 3. Swagger Editor Client/Server SDK Generation
 * 4. CLI Code Generation เครื่องมือช่วยสร้าง DTO / Interfaces อัตโนมัติ
 * 5. เทคนิคการอ่าน Schemas และ Foreign Key Relations จาก OpenAPI Specification
 */

/**
 * OpenApiGuidePage
 * คอมโพเนนต์หน้าคู่มือแนะนำการใช้ OpenAPI/Swagger ในการทำข้อสอบ
 * 
 * @component OpenApiGuidePage
 * @returns {JSX.Element} หน้าคู่มือ OpenAPI
 */
export default function OpenApiGuidePage() {
  const [activeModule, setActiveModule] = useState<
    "postman" | "swagger-editor" | "cli" | "schema" | "mock-server"
  >("postman");

  const [copiedSwagger, setCopiedSwagger] = useState(false);

  /**
   * คัดลอก URL ของไฟล์ swagger.json ตัวอย่างลงใน Clipboard
   * 
   * @function handleCopySwaggerUrl
   */
  const handleCopySwaggerUrl = async () => {
    try {
      // ขั้นตอนที่ 1: คำนวณ URL แบบสัมบูรณ์ (Absolute URL) ของ swagger.json
      const url = `${window.location.origin}/swagger.json`;

      // ขั้นตอนที่ 2: เขียน URL ลงใน Clipboard ของระบบ
      await navigator.clipboard.writeText(url);

      // ขั้นตอนที่ 3: สลับสถานะ copiedSwagger เป็น true ชั่วคราว 2 วินาทีเพื่อให้เห็นปุ่มสีเขียว
      setCopiedSwagger(true);
      setTimeout(() => setCopiedSwagger(false), 2000);
    } catch (e) {
      console.error("Failed to copy swagger url:", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Zap className="w-3.5 h-3.5" /> Exam Automation Accelerator
          </span>
          <span className="text-xs text-slate-400 font-mono">OpenAPI 3.0 / Swagger & Postman</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          วิธีแปลง OpenAPI / Swagger และ Postman เป็นโค้ด (ไม่ต้องเริ่มจาก 0) 🚀
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          อาจารย์ให้ไฟล์ Swagger มาเพื่อประหยัดเวลา! นี่คือคู่มือสรุปวิธีนำไฟล์ <code className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">swagger.json</code> ไปสร้างเป็น Postman Collection, โครงสร้าง Backend สำเร็จรูป, และ Types สำหรับ Next.js / TypeScript ภายใน 1-2 นาทีโดยไม่ต้องเขียนเองจากศูนย์
        </p>

        {/* Action bar for Swagger JSON */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href="/swagger.json"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>เปิดดูไฟล์ swagger.json ตัวอย่าง</span>
          </a>

          <button
            onClick={handleCopySwaggerUrl}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              copiedSwagger
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
            }`}
          >
            {copiedSwagger ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copiedSwagger ? "คัดลอก URL สำเร็จ!" : "คัดลอก URL ของ swagger.json"}</span>
          </button>

          <a
            href="https://editor.swagger.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium underline ml-auto"
          >
            <span>เปิด Swagger Editor (Web)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-slate-200 scrollbar-none">
        {[
          { id: "postman", label: "1. Postman Import & Code Snippet (30 วิ)", icon: Zap },
          { id: "mock-server", label: "2. Postman Mock Server", icon: Sparkles },
          { id: "swagger-editor", label: "3. Swagger Editor (Web Gen)", icon: Globe },
          { id: "cli", label: "4. CLI Code Generator (Terminal)", icon: Terminal },
          { id: "schema", label: "5. การอ่าน Schema จาก Swagger", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id as typeof activeModule)}
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

      {/* Module 1: Postman Import */}
      {activeModule === "postman" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">1</span>
                นำเข้า Swagger สู่ Postman แล้วกดดูโค้ดสำเร็จรูป (เร็วสุดในห้องสอบ)
              </h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                แนะนำสำหรับห้องสอบ ⏱️ 30 วินาที
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Postman มีฟีเจอร์แปลง OpenAPI/Swagger Document เป็น Request สำเร็จรูปครบทุก Endpoint พร้อมตัวสร้างโค้ด (Code Generator) ในคลิกเดียว:
            </p>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div className="text-xs sm:text-sm text-slate-700">
                  <p className="font-bold text-slate-900">เปิด Postman แล้วกดปุ่ม Import</p>
                  <p className="text-slate-500 mt-0.5">
                    มองที่มุมบนซ้ายของ Postman คลิกที่ปุ่ม <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">Import</code>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div className="text-xs sm:text-sm text-slate-700">
                  <p className="font-bold text-slate-900">ลากไฟล์ swagger.json หรือวาง URL ลงไป</p>
                  <p className="text-slate-500 mt-0.5">
                    ลากไฟล์ <code className="font-mono text-indigo-600">swagger.json</code> ที่อาจารย์ให้มาวางลงในช่อง หรือวาง URL เช่น <code className="font-mono">http://localhost:3000/swagger.json</code>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div className="text-xs sm:text-sm text-slate-700">
                  <p className="font-bold text-slate-900">Postman จะสร้าง Collection ให้อัตโนมัติ</p>
                  <p className="text-slate-500 mt-0.5">
                    ในแท็บ Collections ด้านซ้าย จะมีโฟลเดอร์รวบรวมทุก Endpoint: <code className="font-mono text-emerald-600">GET /books</code>, <code className="font-mono text-amber-600">POST /books</code>, <code className="font-mono text-blue-600">PUT /books/:id</code>, <code className="font-mono text-rose-600">DELETE /books/:id</code> พร้อม JSON Body ตัวอย่างตามสเปกครบถ้วน
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  4
                </span>
                <div className="text-xs sm:text-sm text-slate-700">
                  <p className="font-bold text-slate-900">กดปุ่ม Code Snippet เพื่อคัดลอกโค้ดไปใช้งาน</p>
                  <p className="text-slate-500 mt-0.5">
                    คลิกเลือก Request ตัวที่ต้องการส่งคำขอ (เช่น POST /books) จากนั้นมองที่ <strong>แถบเครื่องมือด้านขวาสุด</strong> จะมีไอคอน <code className="font-mono font-bold text-indigo-600">&lt;/&gt;</code> (Code)
                  </p>
                  <p className="text-slate-500 mt-1">
                    เลือกภาษาได้ทันที:
                    <span className="inline-block ml-1 font-mono text-xs text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">JavaScript - Fetch</span>
                    <span className="inline-block ml-1 font-mono text-xs text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">NodeJs - Axios</span>
                    <span className="inline-block ml-1 font-mono text-xs text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">cURL</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-700 mb-1">
                ตัวอย่างโค้ดที่ Postman จะสร้างให้อัตโนมัติ (สามารถ Copy ไปใส่ในหน้าบ้านได้ทันที):
              </p>
              <CodeBlock
                title="Postman Generated Code Snippet (JavaScript - Fetch)"
                language="javascript"
                code={`const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "publishedYear": 2008,
  "isAvailable": true
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/books", requestOptions)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));`}
              />
            </div>
          </div>
        </section>
      )}

      {/* Module 2: Postman Mock Server */}
      {activeModule === "mock-server" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">2</span>
              วิธีสร้าง Mock Server บน Postman (รัน Backend จำลองได้ก่อนเขียนโค้ดจริง)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              หากต้องการทำหน้า Frontend หรือทดสอบ UI ก่อนที่ Backend จะเสร็จ คุณสามารถใช้ Postman แปลง Swagger เป็น Live Mock Server ที่ส่ง Status Code 200, 201 และ JSON จริงได้ทันที:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                <p className="font-bold text-slate-900">ขั้นตอนการสร้าง Postman Mock Server:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                  <li>ในแท็บ <strong>Collections</strong> ด้านซ้าย ให้คลิกขวาที่ Collection ที่เพิ่ง Import เข้ามา</li>
                  <li>เลือกเมนู <strong>Mock collection</strong></li>
                  <li>ตั้งชื่อ Mock Server (เช่น <code>Library Exam Mock</code>) แล้วกดปุ่ม <strong>Create Mock Server</strong></li>
                  <li>Postman จะมอบ <strong>Mock URL</strong> มาให้ เช่น:
                    <div className="my-1.5 p-2 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs">
                      https://4a7b9c1d-mock.pstmn.io
                    </div>
                  </li>
                  <li>นำ URL นี้ไปใส่ในคำสั่ง <code>fetch(&quot;https://...mock.pstmn.io/books&quot;)</code> ใน Next.js หน้าบ้านเพื่อทดสอบ Render ข้อมูลและการทำงานได้ทันที โดยไม่ต้องรอ Backend!</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Module 3: Swagger Editor */}
      {activeModule === "swagger-editor" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">3</span>
              ใช้ Swagger Editor ในการ Gen โครงสร้าง Server และ Client สำเร็จรูป
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Swagger Editor (<a href="https://editor.swagger.io" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">https://editor.swagger.io</a>) สามารถแปลงสเปกเป็นไฟล์ Zip ของโปรเจกต์ Backend และ Client SDK ได้กว่า 40 ภาษา:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Generate Server Box */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
                <p className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  เมนู &quot;Generate Server&quot; (ฝั่ง Backend)
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ดาวน์โหลดโครงสร้างเซิร์ฟเวอร์ที่มี Route Handlers, Controller และ Data Model พร้อมรัน:
                </p>
                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                  <li><strong>nodejs-server</strong>: สำหรับ Node.js / Express</li>
                  <li><strong>php-laravel</strong>: สำหรับโจทย์ที่ใช้ Laravel</li>
                  <li><strong>python-flask</strong> / <strong>fastapi</strong>: สำหรับโจทย์ Python</li>
                </ul>
              </div>

              {/* Generate Client Box */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <p className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  เมนู &quot;Generate Client&quot; (ฝั่ง Frontend)
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ดาวน์โหลดฟังก์ชัน Fetch / Axios ที่ผูก Type ให้เสร็จสรรพ:
                </p>
                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                  <li><strong>typescript-fetch</strong>: เหมาะที่สุดสำหรับ Next.js</li>
                  <li><strong>javascript</strong>: ฟังก์ชัน Fetch สำเร็จรูป</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Module 4: CLI Generator */}
      {activeModule === "cli" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">4</span>
              คำสั่ง Terminal รัน OpenAPI Generator (npx ไม่ต้องลงโปรแกรมล่วงหน้า)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              สำหรับห้องสอบที่มี Terminal คุณสามารถสั่ง Gen Code ผ่าน <code>npx</code> ได้ทันทีใน 10 วินาที:
            </p>

            <CodeBlock
              title="1. คำสั่ง Gen TypeScript Types สำหรับ Next.js จาก Swagger (openapi-typescript)"
              language="bash"
              code={`# แปลง swagger.json เป็น TypeScript Interfaces ทั้งระบบแบบ 100% Type-Safe
npx openapi-typescript public/swagger.json -o src/types/api-schema.d.ts`}
            />

            <CodeBlock
              title="2. คำสั่ง Gen Backend Server โครงสร้าง Node.js Express"
              language="bash"
              code={`# Gen โครงสร้าง Server Backend จาก swagger.json
npx @openapitools/openapi-generator-cli generate \\
  -i public/swagger.json \\
  -g nodejs-express-server \\
  -o ./generated-backend`}
            />

            <CodeBlock
              title="3. คำสั่ง Gen TypeScript Fetch Client สำหรับหน้าบ้าน"
              language="bash"
              code={`# Gen SDK สำหรับเรียก API ทุกเส้นโดยไม่ต้องเขียน fetch เอง
npx @openapitools/openapi-generator-cli generate \\
  -i public/swagger.json \\
  -g typescript-fetch \\
  -o ./src/api-client`}
            />
          </div>
        </section>
      )}

      {/* Module 5: Schema Inspection */}
      {activeModule === "schema" && (
        <section className="py-6 space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">5</span>
              เคล็ดลับการแกะข้อมูลจาก Swagger เพื่อเขียน Validation & Endpoints ในห้องสอบ
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              หากอาจารย์ให้ไฟล์ <code className="font-mono text-indigo-600">swagger.json</code> หรือ <code className="font-mono text-indigo-600">openapi.yaml</code> มา ให้เปิดไฟล์และดู 3 จุดสำคัญนี้เพื่อนำมาเขียนโค้ด Backend ใน Next.js ได้ทันที:
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  1. จุดค้นหา Data Model และ Field ที่ Required
                </p>
                <p className="text-xs text-slate-600">
                  ค้นหาคำว่า <code className="font-mono font-bold text-indigo-600">&quot;components&quot;</code> หรือ <code className="font-mono font-bold text-indigo-600">&quot;schemas&quot;</code>:
                </p>
                <CodeBlock
                  title="ตัวอย่าง Schema ใน swagger.json"
                  language="json"
                  code={`"Book": {
  "type": "object",
  "required": ["id", "title", "author", "publishedYear", "isAvailable"],
  "properties": {
    "id": { "type": "integer" },
    "title": { "type": "string" },
    "author": { "type": "string" },
    "publishedYear": { "type": "integer" },
    "isAvailable": { "type": "boolean" },
    "userId": { "type": "integer", "nullable": true }
  }
}`}
                />
                <p className="text-xs text-slate-500">
                  💡 <strong>นำไปใช้ต่อ</strong>: นำฟิลด์ใน <code>required</code> ไปเขียน <code>if (!body.title || !body.author) return NextResponse.json(&#123; error &#125;, &#123; status: 400 &#125;)</code>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  2. จุดสังเกต Response Status Code (200, 201, 404)
                </p>
                <p className="text-xs text-slate-600">
                  ในแต่ละ Endpoint ใต้หัวข้อ <code className="font-mono font-bold text-indigo-600">&quot;responses&quot;</code> จะบอกชัดเจนว่าต้องส่งเลขอะไรกลับไป:
                </p>
                <ul className="text-xs text-slate-700 space-y-1 font-mono">
                  <li>• GET /books → &quot;200&quot;: OK</li>
                  <li>• POST /books → &quot;201&quot;: Created</li>
                  <li>• GET /books/:id → &quot;200&quot; (พบ) หรือ &quot;404&quot;: Not Found</li>
                  <li>• DELETE /books/:id → &quot;200&quot; (ลบสำเร็จ) หรือ &quot;404&quot;: Not Found</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
