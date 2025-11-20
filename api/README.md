# **Backend**

* **Programming Language**: Express (v5.1.0) — *Framework Node.js untuk membangun REST API.*
* **ORM**: Prisma (v6.19.0) — *Mengelola database menggunakan model schema, migration, dan query builder.*
* **Database**: PostgreSQL (v17.6.1) — *Penyimpanan data utama aplikasi.*
* **Authentication**: Jsonwebtoken (v9.0.2) — *Digunakan untuk sistem login & proteksi endpoint menggunakan token.*

---

## 🛠️ **Backend Setup (Express + TypeScript + Prisma + PostgreSQL)**

Panduan berikut digunakan untuk menjalankan server backend di lokal, mulai dari clone repo, install dependensi, set env, migrasi database, hingga run server.

---

### 🔽 **1. Clone Repository**

Mengambil project dari GitHub ke komputer lokal.

```bash
git clone https://github.com/megustaSzy/project-web-mobile-api.git
cd api
```

---

### 📁 **2. Masuk ke Folder API**

Memastikan terminal berada dalam folder server/API.

```bash
cd api
```

---

### 📦 **3. Install Dependencies**

Menginstal seluruh library yang dibutuhkan (Express, Prisma, JWT, dan lainnya).

```bash
npm i
```

---

### ⚙️ **4. Setup Environment**

Digunakan untuk mengatur **koneksi database**, **secret JWT**, dan variabel sensitif lain.

Rename file:

`.env.example` → `.env`

Lalu isi:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/db_projectlamigo?schema=public"
JWT_SECRET="your-secret-key"
```

* `DATABASE_URL` → Koneksi PostgreSQL
* `JWT_SECRET` → Kunci enkripsi untuk token login

---

### 🗄️ **5. Run Migrations**

Membuat tabel-tabel ke database berdasarkan file `schema.prisma`.

```bash
npm run migrate
```

---

### 🚀 **6. Start Development Server**

Menjalankan server Express dalam mode development (dengan TypeScript).

```bash
npm run dev
```

Server akan aktif dan siap menerima request API.

---

### 📄 **Link Dokumentasi API**

Dokumentasi lengkap endpoint (Users, Auth, Schedule, Order, dsb):

🔗 [https://documenter.getpostman.com/view/49345109/2sB3WwrdGU](https://documenter.getpostman.com/view/49345109/2sB3WwrdGU)

---

Kalau mau, saya bisa bikin versi **lebih estetik**, **lebih ringkas**, atau **lebih teknis untuk developer**.
