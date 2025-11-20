### **Backend**

- **Programming Langueage**: Express (v5.1.0)
- **ORM**: Prisma (v6.19.0)
- **Database**: PostgreSQL (v17.6.1)
- **Authentication**: Jsonwebtoken (v9.0.2)


---

# 🛠️ **Backend Setup (Express + TypeScript + Prisma + PostgreSQL)**



### Clone Repository

```bash
git clone https://github.com/megustaSzy/project-web-mobile-api.git
cd api
```

### 1. Set up API

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
### Link Dokumentasi API

https://documenter.getpostman.com/view/49345109/2sB3WwrdGU