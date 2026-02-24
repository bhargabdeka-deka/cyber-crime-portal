const { body, validationResult } = require("express-validator");

// Complaint validation rules
const validateComplaint = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters")
];

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
      errors: errors.array()
    });
  }

  next();
};

module.exports = {
  validateComplaint,
  validateStatusUpdate,
  handleValidationErrors
};
