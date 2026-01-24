import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Network from '../components/Network';
import Partners from '../components/Partners';
import Content from '../components/Content';
import Stats from '../components/Stats';
import Cards from '../components/Cards';
import { Quote, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function AboutUs({ onBook }) {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const res = await fetch(`${API_URL}/public/page/about`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setPageData(data.data);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch about page data:', err);
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

    // Get all visible sections sorted by order
    const getVisibleSections = () => {
        if (!pageData || !pageData.sections) return [];
        return pageData.sections.filter(s => s.isVisible).sort((a, b) => a.order - b.order);
    };

    // Render section based on type
    const renderSection = (section) => {
        const { type, data, _id } = section;

        switch (type) {
            case 'hero':
                return <Hero key={_id} onBook={onBook} data={data} />;
            case 'content':
                return <Content key={_id} data={data} />;
            case 'stats':
                return <Stats key={_id} data={data} />;
            case 'cards':
                return <Cards key={_id} data={data} />;
            case 'partners':
                return <Partners key={_id} data={data} />;
            case 'network':
                return <Network key={_id} data={data} />;
            default:
                return null;
        }
    };

    return (
        <main className="pt-24 bg-white">
            {getVisibleSections().map(section => renderSection(section))}
        </main>
    );
}
