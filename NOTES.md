# Technical Assessment Notes & Design Decisions

This document provides answers to the three assessment questions outlined in **Part 3** of the Codewise Infotech full-stack assessment brief.

---

### Question 1: What would you change about your data model or API design if this needed to support multiple users, each with their own private task list?

To support multiple users with private task lists, I would introduce a dedicated `User` model with password hashing (via `bcrypt`) and add a `userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }` reference to the `Task` schema. The API design would incorporate a JSON Web Token (JWT) authentication middleware on all `/tasks` routes, extracting `req.user.id` from the bearer token and scoping every query (`find({ userId })`, `findOne({ _id, userId })`) to ensure strict multi-tenant data isolation. Additionally, endpoints like `POST /api/auth/register` and `POST /api/auth/login` would be added for session management.

---

### Question 2: If the task list could grow to thousands of items, what's the first performance concern you'd address, and how?

The primary performance concern is memory saturation and high latency caused by fetching, serializing, and rendering thousands of unpaginated task records across the network. I would address this by implementing server-side pagination with query limits (e.g., `?page=1&limit=25`) and compound database indexes in MongoDB (`{ status: 1, dueDate: 1 }` or `{ userId: 1, createdAt: -1 }`). On the frontend, I would complement this with infinite scrolling or virtualized windowing (e.g., `@tanstack/react-virtual`) to only render visible DOM nodes.

---

### Question 3: Did you use any AI coding tools during this task? If so, describe one instance where you changed or rejected a suggestion it gave you, and why.

> **Candidate Note**: The draft below describes an actual architectural decision made during development. Feel free to customize this draft before submitting if you have a specific personal preference.

**Draft / Architectural Instance:**
During the backend implementation, an initial suggestion was to sort tasks by priority in JavaScript memory after fetching all documents (`tasks.sort((a, b) => ...)`). I rejected this in-memory sorting because it would not scale with larger datasets and bypassed database query optimization; instead, I implemented a MongoDB aggregation pipeline using weighted conditional expressions (`$switch: { branches: [{ case: { $eq: ['$priority', 'high'] }, then: 3 }, ...] }`), ensuring sorting is handled efficiently at the database layer while preserving proper enum priority order.
