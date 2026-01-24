import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Send, ArrowLeft, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function ConsultationPad() {
    const location = useLocation();
    const navigate = useNavigate();
    const { appointment } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!appointment) {
            navigate('/doctor/dashboard');
        }
    }, [appointment, navigate]);

    if (!appointment) return null;

    const addMedication = () => {
        setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const removeMedication = (index) => {
        const newMeds = [...medications];
        newMeds.splice(index, 1);
        setMedications(newMeds);
    };

    const updateMedication = (index, field, value) => {
        const newMeds = [...medications];
        newMeds[index][field] = value;
        setMedications(newMeds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/prescriptions/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    appointmentId: appointment._id,
                    patientName: appointment.name,
                    patientEmail: appointment.email,
                    diagnosis,
                    medications,
                    notes
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Prescription sent successfully!');
                navigate('/doctor/dashboard');
            } else {
                alert(data.message || 'Failed to send prescription');
            }
        } catch (err) {
            console.error('Error sending prescription:', err);
            alert('Error sending prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream p-8 flex justify-center font-sans">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col min-h-[800px] border border-brand-peach/30">
                {/* Header / Letterhead */}
                <div className="bg-brand-dark text-white p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Romashka Health Care</h1>
                            <p className="opacity-80">Sector 62, Noida, Uttar Pradesh 201301</p>
                            <p className="opacity-80">Phone: +91 120 456 7890</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-brand-peach">DIGITAL PRESCRIPTION</h2>
                            <p className="mt-2 text-white/70 text-sm">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Patient Info Bar */}
                <div className="bg-brand-cream border-b border-brand-peach/30 p-6 flex flex-wrap gap-8 items-center text-sm">
                    <div>
                        <span className="text-brand-dark/60 font-medium">Patient Name:</span>
                        <span className="ml-2 font-bold text-brand-dark text-lg">{appointment.name}</span>
                    </div>
                    <div>
                        <span className="text-brand-dark/60 font-medium">Phone:</span>
                        <span className="ml-2 text-brand-dark">{appointment.phone}</span>
                    </div>
                    <div>
                        <span className="text-brand-dark/60 font-medium">Ref ID:</span>
                        <span className="ml-2 text-brand-dark font-mono bg-brand-peach/30 px-2 py-0.5 rounded">{appointment.referenceId}</span>
                    </div>
                </div>

                {/* Content Area */}
                <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-8">
                    {/* Diagnosis */}
                    <div>
                        <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-widest mb-3">Diagnosis</h3>
                        <textarea
                            required
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            className="w-full p-4 border border-brand-peach/40 rounded-xl focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none min-h-[100px] text-lg bg-brand-cream/30"
                            placeholder="Type diagnosis here..."
                        />
                    </div>

                    {/* Medications */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-widest">Medications (Rx)</h3>
                            <button
                                type="button"
                                onClick={addMedication}
                                className="text-sm text-brand-blue hover:text-brand-dark font-bold flex items-center gap-1 transition-colors"
                            >
                                <Plus size={16} /> Add Drug
                            </button>
                        </div>

                        <div className="space-y-3">
                            {medications.map((med, index) => (
                                <div key={index} className="flex gap-3 items-start bg-brand-cream p-4 rounded-xl border border-brand-peach/30 group">
                                    <div className="flex-1 grid grid-cols-12 gap-3">
                                        <div className="col-span-4">
                                            <input
                                                type="text"
                                                placeholder="Medicine Name"
                                                className="w-full bg-white border border-brand-peach/40 rounded-lg px-3 py-2 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 outline-none font-medium"
                                                value={med.name}
                                                onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="text"
                                                placeholder="Dosage (e.g. 500mg)"
                                                className="w-full bg-white border border-brand-peach/40 rounded-lg px-3 py-2 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 outline-none"
                                                value={med.dosage}
                                                onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="text"
                                                placeholder="Freq (e.g. 1-0-1)"
                                                className="w-full bg-white border border-brand-peach/40 rounded-lg px-3 py-2 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 outline-none"
                                                value={med.frequency}
                                                onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                placeholder="Duration"
                                                className="w-full bg-white border border-brand-peach/40 rounded-lg px-3 py-2 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 outline-none"
                                                value={med.duration}
                                                onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {medications.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMedication(index)}
                                            className="p-2 text-brand-dark/30 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-widest mb-3">Advice / Notes</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-4 border border-brand-peach/40 rounded-xl focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none min-h-[100px] bg-brand-cream/30"
                            placeholder="Additional instructions..."
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-8 flex items-center justify-between border-t border-brand-peach/30 mt-auto">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-6 py-3 text-brand-dark/60 hover:bg-brand-cream rounded-xl font-medium transition-colors"
                        >
                            <ArrowLeft size={20} /> Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-brand-dark text-white rounded-xl font-bold shadow-lg hover:opacity-90 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                            Sign & Send to Patient
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
