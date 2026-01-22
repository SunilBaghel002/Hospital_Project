import { motion } from 'framer-motion';
import { Calendar, Clock, Star, ShieldCheck, ArrowRight, Play } from 'lucide-react';

export default function Hero({ onBook }) {
    return (
        <section className="relative min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
            {/* Left Content Side - 45% */}
            <div className="lg:w-[45%] relative z-20 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-28 pb-12 lg:py-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Eyebrow Label */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-12 h-[1px] bg-brand-dark"></span>
                        <span className="text-brand-dark font-bold tracking-[0.2em] text-xs uppercase">
                            World-Class Healthcare
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand-dark leading-[1.1] mb-8 tracking-tight">
                        Healing with <br />
                        <span className="font-serif italic font-light text-brand-blue">Compassion.</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
                        Experience a new standard of medical excellence. Where advanced technology meets human touch to create a sanctuary for your health.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                        <button
                            onClick={() => onBook()}
                            className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-sm tracking-wide hover:bg-brand-blue transition-colors shadow-lg flex items-center justify-center gap-3 group"
                        >
                            <Calendar size={18} />
                            Book Appointment
                        </button>
                        <button className="px-8 py-4 border border-gray-200 text-brand-dark rounded-full font-bold text-sm tracking-wide hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
                            <Play size={18} className="fill-brand-dark" />
                            Watch Story
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center gap-8 border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark text-sm">JCI Accredited</p>
                                <p className="text-xs text-gray-500">Global Standard</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <Star size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark text-sm">4.9/5 Rating</p>
                                <p className="text-xs text-gray-500">Patient Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Image Side - 55% */}
            <div className="lg:w-[55%] relative h-[50vh] lg:h-auto bg-gray-100">
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2128&auto=format&fit=crop"
                        alt="Modern Indian Hospital Interior"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent mix-blend-overlay"></div>
                </motion.div>

                {/* Floating Glass Card Removed as per user request */}
            </div>
        </section>
    );
}