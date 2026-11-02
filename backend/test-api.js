const assert = require('assert');
const http = require('http');
const mongoose = require('mongoose');
const app = require('./server');

const PORT = 5001; // Run test server on port 5001 to avoid conflicting with dev server
let server;
const BASE_URL = `http://localhost:${PORT}/api/tasks`;

// Helper for making HTTP JSON requests
async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { rawText: text };
  }

  return {
    status: response.status,
    headers: response.headers,
    data: json,
  };
}

async function runTests() {
  console.log('\n========================================');
  console.log('  RUNNING BACKEND API TEST SUITE');
  console.log('========================================\n');

  // Start test server
  await new Promise((resolve) => {
    server = app.listen(PORT, resolve);
  });
  console.log(`[Test Server] Listening on port ${PORT}`);

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`Testing: ${name}... `);
      await fn();
      console.log('PASSED');
      passed++;
    } catch (err) {
      console.log('FAILED');
      console.error(`  -> ${err.message}`);
      failed++;
    }
  }

  try {
    let createdTaskId;
    let taskTwoId;

    // Test 1: POST /tasks - Valid task creation
    await test('POST /tasks creates a valid task with 201 status', async () => {
      const res = await request(BASE_URL, {
        method: 'POST',
        body: {
          title: 'Implement Authentication',
          description: 'Set up JWT and bcrypt for user auth',
          priority: 'high',
          status: 'todo',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
        },
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.title, 'Implement Authentication');
      assert.strictEqual(res.data.data.priority, 'high');
      assert.strictEqual(res.data.data.status, 'todo');
      assert.ok(res.data.data.id || res.data.data._id);
      createdTaskId = res.data.data.id || res.data.data._id;
    });

    // Test 2: POST /tasks - Create second task with defaults
    await test('POST /tasks sets default status=todo and priority=medium', async () => {
      const res = await request(BASE_URL, {
        method: 'POST',
        body: {
          title: 'Write Unit Tests',
        },
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.data.status, 'todo');
      assert.strictEqual(res.data.data.priority, 'medium');
      assert.strictEqual(res.data.data.description, '');
      taskTwoId = res.data.data.id || res.data.data._id;
    });

    // Test 3: POST /tasks - Empty title validation (400)
    await test('POST /tasks rejects empty title with 400 Bad Request', async () => {
      const res = await request(BASE_URL, {
        method: 'POST',
        body: {
          title: '   ',
          priority: 'low',
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message || res.data.errors);
    });

    // Test 4: POST /tasks - Missing title validation (400)
    await test('POST /tasks rejects missing title with 400 Bad Request', async () => {
      const res = await request(BASE_URL, {
        method: 'POST',
        body: {
          description: 'No title given',
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
    });

    // Test 5: POST /tasks - Invalid priority validation (400)
    await test('POST /tasks rejects invalid priority with 400 Bad Request', async () => {
      const res = await request(BASE_URL, {
        method: 'POST',
        body: {
          title: 'Invalid Priority Task',
          priority: 'critical_urgent', // Not in [low, medium, high]
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
    });

    // Test 6: POST /tasks - Invalid status validation (400)
    await test('POST /tasks rejects invalid status with 400 Bad Request', async () => {
      const res = await request(BASE_URL, {
        method: 'POST',
        body: {
          title: 'Invalid Status Task',
          status: 'abandoned', // Not in [todo, in_progress, done]
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
    });

    // Test 7: GET /tasks - List all tasks
    await test('GET /tasks returns array of tasks with count', async () => {
      const res = await request(BASE_URL, { method: 'GET' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
      assert.ok(res.data.count >= 2);
    });

    // Test 8: GET /tasks?status=todo - Filter by status
    await test('GET /tasks?status=todo returns only tasks with todo status', async () => {
      const res = await request(`${BASE_URL}?status=todo`, { method: 'GET' });
      assert.strictEqual(res.status, 200);
      assert.ok(res.data.data.every((t) => t.status === 'todo'));
    });

    // Test 9: GET /tasks?status=invalid - Rejects invalid status filter
    await test('GET /tasks with invalid status query returns 400 Bad Request', async () => {
      const res = await request(`${BASE_URL}?status=unknown_filter`, { method: 'GET' });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
    });

    // Test 10: GET /tasks?sortBy=priority&order=desc - Sort by priority high to low
    await test('GET /tasks?sortBy=priority&order=desc sorts high before medium/low', async () => {
      const res = await request(`${BASE_URL}?sortBy=priority&order=desc`, { method: 'GET' });
      assert.strictEqual(res.status, 200);
      const highIndex = res.data.data.findIndex((t) => t.priority === 'high');
      const medIndex = res.data.data.findIndex((t) => t.priority === 'medium');
      if (highIndex !== -1 && medIndex !== -1) {
        assert.ok(highIndex < medIndex, 'High priority must precede medium priority');
      }
    });

    // Test 11: GET /tasks/:id - Fetch single task
    await test('GET /tasks/:id returns correct task data', async () => {
      const res = await request(`${BASE_URL}/${createdTaskId}`, { method: 'GET' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.title, 'Implement Authentication');
    });

    // Test 12: GET /tasks/:id - Invalid ObjectId (400)
    await test('GET /tasks/:id returns 400 for invalid ObjectId format', async () => {
      const res = await request(`${BASE_URL}/invalid-123-id`, { method: 'GET' });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('Invalid task ID format'));
    });

    // Test 13: GET /tasks/:id - Non-existent valid ObjectId (404)
    await test('GET /tasks/:id returns 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(`${BASE_URL}/${fakeId}`, { method: 'GET' });
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.message.includes('Task not found'));
    });

    // Test 14: PUT /tasks/:id - Update task fields
    await test('PUT /tasks/:id successfully updates status to in_progress', async () => {
      const res = await request(`${BASE_URL}/${createdTaskId}`, {
        method: 'PUT',
        body: {
          status: 'in_progress',
          priority: 'medium',
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.status, 'in_progress');
      assert.strictEqual(res.data.data.priority, 'medium');
    });

    // Test 15: PUT /tasks/:id - Invalid status in update (400)
    await test('PUT /tasks/:id rejects invalid status update with 400', async () => {
      const res = await request(`${BASE_URL}/${createdTaskId}`, {
        method: 'PUT',
        body: {
          status: 'invalid_status_value',
        },
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
    });

    // Test 16: DELETE /tasks/:id - Delete a task
    await test('DELETE /tasks/:id successfully removes the task', async () => {
      const res = await request(`${BASE_URL}/${taskTwoId}`, {
        method: 'DELETE',
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);

      // Verify it no longer exists
      const verifyRes = await request(`${BASE_URL}/${taskTwoId}`, { method: 'GET' });
      assert.strictEqual(verifyRes.status, 404);
    });

    // Test 17: DELETE /tasks/:id - Delete non-existent returns 404
    await test('DELETE /tasks/:id returns 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(`${BASE_URL}/${fakeId}`, {
        method: 'DELETE',
      });

      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.data.success, false);
    });

    // Clean up created task
    if (createdTaskId) {
      await request(`${BASE_URL}/${createdTaskId}`, { method: 'DELETE' });
    }
  } finally {
    // Close server and mongoose connection
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    console.log('\n========================================');
    console.log(`  TEST RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log('========================================\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
