require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// ================= CORS =================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// ================= Middleware =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= Static Upload Folder =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= Routes =================
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);

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