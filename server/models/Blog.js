const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Blog content is required']
    },
    author: {
        name: { type: String, required: true },
        role: { type: String }
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    readTime: {
        type: String,
        default: '5 min read'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

// Auto-generate slug from title
blogSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Index
// Index
blogSchema.index({ isPublished: 1, publishedAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
