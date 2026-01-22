import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Doctors from '../components/Doctors';

export default function DoctorsPage({ onBook }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const reviews = [
        {
            name: "Emily Clark",
            role: "LASIK Patient",
            title: "A Life-Changing Experience",
            review: "Dr. Sarah Johnson is a miracle worker! I was terrified of laser surgery, but she explained everything so calmly. Now I have 20/20 vision and it feels like a new life.",
            stars: 5,
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop"
        },
        {
            name: "Robert Fox",
            role: "Cataract Surgery",
            title: "Precision You Can Trust",
            review: "The care I received from Dr. Michael Chen was exceptional. The blade-free cataract surgery was painless, and I was back to golfing in a week with crystal clear vision.",
            stars: 5,
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=987&auto=format&fit=crop"
        },
        {
            name: "Anita Roy",
            role: "Glaucoma Care",
            title: "More Than Just a Clinic",
            review: "I've been visiting Visionary for 5 years for my glaucoma. The team is so proactive and caring. They truly treat you like family, not just a patient number.",
            stars: 5,
            image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    const nextReview = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextReview();
            if (e.key === 'ArrowLeft') prevReview();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <main className="pt-20">
            {/* Minimalist Editorial Hero */}
            <section className="px-6 max-w-[90rem] mx-auto pb-12 pt-10">
                <div className="max-w-7xl mx-auto">
                    {/* Split layout: Title Left, Tagline Right */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight tracking-tight">
                            World-class <br />
                            <span className="text-brand-blue italic font-serif">expertise.</span>
                        </h1>

                        {/* Right-aligned tagline */}
                        <div className="flex items-center gap-4 md:self-end">
                            <div className="hidden md:block h-[1px] w-16 bg-brand-blue/30"></div>
                            <span className="text-lg text-gray-500 font-light tracking-tight md:text-right leading-snug">
                                Visionary care for<br className="hidden md:inline" /> a clearer tomorrow.
                            </span>
                        </div>
                    </div>

                    <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl">
                        Meet our team of world-class ophthalmologists and vision care experts.
                    </p>
                </div>
            </section>

            <Doctors onBook={onBook} />

            {/* Patient Reviews Section */}
            <section className="py-12 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <span className="text-brand-blue font-bold tracking-widest uppercase text-xs">Testimonials</span>
                    <h2 className="text-3xl font-bold text-brand-dark mt-1">What Our Patients Say</h2>
                </div>

                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevReview}
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-white border border-gray-100 rounded-full shadow-lg text-brand-dark hover:bg-brand-blue hover:text-white transition-all z-20 hidden md:block -ml-6"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={nextReview}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-white border border-gray-100 rounded-full shadow-lg text-brand-dark hover:bg-brand-blue hover:text-white transition-all z-20 hidden md:block -mr-6"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden mx-auto max-w-5xl">
                        <div className="grid md:grid-cols-2 h-auto md:h-[380px]">
                            {/* Video Side */}
                            <div className="relative h-64 md:h-full overflow-hidden group">
                                <img
                                    src={reviews[currentIndex].image}
                                    alt="Patient"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-blue pl-1">
                                            <Play size={24} fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="p-8 md:p-10 flex flex-col justify-center bg-gray-50/50">
                                <div className="flex gap-1 mb-3 text-yellow-400">
                                    {[...Array(reviews[currentIndex].stars)].map((_, i) => (
                                        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
                                        </svg>
                                    ))}
                                </div>

                                <h3 className="text-2xl font-serif text-brand-dark mb-4 italic">
                                    "{reviews[currentIndex].title}"
                                </h3>

                                <p className="text-gray-600 mb-6 font-light leading-relaxed">
                                    {reviews[currentIndex].review}
                                </p>

                                <div>
                                    <h4 className="text-lg font-bold text-brand-dark">{reviews[currentIndex].name}</h4>
                                    <p className="text-gray-500 font-medium text-xs uppercase">{reviews[currentIndex].role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Arrow Navigation - Visible only on mobile */}
                    <div className="flex justify-center gap-4 mt-6 md:hidden">
                        <button onClick={prevReview} className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-brand-blue hover:text-white transition-colors active:scale-95 bg-white shadow-sm">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextReview} className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-brand-blue hover:text-white transition-colors active:scale-95 bg-white shadow-sm">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}