import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VisionCare({ onBook }) {
    const features = [
        { title: "Advanced Diagnostics", link: "/services/advanced-diagnostics", img: "/assets/images/services/advanced-diagnostics.png", desc: "Using AI-powered OCT and topographic mapping for early detection of conditions before symptoms appear." },
        { title: "Robotic Surgery", link: "/services/robotic-surgery", img: "/assets/images/services/cataract-surgery.png", desc: "Precision-guided femtosecond lasers for perfect cataract and refractive surgery outcomes." },
        { title: "Pediatric Care", link: "/services/pediatric-care", img: "/assets/images/services/pediatric-vision.png", desc: "Specialized gentle care for our youngest patients with myopia control and vision therapy." },
        { title: "Emergency Trauma", link: "/services/emergency-trauma", img: "/assets/images/services/emergency-care.png", desc: "24/7 rapid response unit for complex ocular injuries and urgent eye conditions." },
    ];

    return (
        <main className="pt-20 bg-white">
            {/* 1. Hero Section - Modern Split */}
            <section className="relative px-6 max-w-[90rem] mx-auto pb-12 pt-8 md:pt-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
                        {/* Content Side */}
                        <div className="order-2 lg:order-1">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-12 h-[2px] bg-brand-blue"></span>
                                <span className="text-brand-blue font-bold tracking-widest uppercase text-sm">Our Commitment</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark leading-[1.1] mb-6 tracking-tight">
                                Excellence in <br />
                                <span className="text-brand-blue">Vision Care</span>
                            </h1>

                            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                                We don't just treat eyes; we enhance your view of the world. Combining decades of medical expertise with cutting-edge robotic technology to deliver outcomes that exceed expectations.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <button
                                    onClick={() => onBook()}
                                    className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-lg hover:bg-brand-blue transition-all shadow-lg hover:shadow-brand-blue/30 flex items-center justify-center gap-2 group"
                                >
                                    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Book Appointment
                                </button>
                                <Link to="/specialties" className="px-8 py-4 border-2 border-brand-dark text-brand-dark rounded-full font-bold text-lg hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2">
                                    View All Services
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>

                            {/* Key Stats */}
                            <div className="grid grid-cols-3 gap-6 border-t border-gray-100 pt-8">
                                <div>
                                    <span className="block text-2xl font-bold text-brand-dark mb-1">30+</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Years Experience</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold text-brand-dark mb-1">15k+</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Happy Patients</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold text-brand-dark mb-1">99%</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Success Rate</span>
                                </div>
                            </div>
                        </div>

                        {/* Image Side */}
                        <div className="order-1 lg:order-2 relative">
                            <div className="relative z-10 rounded-tl-[80px] rounded-br-[80px] overflow-hidden aspect-square shadow-2xl">
                                <img
                                    src="/assets/images/services/advanced-diagnostics.png"
                                    alt="Vision Care Excellence"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                                {/* Floating Badge */}
                                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 max-w-xs">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 rounded-full text-green-600">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-brand-dark">World-Class Technology</p>
                                            <p className="text-xs text-gray-500">State-of-the-art equipment</p>
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

            {/* 2. Features Grid */}
            <section className="px-6 max-w-[90rem] mx-auto py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-brand-blue font-bold tracking-widest uppercase text-xs">What We Offer</span>
                        <h2 className="text-3xl font-bold text-brand-dark mt-2">Our Core Specializations</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((item, index) => (
                            <Link to={item.link} key={index} className="group relative h-[350px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 block">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent group-hover:from-brand-blue/90 transition-colors duration-500" />

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Why Choose Us */}
            <section className="bg-brand-cream/30 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-brand-blue font-bold tracking-widest uppercase text-xs mb-2 block">Why Choose Us</span>
                            <h2 className="text-3xl font-bold text-brand-dark mb-6">The Romashka Difference</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                At Romashka Health Care, we combine medical excellence with a patient-first approach. Every treatment plan is personalized, every procedure is precise, and every patient is family.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Cutting-edge diagnostic technology",
                                    "Experienced team of specialists",
                                    "Personalized treatment plans",
                                    "Comprehensive follow-up care"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                                        <CheckCircle2 className="text-brand-blue w-5 h-5 flex-shrink-0" />
                                        <span className="text-brand-dark font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src="/assets/images/services/advanced-diagnostics.png"
                                alt="Medical Excellence"
                                className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CTA Section */}
            <section className="px-6 py-16">
                <div className="max-w-7xl mx-auto bg-brand-dark rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-blue/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Experience the Difference?</h2>
                        <p className="text-gray-300 mb-8">Schedule your comprehensive eye exam today and take the first step towards better vision.</p>
                        <button
                            onClick={() => onBook()}
                            className="bg-white text-brand-dark py-4 px-10 rounded-full font-bold text-lg hover:bg-brand-blue hover:text-white transition-all shadow-xl flex items-center gap-2 mx-auto"
                        >
                            <Calendar size={20} />
                            Book Your Appointment
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
