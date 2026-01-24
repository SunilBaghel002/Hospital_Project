import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText,
    Layers,
    Settings,
    Image,
    TrendingUp,
    Eye,
    Edit,
    Plus,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { pagesAPI, settingsAPI } from '../../services/adminApi';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        mainPages: 0,
        subPages: 0,
        totalSections: 0
    });
    const [recentPages, setRecentPages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pagesResponse = await pagesAPI.getAll();
                const pages = pagesResponse.data || [];

                const mainPages = pages.filter(p => p.type === 'main');
                const subPages = pages.filter(p => p.type === 'sub');

                setStats({
                    mainPages: mainPages.length,
                    subPages: subPages.length,
                    totalSections: 0 // Will be calculated when we have sections
                });

                // Get 5 most recent pages
                setRecentPages(pages.slice(0, 5));
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const quickActions = [
        { label: 'Add New Page', icon: Plus, path: '/admin/pages/new', color: 'blue' },
        { label: 'Edit Homepage', icon: Edit, path: '/admin/pages/edit/home', color: 'green' },
        { label: 'Site Settings', icon: Settings, path: '/admin/settings', color: 'purple' },
        { label: 'Media Library', icon: Image, path: '/admin/media', color: 'orange' },
    ];

    const statCards = [
        { label: 'Main Pages', value: stats.mainPages, icon: FileText, color: 'blue', path: '/admin/pages' },
        { label: 'Sub Pages', value: stats.subPages, icon: Layers, color: 'green', path: '/admin/subpages' },
        { label: 'Media Files', value: '-', icon: Image, color: 'purple', path: '/admin/media' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative">
                    <h1 className="text-2xl font-bold mb-2">Welcome to Romashka CMS</h1>
                    <p className="text-blue-100 max-w-lg">
                        Manage your website content, pages, and settings from this dashboard.
                        All changes are reflected on the live website instantly.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map((stat) => (
                    <Link
                        key={stat.label}
                        to={stat.path}
                        className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600`}>
                                <stat.icon size={24} />
                            </div>
                            <ArrowRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                        <p className="text-slate-500">{stat.label}</p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            to={action.path}
                            className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center text-center group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-${action.color}-100 flex items-center justify-center text-${action.color}-600 mb-3 group-hover:scale-110 transition-transform`}>
                                <action.icon size={24} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800">Recent Pages</h2>
                        <Link to="/admin/pages" className="text-sm text-blue-500 hover:text-blue-600">View All</Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentPages.length > 0 ? (
                            recentPages.map((page) => (
                                <div key={page._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                                    <div>
                                        <h3 className="font-medium text-slate-800">{page.title}</h3>
                                        <p className="text-sm text-slate-500">/{page.slug}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${page.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {page.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                        <Link
                                            to={`/admin/pages/edit/${page._id}`}
                                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-500"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-slate-500">
                                <FileText className="mx-auto mb-2 text-slate-300" size={32} />
                                <p>No pages created yet</p>
                                <Link to="/admin/pages/new" className="text-blue-500 hover:underline text-sm">Create your first page</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Help Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="font-semibold text-slate-800 mb-4">Getting Started</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                            <div>
                                <h3 className="font-medium text-slate-700">Configure Site Settings</h3>
                                <p className="text-sm text-slate-500">Set up your site name, contact info, and social links.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                            <div>
                                <h3 className="font-medium text-slate-700">Create Main Pages</h3>
                                <p className="text-sm text-slate-500">Add pages that appear in your navbar.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                            <div>
                                <h3 className="font-medium text-slate-700">Add Content Sections</h3>
                                <p className="text-sm text-slate-500">Build your pages with visual sections.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm shrink-0">4</div>
                            <div>
                                <h3 className="font-medium text-slate-700">Publish & Go Live</h3>
                                <p className="text-sm text-slate-500">Preview and publish your pages.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
