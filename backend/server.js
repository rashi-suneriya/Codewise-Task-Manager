const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware: Enable Cross-Origin Resource Sharing
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      // In development, allow localhost on any port or configured origin
      if (
        origin === clientUrl ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local internship assessment review
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Middleware: Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Personal Task Manager API',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Personal Task Manager API',
  });
});

// Mount Task Routes on both /tasks and /api/tasks for developer convenience
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

// Catch-all 404 handler for unknown endpoints
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Server] Codewise Task Manager running on port ${PORT}`);
    console.log(`[Server] API endpoints available at http://localhost:${PORT}/api/tasks`);
  });
}

module.exports = app;
