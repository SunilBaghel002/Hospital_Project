
import { useParams, Navigate } from 'react-router-dom';
import { servicesData } from '../data/services';
import { doctors } from '../data/doctors';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ServiceDetail({ onBook }) {
    const { slug } = useParams();
    const service = servicesData.find(s => s.id === slug);

    if (!service) {
        return <Navigate to="/specialties" replace />;
    }

    // Filter experts for this service
    // Simplistic matching: check if doctor role keyword matches
    const experts = doctors.filter(doc =>
        doc.role.toLowerCase().includes(service.doctorRoleKeyword.toLowerCase()) ||
        (service.doctorRoleKeyword === "General" && !doc.role.includes("Surgeon"))
        // Fallback logic could be improved
    );

    return (
        <main className="pt-20 bg-white">
            {/* 1. Hero Section - Modern Split ID */}
            <section className="relative px-6 max-w-[90rem] mx-auto pb-12 pt-8 md:pt-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
                        {/* Content Side */}
                        <div className="order-2 lg:order-1">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-12 h-[2px] bg-brand-blue"></span>
                                <span className="text-brand-blue font-bold tracking-widest uppercase text-sm">Clinical Excellence</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-brand-dark leading-[1.1] mb-6 tracking-tight">
                                {service.heroTitle} <br />
                                <span className="text-gray-400 font-light">{service.heroSubtitle}</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-10 max-w-lg">
                                {service.heroTagline} Experience expert care designed for long-term vision health.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button
                                    onClick={() => onBook()}
                                    className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-lg hover:bg-brand-blue transition-all shadow-lg hover:shadow-brand-blue/30 flex items-center justify-center gap-2 group"
                                >
                                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Book Appointment
                                </button>
                                <div className="flex items-center gap-4 px-6 py-4 bg-brand-cream/50 rounded-full">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-brand-dark">500+ Trusted Patients</span>
                                </div>
                            </div>

                            {/* Key Stats / Features Row */}
                            <div className="grid grid-cols-3 gap-6 border-t border-gray-100 pt-8">
                                <div>
                                    <span className="block text-2xl md:text-3xl font-bold text-brand-dark mb-1">99%</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Success Rate</span>
                                </div>
                                <div>
                                    <span className="block text-2xl md:text-3xl font-bold text-brand-dark mb-1">24/7</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Support</span>
                                </div>
                                <div>
                                    <span className="block text-2xl md:text-3xl font-bold text-brand-dark mb-1">Top</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Specialists</span>
                                </div>
                            </div>
                        </div>

                        {/* Image Side */}
                        <div className="order-1 lg:order-2 relative">
                            <div className="relative z-10 rounded-tl-[100px] rounded-br-[100px] overflow-hidden aspect-[4/5] md:aspect-square shadow-2xl">
                                <img
                                    src={service.img}
                                    alt={service.heroTitle}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                                {/* Floating Badge */}
                                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 max-w-xs">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 rounded-full text-green-600">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-brand-dark text-lg">Top Rated Care</p>
                                            <p className="text-xs text-gray-500">Recognized for excellence in patient outcomes.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Blob */}
                            <div className="absolute -top-10 -right-10 w-full h-full bg-brand-cream rounded-full blur-3xl -z-10 opacity-60"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Overview & Deep Dive - Compact Split Layout */}
            <section className="px-6 max-w-[90rem] mx-auto py-16">
                <div className="flex flex-col lg:flex-row gap-10 items-center max-w-7xl mx-auto">
                    {/* Visual Side - Smaller */}
                    <div className="lg:w-2/5 relative">
                        <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-xl max-h-[400px]">
                            <img
                                src={service.img}
                                alt={service.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                                <p className="text-white text-sm font-light leading-relaxed backdrop-blur-sm bg-white/10 p-3 rounded-xl border border-white/20">
                                    "{service.shortDesc}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Side - Compact */}
                    <div className="lg:w-3/5">
                        <span className="text-brand-blue font-bold tracking-widest uppercase text-xs mb-2 block">{service.overviewTitle}</span>
                        <p className="text-base font-bold text-brand-dark mb-4 leading-relaxed">{service.overviewText}</p>

                        <div className="text-gray-600 leading-relaxed whitespace-pre-line mb-6 text-sm">
                            {service.longDesc}
                        </div>

                        {/* Quick highlights - Inline */}
                        <div className="bg-brand-cream/50 p-5 rounded-2xl border border-brand-peach/20">
                            <h3 className="text-base font-bold text-brand-dark mb-3">Why Choose This?</h3>
                            <ul className="grid grid-cols-3 gap-3">
                                <li className="flex items-center gap-2 text-gray-600 text-sm">
                                    <CheckCircle2 className="text-brand-blue w-4 h-4 flex-shrink-0" />
                                    <span>Advanced Tech</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 text-sm">
                                    <CheckCircle2 className="text-brand-blue w-4 h-4 flex-shrink-0" />
                                    <span>Custom Care</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 text-sm">
                                    <CheckCircle2 className="text-brand-blue w-4 h-4 flex-shrink-0" />
                                    <span>Expert Team</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Scope of Services */}
            < section className="bg-brand-cream/30 py-20 px-6" >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2">
                            <span className="text-brand-blue font-bold tracking-widest uppercase text-xs mb-2 block">What We Offer</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">{service.scopeTitle}</h2>
                            <div className="grid gap-6">
                                {service.scopePoints.map((point, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100/50">
                                        <div className="mt-1">
                                            <CheckCircle2 className="text-brand-blue h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-brand-dark text-lg">{point.title}</h3>
                                            <p className="text-gray-500 text-sm">{point.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:w-1/2 relative h-[500px] w-full rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src={service.scopeImg}
                                alt="Scope of Services"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section >

            {/* 5. Our Experts */}
            {
                experts.length > 0 && (
                    <section className="py-24 px-6 max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-brand-blue font-bold tracking-widest uppercase text-xs">Specialists</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mt-2">Meet Your Care Team</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                            {experts.map((doc, idx) => (
                                <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                                    <div className="h-64 overflow-hidden relative">
                                        <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-brand-dark">{doc.name}</h3>
                                        <p className="text-brand-blue font-medium text-sm uppercase mb-4">{doc.role}</p>
                                        <button
                                            onClick={() => onBook(doc.name)}
                                            className="w-full py-3 rounded-xl bg-brand-cream/50 text-brand-dark font-bold hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Calendar size={16} /> Book Consultation
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            }

            {/* 6. CTA Section */}
            <section className="px-6 pb-20">
                <div className="max-w-7xl mx-auto bg-brand-dark rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to restore your vision?</h2>
                        <p className="text-gray-300 text-lg mb-8">Take the first step towards a clearer tomorrow. Schedule your comprehensive evaluation today.</p>
                        <button
                            onClick={() => onBook()}
                            className="bg-white text-brand-dark py-4 px-10 rounded-full font-bold text-lg hover:bg-brand-blue hover:text-white transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 mx-auto"
                        >
                            <Calendar size={20} />
                            Book Appointment
                        </button>
                    </div>
                </div>
            </section>
        </main >
    );
}
