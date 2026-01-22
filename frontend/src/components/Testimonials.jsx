import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: "Priya Mehta",
            role: "Glaucoma Patient",
            quote: "I was terrified when I was diagnosed with early-stage glaucoma. The team at Visionary Eye Care didn't just treat my eyes; they treated my fears. The laser treatment was painless, and for the first time in years, I feel confident about my future vision.",
            poster: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop",
            video: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-in-a-park-1275-large.mp4" // Placeholder stock video
        },
        {
            id: 2,
            name: "Arjun Patel",
            role: "LASIK Patient",
            quote: "Waking up and seeing the alarm clock clearly without reaching for glasses is a miracle I experience every day now. The recovery was faster than I imagined. Best investment I've ever made in myself.",
            poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
            video: "https://assets.mixkit.co/videos/preview/mixkit-young-man-looking-at-the-horizon-standing-on-the-beach-1163-large.mp4"
        },
        {
            id: 3,
            name: "Lakshmi Reddy",
            role: "Cataract Surgery",
            quote: "The colors! I had forgotten how vibrant the world actually is. Dr. Johnson explained every step, and the blade-free procedure was over before I knew it. I'm painting again for the first time in a decade.",
            poster: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
            video: "https://assets.mixkit.co/videos/preview/mixkit-senior-woman-smiling-portrait-looking-at-camera-3367-large.mp4"
        }
    ];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <span className="text-brand-blue font-bold tracking-wider text-xs uppercase mb-1 block">Patient Stories</span>
                <h2 className="text-3xl font-bold text-brand-dark">Life-Changing Results</h2>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden relative">
                {/* Organic Background Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-peach/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0"></div>

                <div className="grid lg:grid-cols-2 h-[450px]">

                    {/* Text Side */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Quote className="text-brand-blue mb-6 opacity-20 transform scale-125 origin-top-left" size={48} />

                                <p className="text-xl font-light text-brand-dark italic leading-relaxed mb-6 line-clamp-4">
                                    "{testimonials[currentIndex].quote}"
                                </p>

                                <div>
                                    <h4 className="text-lg font-bold text-brand-dark">{testimonials[currentIndex].name}</h4>
                                    <p className="text-brand-blue font-medium text-xs uppercase tracking-wide">{testimonials[currentIndex].role}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button onClick={handlePrev} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-blue hover:text-white hover:border-transparent transition-all group">
                                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button onClick={handleNext} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-blue hover:text-white hover:border-transparent transition-all group">
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Video Side */}
                    <div className="relative h-full bg-brand-dark">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <img
                                    src={testimonials[currentIndex].poster}
                                    alt={testimonials[currentIndex].name}
                                    className="w-full h-full object-cover opacity-80"
                                />

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg text-brand-blue pl-1">
                                            <Play size={20} fill="currentColor" />
                                        </div>
                                    </div>
                                    <p className="absolute bottom-10 text-white font-bold tracking-widest text-xs opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">WATCH STORY</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
