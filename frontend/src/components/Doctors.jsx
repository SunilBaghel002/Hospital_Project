import { useState } from 'react';
import { Search, ChevronDown, Calendar, GraduationCap, Clock, Languages, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Doctors({ onBook }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);

    const doctors = [
        {
            name: "Dr. Sarah Johnson",
            role: "Cataract Specialist",
            qualification: "MBBS, MD (Ophthal)",
            experience: "15 Years Exp",
            languages: ["English", "Spanish"],
            gender: "Female",
            img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Dr. Michael Chen",
            role: "Retina Surgeon",
            qualification: "MBBS, MS, FVRS",
            experience: "12 Years Exp",
            languages: ["English", "Mandarin"],
            gender: "Male",
            img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2128&auto=format&fit=crop"
        },
        {
            name: "Dr. Emily Davis",
            role: "Pediatric Ophthalmologist",
            qualification: "MD, FPOS",
            experience: "10 Years Exp",
            languages: ["English"],
            gender: "Female",
            img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2000&auto=format&fit=crop"
        },
        {
            name: "Dr. James Wilson",
            role: "Glaucoma Specialist",
            qualification: "MBBS, DO",
            experience: "20 Years Exp",
            languages: ["English", "French"],
            gender: "Male",
            img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Dr. Robert Lee",
            role: "Cornea Specialist",
            qualification: "MD, FACS",
            experience: "18 Years Exp",
            languages: ["English", "Korean"],
            gender: "Male",
            img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"
        },
        {
            name: "Dr. Anita Patel",
            role: "Refractive Surgeon",
            qualification: "MBBS, MS",
            experience: "8 Years Exp",
            languages: ["English", "Hindi"],
            gender: "Female",
            img: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=1974&auto=format&fit=crop"
        },
        {
            name: "Dr. David Kim",
            role: "Neuro-Ophthalmologist",
            qualification: "MD, PhD",
            experience: "14 Years Exp",
            languages: ["English", "Korean"],
            gender: "Male",
            img: "https://images.unsplash.com/photo-1582750433449-d22b1c74caf8?q=80&w=1974&auto=format&fit=crop"
        },
        {
            name: "Dr. Lisa Wong",
            role: "Oculoplastic Surgeon",
            qualification: "MD, FPRS",
            experience: "16 Years Exp",
            languages: ["English", "Cantonese"],
            gender: "Female",
            img: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=2070&auto=format&fit=crop"
        },
    ];

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollContainer = (direction) => {
        const container = document.getElementById('doctors-container');
        if (container) {
            const scrollAmount = direction === 'left' ? -420 : 420;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="doctors" className="py-24 px-6 max-w-[95%] mx-auto z-10 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10"></div>

            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div className="text-left">
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">Our Medical Experts</h2>
                    <p className="text-gray-500 max-w-2xl text-lg">World-class doctors dedicated to your vision health.</p>
                </div>

                {/* Navigation and Search Combined Area */}
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
                    {/* Simplified Search - Visual & Large */}
                    <div className="relative group w-full md:w-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-peach to-brand-blue rounded-full opacity-25 group-hover:opacity-50 blur transition duration-200"></div>
                        <div className="relative flex items-center bg-white rounded-full p-2 pl-6 shadow-lg border border-gray-100">
                            <Search size={20} className="text-brand-blue mr-3" />
                            <input
                                type="text"
                                placeholder="Search Doctor..."
                                className="w-48 bg-transparent py-1 outline-none text-brand-dark placeholder-gray-400 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => scrollContainer('left')} className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-brand-blue hover:text-white transition-colors active:scale-95 bg-white">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => scrollContainer('right')} className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-brand-blue hover:text-white transition-colors active:scale-95 bg-white">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Carousel Container */}
            <div
                id="doctors-container"
                className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar p-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {filteredDoctors.slice(0, 10).map((doc, idx) => ( // Removed limit of visualCount since it's scrollable now, but keeping safe limit
                    <div key={idx} className="min-w-[320px] md:min-w-[400px] snap-center group relative bg-white rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">

                        {/* Large Image Area */}
                        <div className="h-[20rem] w-full relative bg-gray-100">
                            <img src={doc.img} alt={doc.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-2xl font-bold mb-1">{doc.name}</h3>
                                <p className="text-white/80 font-medium uppercase tracking-wide text-sm">{doc.role}</p>
                            </div>
                        </div>

                        {/* Professional Details - Very Clear Icons */}
                        <div className="p-8 pt-6 flex-1 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <div className="flex items-center gap-3 p-3 bg-brand-cream/50 rounded-2xl">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-blue shadow-sm">
                                        <GraduationCap size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Education</p>
                                        <p className="text-brand-dark font-bold text-sm leading-tight">{doc.qualification}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-brand-cream/50 rounded-2xl">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-blue shadow-sm">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Experience</p>
                                        <p className="text-brand-dark font-bold text-sm leading-tight">{doc.experience}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Languages Pill */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 px-2">
                                <Languages size={16} className="text-brand-blue" />
                                <span>Speaks:</span>
                                <span className="font-medium text-brand-dark">{doc.languages.join(", ")}</span>
                            </div>

                            <div className="mt-auto pt-4">
                                <button onClick={() => onBook(doc.name)} className="w-full py-4 rounded-2xl bg-brand-blue text-white font-bold text-lg hover:bg-brand-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/30 hover:shadow-xl hover:shadow-brand-dark/20 active:scale-95">
                                    <Calendar size={20} />
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Arrow Navigation - Visible only on mobile */}
            <div className="flex justify-center gap-4 mt-4 md:hidden">
                <button onClick={() => scrollContainer('left')} className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-brand-blue hover:text-white transition-colors active:scale-95 bg-white shadow-sm">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={() => scrollContainer('right')} className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-brand-blue hover:text-white transition-colors active:scale-95 bg-white shadow-sm">
                    <ChevronRight size={20} />
                </button>
            </div>

        </section>
    );
}
