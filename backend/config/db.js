const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 * Logs connection state and handles initial connection errors.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codewise_task_manager';

  try {
    const conn = await mongoose.connect(uri, {
      // Modern mongoose settings are defaulted, but keeping explicit options ensures stability
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Initial connection error: ${error.message}`);
    // Do not crash server immediately in development so health checks or offline mode can provide clear guidance
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
