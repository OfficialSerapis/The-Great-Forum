const mongoose = require('mongoose');
const Comment = require('./Comment');

const PostSchema = new mongoose.Schema({
    user: { type: String, required: true },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },  // Upvotes field
    downvotes: { type: Number, default: 0 },  // Downvotes field
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
