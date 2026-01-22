const express = require('express');
const Page = require('../models/Page');
const Section = require('../models/Section');

const router = express.Router();

/**
 * GET /api/public/navbar
 * Get navbar pages for frontend (public)
 */
router.get('/navbar', async (req, res) => {
    try {
        const pages = await Page.find({ 
            type: 'main', 
            isPublished: true, 
            showInNavbar: true 
        })
        .select('slug title icon navbarOrder')
        .sort({ navbarOrder: 1 });
        
        res.json({
            success: true,
            data: pages
        });
    } catch (error) {
        console.error('Get navbar error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch navbar.'
        });
    }
});

/**
 * GET /api/public/page/:slug
 * Get page content by slug for frontend (public)
 */
router.get('/page/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({ 
            slug: req.params.slug, 
            isPublished: true 
        });
        
        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page not found.'
            });
        }
        
        // Get visible sections for this page
        const sections = await Section.find({ 
            pageId: page._id, 
            isVisible: true 
        }).sort({ order: 1 });
        
        res.json({
            success: true,
            data: { 
                ...page.toObject(), 
                sections 
            }
        });
    } catch (error) {
        console.error('Get public page error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch page.'
        });
    }
});

/**
 * GET /api/public/subpages/:parentSlug
 * Get subpages for a parent page (public)
 */
router.get('/subpages/:parentSlug', async (req, res) => {
    try {
        const parentPage = await Page.findOne({ slug: req.params.parentSlug });
        
        if (!parentPage) {
            return res.status(404).json({
                success: false,
                message: 'Parent page not found.'
            });
        }
        
        const subpages = await Page.find({ 
            parentPage: parentPage._id, 
            isPublished: true 
        })
        .select('slug title icon hero')
        .sort({ navbarOrder: 1 });
        
        res.json({
            success: true,
            data: subpages
        });
    } catch (error) {
        console.error('Get subpages error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subpages.'
        });
    }
});

module.exports = router;
