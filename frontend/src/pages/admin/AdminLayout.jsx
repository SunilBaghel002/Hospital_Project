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
    Home,
    UserRound,
    BookOpen,
    Globe
} from 'lucide-react';
import { adminAuthAPI } from '../../services/adminApi';

const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/pages', label: 'Pages', icon: FileText },
    { path: '/admin/subpages', label: 'Sub-Pages', icon: Layers },
    { path: '/admin/doctors', label: 'Doctors', icon: UserRound },
    { path: '/admin/blogs', label: 'News & Blogs', icon: BookOpen },
    { path: '/admin/media', label: 'Media Library', icon: Image },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
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
        return currentNav?.label || 'Admin Portal';
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            {/* Sidebar - Desktop */}
            <aside
                className={`hidden lg:flex flex-col ${isSidebarOpen ? 'w-72' : 'w-20'} bg-zinc-900 text-zinc-300 transition-all duration-300 ease-in-out border-r border-zinc-800 shadow-xl z-20`}
            >
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-800/50">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-tr from-brand-blue to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                                V
                            </div>
                            <div>
                                <h1 className="text-white font-bold tracking-tight">Visionary</h1>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Admin Portal</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all ${!isSidebarOpen && 'mx-auto'}`}
                    >
                        {isSidebarOpen ? <ChevronRight size={18} className="rotate-180" /> : <ChevronRight size={18} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20 font-medium'
                                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                                }
                                ${!isSidebarOpen && 'justify-center px-0'}
                            `}
                            title={!isSidebarOpen ? item.label : ''}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={`${!isSidebarOpen ? 'w-6 h-6' : ''}`} />
                                    {isSidebarOpen && <span>{item.label}</span>}
                                    {isSidebarOpen && isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-zinc-800/50 space-y-2">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-emerald-400 transition-all group ${!isSidebarOpen && 'justify-center'}`}
                        title="View Live Site"
                    >
                        <Globe size={20} />
                        {isSidebarOpen && <span className="font-medium group-hover:translate-x-1 transition-transform">View Live Site</span>}
                    </a>

                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all group ${!isSidebarOpen && 'justify-center'}`}
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-zinc-900 border-r border-zinc-800 z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center text-white font-bold text-lg">V</div>
                        <span className="text-white font-semibold">Visionary</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all
                                ${isActive
                                    ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20'
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }
                            `}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-400 hover:bg-red-900/20 hover:text-red-400 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10 shadow-sm/50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 text-zinc-600"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-800">{getCurrentPageTitle()}</h1>
                            <p className="text-xs text-zinc-500 hidden sm:block">Manage your website content</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-50 rounded-full border border-zinc-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-zinc-600">System Active</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-200 flex items-center justify-center text-white font-bold shadow-md">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-10 overflow-auto bg-zinc-50/50">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
