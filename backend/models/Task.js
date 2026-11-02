const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Task title cannot exceed 150 characters'],
      validate: {
        validator: function (v) {
          return typeof v === 'string' && v.trim().length > 0;
        },
        message: 'Task title cannot be empty or only whitespace',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be one of: low, medium, high',
      },
      default: 'medium',
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in_progress', 'done'],
        message: 'Status must be one of: todo, in_progress, done',
      },
      default: 'todo',
      lowercase: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (val) {
          if (val === null || val === undefined || val === '') return true;
          return !isNaN(new Date(val).getTime());
        },
        message: 'Due date must be a valid date format',
      },
    },
  },
  {
    timestamps: true, // Automatically provides createdAt and updatedAt timestamps
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

// Indexes for optimal query performance on filtering and sorting (per PDF & scaling requirements)
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Task', TaskSchema);
