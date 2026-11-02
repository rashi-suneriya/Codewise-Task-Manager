import axios from 'axios';

// Default to backend port 5000 /api if not set in environment
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to normalize error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Backend returned an error response
      const data = error.response.data;
      if (data && data.message) {
        errorMessage = data.message;
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage += `: ${data.errors.join(', ')}`;
        }
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
    } else if (error.request) {
      // Network error or server unreachable
      errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
    } else {
      errorMessage = error.message;
    }

    const customError = new Error(errorMessage);
    customError.originalError = error;
    customError.status = error.response?.status;
    return Promise.reject(customError);
  }
);

/**
 * Fetch all tasks with optional query filters and sorting
 * @param {Object} params - { status, priority, sortBy, order, search }
 */
export const getTasks = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.status && params.status !== 'all') {
    queryParams.append('status', params.status);
  }
  if (params.priority && params.priority !== 'all') {
    queryParams.append('priority', params.priority);
  }
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params.order) {
    queryParams.append('order', params.order);
  }
  if (params.search && params.search.trim()) {
    queryParams.append('search', params.search.trim());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/tasks?${queryString}` : '/tasks';
  const response = await apiClient.get(url);
  return response.data;
};

/**
 * Fetch a single task by ID
 * @param {string} id
 */
export const getTaskById = async (id) => {
  const response = await apiClient.get(`/tasks/${id}`);
  return response.data;
};

/**
 * Create a new task
 * @param {Object} taskData - { title, description, priority, status, dueDate }
 */
export const createTask = async (taskData) => {
  const response = await apiClient.post('/tasks', taskData);
  return response.data;
};

/**
 * Update an existing task
 * @param {string} id
 * @param {Object} taskData - partial or full fields
 */
export const updateTask = async (id, taskData) => {
  const response = await apiClient.put(`/tasks/${id}`, taskData);
  return response.data;
};

/**
 * Delete a task by ID
 * @param {string} id
 */
export const deleteTask = async (id) => {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
};

export default apiClient;
