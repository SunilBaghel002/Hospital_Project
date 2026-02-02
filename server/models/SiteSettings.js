const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    // Site identity
    siteName: {
        type: String,
        default: 'Visionary Eye Care'
    },
    tagline: {
        type: String,
        default: 'World-Class Eye Care'
    },
    logo: {
        type: String,
        default: null
    },
    favicon: {
        type: String,
        default: null
    },

    // Navbar settings
    navbar: {
        items: [{
            name: { type: String, required: true },
            href: { type: String, required: true },
            order: { type: Number, default: 0 }
        }],
        siteName: { type: String, default: 'Visionary' },
        logoInitial: { type: String, default: 'V' },
        logoImage: { type: String, default: null },
        ctaText: { type: String, default: 'Book an Appointment' },
        ctaLink: { type: String, default: '/appointment' }
    },
    
    // Contact information
    contact: {
        address: { type: String, default: 'Sector 62, Noida, Uttar Pradesh 201301' },
        phone: { type: String, default: '+91 120 456 7890' },
        email: { type: String, default: 'info@visionaryeye.in' },
        emergencyNumber: { type: String, default: '1800-EYE-CARE' },
        workingHours: {
            weekdays: { type: String, default: '8:00 AM - 8:00 PM' },
            saturday: { type: String, default: '9:00 AM - 5:00 PM' },
            sunday: { type: String, default: 'Emergency Only' }
        }
    },
    
    // Social media links
    social: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        youtube: { type: String, default: '' }
    },
    
    // Google Maps embed URL
    mapEmbedUrl: {
        type: String,
        default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56066.65089631422!2d77.33685559999999!3d28.6124282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
    },
    
    // Footer settings
    footer: {
        description: { type: String, default: 'Providing clarity and vision to the world through advanced ophthalmology and compassionate care.' },
        copyright: { type: String, default: '© 2024 Visionary Eye Care. All rights reserved.' },
        quickLinks: [{
            name: String,
            href: String
        }],
        servicesLinks: [{
            name: String,
            href: String
        }]
    },
    
    // SEO defaults
    seo: {
        defaultTitle: { type: String, default: 'Visionary Eye Care - Advanced Eye Care in Noida' },
        defaultDescription: { type: String, default: 'Leading eye care hospital in Noida offering cataract surgery, LASIK, glaucoma treatment, and more.' },
        keywords: { type: String, default: 'eye care, ophthalmology, cataract surgery, LASIK, Noida, eye hospital' }
    },
    
    // Theme colors (for future customization)
    theme: {
        primaryColor: { type: String, default: '#1e3a5f' },
        secondaryColor: { type: String, default: '#2563eb' },
        accentColor: { type: String, default: '#f59e0b' }
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
siteSettingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
