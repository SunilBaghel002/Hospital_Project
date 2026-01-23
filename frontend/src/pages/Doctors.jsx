import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Doctors from '../components/Doctors';
import Testimonials from '../components/Testimonials';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

export default function DoctorsPage({ onBook }) {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const res = await fetch(`${API_URL}/public/page/doctors`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setPageData(data.data);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch doctors page data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPageData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 text-gray-500">
                Failed to load content.
            </div>
        );
    }

    return (
        <main>
            {(pageData.sections || []).map((section) => {
                switch (section.type) {
                    case 'hero':
                        return <Hero key={section._id} data={section.data} onBook={onBook} />;
                    case 'doctors':
                        return <Doctors key={section._id} data={section.data} onBook={onBook} />;
                    case 'testimonials':
                        return <Testimonials key={section._id} data={section.data} />;
                    default:
                        return null;
                }
            })}
        </main>
    );
}