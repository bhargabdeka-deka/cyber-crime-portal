const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. User not authenticated.",
      });
    }

    const userRole = req.user.role?.toLowerCase();

    // Check role existence and permission
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.warn(`Forbidden access attempt by role: ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized.`,
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
