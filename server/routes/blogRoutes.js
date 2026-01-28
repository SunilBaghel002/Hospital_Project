const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const adminAuth = require('../middleware/adminAuth');

// GET all published blogs (public)
router.get('/', async (req, res) => {
    try {
        let query = Blog.find({ isPublished: true })
            .sort({ publishedAt: -1 })
            .select('-content'); // Exclude full content for list

        if (req.query.limit) {
            query = query.limit(parseInt(req.query.limit));
        }

        const blogs = await query;
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET all blogs (admin - includes drafts)
router.get('/admin', adminAuth, async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET single blog by slug (public)
router.get('/slug/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET single blog by ID (admin)
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// CREATE blog (admin)
router.post('/', adminAuth, async (req, res) => {
    try {
        const blog = new Blog(req.body);
        if (req.body.isPublished && !blog.publishedAt) {
            blog.publishedAt = new Date();
        }
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: 'Validation error', error: error.message });
    }
});

// UPDATE blog (admin)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        // If publishing for first time, set publishedAt
        if (req.body.isPublished) {
            const existing = await Blog.findById(req.params.id);
            if (existing && !existing.publishedAt) {
                req.body.publishedAt = new Date();
            }
        }

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: 'Validation error', error: error.message });
    }
});

// DELETE blog (admin)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
