const { body, query, validationResult } = require("express-validator");

const validateScamCheck = [
  body("value")
    .trim()
    .notEmpty()
    .withMessage("Value is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Value must be between 3 and 100 characters")
    .escape()
];

const validateScamCheckGet = [
  query("query")
    .trim()
    .notEmpty()
    .withMessage("Query parameter is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Query must be between 3 and 100 characters")
    .escape()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateScamCheck,
  validateScamCheckGet,
  handleValidationErrors
};
