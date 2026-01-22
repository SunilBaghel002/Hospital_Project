import { useState, useEffect } from 'react';
import { X, CheckCircle, ChevronRight, ChevronLeft, CreditCard, Calendar, User, Stethoscope } from 'lucide-react';
import { doctors } from '../data/doctors';

export default function AppointmentModal({ isOpen, onClose, initialDoctor = null }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        doctor: '',
        service: '',
        date: '',
        time: ''
    });
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (initialDoctor) {
                setFormData(prev => ({ ...prev, doctor: initialDoctor }));
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen, initialDoctor]);

    if (!isOpen) return null;

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate logic here
        if (step < 3) {
            handleNext();
        } else {
            // Mock API call
            setTimeout(() => {
                setIsSuccess(true);
            }, 500);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setFormData({ name: '', phone: '', email: '', doctor: '', service: '', date: '', time: '' });
        setIsSuccess(false);
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-end justify-end p-4 sm:p-6 pointer-events-none ${isOpen ? 'visible' : 'invisible'}`}>
            {/* Backdrop - Only blocks clicks, visual dimming */}
            <div
                className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={resetAndClose}
            />

            {/* Modal Content - Floating Widget Style */}
            <div className={`bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/50 flex flex-col max-h-[85vh] pointer-events-auto transition-all duration-500 ease-in-out transform origin-bottom-right ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>

                {/* Modern Header */}
                <div className="p-6 pb-2 shrink-0 flex justify-between items-start bg-gradient-to-b from-white to-transparent">
                    <div>
                        <p className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-1">Book Online</p>
                        <h3 className="text-2xl font-bold text-brand-dark">New Appointment</h3>
                    </div>
                    <button onClick={resetAndClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Success View */}
                {isSuccess ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-200">
                                <CheckCircle size={48} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-brand-dark mb-2">It's Confirmed!</h2>
                        <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">We've sent a confirmation email to <span className="text-brand-dark font-medium">{formData.email}</span>.</p>

                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-8 w-full">
                            <p className="text-xs text-brand-blue uppercase font-bold tracking-wider mb-1">Booking Reference</p>
                            <p className="text-2xl font-mono font-bold text-brand-dark tracking-widest">#VEC-{Math.floor(1000 + Math.random() * 9000)}</p>
                        </div>

                        <button onClick={resetAndClose} className="w-full bg-brand-dark text-white p-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">
                            Close Widget
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Progress Dots */}
                        <div className="px-6 flex gap-2 mb-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-brand-blue' : s < step ? 'w-2 bg-brand-blue/40' : 'w-2 bg-gray-200'}`}
                                />
                            ))}
                        </div>

                        {/* Form scroll area */}
                        <div className="p-6 pt-2 overflow-y-auto custom-scrollbar flex-1">
                            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                                {step === 1 && (
                                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    required
                                                    autoFocus
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all font-medium text-brand-dark"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all font-medium text-brand-dark"
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all font-medium text-brand-dark"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Select Specialist</label>
                                            <div className="relative">
                                                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <select
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all font-medium text-brand-dark appearance-none"
                                                    value={formData.doctor}
                                                    onChange={e => setFormData({ ...formData, doctor: e.target.value })}
                                                >
                                                    <option value="">Choose Doctor...</option>
                                                    {doctors.map((doc, idx) => (
                                                        <option key={idx} value={doc.name}>{doc.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronRight className="rotate-90 text-gray-400" size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 ml-1">Date</label>
                                                <input
                                                    required
                                                    type="date"
                                                    className="w-full px-3 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all font-medium text-brand-dark text-sm"
                                                    value={formData.date}
                                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 ml-1">Time</label>
                                                <select
                                                    required
                                                    className="w-full px-3 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all font-medium text-brand-dark appearance-none text-sm"
                                                    value={formData.time}
                                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                                >
                                                    <option value="">Time...</option>
                                                    <option value="09:00 AM">09:00 AM</option>
                                                    <option value="10:00 AM">10:00 AM</option>
                                                    <option value="11:00 AM">11:00 AM</option>
                                                    <option value="02:00 PM">02:00 PM</option>
                                                    <option value="04:00 PM">04:00 PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                                        <div className="bg-gradient-to-r from-brand-blue to-brand-purple p-6 rounded-2xl text-white shadow-lg mb-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                            <p className="opacity-80 text-sm font-medium mb-1">Total Amount</p>
                                            <h3 className="text-3xl font-bold">$150.00</h3>
                                            <div className="mt-4 flex items-center gap-2 opacity-60 text-xs">
                                                <CreditCard size={14} /> Secure Encryption
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Card Details</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full pl-4 pr-4 py-4 bg-gray-50 border border-transparent rounded-t-2xl focus:bg-white focus:border-brand-blue focus:z-10 outline-none transition-all font-mono"
                                                    placeholder="0000 0000 0000 0000"
                                                />
                                                <div className="flex border-t border-gray-200">
                                                    <input
                                                        required
                                                        type="text"
                                                        className="w-1/2 px-4 py-4 bg-gray-50 border border-transparent rounded-bl-2xl focus:bg-white focus:border-brand-blue focus:z-10 outline-none transition-all text-center"
                                                        placeholder="MM/YY"
                                                    />
                                                    <div className="w-[1px] bg-gray-200"></div>
                                                    <input
                                                        required
                                                        type="password"
                                                        className="w-1/2 px-4 py-4 bg-gray-50 border border-transparent rounded-br-2xl focus:bg-white focus:border-brand-blue focus:z-10 outline-none transition-all text-center"
                                                        placeholder="CVC"
                                                        maxLength={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Navigation Footer */}
                        <div className="p-6 pt-2 shrink-0 flex gap-3">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-50 text-brand-dark hover:bg-gray-100 transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            <button
                                onClick={handleSubmit} // Using explicit click instead of form submit to allow button styling flex
                                className="flex-1 h-14 bg-brand-dark text-white rounded-2xl font-bold text-lg hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-dark/20"
                            >
                                {step === 3 ? 'Pay Now' : 'Continue'}
                                {step < 3 && <ChevronRight size={20} />}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
