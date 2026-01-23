import { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

export default function Blogs({ data }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Config from CMS
    const showCount = data?.showCount || 3;
    const headline = data?.headline || 'Latest News & Insights';
    const tagline = data?.tagline || 'Our Blog';
    const showViewAll = data?.showViewAll !== false;

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch(`${API_URL}/blogs`); // Fetch published blogs
                if (res.ok) {
                    const data = await res.json();
                    // Map API data to component format
                    const mappedBlogs = data.map(blog => ({
                        id: blog.slug || blog._id,
                        title: blog.title,
                        category: blog.category,
                        image: blog.image || 'https://via.placeholder.com/400x300?text=Blog+Image',
                        date: new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        author: blog.author?.name || 'Admin',
                        subtitle: blog.subtitle
                    }));
                    setBlogs(mappedBlogs);
                }
            } catch (err) {
                console.error('Failed to fetch blogs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // Get the latest blogs based on config
    const recentBlogs = blogs.slice(0, showCount);

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto bg-brand-cream/30 rounded-[3rem] text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <span className="text-brand-blue font-bold tracking-wider text-sm uppercase mb-2 block">{tagline}</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-dark">{headline}</h2>
                </div>
                {showViewAll && (
                    <Link to="/blogs" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-4 transition-all">
                        View All Articles <ArrowRight size={20} />
                    </Link>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {recentBlogs.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all group flex flex-col h-full border border-gray-100">
                        <Link to={`/blogs/${blog.id}`} className="block h-56 overflow-hidden relative">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-blue shadow-sm">
                                {blog.category}
                            </div>
                        </Link>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-medium">
                                <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
                                <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>
                            </div>
                            <Link to={`/blogs/${blog.id}`} className="block">
                                <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-blue transition-colors leading-snug">
                                    {blog.title}
                                </h3>
                            </Link>
                            <Link to={`/blogs/${blog.id}`} className="mt-auto inline-flex items-center text-sm font-bold text-gray-400 group-hover:text-brand-dark transition-colors">
                                Read More <ArrowRight size={16} className="ml-1 group-hover:ml-2 transition-all" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <Link to="/blogs" className="md:hidden w-full mt-12 bg-white text-brand-blue font-bold py-4 rounded-xl shadow-sm border border-brand-blue/10 block">
                View All Articles
            </Link>
        </section>
    );
}
