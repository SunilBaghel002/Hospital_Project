const express = require('express');
const Section = require('../models/Section');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

/**
 * GET /api/sections/:pageId
 * Get all sections for a page
 */
router.get('/page/:pageId', async (req, res) => {
    try {
        const sections = await Section.find({ pageId: req.params.pageId })
            .sort({ order: 1 });
        
        res.json({
            success: true,
            data: sections
        });
    } catch (error) {
        console.error('Get sections error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sections.'
        });
    }
});

/**
 * GET /api/sections/:id
 * Get single section by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        
        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found.'
            });
        }
        
        res.json({
            success: true,
            data: section
        });
    } catch (error) {
        console.error('Get section error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch section.'
        });
    }
});

/**
 * POST /api/sections
 * Create a new section
 */
router.post('/', async (req, res) => {
    try {
        const { pageId, type, order, isVisible, title, subtitle, data, settings } = req.body;
        
        // If no order specified, add to end
        let sectionOrder = order;
        if (sectionOrder === undefined) {
            const lastSection = await Section.findOne({ pageId })
                .sort({ order: -1 });
            sectionOrder = lastSection ? lastSection.order + 1 : 0;
        }
        
        const section = await Section.create({
            pageId,
            type,
            order: sectionOrder,
            isVisible: isVisible !== false,
            title,
            subtitle,
            data: data || {},
            settings: settings || {}
        });
        
        res.status(201).json({
            success: true,
            message: 'Section created successfully.',
            data: section
        });
    } catch (error) {
        console.error('Create section error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create section.'
        });
    }
});

/**
 * PUT /api/sections/:id
 * Update a section
 */
router.put('/:id', async (req, res) => {
    try {
        const { type, order, isVisible, title, subtitle, data, settings } = req.body;
        
        const section = await Section.findByIdAndUpdate(
            req.params.id,
            { type, order, isVisible, title, subtitle, data, settings },
            { new: true, runValidators: true }
        );
        
        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found.'
            });
        }
        
        res.json({
            success: true,
            message: 'Section updated successfully.',
            data: section
        });
    } catch (error) {
        console.error('Update section error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update section.'
        });
    }
});

/**
 * DELETE /api/sections/:id
 * Delete a section
 */
router.delete('/:id', async (req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.params.id);
        
        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found.'
            });
        }
        
        res.json({
            success: true,
            message: 'Section deleted successfully.'
        });
    } catch (error) {
        console.error('Delete section error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete section.'
        });
    }
});

/**
 * PUT /api/sections/reorder/:pageId
 * Reorder sections within a page
 */
router.put('/reorder/:pageId', async (req, res) => {
    try {
        const { orderedIds } = req.body;
        
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({
                success: false,
                message: 'orderedIds must be an array.'
            });
        }
        
        // Update each section's order
        const updates = orderedIds.map((id, index) => 
            Section.findByIdAndUpdate(id, { order: index })
        );
        
        await Promise.all(updates);
        
        res.json({
            success: true,
            message: 'Sections reordered successfully.'
        });
    } catch (error) {
        console.error('Reorder sections error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reorder sections.'
        });
    }
});

/**
 * PUT /api/sections/visibility/:id
 * Toggle section visibility
 */
router.put('/visibility/:id', async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        
        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found.'
            });
        }
        
        section.isVisible = !section.isVisible;
        await section.save();
        
        res.json({
            success: true,
            message: `Section ${section.isVisible ? 'shown' : 'hidden'} successfully.`,
            data: section
        });
    } catch (error) {
        console.error('Toggle visibility error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle section visibility.'
        });
    }
});

module.exports = router;
