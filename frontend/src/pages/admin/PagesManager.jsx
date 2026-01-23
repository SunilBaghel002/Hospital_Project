import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    GripVertical,
    Search,
    FileText,
    Loader2,
    MoreHorizontal,
    ExternalLink,
    Check,
    X,
    AlertCircle
} from 'lucide-react';
import { pagesAPI } from '../../services/adminApi';

export default function PagesManager() {
    const navigate = useNavigate();
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setIsLoading(true);
        try {
            const response = await pagesAPI.getAll('main');
            setPages(response.data || []);
        } catch (err) {
            setError('Failed to load pages');
            console.error(err);
        } finally {
            setIsLoading(false);
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
                    <h1 className="text-2xl font-bold text-slate-800">Main Pages</h1>
                    <p className="text-slate-500">Manage pages that appear in your navbar</p>
                </div>
                <Link
                    to="/admin/subpages/new?type=main"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                >
                    <Plus size={18} />
                    Create New Page
                </Link>
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
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
            </div>

            {/* Pages Grid */}
            {filteredPages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPages.map((page) => (
                        <div
                            key={page._id}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all group"
                        >
                            {/* Page Preview Header */}
                            <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative">
                                <FileText className="text-slate-300" size={48} />

                                {/* Status Badge */}
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${page.isPublished
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {page.isPublished ? 'Published' : 'Draft'}
                                </div>

                                {/* Navbar Order */}
                                <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-white shadow text-xs font-bold flex items-center justify-center text-slate-600">
                                    {page.navbarOrder + 1}
                                </div>
                            </div>

                            {/* Page Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-slate-800 mb-1">{page.title}</h3>
                                <p className="text-sm text-slate-500 mb-4">/{page.slug}</p>

                                {/* Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => navigate(`/admin/subpages/edit/${page._id}?type=main`)}
                                            className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors"
                                            title="Edit Page"
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
                                            className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                                            title="View Page"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>

                                    {deleteConfirm === page._id ? (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleDelete(page._id)}
                                                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                title="Confirm Delete"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
                                                title="Cancel"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(page._id)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Delete Page"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No pages found</h3>
                    <p className="text-slate-500 mb-4">
                        {searchQuery ? 'Try adjusting your search.' : 'Create your first page to get started.'}
                    </p>
                    {!searchQuery && (
                        <Link
                            to="/admin/subpages/new?type=main"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Create Page
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
