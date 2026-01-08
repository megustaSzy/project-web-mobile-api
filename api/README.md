# **Tech Stack Backend**

* **Programming Language**: Express (v5.1.0)
* **ORM**: Prisma (v6.19.0)
* **Database**: PostgreSQL (v17.6.1)
* **Authentication**: Jsonwebtoken (v9.0.2)

---

## 🛠️ **Backend Setup (Express + TypeScript + Prisma + PostgreSQL)**

Panduan berikut digunakan untuk menjalankan server backend di lokal, mulai dari clone repo, install dependensi, set env, migrasi database, hingga run server.

---

### 🔽 1. Clone Repository

Mengambil project dari GitHub ke komputer lokal.

```bash
git clone https://github.com/megustaSzy/project-web-mobile-api.git
cd api
```

📁 2. Masuk ke Folder API

Memastikan terminal berada dalam folder server/API.

```bash
cd api
```

📦 3. Install Dependencies

Menginstal seluruh library yang dibutuhkan (Express, Prisma, JWT, dan lainnya).

```bash
npm i
```

⚙️ 4. Setup Environment

Digunakan untuk mengatur koneksi database, secret JWT, dan variabel sensitif lain.

Rename file .env.example → .env

Isi .env dengan contoh berikut:


 Node environment
```bash
NODE_ENV=development
PORT=3001
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/db_projectlamigo?schema=public"

# JWT / Auth
JWT_SECRET="YOUR_SECRET"
JWT_REFRESH_SECRET="YOUR_SECRET_REFRESH"

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
GOOGLE_REDIRECT=http://localhost:3001/api/auth/google/callback

# Frontend URL / CORS
FRONTEND_URL=http://localhost:3000

# Email / Notification
EMAIL_USER=YOUR_EMAIL_USER
EMAIL_PASS=YOUR_EMAIL_PASS
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465

# Payment Gateway (Midtrans)
MIDTRANS_MERCHANT_ID=YOUR_MIDTRANS_MERCHANT_ID
MIDTRANS_CLIENT_KEY=YOUR_MIDTRANS_CLIENT_KEY
MIDTRANS_SERVER_KEY=YOUR_MIDTRANS_SERVER_KEY
MIDTRANS_IS_PRODUCTION=false
```

Catatan:

DATABASE_URL → koneksi ke PostgreSQL

JWT_SECRET / JWT_REFRESH_SECRET → kunci enkripsi token login

MIDTRANS_IS_PRODUCTION=false → untuk development/testing

🗄️ 5. Run Migrations

Membuat tabel-tabel ke database berdasarkan file schema.prisma.

```bash
npm run migrate
```

Pastikan PostgreSQL sudah jalan dan database sesuai DATABASE_URL.

🚀 6. Start Development Server

Menjalankan server Express dalam mode development (dengan TypeScript).

```bash
npm run dev
```

Server akan aktif dan siap menerima request API di http://localhost:3001.


📄 8. Link Dokumentasi API

Dokumentasi lengkap endpoint (Users, Auth, Schedule, Order, dsb):

🔗 https://documenter.getpostman.com/view/49345109/2sB3WwrdGU