import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Search,
    Layers,
    Loader2,
    ExternalLink,
    Check,
    X,
    AlertCircle,
    FolderOpen
} from 'lucide-react';
import { pagesAPI, sectionsAPI } from '../../services/adminApi';

export default function SubPagesManager() {
    const navigate = useNavigate();
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isCreatingDemo, setIsCreatingDemo] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setIsLoading(true);
        try {
            const response = await pagesAPI.getAll('sub');
            setPages(response.data || []);
        } catch (err) {
            setError('Failed to load pages');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateExample = async () => {
        setIsCreatingDemo(true);
        try {
            // 1. Create Page
            const pageRes = await pagesAPI.create({
                title: 'Example: Robotic Surgery',
                slug: 'example-robotic-surgery-' + Date.now().toString().slice(-4),
                type: 'sub',
                isPublished: true,
                navbarOrder: 99
            });

            if (pageRes.success) {
                const pageId = pageRes.data._id;

                // 2. Create Sections
                // Hero
                await sectionsAPI.create({
                    pageId, type: 'hero', title: 'Hero', order: 0, isVisible: true,
                    data: {
                        title: "Advanced Robotic Surgery",
                        subtitle: "Precision Meets Care",
                        tagline: "Minimum Invasive",
                        backgroundImage: "https://images.unsplash.com/photo-1579684385136-137af18db23c?auto=format&fit=crop&q=80&w=2070",
                        ctaText: "Book Now",
                        showBreadcrumb: true
                    }
                });

                // Overview
                await sectionsAPI.create({
                    pageId, type: 'service_overview', title: 'Overview', order: 1, isVisible: true,
                    data: {
                        title: "Overview",
                        overviewText: "State-of-the-art robotic systems for faster recovery.",
                        shortDesc: "Future of Surgery",
                        longDesc: "<p>Robotic surgery allows surgeons to perform many types of complex procedures with more precision, flexibility and control than is possible with conventional techniques. <strong>Benefits include:</strong></p><ul><li>Fewer complications</li><li>Less pain and blood loss</li><li>Quicker recovery</li><li>Smaller, less noticeable scars</li></ul>",
                        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2070"
                    }
                });

                // Scope
                await sectionsAPI.create({
                    pageId, type: 'service_scope', title: 'Scope', order: 2, isVisible: true,
                    data: {
                        title: "Our Capabilities",
                        image: "https://images.unsplash.com/photo-1516549655169-df83a0674f66?auto=format&fit=crop&q=80&w=2070",
                        points: [
                            { title: "Cardiac Surgery", desc: "Valve repair and bypass" },
                            { title: "Urology", desc: "Prostate and kidney procedures" },
                            { title: "Gynecology", desc: "Hysterectomy and fibroid removal" }
                        ]
                    }
                });

                // Experts
                await sectionsAPI.create({
                    pageId, type: 'service_experts', title: 'Experts', order: 3, isVisible: true,
                    data: { roleKeyword: "Surgeon", title: "Our Robotic Surgeons" }
                });

                // CTA
                await sectionsAPI.create({
                    pageId, type: 'cta', title: 'CTA', order: 4, isVisible: true,
                    data: {
                        title: "Ready to consult?",
                        subtitle: "Get expert advice today",
                        buttonText: "Schedule Visit",
                        link: "/appointment"
                    }
                });

                fetchPages();
                alert('Example page created successfully! You can now edit it to see how it works.');
            }
        } catch (error) {
            console.error("Failed to create demo", error);
            alert("Failed to create example page.");
        } finally {
            setIsCreatingDemo(false);
        }
    };

    const handleDelete = async (pageId) => {
        try {
            await pagesAPI.delete(pageId);
            setPages(pages.filter(p => p._id !== pageId));
            setDeleteConfirm(null);
        } catch (err) {
            setError('Failed to delete page');
            console.error(err);
        }
    };

    const handleTogglePublish = async (page) => {
        try {
            await pagesAPI.update(page._id, { isPublished: !page.isPublished });
            setPages(pages.map(p =>
                p._id === page._id ? { ...p, isPublished: !p.isPublished } : p
            ));
        } catch (err) {
            setError('Failed to update page');
            console.error(err);
        }
    };

    const filteredPages = pages.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group by parent
    const groupedPages = filteredPages.reduce((acc, page) => {
        const parentTitle = page.parentPage?.title || 'No Parent';
        if (!acc[parentTitle]) {
            acc[parentTitle] = [];
        }
        acc[parentTitle].push(page);
        return acc;
    }, {});

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sub Pages</h1>
                    <p className="text-slate-500">Manage service pages, blog posts, and other sub-pages</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCreateExample}
                        disabled={isCreatingDemo}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-medium transition-colors"
                    >
                        {isCreatingDemo ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                        Create Example Page
                    </button>
                    <Link
                        to="/admin/subpages/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Add Sub Page
                    </Link>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="ml-auto">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search sub-pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
            </div>

            {/* Pages List */}
            {filteredPages.length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(groupedPages).map(([parentTitle, subpages]) => (
                        <div key={parentTitle} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                                <FolderOpen size={18} className="text-slate-400" />
                                <span className="font-medium text-slate-700">{parentTitle}</span>
                                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{subpages.length}</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {subpages.map((page) => (
                                    <div
                                        key={page._id}
                                        className="px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <Layers size={20} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-slate-800">{page.title}</h3>
                                                <p className="text-sm text-slate-500">/{page.slug}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${page.isPublished
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {page.isPublished ? 'Published' : 'Draft'}
                                            </span>

                                            <button
                                                onClick={() => navigate(`/admin/subpages/edit/${page._id}`)}
                                                className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleTogglePublish(page)}
                                                className={`p-2 rounded-lg transition-colors ${page.isPublished
                                                    ? 'hover:bg-yellow-50 text-slate-400 hover:text-yellow-500'
                                                    : 'hover:bg-green-50 text-slate-400 hover:text-green-500'
                                                    }`}
                                                title={page.isPublished ? 'Unpublish' : 'Publish'}
                                            >
                                                {page.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                            <a
                                                href={`/${page.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                                title="View"
                                            >
                                                <ExternalLink size={18} />
                                            </a>

                                            {deleteConfirm === page._id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDelete(page._id)}
                                                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(page._id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Layers className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No sub-pages found</h3>
                    <p className="text-slate-500 mb-4">
                        {searchQuery ? 'Try adjusting your search.' : 'Create your first sub-page.'}
                    </p>
                    {!searchQuery && (
                        <Link
                            to="/admin/subpages/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Create Sub-Page
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
