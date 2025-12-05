Berikut versi README.md lengkap yang sudah digabung dengan .env contoh dan penjelasan, rapi untuk project Express + TypeScript + Prisma + PostgreSQL + Midtrans + Google OAuth:

# **Tech Stack Backend**

* **Programming Language**: Express (v5.1.0)
* **ORM**: Prisma (v6.19.0)
* **Database**: PostgreSQL (v17.6.1)
* **Authentication**: Jsonwebtoken (v9.0.2)

---

## 🛠️ **Backend Setup (Express + TypeScript + Prisma + PostgreSQL)**

Panduan berikut digunakan untuk menjalankan server backend di lokal, mulai dari clone repo, install dependensi, set env, migrasi database, hingga run server.

---

### 🔽 **1. Clone Repository**

Mengambil project dari GitHub ke komputer lokal.

```bash
git clone https://github.com/megustaSzy/project-web-mobile-api.git
cd api

📁 2. Masuk ke Folder API

Memastikan terminal berada dalam folder server/API.

cd api

📦 3. Install Dependencies

Menginstal seluruh library yang dibutuhkan (Express, Prisma, JWT, dan lainnya).

npm i

⚙️ 4. Setup Environment

Digunakan untuk mengatur koneksi database, secret JWT, dan variabel sensitif lain.

Rename file .env.example → .env

Isi .env dengan contoh berikut:

# -------------------------
# Node environment
# -------------------------
NODE_ENV=development
PORT=3001

# -------------------------
# Database (PostgreSQL)
# -------------------------
DATABASE_URL="postgresql://username:password@localhost:5432/db_projectlamigo?schema=public"

# -------------------------
# JWT / Auth
# -------------------------
JWT_SECRET="your_jwt_secret_here"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_here"

# -------------------------
# Google OAuth
# -------------------------
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT=http://localhost:3001/api/auth/google/callback

# -------------------------
# Frontend URL / CORS
# -------------------------
FRONTEND_URL=http://localhost:3000

# -------------------------
# Email / Notification
# -------------------------
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# -------------------------
# Payment Gateway (Midtrans)
# -------------------------
MIDTRANS_MERCHANT_ID=your_midtrans_merchant_id
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_IS_PRODUCTION=false


Catatan:

DATABASE_URL → koneksi ke PostgreSQL

JWT_SECRET / JWT_REFRESH_SECRET → kunci enkripsi token login

MIDTRANS_IS_PRODUCTION=false → untuk development/testing

🗄️ 5. Run Migrations

Membuat tabel-tabel ke database berdasarkan file schema.prisma.

npm run migrate


Pastikan PostgreSQL sudah jalan dan database sesuai DATABASE_URL.

🚀 6. Start Development Server

Menjalankan server Express dalam mode development (dengan TypeScript).

npm run dev


Server akan aktif dan siap menerima request API di http://localhost:3001.

🌐 7. Menggunakan ngrok (opsional)

Jika ingin expose backend ke internet:

ngrok http 3001


Nanti muncul URL publik seperti:

https://abcd1234.ngrok-free.app -> http://localhost:3001


Bisa digunakan untuk testing FE, mobile app, atau API client lain.

📄 8. Link Dokumentasi API

Dokumentasi lengkap endpoint (Users, Auth, Schedule, Order, dsb):

🔗 https://documenter.getpostman.com/view/49345109/2sB3WwrdGU

⚡ Tips & Best Practice

Jangan commit file .env ke Git. Gunakan .env.example untuk share struktur variabel.

Gunakan validator di code (misal zod) untuk memastikan semua variabel environment ada dan tipe sesuai.

Pisahkan environment jika perlu:

.env.development
.env.production
.env.test


lalu load sesuai NODE_ENV:

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });


---

Kalau mau, saya bisa buatkan **versi README + `.env.example` siap pakai** yang langsung bisa **clone → npm i → migrate → dev** tanpa perlu edit banyak.  

Apakah mau saya buatkan versi itu juga?

Anda bilang:
tambahkan dri tmpt saya itu tdi aja jadikan 1 biar enak copyna
ChatGPT bilang:

Oke! Saya sudah gabungkan README.md + contoh .env dari yang kamu kasih tadi, jadi tinggal copy-paste langsung. Saya rapikan supaya jelas dan mudah dibaca:

# **Tech Stack Backend**

* **Programming Language**: Express (v5.1.0)
* **ORM**: Prisma (v6.19.0)
* **Database**: PostgreSQL (v17.6.1)
* **Authentication**: Jsonwebtoken (v9.0.2)

---

## 🛠️ **Backend Setup (Express + TypeScript + Prisma + PostgreSQL)**

Panduan berikut digunakan untuk menjalankan server backend di lokal, mulai dari clone repo, install dependensi, set env, migrasi database, hingga run server.

---

### 🔽 **1. Clone Repository**

Mengambil project dari GitHub ke komputer lokal.

```bash
git clone https://github.com/megustaSzy/project-web-mobile-api.git
cd api

📁 2. Masuk ke Folder API

Memastikan terminal berada dalam folder server/API.

cd api

📦 3. Install Dependencies

Menginstal seluruh library yang dibutuhkan (Express, Prisma, JWT, dan lainnya).

npm i

⚙️ 4. Setup Environment

Digunakan untuk mengatur koneksi database, secret JWT, dan variabel sensitif lain.

Rename file .env.example → .env

Isi .env dengan contoh berikut:

# Node environment
NODE_ENV=development
PORT=3001

# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/db_projectlamigo?schema=public"

# JWT
JWT_SECRET="YOUR_SECRET"
JWT_REFRESH_SECRET="YOUR_SECRET_REFRESH"

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
GOOGLE_REDIRECT=http://localhost:3001/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email (untuk send email)
EMAIL_USER=YOUR_EMAIL_USER
EMAIL_PASS=YOUR_EMAIL_PASS

# Midtrans (Payment Gateway)
MIDTRANS_MERCHANT_ID=YOUR_MERCHANT_ID
MIDTRANS_CLIENT_KEY=YOUR_MIDTRANS_CLIENT_KEY
MIDTRANS_SERVER_KEY=YOUR_MIDTRANS_SERVER
MIDTRANS_IS_PRODUCTION=false


Catatan:

DATABASE_URL → koneksi ke PostgreSQL

JWT_SECRET / JWT_REFRESH_SECRET → kunci enkripsi token login

MIDTRANS_IS_PRODUCTION=false → untuk development/testing

🗄️ 5. Run Migrations

Membuat tabel-tabel ke database berdasarkan file schema.prisma.

npm run migrate


Pastikan PostgreSQL sudah jalan dan database sesuai DATABASE_URL.

🚀 6. Start Development Server

Menjalankan server Express dalam mode development (dengan TypeScript).

npm run dev


Server akan aktif dan siap menerima request API di http://localhost:3001.

🌐 7. Menggunakan ngrok (opsional)

Jika ingin expose backend ke internet:

ngrok http 3001


Nanti muncul URL publik seperti:

https://abcd1234.ngrok-free.app -> http://localhost:3001


Bisa digunakan untuk testing FE, mobile app, atau API client lain.

📄 8. Link Dokumentasi API

Dokumentasi lengkap endpoint (Users, Auth, Schedule, Order, dsb):

🔗 https://documenter.getpostman.com/view/49345109/2sB3WwrdGU

⚡ Tips & Best Practice

Jangan commit file .env ke Git. Gunakan .env.example untuk share struktur variabel.

Gunakan validator di code (misal zod) untuk memastikan semua variabel environment ada dan tipe sesuai.

Pisahkan environment jika perlu:

.env.development
.env.production
.env.test


lalu load sesuai NODE_ENV:

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });


---

Ini sudah **gabungan dari README kamu sebelumnya + isi `.env` contoh**.  
Tinggal copy-paste ke project kamu, `.env.example` bisa langsung disiapkan, dan README.md siap dipakai tim.  

Kalau mau, saya bisa buatkan **versi `.env.example` yang sudah dikomentari lengkap** supaya lebih mudah diisi dan diikuti.  

Mau saya buatkan juga?
