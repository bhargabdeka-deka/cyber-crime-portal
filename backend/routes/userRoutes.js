const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const {
  validateRegister,
  validateLogin,
  handleValidationErrors
} = require("../validators/userValidator");

const router = express.Router();

console.log("User Routes File Loaded");

// ================= REGISTER =================
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "User already exists"
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashedPassword
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User registered successfully"
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }
);

// ================= LOGIN =================
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }
);

// ================= PROTECTED PROFILE =================
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
