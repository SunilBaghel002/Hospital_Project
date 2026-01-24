const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    // URL path (e.g., "about", "services/cataract-surgery")
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    
    // Display title
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    // Page type: main (navbar) or sub (service pages, etc.)
    type: {
        type: String,
        enum: ['main', 'sub'],
        default: 'main'
    },
    
    // Position in navbar (for main pages only)
    navbarOrder: {
        type: Number,
        default: 0
    },
    
    // For subpages - reference to parent page
    parentPage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        default: null
    },
    
    // Whether page is live
    isPublished: {
        type: Boolean,
        default: false
    },
    
    // Show in navbar (for main pages)
    showInNavbar: {
        type: Boolean,
        default: true
    },
    
    // SEO metadata
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    
    // Icon for navbar/menu (lucide icon name)
    icon: {
        type: String,
        default: null
    },
    
    // Hero/header configuration
    hero: {
        title: String,
        subtitle: String,
        tagline: String,
        image: String,
        showBreadcrumb: { type: Boolean, default: true }
    }
}, {
    timestamps: true
});

// Index for faster lookups
// pageSchema.index({ slug: 1 }); // Removed to fix duplicate index warning
pageSchema.index({ type: 1, navbarOrder: 1 });
pageSchema.index({ parentPage: 1 });

module.exports = mongoose.model('Page', pageSchema);
