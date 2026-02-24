const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

module.exports = errorHandler;
