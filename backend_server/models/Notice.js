const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    category: String,
    fileUrl: String,
    isImportant: {
        type: Boolean,
        default: false
    },
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date
});

module.exports = mongoose.model('Notice', NoticeSchema);