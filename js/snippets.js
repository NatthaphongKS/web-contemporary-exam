// Web Contemporary Exam Snippets Data
// Pre-bundled to guarantee 100% offline functionality without file:// CORS issues
window.EXAM_DATA = [
  {
    "id": "module-setup",
    "title": "01. ติดตั้งโปรเจกต์ & เชื่อมต่อ Database",
    "tag": "SETUP & LARAGON",
    "description": "ขั้นตอนการสร้างโปรเจกต์ Laravel บน Laragon, ตั้งค่า .env, และทดสอบการเชื่อมต่อ Database",
    "steps": [
      {
        "step": "1.1",
        "title": "สร้างโปรเจกต์ Laravel บน Laragon",
        "description": "เปิด Terminal ใน Laragon แล้วไปที่โฟลเดอร์ www เพื่อสร้างโปรเจกต์ใหม่",
        "badge": "Terminal",
        "code": "cd C:\\laragon\\www\ncomposer create-project laravel/laravel library-app\ncd library-app",
        "lang": "bash",
        "file": "Terminal Command"
      },
      {
        "step": "1.2",
        "title": "เปิดใช้งาน API Routing (สำหรับ Laravel 11)",
        "description": "Laravel 11 ไม่ได้สร้าง routes/api.php มาเป็นค่าเริ่มต้น ต้องรันคำสั่งนี้เพื่อสร้าง routes/api.php และตั้งค่า API middleware",
        "badge": "Laravel 11 Requirement",
        "code": "php artisan install:api",
        "lang": "bash",
        "file": "Terminal Command"
      },
      {
        "step": "1.3",
        "title": "สร้างฐานข้อมูล MySQL บน Laragon",
        "description": "เปิด HeidiSQL บน Laragon หรือใช้คำสั่ง Terminal เพื่อสร้าง Database ชื่อ library_db",
        "badge": "MySQL CLI",
        "code": "mysql -u root -e \"CREATE DATABASE IF NOT EXISTS library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\"",
        "lang": "sql",
        "file": "Terminal / HeidiSQL"
      },
      {
        "step": "1.4",
        "title": "ตั้งค่าไฟล์ .env เชื่อมต่อฐานข้อมูล",
        "description": "เปิดไฟล์ .env และแก้ไขส่วนการเชื่อมต่อ Database โดย Laragon รหัสผ่าน root จะเป็นค่าว่างเสมอ",
        "badge": "Config",
        "code": "DB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=library_db\nDB_USERNAME=root\nDB_PASSWORD=\n\n# ตั้งค่า Application URL\nAPP_URL=http://localhost:8000",
        "lang": "ini",
        "file": ".env"
      },
      {
        "step": "1.5",
        "title": "ทดสอบรัน Web Server & ตรวจสถานะ Database",
        "description": "รันเซิร์ฟเวอร์ผ่าน Artisan Serve และตรวจสอบว่าเชื่อมต่อ DB สำเร็จ",
        "badge": "Terminal",
        "code": "# ตรวจสอบสถานะการเชื่อมต่อ Database\nphp artisan db:show\n\n# รัน Server พอร์ต 8000\nphp artisan serve --port=8000",
        "lang": "bash",
        "file": "Terminal Command"
      }
    ]
  },
  {
    "id": "module-database",
    "title": "02. ตั้งค่า Database & สร้าง 2 ตารางสัมพันธ์",
    "tag": "MIGRATIONS & MODELS",
    "description": "คำสั่งสร้าง Model, Migration 2 ตารางเชื่อมโยง Foreign Key (Categories & Books), Eloquent Relations, และ Seeders",
    "steps": [
      {
        "step": "2.1",
        "title": "สร้าง Model & Migration พร้อมกัน",
        "description": "ใช้คำสั่ง make:model พร้อมแฟล็ก -m เพื่อสร้างไฟล์ Model และ Migration พร้อมกัน",
        "badge": "Artisan CLI",
        "code": "php artisan make:model Category -m\nphp artisan make:model Book -m",
        "lang": "bash",
        "file": "Terminal Command"
      },
      {
        "step": "2.2",
        "title": "Migration: ตาราง Categories (หมวดหมู่/แคตตาล็อก)",
        "description": "เปิดไฟล์ database/migrations/xxxx_create_categories_table.php และระบุโครงสร้างตาราง",
        "badge": "Migration",
        "code": "<?php\n\nuse Illuminate\\Database\\Migrations\\Migration;\nuse Illuminate\\Database\\Schema\\Blueprint;\nuse Illuminate\\Support\\Facades\\Schema;\n\nreturn new class extends Migration\n{\n    public function up(): void\n    {\n        Schema::create('categories', function (Blueprint $table) {\n            $table->id();\n            $table->string('name');\n            $table->text('description')->nullable();\n            $table->timestamps();\n        });\n    }\n\n    public function down(): void\n    {\n        Schema::dropIfExists('categories');\n    }\n};",
        "lang": "php",
        "file": "database/migrations/xxxx_create_categories_table.php"
      },
      {
        "step": "2.3",
        "title": "Migration: ตาราง Books (หนังสือในห้องสมุด)",
        "description": "เปิดไฟล์ database/migrations/xxxx_create_books_table.php พร้อมเชื่อม Foreign Key ไปยัง categories",
        "badge": "Migration",
        "code": "<?php\n\nuse Illuminate\\Database\\Migrations\\Migration;\nuse Illuminate\\Database\\Schema\\Blueprint;\nuse Illuminate\\Support\\Facades\\Schema;\n\nreturn new class extends Migration\n{\n    public function up(): void\n    {\n        Schema::create('books', function (Blueprint $table) {\n            $table->id();\n            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');\n            $table->string('title');\n            $table->string('author');\n            $table->integer('published_year');\n            $table->boolean('is_available')->default(true);\n            $table->string('cover_image')->nullable();\n            $table->timestamps();\n        });\n    }\n\n    public function down(): void\n    {\n        Schema::dropIfExists('books');\n    }\n};",
        "lang": "php",
        "file": "database/migrations/xxxx_create_books_table.php"
      },
      {
        "step": "2.4",
        "title": "Model Eloquent: Category & Book Relations",
        "description": "กำหนด $fillable และ Relationship แบบ 1:N (Category hasMany Books, Book belongsTo Category)",
        "badge": "Models",
        "code": "// File: app/Models/Category.php\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass Category extends Model\n{\n    use HasFactory;\n    protected $fillable = ['name', 'description'];\n\n    public function books()\n    {\n        return $this->hasMany(Book::class);\n    }\n}\n\n// File: app/Models/Book.php\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass Book extends Model\n{\n    use HasFactory;\n\n    protected $fillable = [\n        'category_id',\n        'title',\n        'author',\n        'published_year',\n        'is_available',\n        'cover_image'\n    ];\n\n    protected $casts = [\n        'is_available' => 'boolean',\n        'published_year' => 'integer',\n        'category_id' => 'integer'\n    ];\n\n    public function category()\n    {\n        return $this->belongsTo(Category::class);\n    }\n}",
        "lang": "php",
        "file": "app/Models/Category.php & Book.php"
      },
      {
        "step": "2.5",
        "title": "Seeder ข้อมูลจำลองสำหรับทดสอบทันที",
        "description": "สร้าง Seeder สำหรับเติมข้อมูลทั้ง 2 ตาราง แล้วรันคำสั่ง migrate:fresh --seed",
        "badge": "Database Seeder",
        "code": "<?php\n// File: database/seeders/DatabaseSeeder.php\nnamespace Database\\Seeders;\n\nuse Illuminate\\Database\\Seeder;\nuse App\\Models\\Category;\nuse App\\Models\\Book;\n\nclass DatabaseSeeder extends Seeder\n{\n    public function run(): void\n    {\n        $catSoftware = Category::create([\n            'name' => 'Software Engineering',\n            'description' => 'หนังสือเกี่ยวกับการออกแบบและเขียนโปรแกรม'\n        ]);\n\n        $catDatabase = Category::create([\n            'name' => 'Database & Cloud',\n            'description' => 'หนังสือเกี่ยวกับระบบจัดการฐานข้อมูลและสถาปัตยกรรมคลาวด์'\n        ]);\n\n        Book::create([\n            'category_id' => $catSoftware->id,\n            'title' => 'Clean Code',\n            'author' => 'Robert C. Martin',\n            'published_year' => 2008,\n            'is_available' => true,\n            'cover_image' => null\n        ]);\n\n        Book::create([\n            'category_id' => $catSoftware->id,\n            'title' => 'Refactoring',\n            'author' => 'Martin Fowler',\n            'published_year' => 1999,\n            'is_available' => true,\n            'cover_image' => null\n        ]);\n    }\n}\n\n// คำสั่งรันใน Terminal:\n// php artisan migrate:fresh --seed",
        "lang": "php",
        "file": "database/seeders/DatabaseSeeder.php"
      }
    ]
  },
  {
    "id": "module-api",
    "title": "03. Backend RESTful API & File Upload",
    "tag": "API & FILE UPLOAD",
    "description": "การสร้าง API Routes, Controllers สำหรับ 2 ตาราง, การจัดการอัปโหลดรูปภาพปก และ Status Code 200, 201, 404",
    "steps": [
      {
        "step": "3.1",
        "title": "สร้าง Controllers สำหรับ API",
        "description": "สร้าง Controller ภายใต้โฟลเดอร์ Api ด้วยตัวเลือก --api เพื่อให้ได้เมธอดมาตรฐาน (index, store, show, update, destroy)",
        "badge": "Artisan CLI",
        "code": "php artisan make:controller Api/CategoryController --api\nphp artisan make:controller Api/BookController --api",
        "lang": "bash",
        "file": "Terminal Command"
      },
      {
        "step": "3.2",
        "title": "กำหนด Routes ใน routes/api.php",
        "description": "ลงทะเบียน Resource routes สำหรับ Categories และ Books พร้อมรองรับ Endpoints ครบชุด",
        "badge": "Routes",
        "code": "<?php\n// File: routes/api.php\nuse Illuminate\\Support\\Facades\\Route;\nuse App\\Http\\Controllers\\Api\\CategoryController;\nuse App\\Http\\Controllers\\Api\\BookController;\n\n// RESTful API Routes\nRoute::apiResource('categories', CategoryController::class);\nRoute::apiResource('books', BookController::class);\n\n/*\n * Endpoints ที่ได้:\n * GET    /api/categories         -> ดึงหมวดหมู่ทั้งหมด (200 OK)\n * POST   /api/categories         -> เพิ่มหมวดหมู่ใหม่ (201 Created)\n *\n * GET    /api/books              -> ดึงหนังสือทั้งหมด (200 OK)\n * GET    /api/books/{id}         -> ดึงเล่มเดียว (200 OK หรือ 404 Not Found)\n * POST   /api/books              -> เพิ่มใหม่พร้อมอัปโหลดปก (201 Created)\n * PUT    /api/books/{id}         -> แก้ไขข้อมูลหนังสือ (200 OK)\n * DELETE /api/books/{id}         -> ลบหนังสือ (200 OK)\n */",
        "lang": "php",
        "file": "routes/api.php"
      },
      {
        "step": "3.3",
        "title": "CategoryController: ดึงและเพิ่มหมวดหมู่",
        "description": "Controller จัดการหมวดหมู่เพื่อส่งข้อมูลไปใส่ Dropdown ในหน้าบ้าน",
        "badge": "Controller",
        "code": "<?php\nnamespace App\\Http\\Controllers\\Api;\n\nuse App\\Http\\Controllers\\Controller;\nuse App\\Models\\Category;\nuse Illuminate\\Http\\Request;\n\nclass CategoryController extends Controller\n{\n    public function index()\n    {\n        return response()->json(Category::all(), 200);\n    }\n\n    public function store(Request $request)\n    {\n        $validated = $request->validate([\n            'name' => 'required|string|max:255',\n            'description' => 'nullable|string'\n        ]);\n\n        $category = Category::create($validated);\n        return response()->json($category, 201);\n    }\n}",
        "lang": "php",
        "file": "app/Http/Controllers/Api/CategoryController.php"
      },
      {
        "step": "3.4",
        "title": "BookController: CRUD & File Upload ปกหนังสือ",
        "description": "Controller จัดการหนังสือ รองรับการอัปโหลดไฟล์รูปภาพลง storage และคืนค่า Status Code ตามข้อกำหนด",
        "badge": "Controller",
        "code": "<?php\nnamespace App\\Http\\Controllers\\Api;\n\nuse App\\Http\\Controllers\\Controller;\nuse App\\Models\\Book;\nuse Illuminate\\Http\\Request;\nuse Illuminate\\Support\\Facades\\Storage;\n\nclass BookController extends Controller\n{\n    public function index()\n    {\n        $books = Book::with('category')->latest()->get()->map(function ($book) {\n            $book->cover_url = $book->cover_image ? asset('storage/' . $book->cover_image) : null;\n            return $book;\n        });\n\n        return response()->json($books, 200);\n    }\n\n    public function store(Request $request)\n    {\n        $validated = $request->validate([\n            'category_id'    => 'required|exists:categories,id',\n            'title'          => 'required|string|max:255',\n            'author'         => 'required|string|max:255',\n            'published_year' => 'required|integer|min:1000|max:' . (date('Y') + 1),\n            'is_available'   => 'nullable|boolean',\n            'cover_image'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'\n        ]);\n\n        // ตรวจสอบค่า Boolean จาก FormData\n        $validated['is_available'] = filter_var($request->input('is_available', true), FILTER_VALIDATE_BOOLEAN);\n\n        // จัดการอัปโหลดไฟล์ปก\n        if ($request->hasFile('cover_image')) {\n            $path = $request->file('cover_image')->store('covers', 'public');\n            $validated['cover_image'] = $path;\n        }\n\n        $book = Book::create($validated);\n        $book->load('category');\n        $book->cover_url = $book->cover_image ? asset('storage/' . $book->cover_image) : null;\n\n        return response()->json($book, 201);\n    }\n\n    public function show(string $id)\n    {\n        $book = Book::with('category')->find($id);\n        if (!$book) {\n            return response()->json(['message' => 'ไม่พบข้อมูลหนังสือที่ต้องการ'], 404);\n        }\n\n        $book->cover_url = $book->cover_image ? asset('storage/' . $book->cover_image) : null;\n        return response()->json($book, 200);\n    }\n\n    public function update(Request $request, string $id)\n    {\n        $book = Book::find($id);\n        if (!$book) {\n            return response()->json(['message' => 'ไม่พบข้อมูลหนังสือที่ต้องการแก้ไข'], 404);\n        }\n\n        $validated = $request->validate([\n            'category_id'    => 'sometimes|required|exists:categories,id',\n            'title'          => 'sometimes|required|string|max:255',\n            'author'         => 'sometimes|required|string|max:255',\n            'published_year' => 'sometimes|required|integer|min:1000',\n            'is_available'   => 'nullable|boolean',\n            'cover_image'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'\n        ]);\n\n        if ($request->has('is_available')) {\n            $validated['is_available'] = filter_var($request->input('is_available'), FILTER_VALIDATE_BOOLEAN);\n        }\n\n        // ถ้ามีการส่งรูปใหม่มา ให้ลบรูปเดิมแล้วเซฟรูปใหม่\n        if ($request->hasFile('cover_image')) {\n            if ($book->cover_image && Storage::disk('public')->exists($book->cover_image)) {\n                Storage::disk('public')->delete($book->cover_image);\n            }\n            $path = $request->file('cover_image')->store('covers', 'public');\n            $validated['cover_image'] = $path;\n        }\n\n        $book->update($validated);\n        $book->load('category');\n        $book->cover_url = $book->cover_image ? asset('storage/' . $book->cover_image) : null;\n\n        return response()->json($book, 200);\n    }\n\n    public function destroy(string $id)\n    {\n        $book = Book::find($id);\n        if (!$book) {\n            return response()->json(['message' => 'ไม่พบข้อมูลหนังสือที่ต้องการลบ'], 404);\n        }\n\n        // ลบรูปภาพออกจาก Storage\n        if ($book->cover_image && Storage::disk('public')->exists($book->cover_image)) {\n            Storage::disk('public')->delete($book->cover_image);\n        }\n\n        $book->delete();\n        return response()->json(['message' => 'ลบข้อมูลหนังสือสำเร็จ'], 200);\n    }\n}",
        "lang": "php",
        "file": "app/Http/Controllers/Api/BookController.php"
      },
      {
        "step": "3.5",
        "title": "สร้าง Storage Symlink สำหรับเข้าถึงรูปภาพ",
        "description": "คำสั่งสำคัญที่สุดเพื่อให้เบราว์เซอร์สามารถเปิดดูไฟล์รูปที่อัปโหลดไว้ใน storage/app/public ได้ผ่าน public/storage",
        "badge": "Artisan CLI",
        "code": "php artisan storage:link\n\n# ทดสอบการเข้าถึง URL ตัวอย่าง:\n# http://localhost:8000/storage/covers/example.jpg",
        "lang": "bash",
        "file": "Terminal Command"
      }
    ]
  },
  {
    "id": "module-frontend",
    "title": "04. Frontend JavaScript Integration",
    "tag": "JAVASCRIPT & FETCH",
    "description": "สูตรโค้ด Vanilla JS (Native Fetch API) ผูกเข้ากับ HTML/CSS ของอาจารย์ รองรับ CRUD ครบวงจร, FormData, และการแก้บั๊ก PUT Multipart",
    "steps": [
      {
        "step": "4.1",
        "title": "ตั้งค่า API Base URL & ดึงหมวดหมู่ใส่ Dropdown",
        "description": "ดึงข้อมูลจาก GET /api/categories มาวนลูปสร้างแท็ก <option> ให้ผู้ใช้เลือกในฟอร์ม",
        "badge": "JavaScript",
        "code": "const API_BASE = 'http://localhost:8000/api';\n\n// ดึงหมวดหมู่มาใส่ใน Select dropdown\nasync function loadCategories() {\n  try {\n    const res = await fetch(`${API_BASE}/categories`);\n    const categories = await res.json();\n    \n    const selectEl = document.getElementById('category_id');\n    if (!selectEl) return;\n    \n    selectEl.innerHTML = '<option value=\"\">-- กรุณาเลือกหมวดหมู่ --</option>';\n    categories.forEach(cat => {\n      selectEl.innerHTML += `<option value=\"${cat.id}\">${cat.name}</option>`;\n    });\n  } catch (error) {\n    console.error('Error loading categories:', error);\n    alert('ไม่สามารถโหลดรายการหมวดหมู่ได้');\n  }\n}",
        "lang": "javascript",
        "file": "frontend/script.js"
      },
      {
        "step": "4.2",
        "title": "ดึงรายการหนังสือทั้งหมดมาแสดงในตาราง (GET /api/books)",
        "description": "ดึงข้อมูลและ Render ลง <tbody> พร้อมแสดงรูปปก, สถานะยืม, และปุ่มแก้ไข/ลบ",
        "badge": "JavaScript",
        "code": "async function loadBooks() {\n  try {\n    const res = await fetch(`${API_BASE}/books`);\n    const books = await res.json();\n    \n    const tbody = document.getElementById('bookTableBody');\n    if (!tbody) return;\n    \n    if (books.length === 0) {\n      tbody.innerHTML = '<tr><td colspan=\"7\" style=\"text-align:center;\">ไม่พบข้อมูลหนังสือ</td></tr>';\n      return;\n    }\n    \n    tbody.innerHTML = books.map(b => `\n      <tr>\n        <td>${b.id}</td>\n        <td>\n          ${b.cover_url \n            ? `<img src=\"${b.cover_url}\" width=\"50\" height=\"70\" style=\"object-fit:cover; border-radius:4px;\">` \n            : '<span style=\"color:#888;\">ไม่มีปก</span>'}\n        </td>\n        <td><strong>${b.title}</strong></td>\n        <td>${b.author}</td>\n        <td>${b.category ? b.category.name : '-'}</td>\n        <td>${b.published_year}</td>\n        <td>\n          <span class=\"badge ${b.is_available ? 'badge-success' : 'badge-danger'}\">\n            ${b.is_available ? 'พร้อมยืม' : 'ถูกยืมแล้ว'}\n          </span>\n        </td>\n        <td>\n          <button onclick=\"openEditModal(${b.id})\" class=\"btn btn-sm btn-edit\">แก้ไข</button>\n          <button onclick=\"deleteBook(${b.id})\" class=\"btn btn-sm btn-delete\">ลบ</button>\n        </td>\n      </tr>\n    `).join('');\n  } catch (error) {\n    console.error('Error loading books:', error);\n  }\n}",
        "lang": "javascript",
        "file": "frontend/script.js"
      },
      {
        "step": "4.3",
        "title": "บันทึกข้อมูลหนังสือใหม่ (POST /api/books)",
        "description": "ดึงค่าจากฟอร์มผ่าน FormData เพื่อส่งข้อมูลพร้อมไฟล์รูปภาพปกไปยัง API",
        "badge": "JavaScript",
        "code": "async function handleCreateBook(event) {\n  event.preventDefault();\n  const form = event.target;\n  const formData = new FormData(form);\n  \n  // จัดการค่า Checkbox is_available ให้เป็น 1 หรือ 0\n  const isAvailableCheckbox = form.querySelector('[name=\"is_available\"]');\n  formData.set('is_available', isAvailableCheckbox && isAvailableCheckbox.checked ? '1' : '0');\n\n  try {\n    const res = await fetch(`${API_BASE}/books`, {\n      method: 'POST',\n      body: formData // ห้ามตั้ง Header Content-Type เมื่อใช้ FormData เบราว์เซอร์จะใส่ multipart boundary ให้อัตโนมัติ\n    });\n\n    if (res.status === 201) {\n      alert('เพิ่มหนังสือสำเร็จ!');\n      form.reset();\n      closeModal();\n      loadBooks();\n    } else {\n      const errData = await res.json();\n      alert('เกิดข้อผิดพลาด: ' + (errData.message || JSON.stringify(errData.errors)));\n    }\n  } catch (error) {\n    console.error('Create error:', error);\n    alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');\n  }\n}",
        "lang": "javascript",
        "file": "frontend/script.js"
      },
      {
        "step": "4.4",
        "title": "แก้ไขข้อมูลหนังสือ (เทคนิค _method=PUT สำคัญมาก)",
        "description": "PHP ไม่รองรับการอ่าน Multipart Form เมื่อส่งด้วยคำขอ PUT ดังนั้นต้องส่งเป็น POST แล้วแนบ _method=PUT ใน FormData",
        "badge": "Laravel Pro-Tip",
        "code": "async function handleUpdateBook(event, bookId) {\n  event.preventDefault();\n  const form = event.target;\n  const formData = new FormData(form);\n  \n  // [สำคัญที่สุด] หลอก Laravel ให้รู้ว่าเป็นคำขอ PUT ผ่าน POST\n  formData.append('_method', 'PUT');\n  \n  const isAvailableCheckbox = form.querySelector('[name=\"is_available\"]');\n  formData.set('is_available', isAvailableCheckbox && isAvailableCheckbox.checked ? '1' : '0');\n\n  try {\n    // ส่งด้วย method POST เสมอเพื่อให้อัปโหลดไฟล์สำเร็จ\n    const res = await fetch(`${API_BASE}/books/${bookId}`, {\n      method: 'POST',\n      body: formData\n    });\n\n    if (res.status === 200) {\n      alert('แก้ไขข้อมูลสำเร็จ!');\n      closeModal();\n      loadBooks();\n    } else {\n      const errData = await res.json();\n      alert('เกิดข้อผิดพลาด: ' + (errData.message || JSON.stringify(errData.errors)));\n    }\n  } catch (error) {\n    console.error('Update error:', error);\n  }\n}",
        "lang": "javascript",
        "file": "frontend/script.js"
      },
      {
        "step": "4.5",
        "title": "ลบข้อมูลหนังสือ (DELETE /api/books/:id)",
        "description": "แสดง Confirm Dialog ก่อนส่งคำขอลบไปยัง Backend พร้อมอัปเดตตารางเมื่อสำเร็จ",
        "badge": "JavaScript",
        "code": "async function deleteBook(id) {\n  if (!confirm(`คุณต้องการลบหนังสือรหัส ${id} ใช่หรือไม่?`)) {\n    return;\n  }\n\n  try {\n    const res = await fetch(`${API_BASE}/books/${id}`, {\n      method: 'DELETE'\n    });\n\n    if (res.status === 200) {\n      alert('ลบหนังสือสำเร็จ');\n      loadBooks();\n    } else if (res.status === 404) {\n      alert('ไม่พบข้อมูลหนังสือเล่มนี้ในระบบ');\n    } else {\n      alert('ไม่สามารถลบข้อมูลได้');\n    }\n  } catch (error) {\n    console.error('Delete error:', error);\n  }\n}",
        "lang": "javascript",
        "file": "frontend/script.js"
      },
      {
        "step": "4.6",
        "title": "พรีวิวรูปภาพปกก่อนอัปโหลด (Image Preview Hook)",
        "description": "เมื่อผู้ใช้เลือกไฟล์ปก แสดงรูปตัวอย่างทันทีก่อนกดยืนยันฟอร์ม",
        "badge": "UI Helper",
        "code": "function setupImagePreview(fileInputId, previewImgId) {\n  const input = document.getElementById(fileInputId);\n  const preview = document.getElementById(previewImgId);\n  if (!input || !preview) return;\n\n  input.addEventListener('change', function () {\n    const file = this.files[0];\n    if (file) {\n      const reader = new FileReader();\n      reader.onload = function (e) {\n        preview.src = e.target.result;\n        preview.style.display = 'block';\n      };\n      reader.readAsDataURL(file);\n    } else {\n      preview.src = '';\n      preview.style.display = 'none';\n    }\n  });\n}",
        "lang": "javascript",
        "file": "frontend/script.js"
      }
    ]
  },
  {
    "id": "module-openapi",
    "title": "05. OpenAPI / Swagger & Postman Automation",
    "tag": "SWAGGER & CODE GEN",
    "description": "วิธีแปลง Swagger / OpenAPI Document เป็นโค้ด Backend & Frontend โดยอัตโนมัติใน 1-2 นาทีโดยไม่ต้องใช้ AI",
    "steps": [
      {
        "step": "5.1",
        "title": "เทคนิคที่ 1: Postman Import & Code Snippet Generator (เร็วสุด 30 วินาที)",
        "description": "วิธีที่ง่ายที่สุดในห้องสอบ: นำเข้าไฟล์ Swagger สู่ Postman แล้วกดดูโค้ดสำเร็จรูปได้ทุกภาษา",
        "badge": "Postman GUI",
        "code": "# ขั้นตอนใน Postman:\n1. เปิดโปรแกรม Postman -> กดปุ่ม 'Import' ที่มุมซ้ายบน\n2. ลากไฟล์ swagger.json หรือวาง URL ของ Swagger จากอาจารย์ลงไป\n3. Postman จะสร้าง Collection ที่รวมทุก Endpoints (GET, POST, PUT, DELETE) พร้อม Body จำลองให้อัตโนมัติ\n4. คลิกที่ Request ตัวที่ต้องการ (เช่น POST /books)\n5. มองที่แถบเครื่องมือด้านขวาสุด คลิกที่ไอคอนโค้ด `</>` (Code Snippet)\n6. เลือกภาษาเป็น 'JavaScript - Fetch' หรือ 'JavaScript - Axios'\n7. กดปุ่ม Copy ไปวางในไฟล์ JS ของเราได้ทันที!",
        "lang": "markdown",
        "file": "Postman Application Guide"
      },
      {
        "step": "5.2",
        "title": "เทคนิคที่ 2: ใช้ Swagger Editor ในการ Gen Server / Client",
        "description": "เข้าเว็บ Swagger Editor นำเข้า JSON/YAML แล้วสั่ง Export เป็นโค้ด Laravel หรือ JavaScript",
        "badge": "Web Tool",
        "code": "# ขั้นตอนใน Swagger Editor:\n1. เข้าเว็บไซต์ https://editor.swagger.io (หากอนุญาตให้เปิดเว็บ)\n2. ไปที่เมนู File -> Import File หรือ Paste swagger.json ของอาจารย์\n3. เมนู 'Generate Server' -> เลือก 'php-laravel'\n   -> จะได้ไฟล์ Zip โครงสร้าง Controller, Model, และ Routes สำหรับ Laravel ทันที!\n4. เมนู 'Generate Client' -> เลือก 'javascript' หรือ 'typescript-fetch'\n   -> จะได้ไฟล์ฟังก์ชันเรียก API สำเร็จรูปโดยไม่ต้องเขียนคำขอเอง",
        "lang": "markdown",
        "file": "Swagger Editor Guide"
      },
      {
        "step": "5.3",
        "title": "เทคนิคที่ 3: รัน CLI ผ่าน Terminal (OpenAPI Generator CLI)",
        "description": "คำสั่ง Terminal รวดเร็วสำหรับนักพัฒนา โดยใช้ npx รัน openapi-generator ไม่ต้องลงโปรแกรมล่วงหน้า",
        "badge": "CLI Generator",
        "code": "# 1. คำสั่ง Gen โครงสร้าง Backend สำหรับ Laravel\nnpx @openapitools/openapi-generator-cli generate \\\n  -i swagger.json \\\n  -g php-laravel \\\n  -o ./generated-laravel-api\n\n# 2. คำสั่ง Gen JavaScript / TypeScript Fetch Client สำหรับหน้าบ้าน\nnpx @openapitools/openapi-generator-cli generate \\\n  -i swagger.json \\\n  -g typescript-fetch \\\n  -o ./generated-frontend-client",
        "lang": "bash",
        "file": "Terminal Command"
      },
      {
        "step": "5.4",
        "title": "เทคนิคการแกะ Data Schema จาก Swagger โดยตรง",
        "description": "วิธีเปิดดูฟิลด์ที่ Required และ Type ของข้อมูลเพื่อเอามาใส่ใน Form Validation ได้ถูกต้อง 100%",
        "badge": "Schema Inspection",
        "code": "# ในไฟล์ swagger.json ให้ค้นหาคำว่า 'components' หรือ 'definitions'\n# จะพบโครงสร้างที่อาจารย์กำหนด เช่น:\n# \"Book\": {\n#    \"required\": [\"title\", \"author\", \"published_year\", \"category_id\"],\n#    \"properties\": {\n#       \"id\": { \"type\": \"integer\" },\n#       \"title\": { \"type\": \"string\" },\n#       \"author\": { \"type\": \"string\" },\n#       \"published_year\": { \"type\": \"integer\" },\n#       \"is_available\": { \"type\": \"boolean\" }\n#    }\n# }\n# นำฟิลด์เหล่านี้มาใส่ใน $request->validate([...]) ใน Laravel ได้ทันที!",
        "lang": "json",
        "file": "Swagger Inspection Tip"
      }
    ]
  },
  {
    "id": "module-troubleshooting",
    "title": "06. กับดักยอดฮิต & เช็กลิสต์ตรวจผลสอบ",
    "tag": "PITFALLS & CHECKLIST",
    "description": "วิธีแก้บั๊กฉุกเฉินที่มักเจอในห้องสอบ (CORS, Storage 404, PHP PUT Multipart, CSRF 419) พร้อมเช็กลิสต์ก่อนส่งงาน",
    "steps": [
      {
        "step": "6.1",
        "title": "Trap 1: ติดปัญหา CORS Policy (หน้าบ้านยิง API ไม่เข้า)",
        "description": "เมื่อยิง fetch แล้วเจอสีแดงใน Console แจ้ง Access to fetch at '...' has been blocked by CORS policy",
        "badge": "CORS Fix",
        "code": "# สำหรับ Laravel 11 ถ้ายังไม่มี config/cors.php ให้ดึงออกมาด้วยคำสั่ง:\nphp artisan config:publish cors\n\n# จากนั้นเปิดไฟล์ config/cors.php และตั้งค่าดังนี้:\nreturn [\n    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*'],\n    'allowed_methods' => ['*'],\n    'allowed_origins' => ['*'],\n    'allowed_origins_patterns' => [],\n    'allowed_headers' => ['*'],\n    'exposed_headers' => [],\n    'max_age' => 0,\n    'supports_credentials' => false,\n];\n\n# อย่าลืมรันคำสั่งเคลียร์แคช:\nphp artisan config:clear",
        "lang": "php",
        "file": "config/cors.php"
      },
      {
        "step": "6.2",
        "title": "Trap 2: รูปอัปโหลดติด แต่เปิดดูแล้วขึ้น 404 Not Found",
        "description": "เกิดจากยังไม่ได้สร้าง Symlink จาก storage/app/public ไปยัง public/storage หรือ Symlink เสียหาย",
        "badge": "Storage Fix",
        "code": "# 1. ถ้าในโฟลเดอร์ public/ มีโฟลเดอร์หรือชอร์ตคัตชื่อ 'storage' อยู่ ให้ลบทิ้งก่อน\n# 2. จากนั้นรันคำสั่งเชื่อมโยงใหม่ใน Terminal:\nphp artisan storage:link\n\n# 3. ตรวจสอบในไฟล์ .env ว่า APP_URL ตรงกับพอร์ตที่รันอยู่หรือไม่ เช่น:\n# APP_URL=http://localhost:8000\n\n# 4. ใน Controller ให้ส่ง URL ของรูปด้วย asset('storage/' . $path)",
        "lang": "bash",
        "file": "Terminal Command"
      },
      {
        "step": "6.3",
        "title": "Trap 3: แก้ไขข้อมูลหนังสือที่มีการเปลี่ยนรูปภาพแล้วข้อมูลไม่เข้า",
        "description": "PHP จะไม่อ่าน multipart/form-data เมื่อส่งด้วย Method PUT ทำให้ $request->file('cover_image') ได้ค่า null",
        "badge": "PHP Quirks",
        "code": "// วิธีแก้ใน JavaScript:\n// 1. ให้เปลี่ยนคำขอ Fetch ให้ส่งด้วย method: 'POST'\n// 2. ให้ append('_method', 'PUT') เข้าไปใน FormData\n\nconst formData = new FormData(editForm);\nformData.append('_method', 'PUT'); // สำคัญมาก!\n\nfetch(`http://localhost:8000/api/books/${id}`, {\n  method: 'POST', // ต้องเป็น POST ห้ามเป็น PUT\n  body: formData\n});",
        "lang": "javascript",
        "file": "frontend/script.js"
      },
      {
        "step": "6.4",
        "title": "Trap 4: ติด Error 419 (CSRF Token Mismatch)",
        "description": "เกิดจากการส่งคำขอไปยัง routes/web.php ซึ่งมีการบังคับตรวจ CSRF token",
        "badge": "Route Fix",
        "code": "// วิธีแก้: ย้ายและตรวจสอบให้แน่ใจว่า Route ของเราอยู่ใน routes/api.php\n// ทุก Route ภายใต้ routes/api.php จะมี Prefix เป็น /api/... เสมอ\n// และ Laravel จะปิดการตรวจ CSRF Token ให้โดยอัตโนมัติ!\n\n// ตัวอย่าง URL ที่ถูกต้อง:\n// http://localhost:8000/api/books\n// http://localhost:8000/api/categories",
        "lang": "javascript",
        "file": "routes/api.php"
      },
      {
        "step": "6.5",
        "title": "Trap 5: ฐานข้อมูลเชื่อมต่อไม่ติด (Connection Refused)",
        "description": "เปิดโปรเจกต์แล้วแจ้ง SQLSTATE[HY000] [2002] No connection could be made",
        "badge": "Laragon Fix",
        "code": "# 1. เปิดโปรแกรม Laragon ขึ้นมาแล้วคลิกที่ปุ่ม 'Start All'\n# 2. ดูว่าปุ่ม MySQL มีไฟเขียวขึ้นและแสดง Port: 3306\n# 3. ตรวจสอบไฟล์ .env:\n#    DB_HOST=127.0.0.1 (แนะนำให้ใช้ 127.0.0.1 แทนคำว่า localhost)\n#    DB_PORT=3306\n#    DB_USERNAME=root\n#    DB_PASSWORD= (เว้นว่างไว้สำหรับ Laragon)\n# 4. ทดสอบด้วย: php artisan migrate:status",
        "lang": "bash",
        "file": ".env"
      }
    ]
  }
];
