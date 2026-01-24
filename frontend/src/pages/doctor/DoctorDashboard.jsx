import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, User, Phone, CheckCircle, XCircle,
    AlertCircle, Loader2, ArrowRight, TrendingUp, Users, FileText, Award, AlertTriangle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [prescriptionCount, setPrescriptionCount] = useState(0);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [earlyWarning, setEarlyWarning] = useState(null); // {app, minutesEarly}

    // Re-fetch whenever we return to this page (e.g., after prescription)
    useEffect(() => {
        fetchDashboardData();
        fetchPrescriptionCount();
    }, [navigate]); // Triggers on every navigation to this component

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

    const fetchPrescriptionCount = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/prescriptions/history?limit=1`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPrescriptionCount(data.pagination?.total || 0);
            }
        } catch (err) {
            console.error('Failed to fetch prescription count');
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

    const handleStartConsultation = (app) => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const appointmentMinutes = parseTime(app.time);

        // Check if starting early (more than 5 minutes before scheduled time)
        if (currentMinutes < appointmentMinutes - 5) {
            const minutesEarly = appointmentMinutes - currentMinutes;
            setEarlyWarning({ app, minutesEarly });
            return;
        }

        // Proceed normally
        proceedToConsultation(app);
    };

    const proceedToConsultation = (app) => {
        // Store actual start time
        const startedAt = new Date().toISOString();
        navigate('/doctor/consultation', {
            state: {
                appointment: {
                    ...app,
                    actualStartTime: startedAt
                }
            }
        });
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

    // ALL pending requests (any date - sorted by nearest first)
    const allPending = appointments.filter(app => app.status === 'pending')
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Top 5 pending for dashboard
    const top5Pending = allPending.slice(0, 5);

    // Today's completed
    const todaysCompleted = appointments.filter(app => {
        const appDate = new Date(app.date);
        appDate.setHours(0, 0, 0, 0);
        return appDate.getTime() === today.getTime() && app.status === 'completed';
    });

    // Overall stats
    const totalAppointments = appointments.length;
    const totalCompleted = appointments.filter(a => a.status === 'completed').length;
    const totalConfirmed = appointments.filter(a => a.status === 'confirmed').length;

    return (
        <div className="min-h-screen bg-brand-cream font-sans">
            {/* Early Start Warning Modal */}
            {earlyWarning && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} className="text-amber-600" />
                            </div>
                            <h2 className="text-xl font-bold text-brand-dark">Starting Early</h2>
                            <p className="text-brand-dark/60 mt-2">
                                This appointment is scheduled for <span className="font-bold">{earlyWarning.app.time}</span>.
                                <br />You're starting <span className="font-bold text-amber-600">{earlyWarning.minutesEarly} minutes early</span>.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    proceedToConsultation(earlyWarning.app);
                                    setEarlyWarning(null);
                                }}
                                className="w-full py-3 bg-brand-dark text-white rounded-xl font-semibold hover:opacity-90 transition-colors"
                            >
                                Proceed Anyway
                            </button>
                            <button
                                onClick={() => setEarlyWarning(null)}
                                className="w-full py-3 bg-brand-cream text-brand-dark rounded-xl font-semibold hover:bg-brand-peach/30 transition-colors"
                            >
                                Wait Until Scheduled Time
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-brand-peach/30 px-8 py-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:items-center gap-4">
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

            <div className="max-w-7xl mx-auto p-8">
                {/* Overall Stats Banner */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-brand-dark/60 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Overall Statistics
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl p-5 border border-brand-peach/30 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                                    <Users size={24} className="text-brand-blue" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-brand-dark">{totalAppointments}</p>
                                    <p className="text-xs text-brand-dark/60">Total Appointments</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-brand-peach/30 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <CheckCircle size={24} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-brand-dark">{totalCompleted}</p>
                                    <p className="text-xs text-brand-dark/60">Completed</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-brand-peach/30 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-brand-peach/30 rounded-xl flex items-center justify-center">
                                    <FileText size={24} className="text-brand-dark" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-brand-dark">{prescriptionCount}</p>
                                    <p className="text-xs text-brand-dark/60">Prescriptions</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-brand-peach/30 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                    <Award size={24} className="text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-brand-dark">{totalConfirmed}</p>
                                    <p className="text-xs text-brand-dark/60">Upcoming Confirmed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Today's Schedule */}
                        <div className="bg-white rounded-2xl shadow-sm border border-brand-peach/30 p-6">
                            <h2 className="text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">
                                <Clock size={20} className="text-brand-blue" />
                                Today's Schedule
                                <span className="ml-auto bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-xs font-bold">
                                    {todaysUpcoming.length} remaining
                                </span>
                            </h2>

                            {todaysUpcoming.length === 0 ? (
                                <div className="text-center py-12 bg-brand-cream rounded-2xl border-2 border-dashed border-brand-peach">
                                    <Calendar size={40} className="mx-auto text-brand-peach mb-3" />
                                    <p className="text-brand-dark/60">No more appointments today. You're all done!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {todaysUpcoming.map(app => (
                                        <div key={app._id} className="flex items-center gap-4 p-4 bg-brand-cream/50 rounded-xl border border-brand-peach/30 hover:border-brand-blue/30 hover:bg-brand-cream transition-all">
                                            <div className="w-14 h-14 bg-brand-peach/30 rounded-xl flex flex-col items-center justify-center text-brand-dark">
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
                                    <p className="text-3xl font-bold">{todaysCompleted.length}</p>
                                    <p className="text-xs opacity-80">Completed</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <p className="text-3xl font-bold">{allPending.length}</p>
                                    <p className="text-xs opacity-80">Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Pending Requests Section - TOP 5 ONLY */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-brand-peach/30 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                                    <AlertCircle size={20} className="text-amber-500" />
                                    Pending Requests
                                </h2>
                                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {allPending.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {allPending.length === 0 ? (
                                    <div className="text-center py-12 bg-brand-cream rounded-xl border-2 border-dashed border-brand-peach">
                                        <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
                                        <p className="text-sm text-brand-dark/60">All caught up!</p>
                                        <p className="text-xs text-gray-400">No pending requests</p>
                                    </div>
                                ) : (
                                    <>
                                        {top5Pending.map(app => (
                                            <div key={app._id} className="bg-brand-cream/50 p-4 rounded-xl border border-brand-peach/30">
                                                <div className="mb-3">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <p className="font-bold text-brand-dark">{app.name}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{app.phone}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block text-xs font-bold text-brand-blue">
                                                                {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500">{app.time}</span>
                                                        </div>
                                                    </div>
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
                                        ))}

                                        {/* View All Button */}
                                        {allPending.length > 5 && (
                                            <button
                                                onClick={() => navigate('/doctor/requests')}
                                                className="w-full py-3 mt-2 bg-brand-cream text-brand-dark rounded-xl font-semibold text-sm hover:bg-brand-peach/30 transition-colors flex items-center justify-center gap-2"
                                            >
                                                View All {allPending.length} Requests
                                                <ArrowRight size={16} />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
