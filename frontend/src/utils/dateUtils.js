/**
 * Utility functions for date calculations and overdue status
 */

/**
 * Checks whether a task is overdue.
 * A task is overdue ONLY if:
 * 1. It has a valid dueDate.
 * 2. Its status is NOT 'done'.
 * 3. Its dueDate is strictly BEFORE the start of today (midnight 00:00:00 local time).
 * Tasks due today are NOT overdue (they are 'Due today').
 *
 * @param {string|Date} dueDate
 * @param {string} status
 * @returns {boolean}
 */
export const isTaskOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  const date = new Date(dueDate);
  if (isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((taskDate - today) / (1000 * 60 * 60 * 24));
  return diffDays < 0;
};

/**
 * Formats a due date for display on task cards with human-readable relative labels
 *
 * @param {string|Date} dateString
 * @param {string} status
 * @returns {Object|null}
 */
export const formatDueDate = (dateString, status) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((taskDate - today) / (1000 * 60 * 60 * 24));

  let relativeLabel = '';
  let isOverdue = false;
  let isDueToday = false;

  if (diffDays < 0 && status !== 'done') {
    isOverdue = true;
    relativeLabel = `${Math.abs(diffDays)}d overdue`;
  } else if (diffDays === 0) {
    isDueToday = true;
    relativeLabel = 'Due today';
  } else if (diffDays === 1) {
    relativeLabel = 'Due tomorrow';
  } else if (diffDays > 1 && diffDays <= 7) {
    relativeLabel = `In ${diffDays} days`;
  }

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });

  return {
    formattedDate,
    relativeLabel,
    isOverdue,
    isDueToday,
  };
};
