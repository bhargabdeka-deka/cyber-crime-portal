require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const scamRoutes = require("./routes/scamRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const morgan = require("morgan");

const app = express();

// ================= Logging =================
app.use(morgan("dev"));

// ================= Security Headers =================
app.use(helmet({
  contentSecurityPolicy: false,
}));

// ================= Rate Limiting =================
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === "::1" || req.ip === "127.0.0.1" || req.hostname === "localhost",
  message: { success: false, message: "Too many requests, please try again later." }
});

// Apply rate limiting to all API routes
app.use("/api/", limiter);

// ================= CORS =================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://cybershield-green-two.vercel.app", // Explicitly added as per audit
  "http://localhost:3000",
  "http://127.0.0.1:3000"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("vercel.app")) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

// ================= Body Parsing =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());
app.use(hpp());

// ================= API Routes =================
// Health check for deployment validation
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/scam", scamRoutes);
app.use("/api/admin", adminRoutes);

// ================= Static Upload Folder =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= Serve React Frontend (Production) =================
if (process.env.NODE_ENV === "production") {
  const frontendBuild = path.join(__dirname, "..", "frontend", "build");
  app.use(express.static(frontendBuild));
  
  app.get("*", (req, res) => {
    // If it's an API route that wasn't found, don't serve HTML
    if (req.url.startsWith("/api/")) {
      return res.status(404).json({ success: false, message: "API endpoint not found" });
    }
    
    const indexPath = path.join(frontendBuild, "index.html");
    const fs = require("fs");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(200).json({ success: true, message: "API is active. Frontend build missing." });
    }
  });
} else {
  app.get("/", (req, res) => res.json({ success: true, message: "Backend API running 🚀" }));
}

// ================= Error Handler =================
app.use(errorHandler);

// ================= Start Server =================
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
