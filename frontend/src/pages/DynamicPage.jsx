import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

// Components - import all possible section types
import Hero from '../components/Hero';
import About from '../components/About';
import Partners from '../components/Partners';
import Network from '../components/Network';
import Partition from '../components/Partition';
import Technology from '../components/Technology';
import Services from '../components/Services';
import Doctors from '../components/Doctors';
import Testimonials from '../components/Testimonials';
import Blogs from '../components/Blogs';
import SEOGuide from '../components/SEOGuide';
import Content from '../components/Content';
import Stats from '../components/Stats';
import Cards from '../components/Cards';
import ServiceLayout from '../components/ServiceLayout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

export default function DynamicPage({ onBook }) {
    const { slug } = useParams();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchPageData = async () => {
            setLoading(true);
            setNotFound(false);
            try {
                const res = await fetch(`${API_URL}/public/page/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setPageData(data.data);
                    } else {
                        setNotFound(true);
                    }
                } else {
                    setNotFound(true);
                }
            } catch (err) {
                console.error('Failed to fetch page data:', err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPageData();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (notFound) {
        return <Navigate to="/" replace />;
    }

    // Check for Service Layout content
    const hasServiceContent = pageData?.sections?.some(s => s.type === 'service_overview');

    if (pageData && (pageData.type === 'sub' || hasServiceContent)) {
        return <ServiceLayout data={pageData} onBook={onBook} />;
    }

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
            case 'about':
                return <About key={_id} data={data} />;
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
            case 'partition':
                return <Partition key={_id} data={data} />;
            case 'technology':
                return <Technology key={_id} data={data} />;
            case 'services':
                return <Services key={_id} data={data} />;
            case 'doctors':
                return <Doctors key={_id} onBook={onBook} data={data} />;
            case 'testimonials':
                return <Testimonials key={_id} data={data} />;
            case 'blogs':
                return <Blogs key={_id} data={data} />;
            case 'faq':
                return <SEOGuide key={_id} data={data} />;
            default:
                console.warn(`Unknown section type: ${type}`);
                return null;
        }
    };

    return (
        <main className="pt-24 bg-white">
            {getVisibleSections().map(section => renderSection(section))}
        </main>
    );
}
