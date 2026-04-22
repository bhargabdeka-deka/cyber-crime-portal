const jwt = require("jsonwebtoken");


// ================= PROTECT (JWT VERIFY) =================
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ── Hardened check: verify user still exists and is NOT disabled ─────
      const User = require("../models/User");
      const user = await User.findById(decoded.id).select("isDisabled role email");

      if (!user) {
        return res.status(401).json({ success: false, message: "User no longer exists." });
      }

      if (user.isDisabled) {
        return res.status(403).json({ success: false, message: "Account is disabled. Access denied." });
      }

      req.user = { id: user._id, role: user.role, email: user.email }; 
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized. Token is invalid or expired." });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. No token provided." });
  }
};


// ================= ADMIN ONLY (legacy — use authorizeRoles instead) =================
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Access denied. Admin only." });
  }
};


module.exports = { protect, adminOnly };
