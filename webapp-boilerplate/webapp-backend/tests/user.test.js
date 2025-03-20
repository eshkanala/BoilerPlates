// backend/tests/user.test.js
const request = require('supertest');
const app = require('../server'); // Import your Express app
const mongoose = require('mongoose');
const User = require('../models/userModel');

describe('User API Endpoints', () => {
  beforeAll(async () => {
    // Connect to a test database (or use an in-memory database)
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from database and close server after all tests
    await mongoose.connection.close();
    // If your server is explicitly started in server.js, you might need to close it here as well.
  });

  beforeEach(async () => {
    // Clear the test database before each test
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const res = await request(app)
      .post('/api/users/register')
      .send(userData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.email).toEqual(userData.email);
  });

  // ... more tests for login, protected routes, etc. ...
});