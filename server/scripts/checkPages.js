/**
 * Check and List All Pages
 * Run with: node scripts/checkPages.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Page = require('../models/Page');

async function checkPages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        const allPages = await Page.find({}).populate('parentPage', 'title');

        console.log('===== ALL PAGES IN DATABASE =====\n');

        const mainPages = allPages.filter(p => p.type === 'main');
        const subPages = allPages.filter(p => p.type === 'sub');
        const otherPages = allPages.filter(p => !p.type);

        console.log(`MAIN Pages (${mainPages.length}):`);
        mainPages.forEach(p => {
            console.log(`  - ${p.title} (/${p.slug}) - Published: ${p.isPublished}`);
        });

        console.log(`\nSUB Pages (${subPages.length}):`);
        subPages.forEach(p => {
            const parent = p.parentPage ? ` [Parent: ${p.parentPage.title}]` : ' [No Parent]';
            console.log(`  - ${p.title} (/${p.slug})${parent} - Published: ${p.isPublished}`);
        });

        if (otherPages.length > 0) {
            console.log(`\nUNTYPED Pages (${otherPages.length}):`);
            otherPages.forEach(p => {
                console.log(`  - ${p.title} (/${p.slug})`);
            });
        }

        console.log('\n=================================\n');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

checkPages();
