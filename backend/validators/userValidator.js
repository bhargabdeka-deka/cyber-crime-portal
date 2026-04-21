const { body, validationResult } = require("express-validator");

// ================= REGISTER VALIDATION =================
const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters")
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
];

// ================= LOGIN VALIDATION =================
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

// ================= HANDLE ERRORS =================
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  next();
};

// ================= PROFILE VALIDATION =================
const validateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters")
    .escape(),

  body("phone")
    .optional()
    .trim()
    .isLength({ max: 15 })
    .withMessage("Phone number too long")
    .escape(),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location too long")
    .escape(),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio too long")
    .escape()
];

// ================= PASSWORD RESET VALIDATION =================
const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
];

const validateResetPassword = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfile,
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors
};
