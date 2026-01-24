import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, Phone, User, CheckCircle, XCircle,
    AlertCircle, Loader2, ChevronLeft, ChevronRight, Search, Filter
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function PendingRequests() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('all'); // 'all', 'today', 'week', 'month'

    useEffect(() => {
        fetchPendingAppointments();
    }, []);

    const fetchPendingAppointments = async () => {
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

    const handleStatusUpdate = async (id, status) => {
        setActionLoading(id);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/doctors/appointments/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Remove the processed appointment from the list
                setAppointments(prev => prev.filter(app => app._id !== id));
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleBulkAction = async (action) => {
        const pendingIds = filteredAppointments.map(a => a._id);
        for (const id of pendingIds) {
            await handleStatusUpdate(id, action);
        }
    };

    // Filter Logic
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingAppointments = appointments.filter(app => app.status === 'pending');

    const filteredAppointments = pendingAppointments.filter(app => {
        // Search filter
        const matchesSearch = !searchQuery ||
            app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.phone?.includes(searchQuery) ||
            app.email?.toLowerCase().includes(searchQuery.toLowerCase());

        // Date filter
        const appDate = new Date(app.date);
        appDate.setHours(0, 0, 0, 0);

        let matchesDate = true;
        if (filterDate === 'today') {
            matchesDate = appDate.getTime() === today.getTime();
        } else if (filterDate === 'week') {
            const weekFromNow = new Date(today);
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            matchesDate = appDate >= today && appDate <= weekFromNow;
        } else if (filterDate === 'month') {
            const monthFromNow = new Date(today);
            monthFromNow.setMonth(monthFromNow.getMonth() + 1);
            matchesDate = appDate >= today && appDate <= monthFromNow;
        }

        return matchesSearch && matchesDate;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const paginatedAppointments = filteredAppointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-3">
                                <AlertCircle className="text-amber-500" size={28} />
                                Pending Requests
                            </h1>
                            <p className="text-brand-dark/60 mt-1">
                                {pendingAppointments.length} total pending • {filteredAppointments.length} shown
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-8">
                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-brand-peach/30 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, phone, or email..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-11 pr-4 py-2.5 bg-brand-cream rounded-xl border border-brand-peach/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-sm"
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-brand-dark/40" />
                            <select
                                value={filterDate}
                                onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
                                className="px-4 py-2.5 bg-brand-cream rounded-xl border border-brand-peach/30 text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-brand-peach">
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                        <h2 className="text-xl font-bold text-brand-dark mb-2">All caught up!</h2>
                        <p className="text-brand-dark/60">
                            {searchQuery || filterDate !== 'all'
                                ? 'No pending requests match your filters.'
                                : 'No pending appointment requests at the moment.'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Appointments Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-brand-peach/30 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-brand-cream/50 border-b border-brand-peach/30">
                                        <tr>
                                            <th className="text-left py-4 px-6 text-xs font-bold text-brand-dark/60 uppercase tracking-wider">Patient</th>
                                            <th className="text-left py-4 px-6 text-xs font-bold text-brand-dark/60 uppercase tracking-wider">Date & Time</th>
                                            <th className="text-left py-4 px-6 text-xs font-bold text-brand-dark/60 uppercase tracking-wider">Contact</th>
                                            <th className="text-right py-4 px-6 text-xs font-bold text-brand-dark/60 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-peach/20">
                                        {paginatedAppointments.map(app => (
                                            <tr key={app._id} className="hover:bg-brand-cream/30 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-brand-peach/30 rounded-full flex items-center justify-center">
                                                            <User size={18} className="text-brand-dark" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-brand-dark">{app.name}</p>
                                                            <p className="text-xs text-gray-500">{app.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-brand-blue" />
                                                        <span className="font-medium text-brand-dark">
                                                            {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Clock size={14} className="text-brand-dark/40" />
                                                        <span className="text-sm text-gray-500">{app.time}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-brand-dark/40" />
                                                        <span className="text-sm text-brand-dark">{app.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(app._id, 'cancelled')}
                                                            disabled={actionLoading === app._id}
                                                            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(app._id, 'confirmed')}
                                                            disabled={actionLoading === app._id}
                                                            className="px-4 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                                                        >
                                                            {actionLoading === app._id ? (
                                                                <Loader2 className="animate-spin" size={14} />
                                                            ) : (
                                                                <>
                                                                    <CheckCircle size={14} />
                                                                    Accept
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
