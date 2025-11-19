# **Lamigo – Aplikasi Pemesanan Tiket Wisata Lampung**

Lamigo adalah aplikasi pemesanan tiket wisata untuk berbagai destinasi di Lampung.
Project terdiri dari **Backend (API)**, **Frontend Web**, dan **Frontend Mobile**.

---

## 🚀 **Tech Stack**

### **Backend**

- **Express** (TypeScript)
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**

### **Frontend Web**

- **Next.js**
- **Tailwind CSS**
- **Shadcn/UI**

### **Frontend Mobile**

- **React Native (Expo)**

---

## 📁 **Project Structure**

```
/lamigo-backend
/lamigo-web
/lamigo-mobile
```

---

# 🛠️ **Backend Setup (Express + TypeScript + Prisma + PostgreSQL)**

### Clone Repository

```bash
git clone https://github.com/megustaSzy/project-web-mobile-api.git
cd api
```

### **1. Set up API

```bash
cd api
```

### Install Dependencies

```bash
npm i
```

### Setup Environment

Rename `.env.example` → `.env` lalu isi:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/db_projectlamigo?schema=public"
JWT_SECRET="your-secret-key"
```

### Run Migrations

```bash
npm run migrate
```

### **5. Start Development Server**

```bash
npm run dev
```

---

# 🌐 **Frontend Web Setup (Next.js + Tailwind + Shadcn/UI)**

### **1. Clone Repository**

```bash
git clone https://github.com/megustaSzy/project-web-mobile-api.git
cd web
```

```bash
cd lamigo-frontend-web
```

### **2. Install Dependencies**

```bash
npm i
```

### **3. Setup Environment**

Rename `.env.example` → `.env` lalu isi:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### **4. Start Development Server**

```bash
npm run dev
```

---

# 📱 **Mobile App Setup (React Native / Expo)**

### **1. Clone Repository**

```bash
git clone https://github.com/megustaSzy/project-web-mobile-api.git
cd mobile
```

### **2. Install Dependencies**

```bash
npm i
```

### **3. Setup Environment**

Rename `.env.example` → `.env` lalu isi:

```env
API_URL=http://localhost:5000
```

### **4. Run App**

```bash
npx expo start
```

---

# ⭐ **Features**

- Pemesanan tiket wisata Lampung secara online
- Autentikasi pengguna menggunakan JWT
- Kelola jadwal, destinasi, pembayaran, dan tiket
- Dashboard admin berbasis web
- Aplikasi mobile untuk user (React Native)
