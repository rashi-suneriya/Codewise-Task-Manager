import React from 'react';
import { Search, ArrowUpDown, Filter, X } from 'lucide-react';

const TaskFilters = ({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  order,
  onOrderToggle,
  search,
  onSearchChange,
  totalMatching,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  return (
    <div className="filters-container">
      {/* Search and Main Filters Row */}
      <div className="filters-top-row">
        {/* Search Bar */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Priority & Sorting Controls */}
        <div className="filter-controls-group">
          {/* Priority Filter */}
          <div className="select-control">
            <Filter size={16} className="select-icon" />
            <select
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="select-input"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Sort By Field */}
          <div className="select-control">
            <ArrowUpDown size={16} className="select-icon" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="select-input"
              aria-label="Sort tasks by"
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <button
            type="button"
            className="btn btn-secondary btn-order"
            onClick={onOrderToggle}
            title={order === 'asc' ? 'Ascending Order' : 'Descending Order'}
          >
            <span>{order === 'asc' ? '↑ Asc' : '↓ Desc'}</span>
          </button>
        </div>
      </div>

      {/* Status Segmented Tabs Row */}
      <div className="status-tabs-row">
        <div className="status-tabs" role="tablist">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={status === opt.value}
              className={`status-tab ${status === opt.value ? 'active' : ''}`}
              onClick={() => onStatusChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="filter-results-info">
          <span>Showing <strong>{totalMatching}</strong> {totalMatching === 1 ? 'task' : 'tasks'}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
