# Personal Task Manager – MERN Stack Application

A full-stack task management dashboard built for the **Codewise Infotech Full-Stack Development Internship Assessment**.

The application enables users to create, organize, filter, sort, update, and track personal tasks with real-time UI updates, robust data validation, and responsive design.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Architecture & Structure](#project-architecture--structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Automated Backend Testing](#automated-backend-testing)
- [Assessment Questions (Part 3)](#assessment-questions-part-3)
- [GitHub Submission Guide](#github-submission-guide)

---

## Overview

Personal Task Manager is built strictly following the requirements outlined in the Codewise assessment brief. It implements a decoupled Model-View-Controller (MVC) architecture on the Express/Node.js backend with MongoDB/Mongoose persistence, coupled with a fast, modern React single-page frontend powered by Vite and Axios.

---

## Key Features

### Backend (Node.js + Express + MongoDB)
- **MVC Architecture**: Strict separation of concerns across `config`, `models`, `controllers`, `routes`, and `middleware`.
- **Complete REST API**: Full CRUD endpoints (`POST /tasks`, `GET /tasks`, `GET /tasks/:id`, `PUT /tasks/:id`, `DELETE /tasks/:id`).
- **Data Validation & Sanitization**:
  - Rejects empty titles, invalid priority (`low | medium | high`), invalid status (`todo | in_progress | done`), and invalid dates with HTTP `400 Bad Request`.
  - Validates MongoDB `ObjectId` formats, returning HTTP `400` with clear error messages instead of server crashes.
  - Returns HTTP `404 Not Found` for non-existent task IDs.
- **Filtering & Semantic Sorting**:
  - Filters by status (`todo`, `in_progress`, `done`).
  - Filters by priority (`low`, `medium`, `high`).
  - Text search across title and description.
  - Semantic priority sorting (`high > medium > low`) via MongoDB aggregation pipelines.
  - Due date sorting with null-safe handling.
- **Centralized Error Handling**: Unified error middleware with clean JSON error responses and no raw stack traces exposed to clients.
- **Database Optimization**: Mongoose indexing on `status`, `priority`, `dueDate`, and `createdAt` for high-throughput queries.

### Frontend (React + Vite)
- **Interactive Dashboard**:
  - Top header displaying project brand and Codewise assessment status.
  - Real-time stats summary cards (Total tasks, To Do, In Progress, Completed, Overdue).
  - Segmented status tabs (`All`, `To Do`, `In Progress`, `Done`) with instant counts.
  - Instant status dropdown on task cards that updates backend and UI immediately without page refresh.
- **Task Management**:
  - Modal form for creating tasks with input validation and priority selection.
  - Edit modal for modifying existing task titles, descriptions, due dates, priorities, and statuses.
  - Confirmation dialog before deletion to prevent accidental data loss.
- **Smart Due Date Badging**:
  - Highlights overdue tasks in red with relative indicators (e.g., `2d overdue`).
  - Highlights due today and upcoming deadlines.
- **UI/UX & Accessibility**:
  - Loading skeleton placeholders while fetching data.
  - Friendly empty-state views tailored to each active filter tab.
  - Non-intrusive floating toast notifications for success and error messages.
  - Fully responsive grid and flexbox layout supporting desktop, tablet, and mobile displays.

---

## Technology Stack

- **Frontend**: React 19, Vite, Axios, Lucide React (icons), Pure CSS
- **Backend**: Node.js (v20+), Express.js (v4.21)
- **Database**: MongoDB (v7.0)
- **ODM**: Mongoose (v8.9)
- **Environment Management**: Dotenv
- **Version Control**: Git & GitHub

---

## Project Architecture & Structure

```
Codewise-Task-Manager/
├── .env.example                # Root environment variable template
├── .gitignore                  # Git exclusions (node_modules, .env, dist)
├── NOTES.md                    # Assessment write-up questions (Part 3)
├── README.md                   # Full documentation
├── package.json                # Root convenience scripts
│
├── backend/
│   ├── .env                    # Local environment variables (git-ignored)
│   ├── .env.example            # Backend env template
│   ├── package.json            # Backend dependencies & scripts
│   ├── server.js               # Express application entry point
│   ├── test-api.js             # Automated end-to-end API test suite
│   ├── config/
│   │   └── db.js               # MongoDB connection handler
│   ├── controllers/
│   │   └── taskController.js   # Task CRUD & query logic
│   ├── middleware/
│   │   ├── errorHandler.js     # Centralized error & 404 handlers
│   │   ├── validateObjectId.js # MongoDB ObjectId format validator
│   │   └── validateTask.js     # Payload & enum validators
│   ├── models/
│   │   └── Task.js             # Mongoose Task schema & indexes
│   └── routes/
│       └── taskRoutes.js       # REST route definitions
│
└── frontend/
    ├── .env                    # Frontend environment variables (git-ignored)
    ├── .env.example            # Frontend env template
    ├── index.html              # HTML shell with Google Fonts
    ├── package.json            # Frontend dependencies & scripts
    ├── vite.config.js          # Vite configuration (port 5173)
    └── src/
        ├── App.css             # Component styling & responsive layout
        ├── App.jsx             # Root React component & state management
        ├── index.css           # Global CSS variables & reset
        ├── main.jsx            # React DOM mounting
        ├── components/
        │   ├── ConfirmModal.jsx    # Delete confirmation modal
        │   ├── Header.jsx          # Dashboard header & action bar
        │   ├── Notification.jsx    # Toast notification system
        │   ├── TaskCard.jsx        # Individual task card component
        │   ├── TaskEditModal.jsx   # Edit task modal
        │   ├── TaskFilters.jsx     # Search, filter, and sorting controls
        │   ├── TaskForm.jsx        # Create task modal
        │   ├── TaskList.jsx        # Grid listing & empty/error states
        │   └── TaskStats.jsx       # Overview statistics cards
        └── services/
            └── api.js              # Axios HTTP client & error interceptors
```

---

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (v22 LTS recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: Community Server v6.0+ or MongoDB Atlas connection URI

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd Codewise-Task-Manager
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

## Environment Configuration

Both backend and frontend utilize environment configuration files. Copy the provided `.env.example` templates to `.env`:

### Backend Configuration (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codewise_task_manager
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

*(Note: Real `.env` files contain sensitive connection secrets and are strictly ignored by `.gitignore`.)*

---

## Running the Application

### Option 1: Run Backend and Frontend in Separate Terminals

**Terminal 1 (Backend Server):**
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Frontend will start on http://localhost:5173
```

### Option 2: Using Root Package Scripts

From the root project directory:
```bash
# Run backend development server
npm run dev:backend

# Run frontend development server
npm run dev:frontend

# Build frontend for production
npm run build:frontend
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## API Documentation

Base URL: `http://localhost:5000/api/tasks` *(also available at `http://localhost:5000/tasks`)*

### 1. Create a Task
- **Endpoint**: `POST /tasks`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Build authentication module",
    "description": "Implement JWT and secure password hashing with bcrypt",
    "priority": "high",
    "status": "todo",
    "dueDate": "2026-11-15T18:00:00.000Z"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Task created successfully",
    "data": {
      "id": "6725e24b420f1807d8f99e41",
      "title": "Build authentication module",
      "description": "Implement JWT and secure password hashing with bcrypt",
      "priority": "high",
      "status": "todo",
      "dueDate": "2026-11-15T18:00:00.000Z",
      "createdAt": "2026-11-02T08:34:19.467Z",
      "updatedAt": "2026-11-02T08:34:19.467Z"
    }
  }
  ```

### 2. List Tasks (With Filtering & Sorting)
- **Endpoint**: `GET /tasks`
- **Query Parameters**:
  - `status`: `todo` | `in_progress` | `done` | `all`
  - `priority`: `low` | `medium` | `high` | `all`
  - `sortBy`: `dueDate` | `priority` | `createdAt` (default: `createdAt`)
  - `order`: `asc` | `desc` (default: `desc`)
  - `search`: search keyword matching title or description
- **Example**: `GET /tasks?status=in_progress&sortBy=priority&order=desc`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": "6725e24b420f1807d8f99e41",
        "title": "Build authentication module",
        "description": "Implement JWT...",
        "priority": "high",
        "status": "in_progress",
        "dueDate": "2026-11-15T18:00:00.000Z",
        "createdAt": "2026-11-02T08:34:19.467Z"
      }
    ]
  }
  ```

### 3. Get Single Task
- **Endpoint**: `GET /tasks/:id`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "id": "6725e24b420f1807d8f99e41",
      "title": "Build authentication module",
      "priority": "high",
      "status": "in_progress"
    }
  }
  ```
- **Error Responses**:
  - Invalid ID format: `400 Bad Request` -> `{"success": false, "message": "Invalid task ID format..."}`
  - Non-existent ID: `404 Not Found` -> `{"success": false, "message": "Task not found with ID..."}`

### 4. Update Task
- **Endpoint**: `PUT /tasks/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body** (any field can be updated):
  ```json
  {
    "status": "done"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Task updated successfully",
    "data": {
      "id": "6725e24b420f1807d8f99e41",
      "status": "done"
    }
  }
  ```

### 5. Delete Task
- **Endpoint**: `DELETE /tasks/:id`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "data": {
      "id": "6725e24b420f1807d8f99e41"
    }
  }
  ```

---

## Automated Backend Testing

An automated end-to-end integration test suite is located in `backend/test-api.js`. It validates 17 comprehensive test scenarios:

1. Valid task creation (`201 Created`).
2. Default values assignment (`status=todo`, `priority=medium`).
3. Rejection of empty title with `400 Bad Request`.
4. Rejection of missing title with `400 Bad Request`.
5. Rejection of invalid priority enum with `400 Bad Request`.
6. Rejection of invalid status enum with `400 Bad Request`.
7. Listing all tasks with count.
8. Filtering tasks by status.
9. Rejection of invalid status query filter with `400 Bad Request`.
10. Sorting by priority (semantic weights: High > Medium > Low).
11. Retrieval of single task by ID.
12. Invalid 24-hex ObjectId handling (`400 Bad Request`).
13. Non-existent valid ObjectId handling (`404 Not Found`).
14. Updating task fields (`PUT /tasks/:id`).
15. Rejection of invalid updates (`400 Bad Request`).
16. Deleting existing task (`200 OK`).
17. Deleting non-existent task (`404 Not Found`).

### To run the test suite:
```bash
cd backend
npm test
# Or: node test-api.js
```

---

## Assessment Questions (Part 3)

Detailed answers to the assessment questions are available in [NOTES.md](./NOTES.md):
1. **Multi-User Architecture & Data Model**: Introduction of a `User` model, `userId` task references, JWT bearer authentication middleware, and tenant-scoped queries.
2. **Performance at Scale (Thousands of Tasks)**: Server-side cursor/offset pagination, compound database indexing, and DOM virtualization on the frontend.
3. **AI Coding Tools Usage**: Description of evaluating and replacing in-memory sorting with server-side aggregation pipelines using weighted priority branches.

---

## GitHub Submission Guide

Follow these steps to connect and push this repository to your GitHub account:

1. **Verify your local git status**:
   ```bash
   git status
   ```

2. **Create a new repository on GitHub**:
   - Go to [https://github.com/new](https://github.com/new)
   - Repository name: `Codewise-Task-Manager` (or your preferred name)
   - Set visibility to **Public** (or **Private** and invite Codewise as a collaborator as requested in the brief)
   - Do **NOT** initialize with README, .gitignore, or license (these already exist locally)
   - Click **Create repository**

3. **Link your local repository to GitHub**:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/Codewise-Task-Manager.git
   ```

4. **Push your code**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

5. **Verify the submission**:
   - Confirm all files (`backend/`, `frontend/`, `README.md`, `NOTES.md`, `.env.example`, `.gitignore`) are visible.
   - Confirm that neither `node_modules` nor actual `.env` files are tracked in the remote repository.
