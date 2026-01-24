import { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Search, Filter, MoreVertical, RefreshCcw } from 'lucide-react';
import { appointmentAPI, doctorAPI } from '../../services/api';

export default function AppointmentManager() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDoctor, setFilterDoctor] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
    }, []);

    const fetchDoctors = async () => {
        try {
            const data = await doctorAPI.getAll();
            setDoctors(data);
        } catch (err) {
            console.error('Failed to fetch doctors', err);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await appointmentAPI.getAll({ limit: 100 }); // Fetch last 100 appointments
            if (response.success) {
                setAppointments(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch appointments', err);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAppointments();
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (!confirm(`Are you sure you want to mark this appointment as ${newStatus}?`)) return;

        try {
            const response = await appointmentAPI.updateStatus(id, newStatus);
            if (response.success) {
                // Optimistic update
                setAppointments(prev => prev.map(apt =>
                    apt._id === id ? { ...apt, status: newStatus } : apt
                ));
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
        const matchesDoctor = filterDoctor === 'all' || apt.doctor === filterDoctor;
        const matchesSearch =
            apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.referenceId.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesDoctor && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Appointment Manager</h1>
                    <p className="text-slate-500 text-sm">View and manage patient bookings</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className={`p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all ${refreshing ? 'animate-spin' : ''}`}
                    title="Refresh List"
                >
                    <RefreshCcw size={20} />
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search patient, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-brand-blue outline-none text-sm"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    <select
                        value={filterDoctor}
                        onChange={(e) => setFilterDoctor(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer hover:border-brand-blue/50"
                    >
                        <option value="all">All Doctors</option>
                        {doctors.map(doc => (
                            <option key={doc._id} value={doc.name}>{doc.name}</option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer hover:border-brand-blue/50"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500">Loading appointments...</p>
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <Calendar className="mx-auto text-slate-300 mb-3" size={48} />
                    <p className="text-slate-500">No appointments found matching your filters.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Reference / Patient</th>
                                    <th className="px-6 py-4 font-semibold">Doctor / Date</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAppointments.map((apt) => (
                                    <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs text-slate-500 mb-1 bg-slate-100 w-fit px-2 py-0.5 rounded">{apt.referenceId}</span>
                                                <span className="font-semibold text-slate-800">{apt.name}</span>
                                                <span className="text-xs text-slate-500">{apt.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-brand-blue">{apt.doctor}</span>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <Calendar size={12} />
                                                    {new Date(apt.date).toLocaleDateString()}
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <Clock size={12} />
                                                    {apt.time}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(apt.status)} capitalize`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {apt.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                                                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all"
                                                        title="Confirm"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {apt.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt._id, 'completed')}
                                                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all"
                                                        title="Mark Completed"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all"
                                                        title="Cancel"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
