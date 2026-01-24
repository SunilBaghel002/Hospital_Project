import { useState, useEffect, useCallback } from 'react';
import { FileText, Search, Calendar, User, Clock, Loader2, AlertCircle, ChevronLeft, ChevronRight, X, Pill } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function PrescriptionHistory() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const fetchPrescriptions = useCallback(async (page = 1, search = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({ page, limit: 10, search });
            const res = await fetch(`${API_URL}/prescriptions/history?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch prescriptions');
            const data = await res.json();
            setPrescriptions(data.prescriptions || []);
            setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrescriptions(1, searchQuery);
    }, [searchQuery, fetchPrescriptions]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchPrescriptions(newPage, searchQuery);
        }
    };

    const handleViewPrescription = async (rx) => {
        setLoadingDetails(true);
        try {
            const res = await fetch(`${API_URL}/prescriptions/view/${rx.token}`);
            if (!res.ok) throw new Error('Failed to load prescription');
            const data = await res.json();
            setSelectedPrescription(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    if (error && !prescriptions.length) {
        return (
            <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h1 className="text-xl font-bold text-brand-dark mb-2">Something went wrong</h1>
                <p className="text-gray-500 mb-6">{error}</p>
                <button onClick={() => fetchPrescriptions()} className="px-6 py-2 bg-brand-dark text-white rounded-lg hover:opacity-90">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream font-sans">
            {/* Header */}
            <div className="bg-white border-b border-brand-peach/30 px-8 py-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-3">
                        <FileText className="text-brand-blue" size={28} />
                        Prescription History
                    </h1>
                    <p className="text-brand-dark/60 mt-1">All consultations and prescriptions issued</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-8">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-brand-peach/30 p-4 mb-6">
                    <div className="relative flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" size={20} />
                            <input
                                type="text"
                                placeholder="Search by patient name, phone, or diagnosis..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-brand-cream rounded-xl border border-brand-peach/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-brand-dark placeholder-brand-dark/40"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-brand-dark text-white rounded-xl font-semibold hover:opacity-90 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-brand-dark/60">
                            Showing <span className="font-bold text-brand-dark">{prescriptions.length}</span> of {pagination.total} records
                        </span>
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => { setSearchInput(''); setSearchQuery(''); }}
                                className="text-brand-blue hover:underline"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                </form>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="animate-spin text-brand-blue" size={32} />
                    </div>
                ) : prescriptions.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-brand-peach">
                        <FileText size={48} className="mx-auto text-brand-peach mb-4" />
                        <p className="text-brand-dark/60">
                            {searchQuery ? 'No prescriptions match your search.' : 'No prescriptions issued yet.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {prescriptions.map(rx => (
                                <PrescriptionCard
                                    key={rx._id}
                                    prescription={rx}
                                    onClick={() => handleViewPrescription(rx)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="p-2 rounded-lg bg-white border border-brand-peach/30 text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-cream transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-sm text-brand-dark">
                                    Page <span className="font-bold">{pagination.page}</span> of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="p-2 rounded-lg bg-white border border-brand-peach/30 text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-cream transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Prescription Detail Modal */}
            {(selectedPrescription || loadingDetails) && (
                <PrescriptionModal
                    prescription={selectedPrescription}
                    loading={loadingDetails}
                    onClose={() => setSelectedPrescription(null)}
                />
            )}
        </div>
    );
}

function PrescriptionCard({ prescription, onClick }) {
    const date = new Date(prescription.date);

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-white rounded-xl p-5 border border-brand-peach/30 hover:border-brand-blue/30 hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-peach/30 rounded-xl flex flex-col items-center justify-center text-brand-dark">
                        <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                        <span className="text-[10px] uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-brand-dark flex items-center gap-2">
                            <User size={14} className="text-brand-blue" />
                            {prescription.patient?.name}
                        </h3>
                        <p className="text-sm text-brand-dark/60 mt-0.5">{prescription.patient?.phone || prescription.patient?.email}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        View Details →
                    </span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-brand-peach/30">
                <p className="text-sm text-brand-dark/80 truncate">
                    <span className="font-semibold text-brand-dark">Diagnosis:</span> {prescription.diagnosis}
                </p>
                {prescription.medications?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {prescription.medications.slice(0, 3).map((med, i) => (
                            <span key={i} className="px-2 py-1 bg-brand-cream text-xs text-brand-dark rounded-lg border border-brand-peach/30">
                                {med.name}
                            </span>
                        ))}
                        {prescription.medications.length > 3 && (
                            <span className="px-2 py-1 bg-brand-cream text-xs text-brand-dark/60 rounded-lg">
                                +{prescription.medications.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </button>
    );
}

function PrescriptionModal({ prescription, loading, onClose }) {
    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8">
                    <Loader2 className="animate-spin text-brand-blue mx-auto" size={32} />
                    <p className="text-brand-dark/60 mt-4">Loading prescription...</p>
                </div>
            </div>
        );
    }

    if (!prescription) return null;

    const date = new Date(prescription.date);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-brand-dark text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Prescription Details</h2>
                        <p className="text-white/70 text-sm mt-1">
                            {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Patient Info */}
                    <div className="bg-brand-cream rounded-xl p-4">
                        <h3 className="text-sm font-bold text-brand-dark/60 uppercase tracking-wider mb-2">Patient</h3>
                        <p className="text-lg font-bold text-brand-dark">{prescription.patient?.name}</p>
                        <p className="text-sm text-brand-dark/60">{prescription.patient?.email}</p>
                    </div>

                    {/* Diagnosis */}
                    <div>
                        <h3 className="text-sm font-bold text-brand-dark/60 uppercase tracking-wider mb-2">Diagnosis</h3>
                        <p className="text-brand-dark bg-brand-cream rounded-xl p-4">{prescription.diagnosis}</p>
                    </div>

                    {/* Medications */}
                    {prescription.medications?.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-brand-dark/60 uppercase tracking-wider mb-3">Medications</h3>
                            <div className="space-y-3">
                                {prescription.medications.map((med, i) => (
                                    <div key={i} className="bg-brand-cream rounded-xl p-4 flex items-start gap-4">
                                        <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                                            <Pill size={20} className="text-brand-blue" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-brand-dark">{med.name}</p>
                                            <p className="text-sm text-brand-dark/60 mt-1">
                                                {med.dosage} • {med.frequency} • {med.duration}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {prescription.notes && (
                        <div>
                            <h3 className="text-sm font-bold text-brand-dark/60 uppercase tracking-wider mb-2">Notes</h3>
                            <p className="text-brand-dark bg-brand-cream rounded-xl p-4 whitespace-pre-wrap">{prescription.notes}</p>
                        </div>
                    )}

                    {/* Doctor */}
                    <div className="border-t border-brand-peach/30 pt-4">
                        <p className="text-sm text-brand-dark/60">
                            Prescribed by <span className="font-bold text-brand-dark">Dr. {prescription.doctor?.name}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
