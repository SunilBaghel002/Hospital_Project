import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { blogs } from '../data/blogs';
import { useState } from 'react';

export default function Blogs() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="pt-32 min-h-screen bg-brand-cream/30">
            {/* Header */}
            <section className="px-6 mb-16 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-brand-dark/10 pb-8">
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-brand-blue font-bold tracking-widest uppercase text-xs mb-2 block"
                        >
                            The Visionary Journal
                        </motion.span>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-serif text-brand-dark"
                        >
                            Medical Insights
                        </motion.h1>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-auto relative">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-80 pl-10 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="px-6 pb-24 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {filteredBlogs.map((blog, index) => (
                        <motion.article
                            key={blog.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex flex-col h-full"
                        >
                            {/* Image Container with Hover Effect */}
                            <Link to={`/blogs/${blog.id}`} className="block overflow-hidden rounded-2xl mb-6 aspect-[4/3]">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </Link>

                            {/* Content */}
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-brand-blue font-bold text-xs uppercase tracking-wider">{blog.category}</span>
                                    <span className="text-gray-400 text-xs">{blog.readTime}</span>
                                </div>

                                <Link to={`/blogs/${blog.id}`} className="block group-hover:text-brand-blue transition-colors">
                                    <h2 className="text-2xl font-serif font-bold text-brand-dark leading-tight mb-3">
                                        {blog.title}
                                    </h2>
                                </Link>

                                <p className="text-gray-500 line-clamp-2 mb-4 text-sm leading-relaxed">
                                    {blog.subtitle}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                            {/* Placeholder Avatar */}
                                            <div className="w-full h-full bg-brand-dark text-white flex items-center justify-center text-[10px]">
                                                {blog.author.charAt(0)}
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-brand-dark">{blog.author}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{blog.date}</span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {filteredBlogs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No articles found matching your search.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
