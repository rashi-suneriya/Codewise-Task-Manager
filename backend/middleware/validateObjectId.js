const mongoose = require('mongoose');

/**
 * Middleware to validate MongoDB ObjectId parameters.
 * Rejects invalid ObjectId format with HTTP 400 and a clear error message.
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid task ID format: '${id}'. Must be a valid 24-character hexadecimal ObjectId.`,
    });
  }

  next();
};

module.exports = validateObjectId;
