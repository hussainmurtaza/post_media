const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    content: {
        type: String,
        required: true
    },
    img_url: {
        type: String
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

const Post = mongoose.model('post', postSchema);
module.exports = Post
