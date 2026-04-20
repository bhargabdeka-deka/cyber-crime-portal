# CyberShield - Scam Detection and Cyber Crime Reporting Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%2019-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?logo=mongodb)](https://www.mongodb.com/)
[![Render](https://img.shields.io/badge/Deployment-Render-informational?logo=render)](https://render.com/)

**The CyberShield platform is a full-stack solution for digital fraud detection, providing instant verification and a centralized community-driven reporting system for cyber crimes.**

[**View Live Demo**](https://cyber-crime-fronten.onrender.com)

</div>

---

## Table of Contents
- [Overview](#overview)
- [Core Features](#core-features)
- [Technical Stack](#technical-stack)
- [Directory Structure](#directory-structure)
- [Installation and Setup](#installation-and-setup)
- [Administrative Configuration](#administrative-configuration)
- [API Reference](#api-reference)
- [Risk Analysis Algorithm](#risk-analysis-algorithm)
- [Scam Intelligence Logic](#scam-intelligence-logic)
- [Security and Deployment](#security-and-deployment)

---

## Overview

CyberShield serves as a community-driven database for verifying suspicious phone numbers, URLs, and UPI IDs. By centralizing incident reporting, the platform allows users to check for known scams in real-time and contribute to a shared intelligence pool that helps authorities and the public stay protected from evolving digital threats.

---

## Core Features

### Public Access
- **Search Verification** - Quickly check if a phone number, URL, or UPI ID has been previously flagged for fraudulent activity.
- **Anonymous Reporting** - Allows users to submit scam details without requiring an account, ensuring low-friction data collection.
- **Trend Analysis** - Real-time visualization of the most reported categories and high-risk targets.
- **Live Activity Feed** - A scrolling indicator showing the latest verified reports globally.
- **Social Sharing** - Integrated support for sharing scam alerts via WhatsApp and other platforms.

### Registered Users
- **Case Submission** - File detailed complaints with supporting evidence such as images and document uploads.
- **Dynamic Risk Categorization** - Automatic classification of crime types based on user descriptions.
- **Status Monitoring** - Follow the progress of a complaint from submission through investigation to resolution.
- **Impact Tracking** - Metrics showing how many people have been alerted or protected by a user's specific reports.

### Admin Dashboard
- **Comprehensive Analytics** - Deep dives into monthly incident trends, geographical hotspots, and category distributions.
- **Complaint Management** - Full administrative control over status updates, case filtering, and priority sorting.
- **User Management** - Tools for auditing and managing registered user accounts.
- **Data Export** - Export platform data to CSV for external analysis or reporting to regulatory bodies.

---

## Technical Stack

| Category | Technology |
|:---|:---|
| **Frontend** | React 19, React Router v7, Recharts, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Security** | JSON Web Tokens (JWT), bcryptjs, Helmet, Rate Limiting |
| **Storage** | Cloudinary (Media Assets), Multer |
| **Email** | Resend API |

---

## Directory Structure

```bash
cyber-crime-portal/
├── backend/
│   ├── config/          # Database and Cloudinary configurations
│   ├── controllers/     # Request handlers for complaints, scams, and users
│   ├── middleware/      # Authentication, error handling, and file processing
│   ├── models/          # Data schemas for MongoDB
│   ├── routes/          # API endpoint routing
│   ├── services/        # Specialized logic for user impact and case tracking
│   ├── utils/           # Risk analysis logic and email utilities
│   ├── validators/      # Input sanitization and validation
│   └── server.js        # Entry point for the application
└── frontend/
    ├── src/
    │   ├── components/  # User interface components and common layouts
    │   ├── hooks/       # Custom React state and event hooks
    │   ├── pages/       # Page views including dashboards and reporting tools
    │   ├── services/    # API communication layer
    │   └── utils/       # Shared logic and formatting helpers
    └── public/
        └── _redirects   # Configuration for single-page application routing
```

---

## Installation and Setup

### 1. Prerequisites
- Node.js version 18 or higher.
- A MongoDB Atlas cluster or a local MongoDB instance.
- A Cloudinary account for media storage.
- A Resend API key for transactional email functionality.

### 2. Repository Setup
```bash
git clone https://github.com/bhargabdeka-deka/cyber-crime-portal.git
cd cyber-crime-portal/backend && npm install
cd ../frontend && npm install
```

### 3. Environment Variables
Create a file named `.env` in the `backend` directory with the following configuration:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_admin_email_for_alerts
```

### 4. Running the Application
- **Start Backend:** `cd backend && npm run dev`
- **Start Frontend:** `cd frontend && npm start`

---

## Administrative Configuration

To elevate a regular user account to administrative status, manually update the user role in your MongoDB database:
1. Register a user account through the standard signup flow.
2. Use a database client (such as MongoDB Compass) to locate the user document.
3. Update the `role` field from `user` to `admin`.

---

## Risk Analysis Algorithm

The platform uses a keyword-based analysis system to determine the priority of each report:

| Category | Typical Keywords |
|:---|:---|
| **Digital Finance** | OTP, UPI, Bank, Transaction, Credit Card |
| **Identity Theft** | Aadhaar, PAN, KYC, Passport |
| **Account Security**| Hacked, Password, Phishing, Breach |
| **Cyber Harassment**| Threat, Blackmail, Stalking, Extortion |
| **Employment Scams**| Work from home, Registration fee, Offer letter |
| **Investments** | Invest, Crypto, Ponzi, Guaranteed returns |

**Priority Levels:**
- **CRITICAL** (Score 75-100): Triggers an immediate notification to the administrator.
- **HIGH** (Score 55-74): Prioritized for rapid investigation.
- **MEDIUM** (Score 35-54): Placed in a standard review queue.
- **LOW** (Score < 35): Flagged for community-level monitoring.

---

## Scam Intelligence Logic

The core database updates dynamically based on user interaction:
- **Telemetry Aggregation**: Every report updates specific metadata for the target, including frequency and geographical origin.
- **Automated Risk Scaling**: A target's risk rating increases automatically as the number of independent reports grows.
- **Public Awareness**: Verified data feeds directly into the search checker and live activity components.

---

## Security and Deployment

### Security Implementation
- **Rate Limiting**: Protects against automated brute-force attacks on authentication endpoints.
- **Input Sanitization**: Middleware prevents NoSQL injection and cross-site scripting (XSS).
- **HTTP Security**: Utilizes Helmet to secure application response headers.

### Deployment Configuration
The application is structured for deployment on Render:
- **Build Step**: `npm install --prefix frontend && npm run build --prefix frontend && npm install --prefix backend`
- **Start Step**: `node backend/server.js`

---

<div align="center">
  <h3>Dedicated to Building a Secure Digital Future</h3>
  Built for transparency and public safety.
</div>
