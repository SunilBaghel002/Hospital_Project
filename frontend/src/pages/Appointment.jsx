import { useState } from 'react';
import { Calendar, Phone, Mail, MapPin, Clock } from 'lucide-react';
import AppointmentModal from '../components/AppointmentModal';

export default function Appointment() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col md:flex-row gap-12 items-start">
                <div className="flex-1 space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">
                            Book an Appointment
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Ready to experience world-class eye care? Schedule your visit with our specialists today.
                            We typically reply within minutes to confirm your slot.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold text-brand-dark mb-6">Contact Information</h3>
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                                    <Phone className="text-brand-blue" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Support Line</p>
                                    <p className="font-semibold text-brand-dark">+1 (800) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                                    <Mail className="text-brand-blue" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email Address</p>
                                    <p className="font-semibold text-brand-dark">care@visionary.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                                    <MapPin className="text-brand-blue" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Location</p>
                                    <p className="font-semibold text-brand-dark">123 Medical Plaza, New York, NY</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-blue/5 p-8 rounded-3xl border border-brand-blue/10">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-brand-blue" size={24} />
                            <h3 className="text-xl font-bold text-brand-blue">Opening Hours</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl">
                                <p className="font-bold text-gray-800">Mon - Fri</p>
                                <p className="text-brand-blue font-medium">08:00 AM - 08:00 PM</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl">
                                <p className="font-bold text-gray-800">Saturday</p>
                                <p className="text-brand-blue font-medium">09:00 AM - 05:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="text-center py-10 relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand-blue/30">
                            <Calendar className="text-white" size={40} />
                        </div>
                        
                        <h2 className="text-3xl font-bold text-brand-dark mb-4">Start Your Booking</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                            Click below to open our secure booking wizard. It only takes 2 minutes to schedule your appointment!
                        </p>
                        
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-brand-dark text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-brand-dark/30 hover:scale-105 transition-all w-full max-w-xs group"
                        >
                            <span className="flex items-center justify-center gap-3">
                                Open Booking Form
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                        
                        <div className="mt-10 flex items-center justify-center gap-8 text-sm text-gray-400">
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Secure
                            </span>
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                2 min
                            </span>
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Instant
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Appointment Modal */}
            <AppointmentModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
}