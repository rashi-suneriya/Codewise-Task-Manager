import React from 'react';
import TaskCard from './TaskCard';
import { ClipboardList, Plus, AlertCircle, RefreshCw } from 'lucide-react';

const TaskList = ({
  tasks,
  isLoading,
  error,
  onRetry,
  onStatusChange,
  onEdit,
  onDelete,
  onOpenCreateModal,
  updatingTaskId,
  activeFilter,
}) => {
  // Loading State Skeleton
  if (isLoading) {
    return (
      <div className="task-grid skeleton-grid">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="task-card skeleton-card">
            <div className="skeleton-line skeleton-badge"></div>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-desc"></div>
            <div className="skeleton-line skeleton-footer"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error State with Retry Button
  if (error) {
    return (
      <div className="empty-state error-state">
        <div className="empty-icon-wrapper error-icon-wrapper">
          <AlertCircle size={36} />
        </div>
        <h3 className="empty-title">Failed to load tasks</h3>
        <p className="empty-text">{error}</p>
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // Empty State (requirement 11)
  if (tasks.length === 0) {
    let emptyMessage = "You haven't created any tasks yet.";
    let emptySubtitle = "Get started by adding your first task to stay organized and productive.";

    if (activeFilter === 'todo') {
      emptyMessage = 'No tasks in To Do!';
      emptySubtitle = 'All pending tasks have been moved or completed.';
    } else if (activeFilter === 'in_progress') {
      emptyMessage = 'No tasks in progress.';
      emptySubtitle = 'Select a task to start working on or create a new one.';
    } else if (activeFilter === 'done') {
      emptyMessage = 'No completed tasks yet.';
      emptySubtitle = 'Keep working! Finished tasks will appear here.';
    } else if (activeFilter === 'overdue') {
      emptyMessage = 'No overdue tasks!';
      emptySubtitle = 'Great job! All of your tasks are currently on schedule.';
    }

    return (
      <div className="empty-state">
        <div className="empty-icon-wrapper">
          <ClipboardList size={40} />
        </div>
        <h3 className="empty-title">{emptyMessage}</h3>
        <p className="empty-text">{emptySubtitle}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenCreateModal}
        >
          <Plus size={18} />
          <span>Create Task</span>
        </button>
      </div>
    );
  }

  // Render Tasks Grid
  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id || task._id}
          task={task}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
          isUpdating={updatingTaskId === (task.id || task._id)}
        />
      ))}
    </div>
  );
};

export default TaskList;
