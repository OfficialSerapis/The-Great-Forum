const request = require('supertest');  // Supertest to handle HTTP requests
const app = require('../backend/app');  // Import your app

describe('User Profile', () => {
    let token;

    // Register and login a new user before running profile tests
    beforeAll(async () => {
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
                password: 'testpassword'
            });
        expect(registerRes.statusCode).toEqual(201);

        // Login and retrieve token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword'
            });
        expect(loginRes.statusCode).toEqual(200);
        token = loginRes.body.token;
    });

    // Fetch user profile
    it('should fetch the user profile', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('username', 'TestUser');
    });

    // Update user profile
    it('should update the user profile', async () => {
        const res = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'UpdatedTestUser',
                bio: 'This is my bio'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('username', 'UpdatedTestUser');
        expect(res.body).toHaveProperty('bio', 'This is my bio');
    });
});
