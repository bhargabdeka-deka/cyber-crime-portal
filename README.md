# ⚔️ CyberShield — Scam Detection & Cyber Crime Reporting Platform

CyberShield is a full-stack web application that lets anyone instantly check if a phone number, URL, or UPI ID has been reported as a scam — and file detailed cyber crime complaints that feed a live intelligence database.

Built with React, Node.js, Express, and MongoDB.

---

## What It Does

### Public (no login needed)
- **Scam Checker** — search any phone number, URL, UPI ID, or email and get an instant verdict (Safe / Caution / Suspicious / Highly Dangerous) with report count, risk score, and action advice
- **Trending Scams** — live feed of most-reported scam targets and top scam categories from real community data
- **Public scam pages** — shareable URLs like `/check/9876543210` for any target

### For Users (after login)
- File detailed cyber crime complaints with title, description, scam type, scam target, location, and evidence upload
- Real-time AI analysis while typing — detects crime type, risk score, and priority
- Track complaint status (Pending → Investigating → Resolved)
- View all past complaints with detailed modal and status timeline
- User impact counter — see how many people your reports helped protect
- Profile page — edit name, phone, location, bio, and upload a profile photo

### For Admins
- Full analytics dashboard — monthly trends, crime type distribution, status breakdown, priority breakdown
- Manage all complaints with filters (priority, status, search, sort) and pagination
- Update complaint status directly from table or detail modal
- Critical case alerts for high-risk complaints (risk score ≥ 80)
- Automatic email alerts via Resend for critical cases

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
| Security | Helmet, CORS, express-validator |

---

## Project Structure

```
cyber-crime-portal/
├── backend/
│   ├── config/          # DB connection + Cloudinary config + auto-seed
│   ├── controllers/     # complaintController, scamController
│   ├── middleware/       # auth, error, upload
│   ├── models/          # User, Complaint, Scam
│   ├── routes/          # userRoutes, complaintRoutes, scamRoutes
│   ├── services/        # complaintService (business logic + user impact)
│   ├── utils/           # riskAnalyzer (8 scam categories), sendEmail
│   ├── validators/      # input validation
│   ├── seed.js          # manual seed script
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/  # Admin Layout (with sidebar)
    │   ├── hooks/       # useWindowWidth (responsive)
    │   ├── layouts/     # UserLayout (sidebar + bottom nav + profile dropdown)
    │   ├── pages/
    │   │   ├── Landing.js        # public homepage with inline scam checker
    │   │   ├── ScamChecker.js    # full scam check page
    │   │   ├── Trending.js       # trending scams page
    │   │   ├── admin/            # Dashboard, Complaints
    │   │   └── user/             # Login, Register, Dashboard, Submit,
    │   │                         # MyComplaints, Profile
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

The backend auto-seeds 16 scam records into the database on first startup if the collection is empty.

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

### Public (no auth)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/scam/check?query=` | Check if a phone/URL/UPI is a scam |
| GET | `/api/scam/trending` | Get trending scams + stats |
| GET | `/api/scam/activity` | Recent scam activity feed |

### Users
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/users/register` | Public |
| POST | `/api/users/login` | Public |
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

---

## AI Risk Analyzer

Classifies complaints into 8 categories using keyword matching with recency weighting:

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
- **Critical** ≥ 75 — triggers email alert + scam DB upsert
- **High** ≥ 55
- **Medium** ≥ 35
- **Low** < 35

---

## Scam Intelligence Database

Every complaint filed with a `scamTarget` (phone/URL/UPI) automatically upserts a `Scam` document:
- Tracks total report count, average risk score, locations, related case IDs
- Risk level auto-upgrades: 1 report = LOW → 2-4 = MEDIUM → 5-9 = HIGH → 10+ = CRITICAL
- Recency factor: targets reported in the last 7 days get a higher effective risk score
- Powers the public Scam Checker and Trending pages

---

## Creating an Admin Account

Register a normal user, then update their role directly in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## Deployment (Render)

**Backend service:**
- Build command: `npm install`
- Start command: `node server.js`
- Add all 7 environment variables in Render → Environment

**Frontend service:**
- Build command: `npm install && npm run build`
- Publish directory: `build`
- Add env var: `REACT_APP_API_URL=https://your-backend.onrender.com`
- The `public/_redirects` file handles SPA routing (no 404 on refresh)

Live demo:
- Frontend: `https://cyber-crime-fronten.onrender.com`
- Backend: `https://cyber-crime-portal-2.onrender.com`

---

## License

MIT
