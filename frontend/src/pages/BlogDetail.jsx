import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogs } from '../data/blogs';
import { ArrowLeft, Share2, Printer, Clock, User } from 'lucide-react';

export default function BlogDetail() {
    const { id } = useParams();
    const blog = blogs.find(b => b.id === id);

    if (!blog) {
        return <Navigate to="/blogs" replace />;
    }

    return (
        <main className="pt-32 pb-24 min-h-screen bg-brand-cream/30">
            {/* Navigation back */}
            <div className="max-w-4xl mx-auto px-6 mb-12">
                <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-blue transition-colors mb-8">
                    <ArrowLeft size={16} /> Back to Journal
                </Link>
            </div>

            {/* Article Container - Modern Web Layout */}
            <article className="max-w-4xl mx-auto bg-transparent">
                {/* Header Block */}
                <header className="px-6 md:px-0 pt-8 pb-12 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex items-center justify-center gap-3"
                    >
                        <span className="uppercase tracking-[0.2em] text-xs font-bold text-brand-blue">{blog.category}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-bold text-brand-dark leading-tight mb-8"
                    >
                        {blog.title}
                    </motion.h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-500 font-sans">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-dark flex items-center gap-2">
                                <User size={14} className="text-brand-blue" />
                                {blog.author}
                            </span>
                            <span className="opacity-60">| {blog.role}</span>
                        </div>
                        <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {blog.date} • {blog.readTime}
                        </div>
                    </div>
                </header>

                {/* Content - Modern Single Column with Shape Wrapping */}
                <div className="px-6 md:px-0 py-4">
                    <style>{`
                        /* Remove Drop Cap styling (reset to normal) */
                        .drop-cap {
                            float: none;
                            font-family: inherit;
                            font-size: inherit;
                            line-height: inherit;
                            padding: 0;
                            color: inherit;
                            font-weight: normal;
                        }

                        /* Shape Outside Implementation for Images - KEPT as requested */
                        .float-shape-left {
                            float: left;
                            width: 280px;
                            height: 280px;
                            border-radius: 50%;
                            shape-outside: circle(50%);
                            margin-right: 3rem;
                            margin-bottom: 2rem;
                            border: none;
                            box-shadow: none;
                        }

                        .float-shape-right {
                            float: right;
                            width: 320px;
                            height: 320px;
                            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; /* Organic shape */
                            shape-outside: circle(50%); 
                            margin-left: 3rem;
                            margin-bottom: 2rem;
                            border: none;
                            box-shadow: none;
                        }

                         /* Base Typography - Modern Sans */
                        .newspaper-content p {
                            font-family: 'Inter', sans-serif; /* Use project default */
                            font-size: 1.25rem; /* Larger modern text */
                            line-height: 1.9;
                            color: #374151; /* Gray-700 */
                            margin-bottom: 2rem;
                        }
                    `}</style>

                    {/* Injecting HTML content */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="newspaper-content max-w-none"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

                {/* Footer Controls */}
                <footer className="px-6 md:px-0 py-12 border-t border-gray-100 flex items-center justify-between mt-12">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-brand-dark transition-colors text-sm font-bold">
                        <Share2 size={16} /> Share Article
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 text-gray-400 hover:text-brand-dark transition-colors text-sm">
                        <Printer size={16} /> Print
                    </button>
                </footer>
            </article>
        </main>
    );
}
