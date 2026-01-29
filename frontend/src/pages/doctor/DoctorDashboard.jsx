import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle, Loader2, ArrowRight, TrendingUp, Users, FileText, Award, AlertTriangle, Calendar, Clock, User, Phone, CheckCircle, XCircle,
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

    const handleUpdateLimit = async (newLimit) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/doctors/${doctor._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ appointmentsPerHour: newLimit })
            });

            if (res.ok) {
                const updatedDoc = await res.json();
                setDoctor(doc => ({ ...doc, appointmentsPerHour: updatedDoc.appointmentsPerHour }));
                // Show toast or slight visual feedback? For now, automatic update is fine.
            }
        } catch (err) {
            console.error('Failed to update limit:', err);
        }
    };

    // Toggle Online Status
    const handleToggleOnline = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/doctors/${doctor._id}/availability`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isOnline: !doctor.isOnline })
            });

            if (res.ok) {
                const updatedDoc = await res.json();
                setDoctor(doc => ({ ...doc, isOnline: updatedDoc.isOnline }));
            }
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };
    const parseTime = (timeStr) => {
        if (!timeStr) return 0;
        const [time, modifier] = timeStr.trim().split(/\s+/); // Handle "10:00 AM" or "10:00AM"
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        if (hours === 12 && modifier.toUpperCase() === 'AM') hours = 0;
        if (hours !== 12 && modifier.toUpperCase() === 'PM') hours += 12;
        return hours * 60 + minutes;
    };

    const handleStartConsultation = (app) => {
        const appTime = parseTime(app.time);
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        // 10 minutes early allowance
        if (appTime - currentMinutes > 10) {
            setEarlyWarning({ app, minutesEarly: appTime - currentMinutes });
            return;
        }
        
        proceedToConsultation(app);
    };

    const proceedToConsultation = (app) => {
        navigate(`/doctor/consultation/${app._id}`);
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
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-sm text-brand-blue font-medium">Welcome back,</p>
                            <h1 className="text-2xl font-bold text-brand-dark">{doctor?.name}</h1>
                        </div>
                        {/* Online/Offline Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${doctor?.isOnline ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                            {doctor?.isOnline ? 'ONLINE' : 'OFFLINE'}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Duty Toggle Switch */}
                        <button
                            onClick={handleToggleOnline}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${doctor?.isOnline
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600'
                                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                }`}
                        >
                            <div className={`w-3 h-3 rounded-full ${doctor?.isOnline ? 'bg-white' : 'bg-gray-400'}`} />
                            {doctor?.isOnline ? 'On Duty' : 'Off Duty'}
                        </button>

                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-brand-peach/50 shadow-sm">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Hourly Limit</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={doctor?.appointmentsPerHour || 5}
                                    onChange={(e) => handleUpdateLimit(parseInt(e.target.value))}
                                    className="w-12 text-right font-bold text-brand-dark focus:outline-none"
                                />
                            </div>
                            <Clock size={16} className="text-brand-blue mb-1" />
                        </div>
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

                <div className="grid lg:grid-cols-1 gap-8">
                    {/* Main Content - Full Width */}
                    <div className="space-y-6">
                        {/* Today's Schedule */}
                        <div className={`bg-white rounded-2xl shadow-sm border border-brand-peach/30 p-6 ${!doctor?.isOnline ? 'opacity-75 grayscale-[0.5] relative overflow-hidden' : ''}`}>
                            {!doctor?.isOnline && (
                                <div className="absolute inset-0 bg-gray-50/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                                    <div className="bg-white px-6 py-4 rounded-2xl shadow-xl border border-gray-200 text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">You are currently Off Duty</h3>
                                        <p className="text-gray-500 text-sm mb-4">Go online to manage appointments</p>
                                        <button onClick={handleToggleOnline} className="text-brand-blue font-bold text-sm hover:underline">
                                            Switch to On Duty
                                        </button>
                                    </div>
                                </div>
                            )}

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
                        <div className="bg-gradient-to-br from-brand-dark to-gray-800 rounded-2xl p-6 text-white text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                                <h3 className="font-bold text-lg">Today's Performance</h3>
                                <p className="text-sm opacity-60 bg-white/10 px-3 py-1 rounded-full">
                                    {now.toLocaleDateString()}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 rounded-2xl p-5 relative overflow-hidden group hover:bg-white/15 transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <Clock size={60} />
                                    </div>
                                    <p className="text-4xl font-bold mb-1">{todaysUpcoming.length}</p>
                                    <p className="text-sm opacity-80 uppercase tracking-wider">Remaining</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-5 relative overflow-hidden group hover:bg-white/15 transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <CheckCircle size={60} />
                                    </div>
                                    <p className="text-4xl font-bold mb-1">{todaysCompleted.length}</p>
                                    <p className="text-sm opacity-80 uppercase tracking-wider">Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
