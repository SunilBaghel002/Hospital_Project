import Hero from '../components/Hero';
import Partners from '../components/Partners';
import Network from '../components/Network';
import Partition from '../components/Partition';
import About from '../components/About';
import Technology from '../components/Technology';
import Services from '../components/Services';
import Doctors from '../components/Doctors';
import Testimonials from '../components/Testimonials';
import Blogs from '../components/Blogs';
import SEOGuide from '../components/SEOGuide';
import Chatbot from '../components/Chatbot';
import Advertisement from '../components/Advertisement';

import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

export default function Home({ onBook }) {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const res = await fetch(`${API_URL}/public/page/home`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setPageData(data.data);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch home page data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPageData();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;
    }

    // Helper to find section data by type
    const getSectionData = (type) => {
        if (!pageData || !pageData.sections) return null;
        const section = pageData.sections.find(s => s.type === type && s.isVisible);
        return section ? section.data : null;
    };

    return (
        <main>
            <Advertisement data={getSectionData('advertisement')} />
            <Hero onBook={onBook} data={getSectionData('hero')} />
            <Partners data={getSectionData('partners')} />
            <Network data={getSectionData('network')} />
            <Partition data={getSectionData('partition')} />
            <About data={getSectionData('about')} />
            <Technology data={getSectionData('technology')} />
            <Services data={getSectionData('services')} />
            <Doctors onBook={onBook} data={getSectionData('doctors')} />
            <Testimonials data={getSectionData('testimonials')} />
            <Blogs data={getSectionData('blogs')} />
            <SEOGuide data={getSectionData('faq')} />
            <Chatbot />
        </main>
    );
}
