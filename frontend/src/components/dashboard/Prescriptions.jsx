import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Prescriptions = () => {
    const { token } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/prescriptions/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setPrescriptions(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, [token]);

    if (loading) return <div>Loading prescriptions...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>
            <div className="grid gap-6">
                {prescriptions.length === 0 ? <p>No prescriptions found.</p> : prescriptions.map(p => (
                    <div key={p._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Dr. {p.doctor.name}</h3>
                                <p className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</p>
                            </div>
                            <a href={`/prescription/view/${p.token}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View Full &rarr;
                            </a>
                        </div>
                        <div className="space-y-2">
                            <p><span className="font-semibold">Diagnosis:</span> {p.diagnosis}</p>
                            <div>
                                <span className="font-semibold">Medications:</span>
                                <ul className="list-disc list-inside ml-2 mt-1 text-sm text-gray-700">
                                    {p.medications.map((med, idx) => (
                                        <li key={idx}>{med.name} - {med.dosage} ({med.frequency})</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Prescriptions;
