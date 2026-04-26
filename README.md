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

## Core Systems & Logic

### 1. Risk Scoring Engine
The platform uses a weighted keyword and reputation-based algorithm to score reported identifiers.
- **0–34**: Low Risk (Single reports or unconfirmed flags)
- **35–54**: Medium Risk (Multiple indicators or recurring reports)
- **55–100**: High/Critical Risk (Confirmed financial fraud or identity theft)

### 2. Multi-Tier Access Control (RBAC)
The system enforces strict RBAC across three levels:
- **Public**: Search identifiers and submit anonymous scam reports.
- **Registered User**: File detailed complaints, track case status, and view personal impact dashboard.
- **Admin**: Manage cases, verify reports, and disable standard users.
- **Superadmin**: Full system control, including the ability to disable/enable other Admin accounts.

### 3. Trust-Based Anti-Abuse System
A production-grade trust scoring mechanism prevents fake and spam reports. Every registered user has a `trustScore` (0–100) that reflects reporting quality.

#### Trust Score Rules
| Event | Score Change | Effect |
|---|---|---|
| Admin marks report **Resolved** | **+5** (capped at 100) | Auto re-enables user if score > 10 |
| Admin marks report **Rejected** | **−15** (floored at 0) | `isDisabled = true` if score ≤ 10 |

#### Submission Guards (Server-Side)
1. **Trust score < 20** → 403 Blocked.
2. **Cooldown** → 1 report per 60 seconds.
3. **Daily limit** → Max 3 reports per day.
4. **Description quality** → Min 20 chars, min 5 words, and spam/garbage pattern detection.

---

## Recent Improvements & Final Quality Checks

### Backend Hardening
- **Auto Re-enable Logic**: Users are now automatically re-enabled if their trust score recovers above 10 following a "Resolved" report.
- **3-Layer Validation**: Implemented strict description checks including minimum length, word count, and regex-based spam/garbage detection.
- **Null Guards**: Added defensive checks for user documents to prevent server crashes on stale sessions.
- **Consistent API Responses**: Standardized all error responses to follow the `{ success: false, message: "..." }` format.

### Frontend & UX
- **Live Trust Sync**: The User Dashboard now fetches the latest trust score and status from the backend on mount, ensuring real-time accuracy.
- **Admin Table UX**: 
    - Disabled users are visually highlighted in red-tinted rows.
    - Status updates are locked for complaints from disabled users to prevent redundant processing.
    - Added pill badges for "Active" and "Disabled" statuses for instant visual scanning.
- **Full Device Responsiveness**: 
    - Tables are wrapped in horizontal scroll containers to prevent layout breakage on mobile.
    - Modals and forms are optimized for single-column views on narrow screens.
    - Navigation uses a slide-in drawer on mobile and a fixed sidebar on desktop.

---

## Local Development

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

3. **Run the application:**
   ```bash
   # Backend
   npm run dev

   # Frontend
   npm run dev
   ```

---

## Changelog (Final Version)
- **v2.2.0**: Implemented symmetric disable/enable cycle based on trust recovery.
- **v2.1.5**: Added 3-layer report quality validation (word count + spam detection).
- **v2.1.0**: Enhanced Admin Dashboard with visual highlights for disabled accounts.
- **v2.0.5**: Optimized all layouts for 100% mobile responsiveness (no cropping).
- **v2.0.0**: Initial production-ready trust system deployment.
