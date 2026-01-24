import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, AlertTriangle, Printer, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function SecurePrescription() {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [prescription, setPrescription] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrescription = async () => {
            try {
                const res = await fetch(`${API_URL}/prescriptions/view/${token}`);
                if (res.ok) {
                    setPrescription(await res.json());
                } else {
                    setError('Prescription invalid or expired');
                }
            } catch (err) {
                setError('Failed to load prescription');
            } finally {
                setLoading(false);
            }
        };
        fetchPrescription();
    }, [token]);

    // Prevent interactions
    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    const handleKeyDown = (e) => {
        // Prevent Print (Ctrl+P), Save (Ctrl+S), Copy (Ctrl+C)
        if ((e.ctrlKey || e.metaKey) && ['p', 's', 'c', 'u'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            return false;
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-100"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;

    return (
        <div
            className="min-h-screen bg-slate-100 p-4 sm:p-8 select-none print:hidden"
            onContextMenu={handleContextMenu}
        >
            {/* Security Watermark Layer */}
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center opacity-5 overflow-hidden">
                <div className="rotate-45 text-9xl font-black text-slate-900 whitespace-nowrap transform scale-150">
                    CONFIDENTIAL • DO NOT COPY •  CONFIDENTIAL • DO NOT COPY
                </div>
            </div>

            <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden relative">
                {/* Anti-Screenshot Pattern Overlay (Subtle noise) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                </div>

                {/* Header */}
                <div className="bg-emerald-700 text-white p-8 relative z-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold font-serif">Romashka Health Care</h1>
                            <p className="text-emerald-100 text-sm">Official Digital Prescription</p>
                        </div>
                        <div className="text-right">
                            <div className="bg-white/10 px-3 py-1 rounded text-xs backdrop-blur-sm inline-flex items-center gap-2">
                                <AlertTriangle size={12} />
                                Secure Document
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 relative z-0">

                    {/* Doctor/Patient Info */}
                    <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-slate-100 pb-6">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Doctor</p>
                            <p className="font-bold text-slate-800 text-lg">Dr. {prescription.doctor.name}</p>
                            <p className="text-slate-500 text-sm">{prescription.doctor.email}</p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Patient</p>
                            <p className="font-bold text-slate-800 text-lg">{prescription.patient.name}</p>
                            <p className="text-slate-500 text-sm">Date: {new Date(prescription.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Diagnosis */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Diagnosis</h3>
                        <div className="bg-slate-50 p-4 rounded-lg text-slate-800 font-serif leading-relaxed">
                            {prescription.diagnosis}
                        </div>
                    </div>

                    {/* Rx */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Medications (Rx)</h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs text-slate-500">
                                    <th className="py-2 font-bold uppercase">Medicine</th>
                                    <th className="py-2 font-bold uppercase">Dosage</th>
                                    <th className="py-2 font-bold uppercase">Freq</th>
                                    <th className="py-2 font-bold uppercase">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {prescription.medications.map((med, i) => (
                                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                        <td className="py-3 font-semibold">{med.name}</td>
                                        <td className="py-3">{med.dosage}</td>
                                        <td className="py-3">{med.frequency}</td>
                                        <td className="py-3">{med.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Notes */}
                    {prescription.notes && (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <h3 className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">Doctor's Note</h3>
                            <p className="text-yellow-800 text-sm">{prescription.notes}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-6 text-center border-t border-slate-100 relative z-0">
                    <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                        This is a digitally generated prescription. It is valid without a physical signature.
                        Downloading, copying, or screenshotting this document for unauthorized use is prohibited.
                    </p>
                </div>
            </div>

            {/* Print Warning Overlay */}
            <div className="hidden print:flex fixed inset-0 bg-white z-[100] items-center justify-center flex-col text-center p-8">
                <AlertTriangle size={64} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-black mb-2">Printing Prohibited</h1>
                <p className="text-gray-600">This document is protected and cannot be printed directly.</p>
            </div>
        </div>
    );
}
