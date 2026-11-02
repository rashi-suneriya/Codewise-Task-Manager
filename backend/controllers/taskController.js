const Task = require('../models/Task');
const { VALID_PRIORITIES, VALID_STATUSES } = require('../middleware/validateTask');

/**
 * @desc    Create a new task
 * @route   POST /tasks
 * @access  Public
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const taskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority ? priority.toLowerCase().trim() : 'medium',
      status: status ? status.toLowerCase().trim() : 'todo',
      dueDate: dueDate ? new Date(dueDate) : null,
    };

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks with optional filtering and sorting
 * @route   GET /tasks
 * @query   status: 'todo' | 'in_progress' | 'done'
 * @query   priority: 'low' | 'medium' | 'high'
 * @query   sortBy: 'dueDate' | 'priority' | 'createdAt'
 * @query   order: 'asc' | 'desc'
 * @query   search: string (matches title or description)
 * @access  Public
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sortBy = 'createdAt', order = 'desc', search } = req.query;

    // Build filter query object
    const filter = {};

    // Validate and apply status filter
    if (status && status !== 'all') {
      const normalizedStatus = status.toLowerCase().trim();
      if (normalizedStatus === 'overdue') {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        filter.status = { $ne: 'done' };
        filter.dueDate = { $ne: null, $lt: todayStart };
      } else if (!VALID_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter '${status}'. Allowed values: ${VALID_STATUSES.join(', ')}, overdue`,
        });
      } else {
        filter.status = normalizedStatus;
      }
    }

    // Validate and apply priority filter
    if (priority && priority !== 'all') {
      const normalizedPriority = priority.toLowerCase().trim();
      if (!VALID_PRIORITIES.includes(normalizedPriority)) {
        return res.status(400).json({
          success: false,
          message: `Invalid priority filter '${priority}'. Allowed values: ${VALID_PRIORITIES.join(', ')}`,
        });
      }
      filter.priority = normalizedPriority;
    }

    // Search query filter (matches title or description)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;

    // Handle priority sorting with semantic numeric weights (high > medium > low)
    if (sortBy === 'priority') {
      const pipeline = [
        { $match: filter },
        {
          $addFields: {
            priorityWeight: {
              $switch: {
                branches: [
                  { case: { $eq: ['$priority', 'high'] }, then: 3 },
                  { case: { $eq: ['$priority', 'medium'] }, then: 2 },
                  { case: { $eq: ['$priority', 'low'] }, then: 1 },
                ],
                default: 0,
              },
            },
          },
        },
        { $sort: { priorityWeight: sortOrder, createdAt: -1 } },
        {
          $project: {
            priorityWeight: 0,
          },
        },
      ];

      const rawTasks = await Task.aggregate(pipeline);
      // Map aggregated docs to include 'id' virtual
      const tasks = rawTasks.map((t) => {
        const id = t._id;
        delete t._id;
        return { ...t, id };
      });

      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    }

    // Handle standard sorting (dueDate, createdAt, etc.)
    const sortField = sortBy === 'dueDate' ? 'dueDate' : 'createdAt';
    const sortOptions = {};

    if (sortField === 'dueDate') {
      // Put null dueDates at the end
      sortOptions.dueDate = sortOrder;
      sortOptions.createdAt = -1;
    } else {
      sortOptions.createdAt = sortOrder;
    }

    const tasks = await Task.find(filter).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /tasks/:id
 * @access  Public
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update any task field
 * @route   PUT /tasks/:id
 * @access  Public
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (priority !== undefined) updates.priority = priority.toLowerCase().trim();
    if (status !== undefined) updates.status = status.toLowerCase().trim();
    if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /tasks/:id
 * @access  Public
 */
const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
