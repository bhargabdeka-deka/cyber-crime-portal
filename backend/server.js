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
// ================= CORS =================
const allowedOrigins = [
  process.env.FRONTEND_URL, // Vercel URL from env
  "http://localhost:3000",
  "http://127.0.0.1:3000"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    const isLocal =
      origin.includes("localhost") ||
      origin.includes("127.0.0.1");

    if (isLocal || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`❌ Blocked by CORS: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests
app.options("*", cors());


// ================= Body Parsing =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prevent NoSQL injection attacks
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
const hpp = require("hpp");
app.use(hpp());

// Handle malformed JSON gracefully
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }
  next(err);
});

// ================= Static Upload Folder =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= API Routes =================
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/scam", scamRoutes);
app.use("/api/admin", adminRoutes);

// ================= Serve React Frontend (Production) =================
// Render runs from repo root, so path is relative to backend folder
const frontendBuild = path.join(__dirname, "..", "frontend", "build");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendBuild));
  app.get("*", (req, res) => {
    const indexPath = path.join(frontendBuild, "index.html");
    // Check file exists before sending
    const fs = require("fs");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(200).json({ success: true, message: "API running. Frontend build not found." });
    }
  });
} else {
  app.get("/", (req, res) => {
    res.json({ success: true, message: "Backend API running 🚀" });
  });
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
