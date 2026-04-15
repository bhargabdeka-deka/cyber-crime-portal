# ⚔️ CyberShield — AI-Powered Cyber Crime Reporting Portal

A full-stack web application for reporting, tracking, and managing cyber crime complaints. Built with React, Node.js, Express, and MongoDB — featuring real-time AI risk analysis, evidence upload, and a role-based admin dashboard.

---

## Features

### For Citizens (Users)
- Register and log in securely with JWT authentication
- File cyber crime complaints with title, description, and evidence upload
- Real-time AI analysis — detects crime type, risk score, and priority as you type
- Track complaint status (Pending → Investigating → Resolved)
- View all past complaints with detailed modal view

### For Administrators
- Full analytics dashboard — monthly trends, crime type distribution, status breakdown, priority breakdown
- Critical case alerts for high-risk complaints (risk score ≥ 80)
- Manage all complaints with filters (priority, status, search, sort)
- Update complaint status directly from the table or detail modal
- Automatic email alerts via Resend for critical cases

### General
- Premium dark UI — responsive, modern design
- Public landing page with feature overview (no login required)
- Role-based route protection (user / admin)
- Evidence stored securely on Cloudinary
- Password strength indicator on registration

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
| Security | Helmet, CORS, express-rate-limit, express-validator |

---

## Project Structure

```
cyber-crime-portal/
├── backend/
│   ├── config/          # DB + Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error, upload middleware
│   ├── models/          # Mongoose schemas (User, Complaint)
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Risk analyzer, email sender
│   ├── validators/      # Input validation
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/  # Admin Layout
    │   ├── layouts/     # User Layout
    │   ├── pages/
    │   │   ├── Landing.js
    │   │   ├── admin/   # Dashboard, Complaints
    │   │   └── user/    # Login, Register, Dashboard, Submit, MyComplaints
    │   ├── routes/      # ProtectedRoute
    │   ├── services/    # Axios API instance
    │   └── utils/       # Frontend risk analyzer
    └── public/
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
git clone https://github.com/your-username/cyber-crime-portal.git
cd cyber-crime-portal
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

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

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### Users
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/users/register` | Public |
| POST | `/api/users/login` | Public |
| GET | `/api/users/profile` | Protected |

### Complaints
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/complaints` | User |
| GET | `/api/complaints/my` | User |
| GET | `/api/complaints/:id` | User |
| GET | `/api/complaints` | Admin |
| PUT | `/api/complaints/:id/status` | Admin |
| GET | `/api/complaints/stats` | Admin |
| GET | `/api/complaints/analytics` | Admin |

---

## AI Risk Analyzer

The built-in keyword-based analyzer classifies complaints into:

| Crime Type | Example Keywords |
|---|---|
| Financial Fraud | otp, bank, upi, transaction, credit card |
| Identity Theft | aadhaar, pan, kyc, identity |
| Account Hacking | hacked, password, phishing, breach |
| Cyber Harassment | threat, blackmail, stalking, extortion |

Risk score (0–100) determines priority:
- **Critical** — score ≥ 80 (triggers email alert)
- **High** — score ≥ 60
- **Medium** — score ≥ 40
- **Low** — score < 40

---

## Creating an Admin Account

Admin accounts must be created directly in MongoDB. Register a normal user, then update their role in the database:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## Deployment

The app is deployed on Render:
- Frontend: `https://cyber-crime-fronten.onrender.com`
- Backend: `https://cyber-crime-portal-2.onrender.com`

For production, set environment variables in your hosting platform instead of `.env` files.

---

## License

MIT
