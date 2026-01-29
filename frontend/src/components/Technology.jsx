export default function Technology({ data }) {
    const techs = data?.technologies || [
        { name: "Femtosecond Laser", desc: "Precision corneal incisions for blade-free cataract surgery.", img: "/assets/images/services/cataract-surgery.png" },
        { name: "OCT Imaging", desc: "High-resolution cross-sectional retinal imaging.", img: "/assets/images/services/retina.png" },
        { name: "Digital Phoropter", desc: "Advanced automated refraction for pinpoint accuracy.", img: "/assets/images/services/advanced-diagnostics.png" },
    ];

    const tagline = data?.tagline || "Innovation";
    const headline = data?.headline || "World-Class Technology";
    const description = data?.description || "We invest in the latest ophthalmic advancements to ensure safety, precision, and faster recovery for our patients. Our labs are equipped with the future of eye care.";

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                <div className="flex-1">
                    <span className="text-brand-blue font-bold tracking-wider text-sm uppercase mb-2 block">{tagline}</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-6">{headline}</h2>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Static High Tech Badge as requested */}
                <div className="flex-1 flex justify-end">
                    <div className="relative group cursor-default">
                        <div className="absolute inset-0 bg-brand-blue/20 blur-2xl rounded-full group-hover:blur-3xl transition-all duration-500"></div>
                        <div className="relative w-72 h-72 bg-white rounded-full border border-gray-100 shadow-2xl flex flex-col items-center justify-center overflow-hidden p-6 text-center z-10">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-brand-blue">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-1">High Tech</h3>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Labs Certified</p>

                            {/* Static data points */}
                            <div className="mt-4 pt-4 border-t border-gray-100 w-full flex justify-between px-2">
                                <div>
                                    <div className="text-lg font-bold text-brand-blue">AI</div>
                                    <div className="text-[10px] text-gray-400">Powered</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-brand-blue">4K</div>
                                    <div className="text-[10px] text-gray-400">Imaging</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-brand-blue">3D</div>
                                    <div className="text-[10px] text-gray-400">Modelling</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {techs.map((tech, i) => (
                    <div key={i} className="group bg-white rounded-[2.5rem] p-4 shadow-xl border border-gray-100 hover:border-brand-blue/30 transition-all hover:-translate-y-2">
                        <div className="h-56 rounded-[2rem] overflow-hidden mb-6 relative">
                            <img src={tech.img} alt={tech.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-brand-blue/10 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="px-4 pb-4">
                            <h3 className="text-2xl font-bold text-brand-dark mb-2">{tech.name}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{tech.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
