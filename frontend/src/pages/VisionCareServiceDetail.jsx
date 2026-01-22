import { useParams, Navigate } from 'react-router-dom';
import { servicesData } from '../data/services';
import { doctors } from '../data/doctors';
import { Calendar, CheckCircle2, ArrowRight, Activity, Shield, Zap } from 'lucide-react';

export default function VisionCareServiceDetail({ onBook, serviceSlug }) {
    const params = useParams();
    const slug = serviceSlug || params.slug;
    const service = servicesData.find(s => s.id === slug);

    if (!service) {
        return <Navigate to="/vision-care" replace />;
    }

    // Filter experts for this service
    const experts = doctors.filter(doc =>
        doc.role.toLowerCase().includes(service.doctorRoleKeyword.toLowerCase()) ||
        (service.doctorRoleKeyword === "General" && !doc.role.includes("Surgeon"))
    );

    return (
        <main className="bg-white">
            {/* 1. Immersive Hero Section - Full Height with Gradient Overlay */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={service.img}
                        alt={service.heroTitle}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-brand-blue/10 mix-blend-overlay"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-brand-blue/20 backdrop-blur-sm border border-brand-blue/30 text-brand-blue font-bold tracking-widest uppercase text-xs rounded-full text-white">
                                Advanced Care Unit
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                            {service.heroTitle} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-white">
                                {service.heroSubtitle}
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-10 border-l-4 border-brand-blue pl-6">
                            {service.heroTagline}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <button
                                onClick={() => onBook()}
                                className="px-10 py-5 bg-brand-blue text-white rounded-full font-bold text-lg hover:bg-white hover:text-brand-dark transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center gap-3 group"
                            >
                                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Priority Booking
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Tech-Focused Overview - Dark/Light hybrid */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-brand-blue font-bold tracking-widest uppercase text-sm mb-3 block">{service.overviewTitle}</span>
                            <h2 className="text-4xl font-bold text-brand-dark mb-8 leading-tight">{service.overviewText}</h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
                                {service.longDesc}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-brand-blue/5 rounded-[2.5rem] transform rotate-3"></div>
                            <div className="relative bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100">
                                <h3 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-3">
                                    <Activity className="text-brand-blue" />
                                    Clinical Advantages
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { title: "Precision", desc: "Digital accuracy beyond human capability" },
                                        { title: "Safety", desc: "Minimally invasive techniques" },
                                        { title: "Recovery", desc: "Accelerated healing protocols" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-brand-cream/30 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-brand-dark">{item.title}</h4>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Scope of Services - Cards Grid */}
            <section className="py-24 px-6 bg-brand-dark text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-brand-blue font-bold tracking-widest uppercase text-sm">Capabilities</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6">{service.scopeTitle}</h2>
                        <div className="w-24 h-1 bg-brand-blue mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {service.scopePoints.map((point, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all hover:-translate-y-2 duration-300 group">
                                <div className="mb-6 text-brand-blue group-hover:text-white transition-colors">
                                    <Shield size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{point.title}</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                                    {point.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Large Visual Break */}
            <section className="h-[60vh] relative fixed-bg-scrolling">
                <img src={service.scopeImg} alt="Detail view" className="w-full h-full object-cover fixed-attachment" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <p className="text-3xl md:text-5xl font-serif italic text-white text-center px-6 max-w-4xl leading-tight">
                        "Redefining what's possible in <span className="text-brand-blue not-italic font-sans font-bold">modern {service.title}</span>."
                    </p>
                </div>
            </section>

            {/* 5. Expert Team */}
            {experts.length > 0 && (
                <section className="py-24 px-6 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="text-brand-blue font-bold tracking-widest uppercase text-sm">Leadership</span>
                            <h2 className="text-4xl font-bold text-brand-dark mt-2">Department Specialists</h2>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {experts.map((doc, idx) => (
                            <div key={idx} className="flex gap-6 items-center p-6 bg-white rounded-[2rem] shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                                <img src={doc.img} alt={doc.name} className="w-24 h-24 rounded-full object-cover border-4 border-brand-cream" />
                                <div>
                                    <h3 className="text-lg font-bold text-brand-dark">{doc.name}</h3>
                                    <p className="text-brand-blue text-sm uppercase font-bold mb-3">{doc.role}</p>
                                    <button
                                        onClick={() => onBook(doc.name)}
                                        className="text-sm font-bold border-b border-brand-dark pb-0.5 hover:text-brand-blue hover:border-brand-blue transition-colors"
                                    >
                                        Request Appointment
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 6. Footer CTA */}
            <section className="py-20 px-6 bg-brand-cream/30">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-8">Your Vision, Our Priority</h2>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                        Don't wait for symptoms to worsen. Early diagnosis is the key to successful treatment.
                    </p>
                    <button
                        onClick={() => onBook()}
                        className="px-12 py-5 bg-brand-dark text-white rounded-full font-bold text-xl hover:bg-brand-blue hover:scale-105 transition-all shadow-xl"
                    >
                        Schedule Consultation
                    </button>
                </div>
            </section>
        </main>
    );
}
