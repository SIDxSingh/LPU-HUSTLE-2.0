# LpuHustle — Your Academic Hustle, Simplified.

> **A full-stack MERN academic resource-sharing platform for university students to discover, view, download, and contribute notes, PYQs, assignments, and study materials.**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Stack: MERN](https://img.shields.io/badge/Stack-MERN-61dafb)](https://reactjs.org/)
[![Platform: University](https://img.shields.io/badge/Platform-University%20Students-brand)](#)

---

## 📚 What Is LpuHustle?

LpuHustle is a peer-to-peer academic content platform specifically built for university students. It solves the common problem of scrambling across WhatsApp groups and scattered Google Drives for notes before exams.

**Key features:**
- 📄 **Semester-wise** resource browsing (Semesters 1–8)
- 🔍 **Smart Search** across title, subject, course code, and description
- ✅ **Admin Moderation** — every resource passes a quality review before going live
- 📊 **Student Dashboard** — track contribution status: Approved / Pending / Rejected
- 🔐 **JWT Authentication** — secure sessions for students and admins
- ☁️ **Cloudinary Storage** — cloud file storage (with automatic local dev fallback)
- 📱 **Fully Responsive** — desktop, tablet, and mobile-friendly

---

## 🚀 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS 3, React Router v6, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, REST API, JWT, bcryptjs |
| **Database** | MongoDB with Mongoose ODM |
| **File Storage** | Cloudinary (auto-fallback to local /uploads in dev) |
| **Dev Database** | `mongodb-memory-server` (zero-config in-memory MongoDB) |
| **Deployment** | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## 📁 Project Structure

```
lpu-hustle/
│
├── client/                       # React 18 + Vite + Tailwind Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, EmptyState, LoadingSkeleton
│   │   │   ├── resources/        # ResourceCard, ResourceFilters, FilePreviewModal, ReportModal
│   │   │   ├── admin/            # StatCards, PendingTable, RejectModal, UserTable
│   │   │   └── layout/           # MainLayout, ProtectedRoute, AdminRoute
│   │   ├── context/              # AuthContext (JWT), ToastContext (notifications)
│   │   ├── pages/                # Home, Resources, ResourceDetail, Semesters, SemesterDetail,
│   │   │                         # SubjectDetail, Upload, Dashboard, AdminDashboard, Login, Register
│   │   ├── services/             # api.js, authService, resourceService, adminService
│   │   └── utils/                # constants.js, formatters.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                       # Express.js + Mongoose Backend
│   ├── config/
│   │   ├── db.js                 # MongoDB Atlas connection (+ in-memory fallback)
│   │   └── cloudinary.js         # Cloudinary v2 (+ local disk fallback)
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe, UpdateProfile
│   │   ├── resourceController.js # CRUD, download, report, featured, semester summary
│   │   ├── userController.js     # Dashboard profile, user resources
│   │   └── adminController.js    # Stats, pending, approve, reject, delete, users
│   ├── middleware/
│   │   ├── authMiddleware.js     # protect, authorize, optionalAuth
│   │   ├── uploadMiddleware.js   # Multer: file type + 15MB size limit
│   │   └── errorMiddleware.js    # Centralized error handling (404 + 500)
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt password hashing
│   │   ├── Resource.js           # Resource schema with status + search indexes
│   │   └── Report.js             # Community report schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resourceRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── seed.js                   # Database seeder with demo accounts + 19 resources
│   ├── server.js                 # Express app entry point
│   └── package.json
│
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json                  # Root-level convenience scripts
└── README.md
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js 18+ (v24 recommended)
- npm 10+
- (Optional) MongoDB Atlas account for persistent cloud database
- (Optional) Cloudinary account for persistent file storage

### Step 1: Clone the repository

```bash
git clone https://github.com/your-username/lpu-hustle.git
cd lpu-hustle
```

### Step 2: Install all dependencies

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

Or use the root script:
```bash
npm run install:all
```

### Step 3: Configure environment variables

```bash
# Copy the example file
cp .env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB - Leave empty to use automatic in-memory dev fallback
MONGO_URI=

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRES_IN=30d

# Cloudinary (optional for local dev - auto-falls back to local storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

> **💡 Zero-Config Dev Mode**: If `MONGO_URI` is empty, the server automatically starts an in-memory MongoDB instance using `mongodb-memory-server`. No MongoDB installation required!

### Step 4: Start the backend server

```bash
cd server
npm run dev
```

The server will:
1. Start on `http://localhost:5000`
2. Launch in-memory MongoDB automatically
3. **Auto-seed** demo accounts and 19 sample academic resources

### Step 5: Start the frontend development server

```bash
cd client
npm run dev
```

Frontend will start on **http://localhost:5173**

---

## 🗄️ Database Setup

### Option A: Zero-Config (In-Memory, for Development)

No setup needed. Leave `MONGO_URI` empty in `.env`. The server auto-creates an in-memory database with seeded demo data on every restart.

> **Note**: Data is lost on server restart. Run `npm run seed` separately to manually re-seed.

### Option B: MongoDB Atlas (Recommended for Persistent Data)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist your IP (or allow all: `0.0.0.0/0`)
4. Copy the connection string to `MONGO_URI` in `server/.env`
5. Run the seeder: `npm run seed` (from the server directory)

---

## ☁️ Cloudinary Setup (Optional)

Without Cloudinary, uploaded files are stored locally in `server/uploads/` and served via Express. This works for local development.

For production with persistent cloud storage:

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard and copy: **Cloud Name**, **API Key**, **API Secret**
3. Add them to `server/.env`
4. Restart the server

---

## 🌱 Seeding Demo Data

```bash
cd server
npm run seed
```

This creates:

| Account | Email | Password | Role |
|---------|-------|----------|------|
| 🛡️ Administrator | `siddharthwizard123@gmail.com` | `Sidsez@12` | admin |
| 👤 Rahul Sharma | `rahul.sharma@lpuhustle.com` | `Student@123` | user |
| 👤 Priya Patel | `priya.patel@lpuhustle.com` | `Student@123` | user |
| 👤 Aman Verma | `aman.verma@lpuhustle.com` | `Student@123` | user |

Plus **19 academic resources** across all semesters including:
- ✅ **15 Approved** (publicly visible)
- ⏳ **3 Pending** (in admin review queue for demo)
- ❌ **1 Rejected** (with feedback reason)

---

## 🔑 Creating an Admin User Manually

After registering a normal account, update the role in MongoDB directly:

```javascript
// Using MongoDB shell or Compass
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 🌐 API Endpoints Reference

### Authentication

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register new student account | Public |
| POST | `/api/auth/login` | Login + receive JWT | Public |
| GET | `/api/auth/me` | Get current user session | Protected |
| PUT | `/api/auth/profile` | Update profile | Protected |

### Resources

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/resources` | Get approved resources (search + filter) | Public |
| GET | `/api/resources/featured` | Featured (popular + recent) | Public |
| GET | `/api/resources/semesters-summary` | Semester resource counts | Public |
| GET | `/api/resources/subjects` | Subject catalog | Public |
| GET | `/api/resources/:id` | Get resource by ID | Public |
| POST | `/api/resources` | Upload resource (creates pending) | Protected |
| GET | `/api/resources/:id/download` | Download + increment counter | Public |
| POST | `/api/resources/:id/report` | Flag resource for review | Protected |

### User Dashboard

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/users/profile` | Get profile with stats | Protected |
| GET | `/api/users/resources` | Get own submissions | Protected |
| DELETE | `/api/users/resources/:id` | Delete own resource | Protected |

### Admin

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/admin/stats` | Platform-wide analytics | Admin |
| GET | `/api/admin/resources/pending` | Pending submissions queue | Admin |
| GET | `/api/admin/resources` | All resources (all statuses) | Admin |
| PATCH | `/api/admin/resources/:id/approve` | Approve + publish | Admin |
| PATCH | `/api/admin/resources/:id/reject` | Reject with reason | Admin |
| DELETE | `/api/admin/resources/:id` | Hard delete | Admin |
| GET | `/api/admin/users` | Student directory | Admin |
| GET | `/api/admin/reports` | Flagged content reports | Admin |

---

## 🔒 Security Features

- ✅ **bcryptjs** — Password hashing with salt rounds
- ✅ **JWT** — Signed tokens with expiry (30 days default)
- ✅ **Role-Based Authorization** — Backend enforced (not just frontend)
- ✅ **Input Validation** — Server-side field checks
- ✅ **Multer File Guard** — MIME type and extension validation, 15MB max
- ✅ **Helmet.js** — HTTP security headers
- ✅ **CORS** — Configured for allowed origins
- ✅ **Environment Variables** — No secrets in source code
- ✅ **Centralized Error Handler** — Consistent error responses

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd client
npm run build
# Deploy dist/ directory to Vercel
```

Or connect GitHub repo to Vercel with:
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Root directory**: `client`

### Backend (Render)

1. Create a new Web Service on [Render](https://render.com/)
2. Set **Root Directory** to `server`
3. **Build command**: `npm install`
4. **Start command**: `node server.js`
5. Add environment variables from `.env.example`

### Database (MongoDB Atlas)

Set `MONGO_URI` to your Atlas connection string in Render's environment variables.

---

## 📷 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero, search, semester grid, featured resources |
| Resources | `/resources` | Full catalog with search + filter + sort + pagination |
| Resource Detail | `/resources/:id` | Full metadata, in-browser preview, download |
| Semesters | `/semesters` | Semester 1–8 overview cards |
| Semester Detail | `/semesters/:semId` | Subject pills + resources filtered by semester |
| Subject Detail | `/subjects/:subjectName` | Resources grouped by subject |
| Upload | `/upload` | Drag-and-drop resource upload form |
| Dashboard | `/dashboard` | Student contribution tracker and status cards |
| Admin Dashboard | `/admin` | Moderation queue, stats, catalog management |
| Login | `/login` | Email/password authentication (quick demo buttons!) |
| Register | `/register` | Student account creation |

---

## 🤝 Contributing Resources (Workflow)

```
Student Uploads → status: 'pending' → NOT visible publicly
        ↓
Admin Reviews (previews document)
        ↓
[Approve] → status: 'approved' → LIVE on public pages ✅
[Reject]  → status: 'rejected' → Feedback sent to student ❌
```

---

## 📝 License

ISC License — see [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for university students by LpuHustle Team*
