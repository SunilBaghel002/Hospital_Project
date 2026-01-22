const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    // Reference to the page this section belongs to
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        required: true
    },
    
    // Section type determines the renderer and editor
    type: {
        type: String,
        enum: [
            'hero',           // Hero/banner section
            'content',        // Rich text content
            'cards',          // Grid of cards
            'doctors',        // Doctors listing
            'testimonials',   // Patient testimonials
            'services',       // Services grid
            'gallery',        // Image gallery
            'cta',            // Call to action
            'partners',       // Partners/logos
            'stats',          // Statistics counters
            'faq',            // FAQ accordion
            'timeline',       // Timeline/history
            'contact',        // Contact form
            'map',            // Google map embed
            'custom'          // Custom HTML/component
        ],
        required: true
    },
    
    // Display order within the page
    order: {
        type: Number,
        default: 0
    },
    
    // Section visibility
    isVisible: {
        type: Boolean,
        default: true
    },
    
    // Section title (optional, shown above section)
    title: {
        type: String,
        trim: true
    },
    
    // Section subtitle
    subtitle: {
        type: String,
        trim: true
    },
    
    // Dynamic data based on section type
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    
    // Section-specific settings (background, padding, etc.)
    settings: {
        backgroundColor: { type: String, default: 'white' },
        textColor: { type: String, default: 'dark' },
        padding: { type: String, default: 'normal' }, // none, small, normal, large
        fullWidth: { type: Boolean, default: false },
        customClass: { type: String, default: '' }
    }
}, {
    timestamps: true
});

// Index for faster lookups
sectionSchema.index({ pageId: 1, order: 1 });

module.exports = mongoose.model('Section', sectionSchema);
