import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Mail, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorSettings() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [doctor, setDoctor] = useState(null);
    const [message, setMessage] = useState(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchDoctorData();
    }, []);

    const fetchDoctorData = async () => {
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

            if (!res.ok) throw new Error('Failed to fetch data');

            const data = await res.json();
            setDoctor(data.doctor);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/doctors/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.message || 'Failed to change password' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-cream flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-blue" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream font-sans">
            {/* Header */}
            <div className="bg-white border-b border-brand-peach/30 px-8 py-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-3">
                        <Settings className="text-brand-blue" size={28} />
                        Settings
                    </h1>
                    <p className="text-brand-dark/60 mt-1">
                        Manage your account settings
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-8 space-y-6">
                {/* Profile Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-brand-peach/30 p-6">
                    <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                        <User size={20} className="text-brand-blue" />
                        Profile Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wider mb-2">Name</label>
                            <div className="px-4 py-3 bg-brand-cream rounded-xl text-brand-dark font-medium">
                                Dr. {doctor?.name || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wider mb-2">Email</label>
                            <div className="px-4 py-3 bg-brand-cream rounded-xl text-brand-dark font-medium flex items-center gap-2">
                                <Mail size={16} className="text-brand-dark/40" />
                                {doctor?.email || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wider mb-2">Specialization</label>
                            <div className="px-4 py-3 bg-brand-cream rounded-xl text-brand-dark font-medium">
                                {doctor?.specialization || 'General Physician'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-2xl shadow-sm border border-brand-peach/30 p-6">
                    <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-brand-blue" />
                        Change Password
                    </h2>

                    {message && (
                        <div className={`p-4 rounded-xl mb-4 flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wider mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-4 py-3 bg-brand-cream rounded-xl border border-brand-peach/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wider mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-4 py-3 bg-brand-cream rounded-xl border border-brand-peach/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wider mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-3 bg-brand-cream rounded-xl border border-brand-peach/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-3 bg-brand-dark text-white rounded-xl font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
