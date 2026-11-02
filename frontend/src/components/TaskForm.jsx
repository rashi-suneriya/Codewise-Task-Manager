import React, { useState } from 'react';
import { X, Calendar, Flag, CheckCircle, Loader2 } from 'lucide-react';

const TaskForm = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
  });

  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' && validationError) {
      setValidationError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || formData.title.trim().length === 0) {
      setValidationError('Task title is required.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };

    onSubmit(payload, () => {
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
      });
      onClose();
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">Create New Task</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="task-title"
              name="title"
              type="text"
              className={`form-input ${validationError ? 'input-error' : ''}`}
              placeholder="e.g., Complete code review for PR #42"
              value={formData.title}
              onChange={handleChange}
              autoFocus
              maxLength={150}
            />
            {validationError && (
              <span className="form-error-msg">{validationError}</span>
            )}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              Description <span className="optional-tag">(Optional)</span>
            </label>
            <textarea
              id="task-desc"
              name="description"
              className="form-textarea"
              placeholder="Add additional details, links, or notes..."
              rows={3}
              value={formData.description}
              onChange={handleChange}
              maxLength={2000}
            />
          </div>

          {/* Priority & Status Row */}
          <div className="form-row">
            {/* Priority Selector */}
            <div className="form-group flex-1">
              <label className="form-label">Priority</label>
              <div className="priority-options">
                {['low', 'medium', 'high'].map((p) => (
                  <label
                    key={p}
                    className={`priority-radio-label priority-${p} ${
                      formData.priority === p ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={formData.priority === p}
                      onChange={handleChange}
                    />
                    <span className="capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Selector */}
            <div className="form-group flex-1">
              <label htmlFor="task-status" className="form-label">Status</label>
              <select
                id="task-status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date Field */}
          <div className="form-group">
            <label htmlFor="task-due-date" className="form-label">
              Due Date <span className="optional-tag">(Optional)</span>
            </label>
            <div className="input-with-icon">
              <Calendar size={18} className="input-icon" />
              <input
                id="task-due-date"
                name="dueDate"
                type="date"
                className="form-input has-icon"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Task</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
