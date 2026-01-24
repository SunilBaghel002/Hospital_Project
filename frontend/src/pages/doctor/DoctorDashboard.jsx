import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, User, Phone, CheckCircle, XCircle,
    AlertCircle, Loader2, ArrowRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
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

            if (!res.ok) throw new Error('Failed to fetch dashboard data');

            const data = await res.json();
            setDoctor(data.doctor);
            setAppointments(data.appointments);
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
                setAppointments(prev => prev.map(app =>
                    app._id === id ? { ...app, status } : app
                ));
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleStartConsultation = (app) => {
        navigate('/doctor/consultation', { state: { appointment: app } });
    };

    // Time parser
    const parseTime = (timeStr) => {
        if (!timeStr) return 0;
        const normalized = timeStr.toLowerCase().replace(/\./g, '').trim();
        let time, modifier;
        if (normalized.includes(' ')) {
            [time, modifier] = normalized.split(' ');
        } else {
            const match = normalized.match(/(\d+:\d+)([ap]m)/);
            if (match) { time = match[1]; modifier = match[2]; }
        }
        if (!time || !modifier) return 0;
        let [hours, minutes] = time.split(':').map(n => parseInt(n, 10));
        if (hours === 12) hours = 0;
        if (modifier === 'pm') hours += 12;
        return hours * 60 + minutes;
    };

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

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Today's appointments only (remaining for the day)
    const todaysUpcoming = appointments.filter(app => {
        const appDate = new Date(app.date);
        appDate.setHours(0, 0, 0, 0);
        if (appDate.getTime() !== today.getTime()) return false;
        if (app.status !== 'confirmed') return false;
        return parseTime(app.time) > currentMinutes;
    }).sort((a, b) => parseTime(a.time) - parseTime(b.time));

    // ALL pending requests (any date - so doctor can approve future bookings)
    const allPending = appointments.filter(app => app.status === 'pending')
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Today's completed
    const todaysCompleted = appointments.filter(app => {
        const appDate = new Date(app.date);
        appDate.setHours(0, 0, 0, 0);
        return appDate.getTime() === today.getTime() && app.status === 'completed';
    });

    return (
        <div className="min-h-screen bg-brand-cream font-sans">
            {/* Header */}
            <div className="bg-white border-b border-brand-peach/30 px-8 py-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <p className="text-sm text-brand-blue font-medium">Welcome back,</p>
                        <h1 className="text-2xl font-bold text-brand-dark">Dr. {doctor?.name}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-brand-cream px-4 py-2 rounded-xl text-sm font-medium text-brand-dark flex items-center gap-2 border border-brand-peach/50">
                            <Calendar size={16} className="text-brand-blue" />
                            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - Today's Schedule */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-brand-peach/30 p-6">
                            <h2 className="text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">
                                <Clock size={20} className="text-brand-blue" />
                                Today's Schedule
                            </h2>

                            {todaysUpcoming.length === 0 ? (
                                <div className="text-center py-16 bg-brand-cream rounded-2xl border-2 border-dashed border-brand-peach">
                                    <Calendar size={48} className="mx-auto text-brand-peach mb-4" />
                                    <p className="text-brand-dark/60">No more appointments today. You're all done!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {todaysUpcoming.map(app => (
                                        <div key={app._id} className="flex items-center gap-4 p-4 bg-brand-cream/50 rounded-xl border border-brand-peach/30 hover:border-brand-blue/30 hover:bg-brand-cream transition-all group">
                                            <div className="w-16 h-16 bg-brand-peach/30 rounded-xl flex flex-col items-center justify-center text-brand-dark">
                                                <span className="text-lg font-bold">{app.time.split(':')[0]}</span>
                                                <span className="text-[10px] font-medium uppercase">{app.time.includes('PM') || app.time.includes('pm') ? 'PM' : 'AM'}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-brand-dark">{app.name}</h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <Phone size={12} /> {app.phone}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleStartConsultation(app)}
                                                className="px-5 py-2.5 bg-brand-dark text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-colors flex items-center gap-2 shadow-sm"
                                            >
                                                Start <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Today's Summary */}
                        <div className="bg-gradient-to-br from-brand-dark to-gray-800 rounded-2xl p-6 text-white">
                            <h3 className="font-bold mb-4">Today's Summary</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <p className="text-3xl font-bold">{todaysUpcoming.length}</p>
                                    <p className="text-xs opacity-80">Remaining</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <p className="text-3xl font-bold">{allPending.length}</p>
                                    <p className="text-xs opacity-80">Pending</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <p className="text-3xl font-bold">{todaysCompleted.length}</p>
                                    <p className="text-xs opacity-80">Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Today's Pending Requests */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-brand-peach/30 p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                                    <AlertCircle size={20} className="text-amber-500" />
                                    Pending Requests
                                </h2>
                                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {allPending.length}
                                </span>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                {allPending.length === 0 ? (
                                    <p className="text-center py-8 text-gray-400 text-sm">No pending requests.</p>
                                ) : (
                                    allPending.map(app => (
                                        <div key={app._id} className="bg-brand-cream/50 p-4 rounded-xl border border-brand-peach/30">
                                            <div className="mb-3">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-bold text-brand-dark">{app.name}</p>
                                                    <span className="text-xs font-medium text-brand-blue bg-white px-2 py-1 rounded border border-brand-peach/30">
                                                        {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {app.time}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{app.phone}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'cancelled')}
                                                    disabled={actionLoading === app._id}
                                                    className="py-2 text-xs font-bold text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'confirmed')}
                                                    disabled={actionLoading === app._id}
                                                    className="py-2 text-xs font-bold text-white bg-brand-dark rounded-lg hover:opacity-90 shadow-sm transition-all flex items-center justify-center"
                                                >
                                                    {actionLoading === app._id ? <Loader2 className="animate-spin" size={12} /> : 'Accept'}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
