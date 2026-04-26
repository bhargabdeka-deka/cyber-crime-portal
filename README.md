# 🛡️ CyberShield

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)](https://cybershield-green-two.vercel.app)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

**CyberShield** is a comprehensive, production-grade cybersecurity intelligence and reporting platform. It empowers citizens to report cyber crimes and verify suspicious identifiers (phone numbers, UPI IDs, URLs) in real-time using a community-driven trust ecosystem.

[**Live Demo**](https://cybershield-green-two.vercel.app) | [**Report a Bug**](https://github.com/bhargabdeka-deka/cyber-crime-portal/issues)

---

## 🚀 Key Features

- **🔍 Real-Time Scam Detection**: Instantly verify suspicious numbers or links against a database of confirmed threats.
- **🛡️ Trust-Based Reporting**: A sophisticated `trustScore` system that rewards high-quality reports and penalizes spam.
- **📊 Impact Dashboard**: Registered users can track their contribution to community safety with personalized impact stats.
- **⚖️ Admin Enforcement**: Comprehensive case management system for authorities to investigate, resolve, or reject reports.
- **📱 Fully Responsive**: A seamless experience across mobile, tablet, and desktop devices.
- **🔐 Enterprise Security**: JWT-based authentication, RBAC, secure evidence storage via Cloudinary, and automated email notifications.

---

## 🏗️ Project Structure

```text
cyber-crime-portal/
├── backend/                # Node.js + Express API
│   ├── config/             # DB & Env configuration
│   ├── controllers/        # Logical request handlers
│   ├── middleware/         # JWT, RBAC, & File Upload guards
│   ├── models/             # Mongoose Schemas (User, Complaint, Scam)
│   ├── routes/             # API Endpoint definitions
│   ├── services/           # Abstraction layer for DB & 3rd party logic
│   ├── utils/              # Email (Resend), Cloudinary, & Math helpers
│   ├── validators/         # Joi/Express-validator logic
│   └── server.js           # Server entry point
├── frontend/               # React 19 + Vite
│   ├── src/
│   │   ├── components/     # Atomic UI components
│   │   ├── layouts/        # Sidebar & Header wrappers
│   │   ├── pages/          # Feature views (Dashboards, Forms, Search)
│   │   ├── services/       # Axios API client & Interceptors
│   │   └── App.js          # Router & Global state
│   └── index.html          # HTML Entry
└── README.md               # Documentation
```

---

## ⚙️ Core Logic & Security

### 💎 The Trust Algorithm
To maintain data integrity, CyberShield implements a "Skin in the Game" trust model:
- **Baseline**: New users start with a trust score of 50.
- **Positive Reinforcement**: Admin resolving a report → **+5 Trust Points**.
- **Negative Reinforcement**: Admin rejecting a fake/spam report → **−15 Trust Points**.
- **Safety Threshold**: If a user drops below **10**, their account is automatically **Disabled**.
- **Recovery**: If an account is disabled, filing valid reports (which are then resolved) will auto-enable the account once the score climbs back above 10.

### 🛡️ Submission Guards
- **Cooldown**: 60-second limit between report submissions to prevent bot flooding.
- **Daily Quota**: Maximum of 3 reports per user per day.
- **Content Quality**: Server-side checks for minimum word count (5+) and regex-based spam/garbage pattern detection.

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
   # From root
   cd backend && npm run dev
   # From root (separate terminal)
   cd frontend && npm run dev
   ```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Contact

**Bhargab Deka** - [@bhargabdeka](https://github.com/bhargabdeka-deka)  
**Project Link:** [https://github.com/bhargabdeka-deka/cyber-crime-portal](https://github.com/bhargabdeka-deka/cyber-crime-portal)
