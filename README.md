# ⚔️ CyberShield — Scam Detection & Cyber Crime Reporting Platform

CyberShield is a full-stack web application that lets anyone instantly check if a phone number, URL, or UPI ID has been reported as a scam — and file detailed cyber crime complaints that feed a live community intelligence database.

Built with React, Node.js, Express, and MongoDB. Live on the internet.

**Live Demo:** https://cyber-crime-fronten.onrender.com

---

## What It Does

### Public (no login needed)
- **Scam Checker** — search any phone, URL, UPI ID, or email → instant verdict (Safe / Caution / Suspicious / Highly Dangerous) with report count, risk score, locations, and action advice
- **Anonymous Reporting** (`/report`) — report a scam without creating an account. No login barrier
- **Trending Scams** — live feed of most-reported targets and top scam categories from real community data
- **Live Ticker** — scrolling banner on homepage showing recently reported scams in real time
- **Public Scam Pages** — shareable URLs like `/check/9876543210` for any target
- **WhatsApp Share** — one tap to share scam warnings directly on WhatsApp
- **API Docs** (`/api-docs`) — public API documentation for developers to integrate

### For Users (after login)
- File detailed complaints with title, description, scam type, scam target, location, evidence upload
- Real-time AI analysis while typing — detects crime type, risk score, priority
- Track complaint status (Pending → Investigating → Resolved)
- Email notification when admin updates your complaint status
- View all past complaints with status timeline and evidence viewer
- User impact counter — see how many people your reports helped protect
- Profile page — edit name, phone, location, bio, upload profile photo

### For Admins
- Full analytics dashboard — monthly trends, crime type distribution, status breakdown, priority breakdown
- Manage all complaints with filters (priority, status, search, sort) and pagination
- Update complaint status from table or detail modal
- User management page — list all registered users with search and pagination
- CSV export — download all complaints as a spreadsheet
- Critical case alerts — email to admin for high-risk complaints (risk score ≥ 80)
- Status email to user — automatic email when complaint status changes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Recharts, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| File Upload | Multer + Cloudinary |
| Email | Resend API |
| Security | Helmet, CORS, express-rate-limit, express-mongo-sanitize, express-validator |

---

## Project Structure

```
cyber-crime-portal/
├── backend/
│   ├── config/          # DB connection + Cloudinary + auto-seed
│   ├── controllers/     # complaintController, scamController
│   ├── middleware/       # auth, error, upload (images + PDF + DOC)
│   ├── models/          # User, Complaint, Scam
│   ├── routes/          # userRoutes, complaintRoutes, scamRoutes
│   ├── services/        # complaintService (business logic + user impact)
│   ├── utils/           # riskAnalyzer (8 categories), sendEmail, sendEmailTo
│   ├── validators/      # input validation
│   ├── seed.js          # manual seed script
│   └── server.js        # serves API + React build in production
└── frontend/
    ├── src/
    │   ├── components/  # Admin Layout
    │   ├── hooks/       # useWindowWidth (responsive)
    │   ├── layouts/     # UserLayout (sidebar + bottom nav + profile dropdown)
    │   ├── pages/
    │   │   ├── Landing.js          # homepage with scam checker + live ticker
    │   │   ├── ScamChecker.js      # full scam check + WhatsApp share
    │   │   ├── Trending.js         # trending scams page
    │   │   ├── AnonReport.js       # anonymous report (no login)
    │   │   ├── ApiDocs.js          # public API documentation
    │   │   ├── admin/              # Dashboard, Complaints, Users
    │   │   └── user/               # Login, Register, ForgotPassword,
    │   │                           # ResetPassword, Dashboard, Submit,
    │   │                           # MyComplaints, Profile
    │   ├── routes/      # ProtectedRoute
    │   ├── services/    # Axios API instance
    │   └── utils/       # frontend riskAnalyzer
    └── public/
        └── _redirects   # Render SPA routing fix
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Resend account (for email alerts)

### 1. Clone the repo

```bash
git clone https://github.com/bhargabdeka-deka/cyber-crime-portal.git
cd cyber-crime-portal
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_admin_email@example.com
```

Start backend:

```bash
npm run dev
```

The backend auto-seeds 16 scam records on first startup if the collection is empty.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm start
```

Open `http://localhost:3000`

---

## API Reference

### Public (no auth required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/scam/check?query=` | Check if phone/URL/UPI is a scam |
| GET | `/api/scam/trending` | Trending scams + stats |
| GET | `/api/scam/activity` | Recent scam activity feed |
| POST | `/api/complaints/anonymous` | Submit anonymous scam report |

### Users
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/users/register` | Public |
| POST | `/api/users/login` | Public |
| POST | `/api/users/forgot-password` | Public |
| POST | `/api/users/reset-password/:token` | Public |
| GET | `/api/users/profile` | Protected |
| PUT | `/api/users/profile` | Protected |
| POST | `/api/users/avatar` | Protected |
| GET | `/api/users/impact` | Protected |

### Complaints
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/complaints` | User |
| GET | `/api/complaints/my` | User |
| GET | `/api/complaints/:id` | User |
| GET | `/api/complaints` | Admin |
| PUT | `/api/complaints/:id/status` | Admin |
| GET | `/api/complaints/analytics` | Admin |
| GET | `/api/complaints/export/csv` | Admin |

### Admin
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/users` | Admin |
| GET | `/api/users/:id/stats` | Admin |

---

## AI Risk Analyzer

Classifies complaints into 8 categories with recency weighting:

| Category | Example Keywords |
|---|---|
| UPI Fraud | otp, bank, upi, transaction, credit card |
| Identity Theft | aadhaar, pan, kyc, passport |
| Account Hacking | hacked, password, phishing, breach |
| Cyber Harassment | threat, blackmail, stalking, extortion |
| Job Scam | job, work from home, registration fee, offer letter |
| Lottery Scam | lottery, winner, prize, lucky draw |
| Investment Scam | invest, crypto, guaranteed returns, ponzi |
| Romance Scam | love, dating, send money, emergency |

Risk score (0–100) → Priority:
- **Critical** ≥ 75 — triggers admin email alert
- **High** ≥ 55
- **Medium** ≥ 35
- **Low** < 35

Recency boost: targets reported in the last 7 days get a higher effective risk level.

---

## Scam Intelligence Database

Every complaint filed with a `scamTarget` automatically upserts a `Scam` document:
- Tracks total report count, average risk score, locations, related case IDs
- Risk level auto-upgrades: 1 = LOW → 2-4 = MEDIUM → 5-9 = HIGH → 10+ = CRITICAL
- Powers the public Scam Checker, Trending page, and live ticker

---

## Security Features

- Rate limiting on auth routes (10 attempts / 15 min)
- Password reset rate limiting (3 attempts / hour)
- NoSQL injection protection (express-mongo-sanitize)
- JWT authentication with 7-day expiry
- Helmet security headers
- CORS configured
- Input validation on all routes (express-validator)

---

## Creating an Admin Account

Register a normal user, then update their role in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## Deployment (Render)

Both frontend and backend are served from a single Node.js service:

**Build Command:**
```
npm install --prefix frontend && npm run build --prefix frontend && npm install --prefix backend
```

**Start Command:**
```
node backend/server.js
```

**Environment Variables (set in Render dashboard):**
```
NODE_ENV=production
MONGO_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
ADMIN_EMAIL=...
```

The `public/_redirects` file handles SPA routing (no 404 on page refresh).

---

## License

MIT
