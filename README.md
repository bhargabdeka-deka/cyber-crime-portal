# CyberShield — Cyber Crime Reporting & Scam Detection

CyberShield is a full-stack MERN (MongoDB, Express, React, Node.js) platform designed to centralize cyber crime reporting and provide real-time scam identifier verification. The system allows users to verify suspicious phone numbers, UPI IDs, and URLs against a community-sourced database, while providing a secure channel for victims to file and track structured complaints.

**Live Application:** [https://cybershield-green-two.vercel.app](https://cybershield-green-two.vercel.app)

---

## Technical Overview

This project was built with a focus on security, scalability, and ease of administration. It implements a layered security architecture to protect user data and ensure the integrity of reported identifiers.

### Core Architecture
- **Frontend**: React 19 (Vite) with Context API for state management and Tailwind CSS for styling.
- **Backend**: Node.js and Express.js REST API.
- **Database**: MongoDB Atlas with Mongoose for schema modeling.
- **Security**: JWT-based authentication with Role-Based Access Control (RBAC), data sanitization, and rate limiting.
- **Integrations**: Cloudinary for evidence storage and Resend for email notifications.

---

## Project Structure

The repository is organized as a monorepo for easier management of shared configurations:

```text
/
├── backend/
│   ├── config/          # Database and service configurations
│   ├── controllers/     # Business logic for API endpoints
│   ├── middleware/      # Auth, RBAC, and security filters
│   ├── models/          # Data schemas (Users, Complaints, Scams)
│   ├── routes/          # API route definitions
│   ├── services/        # Scoring algorithms and analytics logic
│   └── server.js        # Entry point and middleware orchestration
├── frontend/
│   ├── src/
│   │   ├── components/  # Atomic and structural components
│   │   ├── pages/       # View-level components
│   │   ├── hooks/       # Custom React hooks (Auth, UI)
│   │   ├── services/    # API abstraction layer (Axios)
│   │   └── utils/       # Shared formatting and logic
├── render.yaml          # Infrastructure as Code (IaC) for Render
└── package.json         # Root scripts
```

---

## Core Systems & Logic

### 1. Risk Scoring Engine
The platform uses a weighted keyword and reputation-based algorithm to score reported identifiers.
- **0–34**: Low Risk (Single reports or unconfirmed flags)
- **35–54**: Medium Risk (Multiple indicators or recurring reports)
- **55–100**: High/Critical Risk (Confirmed financial fraud or identity theft)

### 2. Multi-Tier Access Control
The system enforces strict RBAC across three levels:
- **Public**: Search identifiers and submit anonymous scam reports.
- **Registered User**: File detailed complaints, track case status, and view personal impact dashboard.
- **Admin/Superadmin**: Full case lifecycle management, user auditing, and data export.

### 3. Trust-Based Anti-Abuse System *(Updated)*

A production-grade trust scoring mechanism prevents fake and spam reports. Every registered user has a `trustScore` (0–100) that reflects reporting quality.

#### Trust Score Rules

| Event | Score Change | Effect |
|---|---|---|
| Submit a report | No change | Only activity fields updated |
| Admin marks report **Resolved** | **+5** (capped at 100) | `isTrusted = score ≥ 30` |
| Admin marks report **Rejected** | **−15** (floored at 0) | `isDisabled = true` if score ≤ 10 |

#### Default Trust Scores by Role
| Role | Default Score |
|---|---|
| User | 50 |
| Admin | 80 |
| Superadmin | 100 |

#### Submission Guards (all enforced server-side)
1. **Account disabled** → 403 blocked
2. **Trust score < 20** → 403 blocked
3. **Cooldown** → 1 report per 60 seconds (429)
4. **Duplicate target** → Same user + same `scamTarget` blocked (400)
5. **Daily limit** → Max 3 reports per day (429)
6. **Description length** → Minimum 20 characters (400)

#### Safety Hardening
- `Number(trustScore) || 0` normalization prevents NaN arithmetic on corrupt documents
- `if (reportUser)` null-guards prevent crashes when user document is missing
- Duplicate status update check prevents double reward/penalty on concurrent admin actions
- Non-sensitive `[TrustSystem]` console logs trace every trust change in server output

### 4. Security Implementation
- **Data Sanitization**: `mongo-sanitize` and `hpp` protect against NoSQL injection and parameter pollution.
- **Rate Limiting**: Applied to all authentication and reporting endpoints to prevent brute-force attacks.
- **Centralized Error Handling**: Ensures that sensitive stack traces are never exposed in production.
- **Secure File Storage**: Evidence is uploaded to Cloudinary with strict MIME-type validation.

---

## Mobile Responsiveness *(Updated)*

All pages are fully responsive across mobile, tablet, and desktop breakpoints:

| Page | Mobile Behaviour |
|---|---|
| `UserLayout` | Collapsible sidebar on desktop; slide-in drawer with backdrop on mobile (`< lg`) |
| `SubmitComplaint` | Single-column form, full-width inputs, trust-score banner visible |
| `MyComplaints` | Card list stacks vertically; modal grid switches to 1-col on `< sm`; stepper wraps |
| `AnonReport` | `px-4` side padding prevents edge-to-edge content on narrow phones |
| `Admin / Complaints` | Table has `overflow-x-auto`; filter bar wraps with `min-w` on selects; modal stepper wraps |
| `Admin / Users` | Header wraps on mobile; email column hidden below `md`; trust score column hidden below `sm` |

---

## Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account
- Resend API key

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhargabdeka-deka/cyber-crime-portal.git
   cd cyber-crime-portal
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

3. **Configure Environment Variables:**

   Create `backend/.env`:
   ```text
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   RESEND_API_KEY=your_resend_key
   ADMIN_EMAIL=your_email
   NODE_ENV=development
   ```

   Create `frontend/.env`:
   ```text
   VITE_API_URL=http://localhost:5000
   ```

4. **Run the application:**
   ```bash
   # In backend/
   npm run dev

   # In frontend/
   npm run dev
   ```

---

## Production Deployment

This project is optimized for deployment on **Render** or **Vercel**.

### Deployment Checklist
1. **Environment Variables**: Ensure all backend secrets are added to the environment configuration.
2. **Frontend API URL**: The `VITE_API_URL` must point to your live backend domain during the build process.
3. **CORS Configuration**: The `CLIENT_URL` in the backend must match your live frontend domain.
4. **Build Command**: `npm install --prefix frontend && npm run build --prefix frontend && npm install --prefix backend`

### Handling "Cold Starts"
If using Render's free tier, the service will spin down after inactivity. Users may experience a delay of 30-60 seconds on the first request. It is recommended to use a health check pinger if consistent uptime is required.

---

## Administration

### Creating the First Superadmin
For security reasons, there is no public signup for administrative roles. To create the first superadmin:
1. Register a standard user account.
2. Access your MongoDB instance.
3. Update the user document's role to `superadmin`.

Once a superadmin is established, they can promote other users to the `admin` role directly through the dashboard.

---

## Changelog

### v2.1.0 — Trust System & Mobile Responsiveness (April 2026)
- **[Backend]** Removed passive `trustScore += 2` on report submission
- **[Backend]** Added `+5` trust reward when admin marks a report as **Resolved**
- **[Backend]** Verified and hardened `-15` penalty when admin marks a report as **Rejected**
- **[Backend]** Added `Number(trustScore) || 0` normalization to prevent NaN on corrupt documents
- **[Backend]** Added `[TrustSystem]` console logs for non-sensitive audit trail
- **[Backend]** Duplicate check uses `scamTarget` field matching schema exactly
- **[Backend]** `createComplaint` now returns `user` object in 201 response
- **[Frontend]** `SubmitComplaint.js` syncs returned `user` into `localStorage` on success
- **[Frontend]** `Admin/Complaints` — header wraps on mobile, filter selects have `min-w`, `Rejected` added to status filter and `statusConfig`
- **[Frontend]** `Admin/Users` — header wraps on mobile, `Trust` column added (hidden on `< sm`), name truncates safely
- **[Frontend]** `MyComplaints` — modal title truncates, details grid is `1-col` on mobile, stepper wraps
- **[Frontend]** `AnonReport` — added `px-4` padding for mobile edge safety

---

## License

Copyright (c) 2026 CyberShield.
Licensed under the MIT License.
