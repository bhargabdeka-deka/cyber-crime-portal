const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const { validateRegister, handleValidationErrors } = require("../validators/userValidator");

const router = express.Router();

// ================= CREATE ADMIN (SUPERADMIN ONLY) =================
router.post("/create-admin", protect, authorizeRoles("superadmin"), validateRegister, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If already admin
      if (existingUser.role === "admin") {
        return res.status(400).json({
          success: false,
          message: "User is already an admin",
        });
      }

      // If superadmin (do not allow changes)
      if (existingUser.role === "superadmin") {
        return res.status(400).json({
          success: false,
          message: "Cannot modify superadmin",
        });
      }

      // PROMOTE USER → ADMIN
      existingUser.role = "admin";
      await existingUser.save();

      return res.status(200).json({
        success: true,
        message: "User promoted to admin successfully",
      });
    }

    // Hash password (existing password hashing logic for NEW users)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with role "admin"
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ success: false, message: "Server error while creating admin." });
  }
});

// ================= DISABLE USER (SOFT DELETE) =================
router.put("/disable-user/:id", protect, authorizeRoles("admin", "superadmin"), async (req, res) => {
  try {
    const userToDisable = await User.findById(req.params.id);

    if (!userToDisable) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // ── Step 5: Prevent self-disable ─────────────────────────────
    if (req.user.id === userToDisable._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot disable your own account." });
    }

    // ── Step 4: Prevent disabling a superadmin ────────────────────
    if (userToDisable.role === "superadmin") {
      return res.status(403).json({ success: false, message: "Cannot disable a superadmin account." });
    }

    // ── Step 4: Only superadmin can disable another admin ─────────
    if (userToDisable.role === "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Only superadmin can disable an admin account." });
    }

    // Already disabled — idempotent, no error
    if (userToDisable.isDisabled) {
      return res.status(200).json({ success: true, message: `${userToDisable.name} is already disabled.` });
    }

    userToDisable.isDisabled = true;
    userToDisable.disabledAt = new Date();
    userToDisable.disabledBy = req.user.id;

    await userToDisable.save();

    res.status(200).json({
      success: true,
      message: `User ${userToDisable.name} has been disabled.`,
    });
  } catch (error) {
    console.error("Disable User Error:", error);
    res.status(500).json({ success: false, message: "Server error while disabling user." });
  }
});

// ================= ENABLE USER (SOFT DELETE REVERSAL) =================
router.put("/enable-user/:id", protect, authorizeRoles("admin", "superadmin"), async (req, res) => {
  try {
    const userToEnable = await User.findById(req.params.id);

    if (!userToEnable) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Only superadmin can re-enable an admin
    if (userToEnable.role === "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Only superadmin can enable an admin account." });
    }

    userToEnable.isDisabled = false;
    userToEnable.disabledAt = undefined;
    userToEnable.disabledBy = undefined;

    await userToEnable.save();

    res.status(200).json({
      success: true,
      message: `User ${userToEnable.name} has been enabled.`,
    });
  } catch (error) {
    console.error("Enable User Error:", error);
    res.status(500).json({ success: false, message: "Server error while enabling user." });
  }
});

// ================= GET USERS LIST (ADMIN/SUPERADMIN ONLY) =================
router.get("/users", protect, authorizeRoles("admin", "superadmin"), async (req, res) => {
  try {
    // Include _id so the frontend can call disable/enable by ID
    const users = await User.find({}).select("name email role isDisabled");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Get Users List Error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching users." });
  }
});

module.exports = router;
