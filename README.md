# CyberShield — Scam Detection & Cyber Crime Reporting Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-47A248?logo=mongodb)
![Deployed on Render](https://img.shields.io/badge/deployed%20on-render-46E3B7?logo=render)

> **Live Demo:** [https://cyber-crime-fronten.onrender.com](https://cyber-crime-fronten.onrender.com)

CyberShield is a production-ready, full-stack MERN platform for digital fraud detection and centralized cyber crime reporting. It enables real-time verification of suspicious phone numbers, UPI IDs, and URLs against a community-driven intelligence database, and streamlines the process of filing and tracking cyber crime complaints.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Security](#security)
- [Risk Scoring Logic](#risk-scoring-logic)
- [Admin Configuration](#admin-configuration)
- [Known Issues & Gotchas](#known-issues--gotchas)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Public (No Account Required)
- **Identifier Verification** — Instantly check phone numbers, UPI IDs, and URLs against the scam database
- **Anonymous Reporting** — Submit scam reports without creating an account
- **Trend Dashboard** — Visual analytics of trending scam categories and high-risk identifiers
- **Activity Feed** — Live feed of recently verified reports across the platform

### Registered Users
- **Detailed Case Filing** — File structured complaints with multimedia evidence (images/documents up to 5MB)
- **Case Tracking** — Real-time status updates from submission to resolution
- **Impact Analytics** — Personal dashboard showing the community protection value of your contributions

### Admins
- **Case Management** — Full lifecycle control: priority assignment, status transitions, case resolution
- **Advanced Analytics** — Monthly incident trends and category breakdowns
- **User Auditing** — Manage platform users and account security
- **CSV Export** — JWT-protected export of case data in CSV format

### Superadmins
- All Admin capabilities
- **Role Promotion** — Elevate standard users to Admin status directly from the dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Context API, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + RBAC |
| File Storage | Multer + Cloudinary |
| Email | Resend API |
| Deployment | Render (Monorepo) |

---

## Project Structure

```
cyber-crime-portal/
├── backend/
│   ├── config/          # DB connection and Cloudinary setup
│   ├── controllers/     # Route handlers and business logic
│   ├── middleware/      # Auth, RBAC, security, and error handling
│   ├── models/          # Mongoose schemas (User, Complaint, Report)
│   ├── routes/          # Express API route definitions
│   ├── services/        # Analytics, impact scoring logic
│   ├── utils/           # Risk algorithm and helper utilities
│   ├── validators/      # express-validator input schemas
│   └── server.js        # Application entry point
├── frontend/
│   ├── public/
│   │   └── _redirects   # Render SPA routing fix
│   └── src/
│       ├── components/  # Reusable UI components and layouts
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Page-level view components
│       ├── routes/      # Protected routes and RBAC guards
│       ├── services/    # Axios API abstraction layer
│       └── utils/       # Formatting and logic helpers
├── .gitignore
├── render.yaml          # Render deployment configuration
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- A [Cloudinary](https://cloudinary.com) account (for file uploads)
- A [Resend](https://resend.com) account (for email notifications)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/bhargabdeka-deka/cyber-crime-portal.git
cd cyber-crime-portal

# 2. Install backend dependencies
cd backend && npm install

# 3. Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_strong_random_jwt_secret

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_admin_alert_email

# Frontend URL (used for CORS)
CLIENT_URL=http://localhost:3000
```

Create a `.env` file inside the `frontend/` directory:

```env
# ⚠️ IMPORTANT: For local development only.
# For production on Render, set this in the Render dashboard environment variables
# BEFORE the build runs — React bakes this into the bundle at build time.
REACT_APP_API_URL=http://localhost:5000
```

> **Production Note:** When deploying to Render, set `REACT_APP_API_URL` to your live backend URL (e.g., `https://cyber-crime-fronten.onrender.com`) in the Render dashboard under **Environment Variables**. This must be set before the build command runs.

### Running Locally

```bash
# Terminal 1 — Start the backend
cd backend
npm run dev

# Terminal 2 — Start the frontend
cd frontend
npm start
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5000`.

---

## Deployment

This project is configured for **Render** as a monorepo (single service). The `render.yaml` at the root handles the full deployment.

```yaml
services:
  - type: web
    name: cyber-crime-portal-2
    env: node
    buildCommand: npm install --prefix frontend && npm run build --prefix frontend && npm install --prefix backend
    startCommand: node backend/server.js
    envVars:
      - key: NODE_ENV
        value: production
```

### Render Deployment Steps

1. Push your code to GitHub
2. Create a new **Web Service** on [Render](https://render.com) and connect your repository
3. Render will auto-detect `render.yaml` and configure the service
4. In the Render dashboard, add all required environment variables from the list above
5. **Critically**, set `REACT_APP_API_URL` to your Render service URL before the first build
6. Deploy — Render runs the build command then starts the server

> **Note on Free Tier:** Render free tier services spin down after 15 minutes of inactivity. The first request after inactivity may take 30–60 seconds to respond (cold start). Consider upgrading to a paid tier for production use.

---

## Security

CyberShield implements multiple defensive layers:

| Layer | Implementation |
|---|---|
| Authentication | JWT-based with database-level status verification on every request |
| Authorization | Role-Based Access Control (RBAC) — User, Admin, Superadmin |
| Input Sanitization | XSS and NoSQL injection protection via `express-validator` and `mongo-sanitize` |
| Security Headers | `helmet` for secure HTTP response headers |
| Rate Limiting | `express-rate-limit` on all auth and reporting endpoints |
| Parameter Pollution | `hpp` middleware to prevent HTTP Parameter Pollution attacks |
| File Upload | Strict 5MB size limit and MIME-type filtering via `multer` |
| Error Handling | Centralized middleware — stack traces hidden in production |
| CSV Export | JWT-protected download streams — admin-only access |

---

## Risk Scoring Logic

Every submitted report is automatically scored from 0–100 based on keyword density and the historical reputation of the reported identifier.

| Score Range | Risk Level | Typical Cases |
|---|---|---|
| 75 – 100 | 🔴 Critical | Financial fraud, identity theft |
| 55 – 74 | 🟠 High | Confirmed phishing, account breaches |
| 35 – 54 | 🟡 Medium | Suspicious activity with multiple indicators |
| 0 – 34 | 🟢 Low | Minor flags, single isolated reports |

---

## Admin Configuration

CyberShield uses a tiered admin system with **Admin** and **Superadmin** roles.

**Creating the first Superadmin (one-time setup):**

Directly update the user document in your MongoDB Atlas collection:

```js
// In MongoDB Atlas Data Explorer or mongosh
db.users.updateOne(
  { email: "your-admin@email.com" },
  { $set: { role: "superadmin" } }
)
```

**Promoting users via the dashboard:**

Once a Superadmin exists, they can promote any registered user to **Admin** directly from the Users management panel inside the app — no further database changes required.

Promoted users immediately gain access to `/admin` routes and all case management capabilities.

---

## Known Issues & Gotchas

- **`REACT_APP_API_URL` must be set before the build** on Render — React embeds environment variables at build time, not runtime. If this variable points to `localhost`, all API calls will fail in production.
- **Render free tier cold starts** — The service sleeps after inactivity. Add a comment in your UI or use a cron ping service to keep it warm if needed.
- **First Superadmin** must be created manually via MongoDB — there is intentionally no public signup flow for admin roles.

---

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure your code follows the existing structure and all security middleware is preserved.

---

## License

Copyright © 2026 CyberShield Project. All rights reserved.

This project is licensed under the [MIT License](LICENSE).
