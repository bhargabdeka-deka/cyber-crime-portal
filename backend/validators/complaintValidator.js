const { body, validationResult } = require("express-validator");

// Complaint validation rules (title + description + location)
const validateComplaint = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters")
    .escape(),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters")
    .escape(),

  body("location")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location is too long")
    .escape(),
];

// Middleware: reject if no evidence file was uploaded (skipped for test users)
const evidenceRequired = (req, res, next) => {
  // Bypass for QA testing if user is logged in and has @test.com email
  if (req.user && req.user.email && req.user.email.endsWith("@test.com")) {
    return next();
  }

  if (!req.file) {
    return res.status(400).json({ message: "Evidence file is required." });
  }
  next();
};

// Status update validation
const validateStatusUpdate = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "Investigating", "Resolved"])
    .withMessage("Invalid status value")
];

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,   // surface first error cleanly
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateComplaint,
  evidenceRequired,
  validateStatusUpdate,
  handleValidationErrors
};
