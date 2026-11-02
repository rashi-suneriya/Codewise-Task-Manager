import React from 'react';
import { ListTodo, Clock, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { isTaskOverdue } from '../utils/dateUtils';

const TaskStats = ({ tasks, activeStatus, onSelectStatus }) => {
  const total = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  // Accurately count overdue tasks (excluding tasks due today or completed tasks)
  const overdueCount = tasks.filter((t) => isTaskOverdue(t.dueDate, t.status)).length;

  const stats = [
    {
      id: 'all',
      label: 'Total Tasks',
      count: total,
      icon: Layers,
      colorClass: 'stat-total',
    },
    {
      id: 'todo',
      label: 'To Do',
      count: todoCount,
      icon: ListTodo,
      colorClass: 'stat-todo',
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      count: inProgressCount,
      icon: Clock,
      colorClass: 'stat-inprogress',
    },
    {
      id: 'done',
      label: 'Completed',
      count: doneCount,
      icon: CheckCircle2,
      colorClass: 'stat-done',
    },
    {
      id: 'overdue',
      label: 'Overdue',
      count: overdueCount,
      icon: AlertTriangle,
      colorClass: 'stat-overdue',
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isActive = activeStatus === stat.id;

        return (
          <button
            key={stat.id}
            type="button"
            className={`stat-card ${stat.colorClass} ${isActive ? 'active' : ''}`}
            onClick={() => onSelectStatus(stat.id)}
            title={`Filter by ${stat.label}`}
          >
            <div className="stat-icon-wrapper">
              <Icon size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-count">{stat.count}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TaskStats;
