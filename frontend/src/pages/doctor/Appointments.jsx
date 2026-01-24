import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, Phone, User, Mail, CheckCircle,
    Loader2, AlertCircle, ChevronLeft, ChevronRight, Search, Filter, ArrowRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Appointments() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('confirmed'); // 'confirmed', 'completed', 'all'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            const res = await fetch(`${API_URL}/doctors/dashboard/appointments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
                return;
            }

            if (!res.ok) throw new Error('Failed to fetch appointments');

            const data = await res.json();
            setAppointments(data.appointments || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartConsultation = (app) => {
        navigate('/doctor/consultation', { state: { appointment: app } });
    };

    // Filter Logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredAppointments = appointments.filter(app => {
        // Status filter
        if (filterStatus === 'confirmed' && app.status !== 'confirmed') return false;
        if (filterStatus === 'completed' && app.status !== 'completed') return false;
        if (filterStatus === 'all' && !['confirmed', 'completed'].includes(app.status)) return false;

        // Search filter
        const matchesSearch = !searchQuery ||
            app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.phone?.includes(searchQuery) ||
            app.email?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    }).sort((a, b) => {
        // Sort by date ascending for confirmed, descending for completed
        if (filterStatus === 'completed') {
            return new Date(b.date) - new Date(a.date);
        }
        return new Date(a.date) - new Date(b.date);
    });

    // Pagination
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const paginatedAppointments = filteredAppointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Stats
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
    const completedCount = appointments.filter(a => a.status === 'completed').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-cream flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-blue" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h1 className="text-xl font-bold text-brand-dark mb-2">Something went wrong</h1>
                <p className="text-gray-500 mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-brand-dark text-white rounded-lg hover:opacity-90">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream font-sans">
            {/* Header */}
            <div className="bg-white border-b border-brand-peach/30 px-8 py-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-3">
                        <Calendar className="text-brand-blue" size={28} />
                        Appointments
                    </h1>
                    <p className="text-brand-dark/60 mt-1">
                        Manage your confirmed and completed appointments
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={() => { setFilterStatus('confirmed'); setCurrentPage(1); }}
                        className={`p-5 rounded-2xl border transition-all ${filterStatus === 'confirmed'
                            ? 'bg-brand-blue text-white border-brand-blue shadow-lg'
                            : 'bg-white border-brand-peach/30 hover:border-brand-blue/30'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Calendar size={24} className={filterStatus === 'confirmed' ? 'text-white' : 'text-brand-blue'} />
                            <div className="text-left">
                                <p className={`text-2xl font-bold ${filterStatus === 'confirmed' ? 'text-white' : 'text-brand-dark'}`}>
                                    {confirmedCount}
                                </p>
                                <p className={`text-xs ${filterStatus === 'confirmed' ? 'text-white/80' : 'text-brand-dark/60'}`}>
                                    Upcoming
                                </p>
                            </div>
                        </div>
                    </button>
                    <button
                        onClick={() => { setFilterStatus('completed'); setCurrentPage(1); }}
                        className={`p-5 rounded-2xl border transition-all ${filterStatus === 'completed'
                            ? 'bg-green-600 text-white border-green-600 shadow-lg'
                            : 'bg-white border-brand-peach/30 hover:border-green-300'}`}
                    >
                        <div className="flex items-center gap-3">
                            <CheckCircle size={24} className={filterStatus === 'completed' ? 'text-white' : 'text-green-600'} />
                            <div className="text-left">
                                <p className={`text-2xl font-bold ${filterStatus === 'completed' ? 'text-white' : 'text-brand-dark'}`}>
                                    {completedCount}
                                </p>
                                <p className={`text-xs ${filterStatus === 'completed' ? 'text-white/80' : 'text-brand-dark/60'}`}>
                                    Completed
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-sm border border-brand-peach/30 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or email..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-11 pr-4 py-2.5 bg-brand-cream rounded-xl border border-brand-peach/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-sm"
                        />
                    </div>
                </div>

                {/* Results */}
                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-brand-peach">
                        <Calendar size={48} className="mx-auto text-brand-peach mb-4" />
                        <h2 className="text-xl font-bold text-brand-dark mb-2">No Appointments</h2>
                        <p className="text-brand-dark/60">
                            {searchQuery
                                ? 'No appointments match your search.'
                                : `No ${filterStatus} appointments found.`}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Appointments List */}
                        <div className="space-y-4">
                            {paginatedAppointments.map(app => {
                                const appDate = new Date(app.date);
                                const isToday = appDate.toDateString() === today.toDateString();
                                const isPast = appDate < today;

                                return (
                                    <div
                                        key={app._id}
                                        className="bg-white rounded-2xl border border-brand-peach/30 p-5 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Left: Patient Info */}
                                            <div className="flex items-start gap-4">
                                                <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${isToday ? 'bg-brand-blue text-white' : 'bg-brand-peach/30 text-brand-dark'
                                                    }`}>
                                                    <span className="text-lg font-bold leading-none">{appDate.getDate()}</span>
                                                    <span className="text-[10px] uppercase">{appDate.toLocaleString('default', { month: 'short' })}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-brand-dark flex items-center gap-2">
                                                        {app.name}
                                                        {isToday && (
                                                            <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-bold rounded-full uppercase">
                                                                Today
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <div className="mt-1 space-y-0.5">
                                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                                            <Clock size={12} /> {app.time}
                                                        </p>
                                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                                            <Phone size={12} /> {app.phone}
                                                        </p>
                                                        {app.email && (
                                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                                <Mail size={12} /> {app.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Status & Action */}
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'completed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-brand-blue/10 text-brand-blue'
                                                    }`}>
                                                    {app.status === 'completed' ? 'Completed' : 'Confirmed'}
                                                </span>

                                                {app.status === 'confirmed' && !isPast && (
                                                    <button
                                                        onClick={() => handleStartConsultation(app)}
                                                        className="px-4 py-2 bg-brand-dark text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors flex items-center gap-2"
                                                    >
                                                        Start <ArrowRight size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Reference ID */}
                                        <div className="mt-4 pt-4 border-t border-brand-peach/30 flex items-center justify-between">
                                            <span className="text-xs text-gray-400 font-mono">
                                                Ref: {app.referenceId}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {appDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm text-brand-dark/60">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-white border border-brand-peach/30 text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-cream transition-colors"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="px-4 py-2 text-sm font-medium text-brand-dark">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg bg-white border border-brand-peach/30 text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-cream transition-colors"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
