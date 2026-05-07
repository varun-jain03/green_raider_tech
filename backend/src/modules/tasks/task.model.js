// Dependencies
const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: 2,
      maxlength: 200
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: ''
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: {
      type: Date,
      default: null
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Useful compound index for dashboard filtering
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
