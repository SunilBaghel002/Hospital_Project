import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, ExternalLink, LogOut, Activity, ClipboardList, History } from 'lucide-react';
import { adminAuthAPI } from '../../services/adminApi';
import { useNavigate } from 'react-router-dom';

export default function DoctorLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        adminAuthAPI.logout();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/doctor/requests', icon: ClipboardList, label: 'Requests' },
        { path: '/doctor/appointments', icon: Activity, label: 'Appointments' },
        { path: '/doctor/history', icon: History, label: 'History' },
        { path: '/doctor/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-brand-cream font-sans text-brand-dark">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-brand-peach/30 flex flex-col fixed inset-y-0 z-20">
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-brand-peach/30">
                    <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold">
                        R
                    </div>
                    <div>
                        <h1 className="font-bold text-brand-dark leading-tight">Romashka</h1>
                        <p className="text-[10px] text-brand-blue uppercase tracking-wider">Doctor Portal</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive(item.path)
                                ? 'bg-brand-blue/10 text-brand-blue shadow-sm'
                                : 'text-brand-dark/60 hover:bg-brand-cream hover:text-brand-dark'
                                }`}
                        >
                            <item.icon size={20} className={isActive(item.path) ? 'text-brand-blue' : 'text-brand-dark/40'} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-brand-peach/30 space-y-2">
                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-dark/60 hover:bg-brand-cream hover:text-brand-dark transition-colors text-sm font-medium"
                    >
                        <ExternalLink size={20} className="text-brand-dark/40" />
                        Go to Website
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pl-64 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
