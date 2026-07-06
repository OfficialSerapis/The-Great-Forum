require('dotenv').config();  // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/tgf', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
