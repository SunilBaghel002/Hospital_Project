import { useState, useEffect } from 'react';
import { X, CheckCircle, ChevronRight, ChevronLeft, CreditCard, Calendar, User, Stethoscope, Loader2, AlertCircle, Lock } from 'lucide-react';
import { appointmentAPI, doctorAPI } from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AppointmentModal({ isOpen, onClose, initialDoctor = null }) {
    const [step, setStep] = useState(1);
    const [doctors, setDoctors] = useState([]); // State for doctors
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        doctor: '',
        date: null,
        time: ''
    });
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [referenceId, setReferenceId] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Fetch doctors on mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await doctorAPI.getAll();
                setDoctors(data);
            } catch (err) {
                console.error('Failed to fetch doctors:', err);
            }
        };
        fetchDoctors();
    }, []);

    // All time slots with their hour values for comparison
    const allTimeSlots = [
        { label: '09:00 AM', hour: 9 },
        { label: '10:00 AM', hour: 10 },
        { label: '11:00 AM', hour: 11 },
        { label: '02:00 PM', hour: 14 },
        { label: '04:00 PM', hour: 16 }
    ];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (initialDoctor) {
                setFormData(prev => ({ ...prev, doctor: initialDoctor }));
            }
            // Reset states
            setStep(1);
            setError('');
            setIsSuccess(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen, initialDoctor]);

    // Fetch available slots when date or doctor changes
    useEffect(() => {
        const fetchSlots = async () => {
            if (formData.date && formData.doctor) {
                setLoadingSlots(true);
                try {
                    // Fix timezone issue for fetching slots too
                    const d = formData.date;
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    const dateString = `${year}-${month}-${day}`;

                    const response = await appointmentAPI.getAvailableSlots(dateString, formData.doctor);

                    // Get all slot labels
                    const allSlotLabels = allTimeSlots.map(s => s.label);
                    const available = response.availableSlots || allSlotLabels;

                    // Calculate booked slots (slots that are NOT available)
                    const booked = allSlotLabels.filter(slot => !available.includes(slot));

                    setAvailableSlots(available);
                    setBookedSlots(booked);

                    // Reset time if previously selected time is no longer available
                    if (formData.time && !available.includes(formData.time)) {
                        setFormData(prev => ({ ...prev, time: '' }));
                    }
                } catch (err) {
                    console.error('Error fetching slots:', err);
                    setAvailableSlots(allTimeSlots.map(s => s.label));
                    setBookedSlots([]);
                } finally {
                    setLoadingSlots(false);
                }
            }
        };

        fetchSlots();
    }, [formData.date, formData.doctor]);

    if (!isOpen) return null;

    const handleNext = () => {
        setError('');
        setStep(prev => prev + 1);
    };

    const handlePrev = () => {
        setError('');
        setStep(prev => prev - 1);
    };

    const validateStep = () => {
        if (step === 1) {
            if (!formData.name.trim()) {
                setError('Please enter your full name');
                return false;
            }
            if (!formData.phone.trim() || !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
                setError('Please enter a valid phone number (10-15 digits)');
                return false;
            }
            if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
                setError('Please enter a valid email address');
                return false;
            }
        }
        if (step === 2) {
            if (!formData.doctor) {
                setError('Please select a doctor');
                return false;
            }
            if (!formData.date) {
                setError('Please select a date');
                return false;
            }
            if (!formData.time) {
                setError('Please select a time slot');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateStep()) return;

        if (step < 3) {
            handleNext();
            return;
        }

        // Step 3: Submit to backend
        setIsLoading(true);

        try {
            // Fix timezone issue: Ensure we send the LOCAL date string "YYYY-MM-DD"
            const date = formData.date;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            const response = await appointmentAPI.create({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                doctor: formData.doctor,
                date: dateString,
                time: formData.time,
                amount: 150.00
            });

            if (response.success) {
                setReferenceId(response.data.referenceId);
                setIsSuccess(true);
            }
        } catch (err) {
            setError(err.message || 'Failed to book appointment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setFormData({ name: '', phone: '', email: '', doctor: '', date: null, time: '' });
        setIsSuccess(false);
        setError('');
        setReferenceId('');
        setBookedSlots([]);
        setAvailableSlots([]);
        onClose();
    };

    const getMinDate = () => {
        return new Date();
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        return maxDate;
    };

    // Check if a time slot should be hidden (past time for today)
    const isSlotPast = (slotHour) => {
        if (!formData.date) return false;

        const today = new Date();
        const selectedDate = new Date(formData.date);

        // Check if selected date is today
        if (selectedDate.toDateString() === today.toDateString()) {
            const currentHour = today.getHours();
            return slotHour <= currentHour;
        }
        return false;
    };

    // Check if a slot is booked
    const isSlotBooked = (slotLabel) => {
        return bookedSlots.includes(slotLabel);
    };

    // Get filtered time slots (hide past slots for today)
    const getVisibleTimeSlots = () => {
        return allTimeSlots.filter(slot => !isSlotPast(slot.hour));
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-end justify-end p-4 sm:p-6 pointer-events-none ${isOpen ? 'visible' : 'invisible'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={resetAndClose}
            />

            {/* Modal Content */}
            <div className={`bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/50 flex flex-col max-h-[85vh] pointer-events-auto transition-all duration-500 ease-in-out transform origin-bottom-right ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>

                {/* Header */}
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
                        <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">
                            We've sent a confirmation email to <span className="text-brand-dark font-medium">{formData.email}</span>.
                        </p>

                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4 w-full">
                            <p className="text-xs text-brand-blue uppercase font-bold tracking-wider mb-1">Booking Reference</p>
                            <p className="text-2xl font-mono font-bold text-brand-dark tracking-widest">{referenceId}</p>
                        </div>

                        <div className="bg-brand-blue/5 p-4 rounded-2xl w-full mb-8 text-left">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500 text-sm">Doctor</span>
                                <span className="font-semibold text-brand-dark">{formData.doctor}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500 text-sm">Date</span>
                                <span className="font-semibold text-brand-dark">
                                    {formData.date?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Time</span>
                                <span className="font-semibold text-brand-dark">{formData.time}</span>
                            </div>
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

                        {/* Error Message */}
                        {error && (
                            <div className="mx-6 mb-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

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
                                                    placeholder="Enter your full name"
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
                                                placeholder="Enter your phone number"
                                                value={formData.phone}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                                    setFormData({ ...formData, phone: val });
                                                }}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all font-medium text-brand-dark"
                                                placeholder="Enter your email address"
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
                                                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                                <select
                                                    required
                                                    className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all font-medium text-brand-dark appearance-none cursor-pointer"
                                                    value={formData.doctor}
                                                    onChange={e => setFormData({ ...formData, doctor: e.target.value, time: '' })}
                                                >
                                                    <option value="">Choose a Doctor...</option>
                                                    {doctors.map((doc, idx) => (
                                                        <option key={idx} value={doc.name}>{doc.name} - {doc.role}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronRight className="rotate-90 text-gray-400" size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Select Date</label>
                                            <div className="relative appointment-datepicker">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                                                <DatePicker
                                                    selected={formData.date}
                                                    onChange={(date) => setFormData({ ...formData, date: date, time: '' })}
                                                    minDate={getMinDate()}
                                                    maxDate={getMaxDate()}
                                                    dateFormat="MMMM d, yyyy"
                                                    placeholderText="Choose a date..."
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all font-medium text-brand-dark cursor-pointer"
                                                    calendarClassName="appointment-calendar"
                                                    showPopperArrow={false}
                                                    popperPlacement="bottom-start"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">
                                                Available Time Slots
                                                {loadingSlots && <Loader2 className="inline ml-2 animate-spin" size={14} />}
                                            </label>

                                            {formData.date && formData.doctor ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    {loadingSlots ? (
                                                        <div className="col-span-2 text-center py-4 text-gray-500">
                                                            Loading available slots...
                                                        </div>
                                                    ) : getVisibleTimeSlots().length > 0 ? (
                                                        getVisibleTimeSlots().map((slot) => {
                                                            const isBooked = isSlotBooked(slot.label);
                                                            const isSelected = formData.time === slot.label;

                                                            return (
                                                                <button
                                                                    key={slot.label}
                                                                    type="button"
                                                                    disabled={isBooked}
                                                                    onClick={() => !isBooked && setFormData({ ...formData, time: slot.label })}
                                                                    className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isBooked
                                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-dashed border-gray-200'
                                                                        : isSelected
                                                                            ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-brand-blue/30 border-2 border-transparent'
                                                                        }`}
                                                                >
                                                                    {isBooked && <Lock size={14} />}
                                                                    {slot.label}
                                                                </button>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="col-span-2 text-center py-4 text-gray-500 bg-gray-50 rounded-xl">
                                                            No slots available for this date. Please try another date.
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-gray-400 bg-gray-50 rounded-xl">
                                                    Please select a doctor and date first
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                                        {/* Appointment Summary */}
                                        <div className="bg-brand-blue/5 p-4 rounded-2xl space-y-3">
                                            <h4 className="font-semibold text-brand-dark">Appointment Summary</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Patient</span>
                                                    <span className="font-medium text-brand-dark">{formData.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Doctor</span>
                                                    <span className="font-medium text-brand-dark">{formData.doctor}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Date</span>
                                                    <span className="font-medium text-brand-dark">
                                                        {formData.date?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Time</span>
                                                    <span className="font-medium text-brand-dark">{formData.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Card */}
                                        <div className="bg-gradient-to-r from-brand-blue to-brand-purple p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                            <p className="opacity-80 text-sm font-medium mb-1">Total Amount</p>
                                            <h3 className="text-3xl font-bold">₹1,500.00</h3>
                                            <div className="mt-4 flex items-center gap-2 opacity-60 text-xs">
                                                <CreditCard size={14} /> Secure Encryption
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">Card Number</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all font-mono"
                                                placeholder="Enter your card number"
                                                maxLength={19}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 ml-1">Expiry Date</label>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all text-center"
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 ml-1">CVC</label>
                                                <input
                                                    required
                                                    type="password"
                                                    className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-blue focus:shadow-lg focus:shadow-brand-blue/10 outline-none transition-all text-center"
                                                    placeholder="Enter CVC"
                                                    maxLength={4}
                                                />
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-400 text-center mt-4">
                                            By clicking "Pay Now", you agree to our terms of service and privacy policy.
                                        </p>
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
                                    disabled={isLoading}
                                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-50 text-brand-dark hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-1 h-14 bg-brand-dark text-white rounded-2xl font-bold text-lg hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-dark/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : step === 3 ? (
                                    'Pay Now'
                                ) : (
                                    <>
                                        Continue
                                        <ChevronRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Custom Datepicker Styles */}
            <style>{`
                .appointment-datepicker .react-datepicker-wrapper {
                    width: 100%;
                }
                
                .appointment-datepicker .react-datepicker {
                    font-family: inherit;
                    border: none;
                    border-radius: 1rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    overflow: hidden;
                }
                
                .appointment-datepicker .react-datepicker__header {
                    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
                    border: none;
                    padding: 1rem;
                }
                
                .appointment-datepicker .react-datepicker__current-month {
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }
                
                .appointment-datepicker .react-datepicker__day-names {
                    display: flex;
                    justify-content: space-around;
                }
                
                .appointment-datepicker .react-datepicker__day-name {
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 600;
                    font-size: 0.75rem;
                    width: 2.5rem;
                    margin: 0;
                }
                
                .appointment-datepicker .react-datepicker__month {
                    margin: 0;
                    padding: 0.5rem;
                }
                
                .appointment-datepicker .react-datepicker__week {
                    display: flex;
                    justify-content: space-around;
                }
                
                .appointment-datepicker .react-datepicker__day {
                    width: 2.5rem;
                    height: 2.5rem;
                    line-height: 2.5rem;
                    margin: 0.125rem;
                    border-radius: 0.75rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                
                .appointment-datepicker .react-datepicker__day:hover {
                    background: #f1f5f9;
                    border-radius: 0.75rem;
                }
                
                .appointment-datepicker .react-datepicker__day--selected {
                    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%) !important;
                    color: white !important;
                    font-weight: 700;
                }
                
                .appointment-datepicker .react-datepicker__day--keyboard-selected {
                    background: #e2e8f0;
                }
                
                .appointment-datepicker .react-datepicker__day--disabled {
                    color: #cbd5e1 !important;
                    cursor: not-allowed;
                }
                
                .appointment-datepicker .react-datepicker__day--today {
                    font-weight: 700;
                    color: #2563eb;
                }
                
                .appointment-datepicker .react-datepicker__navigation {
                    top: 1rem;
                }
                
                .appointment-datepicker .react-datepicker__navigation-icon::before {
                    border-color: white;
                }
                
                .appointment-datepicker .react-datepicker__navigation:hover *::before {
                    border-color: rgba(255, 255, 255, 0.7);
                }
                
                .appointment-datepicker .react-datepicker-popper {
                    z-index: 110 !important;
                }
            `}</style>
        </div>
    );
}