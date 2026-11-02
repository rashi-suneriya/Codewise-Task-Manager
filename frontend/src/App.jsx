import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskEditModal from './components/TaskEditModal';
import ConfirmModal from './components/ConfirmModal';
import Notification from './components/Notification';
import { isTaskOverdue } from './utils/dateUtils';
import {
  getTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from './services/api';
import './App.css';

function App() {
  // Main Data States
  const [tasks, setTasks] = useState([]);
  const [allTasksForStats, setAllTasksForStats] = useState([]); // Keeps full list for stats calculation
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Sort States
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [search, setSearch] = useState('');

  // UI Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Fetch full task dataset for stats metrics
  const fetchStatsOverview = useCallback(async () => {
    try {
      const response = await getTasks();
      if (response && response.data) {
        setAllTasksForStats(response.data);
      }
    } catch (err) {
      // Non-blocking for stats
      console.error('Stats overview fetch error:', err);
    }
  }, []);

  // Fetch filtered and sorted tasks
  const loadTasks = useCallback(
    async (showLoadingSpinner = true) => {
      if (showLoadingSpinner) {
        setIsLoading(true);
      }
      setError(null);

      try {
        // When filtering by 'overdue', fetch non-status filtered data and apply timezone-aware overdue check
        const queryStatus = status === 'overdue' ? 'all' : status;
        const response = await getTasks({
          status: queryStatus,
          priority,
          sortBy,
          order,
          search,
        });

        if (response && response.data) {
          if (status === 'overdue') {
            setTasks(response.data.filter((t) => isTaskOverdue(t.dueDate, t.status)));
          } else {
            setTasks(response.data);
          }
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message || 'Failed to fetch tasks from server.');
        showNotification(err.message || 'Error connecting to backend API', 'error');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [status, priority, sortBy, order, search]
  );

  // Initial load and filter change trigger
  useEffect(() => {
    loadTasks();
    fetchStatsOverview();
  }, [loadTasks, fetchStatsOverview]);

  // Handler: Manual Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadTasks(false);
    fetchStatsOverview();
  };

  // Handler: Sort Order Toggle
  const handleOrderToggle = () => {
    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Handler: Create Task
  const handleCreateTask = async (taskData, onSuccess) => {
    setIsSubmitting(true);
    try {
      const response = await apiCreateTask(taskData);
      if (response && response.data) {
        showNotification('Task created successfully!', 'success');
        if (onSuccess) onSuccess();
        // Immediately reload data and stats
        loadTasks(false);
        fetchStatsOverview();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to create task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Quick Status Change (immediate UI feedback without reload)
  const handleQuickStatusChange = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);

    // Optimistic UI update
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        (t.id || t._id) === taskId ? { ...t, status: newStatus } : t
      )
    );
    setAllTasksForStats((prev) =>
      prev.map((t) =>
        (t.id || t._id) === taskId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await apiUpdateTask(taskId, { status: newStatus });
      showNotification(`Task status updated to "${newStatus.replace('_', ' ')}"`, 'success');
      // If current filter is active and doesn't match newStatus, reload view
      if (status !== 'all' && status !== newStatus) {
        loadTasks(false);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update task status.', 'error');
      // Revert on failure
      loadTasks(false);
      fetchStatsOverview();
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Handler: Full Task Update (from edit modal)
  const handleUpdateTask = async (taskId, taskData, onSuccess) => {
    setIsSubmitting(true);
    try {
      const response = await apiUpdateTask(taskId, taskData);
      if (response && response.data) {
        showNotification('Task updated successfully!', 'success');
        if (onSuccess) onSuccess();
        loadTasks(false);
        fetchStatsOverview();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Delete Task
  const handleDeleteTask = async (taskId) => {
    setIsSubmitting(true);
    try {
      await apiDeleteTask(taskId);
      showNotification('Task deleted successfully.', 'success');
      setDeletingTask(null);
      // Immediately reflect removal without page reload
      setTasks((prev) => prev.filter((t) => (t.id || t._id) !== taskId));
      setAllTasksForStats((prev) => prev.filter((t) => (t.id || t._id) !== taskId));
    } catch (err) {
      showNotification(err.message || 'Failed to delete task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Notification notification={notification} onClose={closeNotification} />

      {/* Header Bar */}
      <Header
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="main-content">
        <div className="content-container">
          {/* Quick Metrics Bar */}
          <TaskStats
            tasks={allTasksForStats}
            activeStatus={status}
            onSelectStatus={(selectedStatus) => setStatus(selectedStatus)}
          />

          {/* Filtering, Search & Sorting Controls */}
          <TaskFilters
            status={status}
            onStatusChange={setStatus}
            priority={priority}
            onPriorityChange={setPriority}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            order={order}
            onOrderToggle={handleOrderToggle}
            search={search}
            onSearchChange={setSearch}
            totalMatching={tasks.length}
          />

          {/* Task Listing / Empty State */}
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            error={error}
            onRetry={() => loadTasks(true)}
            onStatusChange={handleQuickStatusChange}
            onEdit={(task) => setEditingTask(task)}
            onDelete={(task) => setDeletingTask(task)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            updatingTaskId={updatingTaskId}
            activeFilter={status}
          />
        </div>
      </main>

      {/* Create Task Modal */}
      <TaskForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isSubmitting={isSubmitting}
      />

      {/* Edit Task Modal */}
      <TaskEditModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onUpdate={handleUpdateTask}
        isSubmitting={isSubmitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmModal
        task={deletingTask}
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        isDeleting={isSubmitting}
      />
    </div>
  );
}

export default App;
