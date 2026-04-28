# 🛡️ CyberShield: Cybersecurity Intelligence Platform

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)](https://cybershield-green-two.vercel.app)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

**CyberShield** is a comprehensive, production-grade cybersecurity intelligence and reporting platform. It empowers citizens to report cyber crimes and verify suspicious identifiers (phone numbers, UPI IDs, URLs) in real-time using a community-driven trust ecosystem and an advanced risk-scoring engine.

---

## 🚀 Key Features

### 👤 For Citizens (Users)
- **🔍 Advanced Scam Checker**: Instantly verify suspicious numbers or links with detailed risk scores and specific threat reasons.
- **🛡️ Reputation Center**: A dedicated profile dashboard showing your contribution, approval rate, and detailed trust activity logs.
- **📈 Trust History**: Complete transparency into why your trust score changed (Rewards for valid reports, Penalties for spam).
- **📊 Impact Tracking**: Track your contribution to community safety with personalized impact statistics.
- **📱 Fully Responsive**: A seamless, high-end experience across mobile, tablet, and desktop devices.

### ⚖️ For Authorities (Admins)
- **📋 Intelligent Case Management**: Filter and investigate reports based on risk level and reporter trust.
- **🛠️ Dynamic Status Workflow**: Advanced status transitions (Pending → Investigating → Resolved/Rejected) with automated reputation updates.
- **🔒 Security Enforcement**: Ability to lock malicious accounts and protect the integrity of the data ecosystem.

---

## ⚙️ Core Logic & Intelligence

### 💎 The Trust Algorithm
To maintain data integrity, CyberShield implements a "Skin in the Game" trust model:
- **Baseline**: New users start with a trust score of 50.
- **Positive Reinforcement**: Admin resolving a report → **+5 Trust Points**.
- **Negative Reinforcement**: Admin rejecting a fake/spam report → **−15 Trust Points**.
- **Safety Threshold**: If a user drops below **10**, their account is automatically **Disabled**.

### 🧠 Scam Reputation Engine
Whenever a report is resolved, the system recalculates the target's threat level using:
- **Report Volume**: Frequency of reports over time.
- **Reporter Trust**: Bonuses for reports from "Trusted" community members.
- **Keyword Severity**: High-risk pattern matching for keywords like *OTP, KYC, Bank, UPI, etc.*
- **Surge Detection**: Identifies rapid spikes in activity (e.g., >3 reports in 7 days).

---

## 🏗️ Project Structure

```text
cyber-crime-portal/
├── backend/                # Node.js + Express API
│   ├── config/             # DB & Env configuration
│   ├── controllers/        # Logic handlers (Trust Algorithm, Scam Engine)
│   ├── middleware/         # JWT, RBAC, & File Upload guards
│   ├── models/             # Mongoose Schemas (User, Complaint, Scam)
│   ├── routes/             # API Endpoint definitions
│   ├── services/           # DB & 3rd party logic abstraction
│   └── validators/         # Joi/Express-validator logic
├── frontend/               # React 19 + Vite + Tailwind
│   ├── src/
│   │   ├── components/     # Atomic UI components
│   │   ├── layouts/        # Dashboard & Navigation wrappers
│   │   ├── pages/          # Feature views (ScamChecker, Profile, Dashboards)
│   │   └── services/       # Axios API client & Interceptors
│   └── index.html          # HTML Entry
└── README.md               # Documentation
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Storage** | Cloudinary (Evidence Images) |
| **Email** | Resend API |
| **Auth** | JWT (JSON Web Tokens), Bcrypt.js |

---

## 📥 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Cloudinary & Resend API Keys

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/bhargabdeka-deka/cyber-crime-portal.git
   cd cyber-crime-portal
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   CLOUDINARY_URL=your_cloudinary_url
   RESEND_API_KEY=your_resend_key
   ```

3. **Run Development Servers**
   ```bash
   # Terminal 1
   cd backend && npm run dev
   # Terminal 2
   cd frontend && npm run dev
   ```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Contact

**Bhargab Deka** - [@bhargabdeka](https://github.com/bhargabdeka-deka)  
**Project Link:** [https://github.com/bhargabdeka-deka/cyber-crime-portal](https://github.com/bhargabdeka-deka/cyber-crime-portal)
