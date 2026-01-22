import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Layers,
    Settings,
    Image,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Home
} from 'lucide-react';
import { adminAuthAPI } from '../../services/adminApi';

const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/pages', label: 'Main Pages', icon: FileText },
    { path: '/admin/subpages', label: 'Sub Pages', icon: Layers },
    { path: '/admin/settings', label: 'Site Settings', icon: Settings },
    { path: '/admin/media', label: 'Media Library', icon: Image },
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Auth check
    useEffect(() => {
        const checkAuth = async () => {
            if (!adminAuthAPI.isAuthenticated()) {
                navigate('/admin/login');
                return;
            }

            try {
                await adminAuthAPI.verify();
            } catch (err) {
                navigate('/admin/login');
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await adminAuthAPI.logout();
        } finally {
            navigate('/admin/login');
        }
    };

    // Get current page title
    const getCurrentPageTitle = () => {
        const currentNav = navItems.find(item => location.pathname.startsWith(item.path));
        return currentNav?.label || 'Admin Panel';
    };

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                V
                            </div>
                            <span className="text-white font-semibold">Visionary CMS</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronRight className={`transform transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                                ${isActive
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            <item.icon size={20} />
                            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* View Site Link */}
                <div className="p-3 border-t border-white/10">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all`}
                    >
                        <Home size={20} />
                        {isSidebarOpen && <span className="font-medium">View Site</span>}
                    </a>
                </div>

                {/* Logout */}
                <div className="p-3 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-slate-900 z-50 transform transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            V
                        </div>
                        <span className="text-white font-semibold">Visionary CMS</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="py-4 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                                ${isActive
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg font-semibold text-slate-800">{getCurrentPageTitle()}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-slate-700">Admin</p>
                            <p className="text-xs text-slate-500">Visionary CMS</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
