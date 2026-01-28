import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardHome from '../../components/dashboard/DashboardHome';
import AppointmentHistory from '../../components/dashboard/AppointmentHistory';
import FutureAppointments from '../../components/dashboard/FutureAppointments';
import Prescriptions from '../../components/dashboard/Prescriptions';
import { LayoutDashboard, Calendar, History, FileText, LogOut, User, Home } from 'lucide-react';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardHome user={user} />;
            case 'history': return <AppointmentHistory />;
            case 'future': return <FutureAppointments />;
            case 'prescriptions': return <Prescriptions />;
            default: return <DashboardHome user={user} />;
        }
    };

    const NavItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === id
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-200'
                : 'text-gray-500 hover:bg-white hover:text-brand-dark hover:shadow-sm'
                }`}
        >
            <Icon size={20} />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-brand-cream/30 flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-white/50 backdrop-blur-xl border-r border-brand-peach/20 flex flex-col h-screen sticky top-0">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                            R
                        </div>
                        <h2 className="text-2xl font-bold text-brand-dark tracking-tight">Romashka</h2>
                    </div>

                    <div className="bg-gradient-to-br from-brand-peach/10 to-brand-cream/50 p-4 rounded-2xl border border-brand-peach/20 mb-8 flex items-center gap-4">
                        <div className="bg-white p-2 rounded-full shadow-sm text-brand-dark">
                            <User size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Patient</p>
                            <p className="font-bold text-brand-dark truncate">{user?.name}</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <NavItem id="dashboard" icon={LayoutDashboard} label="Overview" />
                        <NavItem id="future" icon={Calendar} label="Appointments" />
                        <NavItem id="history" icon={History} label="History" />
                        <NavItem id="prescriptions" icon={FileText} label="Prescriptions" />
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-brand-peach/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium border border-transparent hover:border-red-100"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
