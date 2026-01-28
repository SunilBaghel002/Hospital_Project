import React from 'react';
import { Calendar, FileText, Activity, Plus, Clock, User } from 'lucide-react';

const DashboardHome = ({ user }) => {
    const handleBookAppointment = () => {
        // Trigger the custom event that App.jsx listens to
        window.dispatchEvent(new CustomEvent('open-appointment-modal'));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* hidden trigger button for existing logic compatibility if needed, 
               but we can also just put the ID on the card itself or a button inside. 
               Let's just put the ID on the main action button.
            */}

            <header className="flex justify-between items-end border-b border-brand-peach/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand-dark">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2">Welcome back, <span className="font-semibold text-brand-blue">{user?.name}</span></p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-brand-peach/20">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    onClick={handleBookAppointment}
                    className="bg-gradient-to-br from-brand-blue to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between h-48 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar size={100} />
                    </div>
                    <div>
                        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm mb-4">
                            <Plus size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold">Book Appointment</h3>
                        <p className="text-blue-100 text-sm mt-1">Schedule a new consultation</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium bg-white/10 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
                        Book Now <ArrowRightIcon className="w-4 h-4" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-peach/20 hover:border-brand-blue/30 transition-all group h-48 flex flex-col justify-between">
                    <div>
                        <div className="bg-brand-cream w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-brand-dark">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark">Prescriptions</h3>
                        <p className="text-gray-500 text-sm mt-1">View your medical records</p>
                    </div>
                    <button className="text-brand-blue font-medium text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform w-fit">
                        View History <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-peach/20 hover:border-brand-blue/30 transition-all group h-48 flex flex-col justify-between">
                    <div>
                        <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-green-600">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Health Tips</h3>
                        <p className="text-gray-500 text-sm mt-1">Daily advice for better health</p>
                    </div>
                    <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded w-fit">
                        Updated Today
                    </span>
                </div>
            </div>

            {/* Recent Activity Section could go here */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-peach/10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                        <Clock size={20} className="text-brand-blue" />
                        Recent Activity
                    </h2>
                </div>
                <div className="text-center py-10 text-gray-400">
                    <HistoryIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No recent activity to show</p>
                </div>
            </div>
        </div>
    );
};

const ArrowRightIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const HistoryIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default DashboardHome;
