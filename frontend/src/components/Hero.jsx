import { motion } from 'framer-motion';
import { Calendar, Clock, Star, ShieldCheck, ArrowRight, Play } from 'lucide-react';

export default function Hero({ onBook, data }) {
    const title = data?.title || "Healing with Compassion."; // We might need to handle the HTML span for "Compassion" if it comes as plain text
    // If title comes from CMS, it might be plain text. The split "Healing with / Compassion" with styling is hard to replicate generically unless we use a rich text editor or specific logic.
    // For now, if data.title is present, use it. If not, use the hardcoded one (which has the span).
    // Actually, to support the visual design, I'll check if it matches the specific default string or just render the text.
    // Better: Render the text. If it's the specific default, maybe apply styling?
    // Let's just render `data.title` if present. If the user wants specific styling, they might need Custom HTML or we accept rich text later.
    // For now, simple text. "Healing with Compassion"

    const tagline = data?.tagline || "World-Class Healthcare";
    const subtitle = data?.subtitle || "Experience a new standard of medical excellence. Where advanced technology meets human touch to create a sanctuary for your health.";
    const bgImage = data?.backgroundImage || "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2128&auto=format&fit=crop";
    const ctaText = data?.ctaText || "Book Appointment";

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
                            {tagline}
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand-dark leading-[1.1] mb-8 tracking-tight">
                        {data?.title ? (
                            data.title
                        ) : (
                            <>
                                Healing with <br />
                                <span className="font-serif italic font-light text-brand-blue">Compassion.</span>
                            </>
                        )}
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
                        {subtitle}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                        <button
                            onClick={() => onBook()}
                            className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-sm tracking-wide hover:bg-brand-blue transition-colors shadow-lg flex items-center justify-center gap-3 group"
                        >
                            <Calendar size={18} />
                            {ctaText}
                        </button>
                        {(data?.secondaryCtaText || !data?.title) && (
                            <button
                                onClick={() => {
                                    if (data?.secondaryCtaLink) {
                                        window.open(data.secondaryCtaLink, '_blank');
                                    }
                                }}
                                className="px-8 py-4 border border-gray-200 text-brand-dark rounded-full font-bold text-sm tracking-wide hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                            >
                                <Play size={18} className="fill-brand-dark" />
                                {data?.secondaryCtaText || 'Watch Story'}
                            </button>
                        )}
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center gap-8 border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark text-sm">{data?.trustBadge1Title || 'JCI Accredited'}</p>
                                <p className="text-xs text-gray-500">{data?.trustBadge1Subtitle || 'Global Standard'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <Star size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark text-sm">{data?.trustBadge2Title || '4.9/5 Rating'}</p>
                                <p className="text-xs text-gray-500">{data?.trustBadge2Subtitle || 'Patient Satisfaction'}</p>
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
                        src={bgImage}
                        alt={title || "Hospital Interior"}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent mix-blend-overlay"></div>
                </motion.div>

                {/* Floating Glass Card Removed as per user request */}
            </div>
        </section>
    );
}