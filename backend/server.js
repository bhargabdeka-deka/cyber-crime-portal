require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");   // ✅ Added
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const scamRoutes = require("./routes/scamRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// ================= Security Headers =================
app.use(helmet());

// ================= CORS =================
// Allow all origins — safe for a public reporting platform
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());

// ================= Middleware =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle malformed JSON body gracefully
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }
  next(err);
});

// ================= Static Upload Folder =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= Routes =================
app.use("/api/users",      userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/scam",       scamRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend API working perfectly 🚀"
  });
});

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