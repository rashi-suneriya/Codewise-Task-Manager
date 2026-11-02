import React from 'react';
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Flame,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { formatDueDate } from '../utils/dateUtils';

const TaskCard = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  isUpdating,
}) => {
  const { id, _id, title, description, priority, status, dueDate, createdAt } = task;
  const taskId = id || _id;

  const dueDateInfo = formatDueDate(dueDate, status);

  // Priority metadata
  const priorityConfig = {
    high: {
      label: 'High',
      className: 'priority-high',
      icon: ArrowUp,
    },
    medium: {
      label: 'Medium',
      className: 'priority-medium',
      icon: Minus,
    },
    low: {
      label: 'Low',
      className: 'priority-low',
      icon: ArrowDown,
    },
  };

  const currentPriority = priorityConfig[priority] || priorityConfig.medium;
  const PriorityIcon = currentPriority.icon;

  const isCompleted = status === 'done';

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''} ${isUpdating ? 'updating' : ''}`}>
      <div className="task-card-header">
        {/* Priority Badge */}
        <div className={`priority-badge ${currentPriority.className}`}>
          <PriorityIcon size={13} strokeWidth={2.5} />
          <span>{currentPriority.label}</span>
        </div>

        {/* Quick Status Dropdown (requirement 3: instant status update) */}
        <div className="status-selector-wrapper">
          <select
            value={status}
            onChange={(e) => onStatusChange(taskId, e.target.value)}
            disabled={isUpdating}
            className={`status-select status-${status}`}
            aria-label="Change task status"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Task Content */}
      <div className="task-card-body">
        <h3 className={`task-title ${isCompleted ? 'task-title-done' : ''}`}>{title}</h3>
        {description && <p className="task-description">{description}</p>}
      </div>

      {/* Task Footer */}
      <div className="task-card-footer">
        <div className="task-meta">
          {dueDateInfo ? (
            <div
              className={`due-date-badge ${dueDateInfo.isOverdue ? 'overdue' : ''} ${
                dueDateInfo.isDueToday ? 'due-today' : ''
              }`}
              title={`Due: ${dueDateInfo.formattedDate}`}
            >
              <Calendar size={14} />
              <span>{dueDateInfo.formattedDate}</span>
              {dueDateInfo.relativeLabel && (
                <span className="due-relative">({dueDateInfo.relativeLabel})</span>
              )}
            </div>
          ) : (
            <span className="no-due-date">No due date</span>
          )}
        </div>

        <div className="task-card-actions">
          <button
            type="button"
            className="action-btn edit-btn"
            onClick={() => onEdit(task)}
            disabled={isUpdating}
            title="Edit Task"
            aria-label="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            className="action-btn delete-btn"
            onClick={() => onDelete(task)}
            disabled={isUpdating}
            title="Delete Task"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
