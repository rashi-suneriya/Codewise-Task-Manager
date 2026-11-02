const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const validateObjectId = require('../middleware/validateObjectId');
const {
  validateCreateTask,
  validateUpdateTask,
} = require('../middleware/validateTask');

// Route: /tasks
router
  .route('/')
  .post(validateCreateTask, createTask)
  .get(getTasks);

// Route: /tasks/:id
router
  .route('/:id')
  .get(validateObjectId, getTaskById)
  .put(validateObjectId, validateUpdateTask, updateTask)
  .delete(validateObjectId, deleteTask);

module.exports = router;
