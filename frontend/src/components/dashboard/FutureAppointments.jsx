import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const FutureAppointments = () => {
    const { token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rescheduleData, setRescheduleData] = useState(null); // { id: string }
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [msg, setMsg] = useState('');

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/appointments/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Filter future appointments locally or rely on sort
                // We'll show all pending/confirmed ones that are in future
                const now = new Date();
                const future = data.data.filter(apt => new Date(apt.date) >= now && apt.status !== 'cancelled' && apt.status !== 'completed');
                setAppointments(future);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [token]);

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        if (!rescheduleData) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/appointments/${rescheduleData.id}/reschedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date: newDate, time: newTime })
            });
            const data = await res.json();
            if (data.success) {
                setMsg('Reschedule request sent successfully! Waiting for doctor confirmation.');
                setRescheduleData(null);
                fetchAppointments(); // Refresh list to show status if we added UI for it
            } else {
                setMsg(data.message || 'Failed to requests reschedule');
            }
        } catch (err) {
            setMsg('Error submitting request');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Upcoming Appointments</h1>
            {msg && <div className="p-3 bg-blue-100 text-blue-700 rounded mb-4">{msg}</div>}

            {loading ? <p>Loading...</p> : (
                <div className="grid gap-4">
                    {appointments.length === 0 ? <p>No upcoming appointments.</p> : appointments.map(apt => (
                        <div key={apt._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{apt.doctor}</h3>
                                <p className="text-gray-600">{new Date(apt.date).toDateString()} at {apt.time}</p>
                                <p className="text-sm text-gray-500 mt-1">Status: <span className="capitalize font-medium text-indigo-600">{apt.status}</span></p>
                                {apt.rescheduleRequest?.isRescheduling && (
                                    <p className="text-xs text-orange-600 mt-1">Reschedule Pending</p>
                                )}
                            </div>
                            {!apt.rescheduleRequest?.isRescheduling && (
                                <button
                                    onClick={() => {
                                        setRescheduleData({ id: apt._id });
                                        setMsg('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Reschedule
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Reschedule Modal */}
            {rescheduleData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-4">Request New Time</h3>
                        <p className="text-xs text-gray-500 mb-4">Note: Requests must be made at least 2 hours in advance.</p>
                        <form onSubmit={handleRescheduleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    value={newDate}
                                    onChange={e => setNewDate(e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                                <select
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    value={newTime}
                                    onChange={e => setNewTime(e.target.value)}
                                >
                                    <option value="">Select Time</option>
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setRescheduleData(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FutureAppointments;
