# CyberShield - Scam Detection and Cyber Crime Reporting Platform

CyberShield is a comprehensive full-stack platform designed to facilitate digital fraud detection and centralized cyber crime reporting. It provides instant verification of suspicious identifiers and a community-driven intelligence database to protect users from evolving digital threats.

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Security Hardening](#security-hardening)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Administrative Configuration](#administrative-configuration)
- [Risk Analysis Logic](#risk-analysis-logic)
- [Deployment](#deployment)

## Project Overview

CyberShield serves as a centralized hub for verifying suspicious phone numbers, URLs, and UPI IDs. By leveraging community-reported data, the platform provides real-time risk assessment for potential scams. It bridges the gap between victims and authorities by streamlining the reporting process and providing actionable intelligence to the public.

## Key Features

### Public Tools
- **Identifier Verification**: Real-time checking of phone numbers, UPI IDs, and URLs against a global scam database.
- **Anonymous Reporting**: Low-friction submission of scam incidents without requiring account creation.
- **Trend Dashboard**: Visual analytics of trending scam categories and high-risk targets.
- **Activity Feed**: Real-time indicator of recent verified reports across the platform.

### Registered User Features
- **Comprehensive Case Filing**: Detailed incident reporting with support for multimedia evidence (images/documents).
- **Automated Case Tracking**: Real-time status updates from initial filing to final resolution.
- **Impact Analytics**: Personalized metrics showing the community protection value of a user's contributions.

### Administrative Capabilities
- **Advanced Analytics**: Detailed breakdown of monthly incident trends and geographical risk distributions.
- **Case Management**: Full lifecycle control over complaints, including priority assignment and status transitions.
- **User Auditing**: Administrative tools for managing platform participants and account security.
- **Data Portability**: Export functionality for case data in standardized formats (CSV).

## Technical Architecture

### Frontend
- **Framework**: React 19 (Functional components with Hooks)
- **Routing**: React Router v7
- **State Management**: React Context API and custom hooks
- **Performance**: Route-level code splitting using React.lazy and Suspense
- **Data Visualization**: Recharts for administrative and public analytics

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator for robust input sanitization
- **File Handling**: Multer with Cloudinary integration for secure asset storage

## Security Hardening

The application has undergone a comprehensive production-ready security audit, implementing the following defensive layers:

- **Authentication & RBAC**: Strict Role-Based Access Control (RBAC) with instantaneous database-level status verification on every request.
- **Data Sanitization**: Global XSS and NoSQL injection protection using express-validator and mongo-sanitize.
- **Security Headers**: Implementation of Helmet for secure HTTP response headers.
- **Traffic Control**: Rate limiting on all authentication and reporting endpoints to prevent brute-force and DDoS attacks.
- **Parameter Pollution**: Prevention of HTTP Parameter Pollution (HPP) attacks.
- **Error Shielding**: Centralized error handling middleware that normalizes responses and hides internal stack traces in production.
- **File Upload Security**: Strict size constraints (5MB) and mime-type filtering for all uploaded evidence.

## Project Structure

```text
cyber-crime-portal/
├── backend/
│   ├── config/          # Database and external service configurations
│   ├── controllers/     # Request processing and business logic
│   ├── middleware/      # Auth, security, and error handling layers
│   ├── models/          # Mongoose schemas and data models
│   ├── routes/          # API endpoint definitions
│   ├── services/        # Specialized analytics and impact logic
│   ├── utils/           # Risk algorithms and helper utilities
│   ├── validators/      # Input validation and sanitization schemas
│   └── server.js        # Server entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components and layouts
    │   ├── hooks/       # Custom React logic hooks
    │   ├── pages/       # View components and dashboard modules
    │   ├── services/    # API abstraction layer
    │   └── utils/       # Formatting and logical helpers
    └── public/
        └── _redirects   # SPA routing configuration for deployment
```

## Installation and Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local instance
- Cloudinary account (for file storage)
- Resend API key (for email notifications)

### 1. Clone the Repository
```bash
git clone https://github.com/bhargabdeka-deka/cyber-crime-portal.git
cd cyber-crime-portal
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Environment Configuration
Create a `.env` file in the `backend` directory:
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
```bash
# In backend directory
npm run dev

# In frontend directory
npm start
```

## Administrative Configuration

To initialize an administrator account:
1. Register a standard user account through the web interface.
2. Locate the user document in your MongoDB database.
3. Change the `role` field from `"user"` to `"admin"`.
4. The user will immediately gain access to the /admin routes upon their next login.

## Risk Analysis Logic

The platform implements an automated scoring system to prioritize incidents:

- **Critical (75-100)**: Finance-related fraud or severe identity theft.
- **High (55-74)**: Confirmed phishing and account breaches.
- **Medium (35-54)**: Suspicious activity with multiple indicators.
- **Low (0-34)**: Minor suspicious flags or individual reports.

Scores are calculated based on keyword density in reports and the historical reputation of the reported identifier.

## Deployment

The application is configured for deployment on platforms like Render or Heroku.

**Build Command**:
`npm install --prefix frontend && npm run build --prefix frontend && npm install --prefix backend`

**Start Command**:
`node backend/server.js`

---
Copyright (c) 2026 CyberShield Project. All rights reserved.
