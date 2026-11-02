const VALID_PRIORITIES = ['low', 'medium', 'high'];
const VALID_STATUSES = ['todo', 'in_progress', 'done'];

/**
 * Validates request payload when creating a new task (POST /tasks)
 */
const validateCreateTask = (req, res, next) => {
  const { title, priority, status, dueDate } = req.body;
  const errors = [];

  // Validate title
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and cannot be empty or whitespace.');
  } else if (title.trim().length > 150) {
    errors.push('Title cannot exceed 150 characters.');
  }

  // Validate priority if provided
  if (priority !== undefined && !VALID_PRIORITIES.includes(String(priority).toLowerCase().trim())) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  // Validate status if provided
  if (status !== undefined && !VALID_STATUSES.includes(String(status).toLowerCase().trim())) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  // Validate dueDate if provided
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Due date must be a valid ISO date or parseable date string.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request payload',
      errors,
    });
  }

  next();
};

/**
 * Validates request payload when updating an existing task (PUT /tasks/:id)
 */
const validateUpdateTask = (req, res, next) => {
  const { title, priority, status, dueDate } = req.body;
  const errors = [];

  // Title validation if provided in update payload
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title cannot be empty or whitespace.');
    } else if (title.trim().length > 150) {
      errors.push('Title cannot exceed 150 characters.');
    }
  }

  // Priority validation if provided
  if (priority !== undefined && !VALID_PRIORITIES.includes(String(priority).toLowerCase().trim())) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  // Status validation if provided
  if (status !== undefined && !VALID_STATUSES.includes(String(status).toLowerCase().trim())) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  // Due date validation if provided
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Due date must be a valid ISO date or parseable date string.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid update payload',
      errors,
    });
  }

  next();
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  VALID_PRIORITIES,
  VALID_STATUSES,
};
