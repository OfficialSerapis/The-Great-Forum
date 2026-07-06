const request = require('supertest');
const app = require('../backend/app');
const mongoose = require('mongoose');
const User = require('../backend/models/User'); // Import the User model to clean up users

describe('POST /api/posts', () => {
  let token;

  // Clear existing users before registering a new one
  beforeAll(async () => {
    await User.deleteOne({ email: 'johndoe@example.com' });  // Clean up user

    // Register a new user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'JohnDoe',
        email: 'johndoe@example.com',
        password: 'testpassword'
      });

    console.log('Register Response:', registerRes.body);
    expect(registerRes.statusCode).toEqual(201);  // Expect successful registration
  });

  // Login and retrieve token before running the test
  beforeEach(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'johndoe@example.com',
        password: 'testpassword'
      });

    console.log('Login Response:', loginRes.body);
    token = loginRes.body.token;
    console.log('JWT Token:', token);
  });

  // Test post creation with a valid token
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a test post'
      });

    console.log('Create Post Response:', res.body);
    expect(res.statusCode).toEqual(201);  // Check for success status code
    expect(res.body).toHaveProperty('content');  // Check if content is returned
  });

  // Test post editing
  it('should edit a post', async () => {
    const newPost = await request(app)
      .post('/api/posts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'This is a new post' });

    const postId = newPost.body._id;

    const editRes = await request(app)
      .put(`/api/posts/edit/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'This is an updated post' });

    expect(editRes.statusCode).toEqual(200);
    expect(editRes.body).toHaveProperty('content', 'This is an updated post');
  });

  // Test post deletion
  it('should delete a post', async () => {
    const newPost = await request(app)
      .post('/api/posts/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Post to be deleted' });

    const postId = newPost.body._id;

    const deleteRes = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body).toHaveProperty('message', 'Post deleted successfully');
  });

  // Close the MongoDB connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
