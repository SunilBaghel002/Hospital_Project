const express = require('express');
const Page = require('../models/Page');
const Section = require('../models/Section');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

/**
 * GET /api/pages
 * Get all pages (with optional filtering by type)
 */
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        
        const pages = await Page.find(filter)
            .sort({ type: 1, navbarOrder: 1, createdAt: -1 })
            .populate('parentPage', 'title slug');
        
        res.json({
            success: true,
            data: pages
        });
    } catch (error) {
        console.error('Get pages error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pages.'
        });
    }
});

/**
 * GET /api/pages/:id
 * Get single page by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const page = await Page.findById(req.params.id)
            .populate('parentPage', 'title slug');
        
        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page not found.'
            });
        }
        
        // Get sections for this page
        const sections = await Section.find({ pageId: page._id })
            .sort({ order: 1 });
        
        res.json({
            success: true,
            data: { ...page.toObject(), sections }
        });
    } catch (error) {
        console.error('Get page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch page.'
        });
    }
});

/**
 * POST /api/pages
 * Create a new page
 */
router.post('/', async (req, res) => {
    try {
        const { slug, title, type, navbarOrder, parentPage, isPublished, showInNavbar, metaTitle, metaDescription, icon, hero } = req.body;
        
        // Check if slug already exists
        const existingPage = await Page.findOne({ slug });
        if (existingPage) {
            return res.status(400).json({
                success: false,
                message: 'A page with this slug already exists.'
            });
        }
        
        const page = await Page.create({
            slug,
            title,
            type: type || 'main',
            navbarOrder: navbarOrder || 0,
            parentPage: parentPage || null,
            isPublished: isPublished || false,
            showInNavbar: showInNavbar !== false,
            metaTitle,
            metaDescription,
            icon,
            hero
        });
        
        res.status(201).json({
            success: true,
            message: 'Page created successfully.',
            data: page
        });
    } catch (error) {
        console.error('Create page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create page.'
        });
    }
});

/**
 * PUT /api/pages/:id
 * Update a page
 */
router.put('/:id', async (req, res) => {
    try {
        const { slug, title, type, navbarOrder, parentPage, isPublished, showInNavbar, metaTitle, metaDescription, icon, hero } = req.body;
        
        // Check if new slug conflicts with another page
        if (slug) {
            const existingPage = await Page.findOne({ slug, _id: { $ne: req.params.id } });
            if (existingPage) {
                return res.status(400).json({
                    success: false,
                    message: 'A page with this slug already exists.'
                });
            }
        }
        
        const page = await Page.findByIdAndUpdate(
            req.params.id,
            { slug, title, type, navbarOrder, parentPage, isPublished, showInNavbar, metaTitle, metaDescription, icon, hero },
            { new: true, runValidators: true }
        );
        
        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page not found.'
            });
        }
        
        res.json({
            success: true,
            message: 'Page updated successfully.',
            data: page
        });
    } catch (error) {
        console.error('Update page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update page.'
        });
    }
});

/**
 * DELETE /api/pages/:id
 * Delete a page and its sections
 */
router.delete('/:id', async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        
        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page not found.'
            });
        }
        
        // Delete all sections belonging to this page
        await Section.deleteMany({ pageId: page._id });
        
        // Delete the page
        await page.deleteOne();
        
        res.json({
            success: true,
            message: 'Page and its sections deleted successfully.'
        });
    } catch (error) {
        console.error('Delete page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete page.'
        });
    }
});

/**
 * PUT /api/pages/reorder
 * Reorder navbar pages
 */
router.put('/reorder/navbar', async (req, res) => {
    try {
        const { orderedIds } = req.body;
        
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({
                success: false,
                message: 'orderedIds must be an array.'
            });
        }
        
        // Update each page's navbarOrder
        const updates = orderedIds.map((id, index) => 
            Page.findByIdAndUpdate(id, { navbarOrder: index })
        );
        
        await Promise.all(updates);
        
        res.json({
            success: true,
            message: 'Navbar order updated successfully.'
        });
    } catch (error) {
        console.error('Reorder pages error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reorder pages.'
        });
    }
});

module.exports = router;
