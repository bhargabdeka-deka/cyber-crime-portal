require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
// Enable CORS for all routes
app.use(cors());
// middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

// 🔥 Error middleware MUST be last
app.use(errorHandler);

// Start server only after DB connects
connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});
