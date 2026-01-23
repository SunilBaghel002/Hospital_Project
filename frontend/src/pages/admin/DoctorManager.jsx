import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, User, Search } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function DoctorManager() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState(false);

    const emptyDoctor = {
        name: '', role: '', qualification: '', experience: '',
        bio: '', image: '', specialty: '', languages: [],
        availableDays: [], consultationFee: '', isActive: true
    };

    const [formData, setFormData] = useState(emptyDoctor);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/doctors/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setDoctors(await res.json());
            }
        } catch (err) {
            console.error('Failed to fetch doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const url = editingDoctor
                ? `${API_URL}/doctors/${editingDoctor._id}`
                : `${API_URL}/doctors`;

            const res = await fetch(url, {
                method: editingDoctor ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchDoctors();
                closeModal();
            } else {
                alert('Failed to save doctor');
            }
        } catch (err) {
            alert('Error saving doctor');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this doctor?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/doctors/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchDoctors();
        } catch (err) {
            alert('Failed to delete doctor');
        }
    };

    const openModal = (doctor = null) => {
        setEditingDoctor(doctor);
        setFormData(doctor || emptyDoctor);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingDoctor(null);
        setFormData(emptyDoctor);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formDataUpload
            });
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image: data.url }));
            }
        } catch (err) {
            alert('Image upload failed');
        }
    };

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Doctor Management</h1>
                    <p className="text-slate-500 mt-1">Add, edit, and manage your medical team</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                    <Plus size={20} /> Add Doctor
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                />
            </div>

            {/* Doctor Grid */}
            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading doctors...</div>
            ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl">
                    <User size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">No doctors found. Add your first doctor!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gradient-to-br from-blue-50 to-slate-100 relative">
                                {doctor.image ? (
                                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User size={64} className="text-slate-300" />
                                    </div>
                                )}
                                {!doctor.isActive && (
                                    <span className="absolute top-3 right-3 px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">Inactive</span>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-800">{doctor.name}</h3>
                                <p className="text-blue-600 font-medium text-sm">{doctor.role}</p>
                                <p className="text-slate-500 text-sm mt-1">{doctor.qualification}</p>
                                <p className="text-slate-400 text-xs mt-1">{doctor.experience} experience</p>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => openModal(doctor)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                                    >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doctor._id)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 overflow-hidden mb-4 relative group">
                                    {formData.image ? (
                                        <img src={formData.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User size={48} className="text-slate-300" />
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="text-white" size={24} />
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Or paste image URL"
                                    value={formData.image}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                    className="w-full max-w-md px-4 py-2 border border-slate-200 rounded-lg text-center text-sm"
                                />
                            </div>

                            {/* Form Fields */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="Dr. John Smith"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role/Specialization *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="Cataract Specialist"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
                                    <input
                                        type="text"
                                        value={formData.qualification}
                                        onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="MBBS, MD (Ophthalmology)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                                    <input
                                        type="text"
                                        value={formData.experience}
                                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="15 Years"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fee</label>
                                    <input
                                        type="number"
                                        value={formData.consultationFee}
                                        onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="500"
                                    />
                                </div>
                                <div className="flex items-center gap-3 pt-6">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                        className="w-5 h-5 rounded"
                                    />
                                    <label htmlFor="isActive" className="text-slate-700">Active (visible on website)</label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none resize-none"
                                    placeholder="Brief biography..."
                                />
                            </div>

                            {/* Available Days */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Available Days</label>
                                <div className="flex flex-wrap gap-2">
                                    {days.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => {
                                                const arr = formData.availableDays || [];
                                                const newArr = arr.includes(day)
                                                    ? arr.filter(d => d !== day)
                                                    : [...arr, day];
                                                setFormData(prev => ({ ...prev, availableDays: newArr }));
                                            }}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${(formData.availableDays || []).includes(day)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Doctor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
