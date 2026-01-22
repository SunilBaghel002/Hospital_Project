export default function Partners() {
    const partners = [
        { name: "MedicalPlus", icon: "M" },
        { name: "PharmaCare", icon: "P" },
        { name: "EyeTech", icon: "E" },
        { name: "VisionLabs", icon: "V" },
        { name: "HealthFirst", icon: "H" },
        { name: "OptiClear", icon: "O" },
        { name: "SureSight", icon: "S" },
        { name: "GlobalMed", icon: "G" },
    ];

    return (
        <section className="py-8 bg-white/40 border-y border-brand-blue/5 overflow-hidden">
            <div className="max-w-full">
                <p className="text-center text-gray-400 text-xs font-semibold uppercase tracking-[0.2em] mb-8">Trusted by Global Healthcare Leaders</p>

                <div className="relative flex overflow-x-hidden group">
                    <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
                        {[...partners, ...partners, ...partners].map((partner, idx) => (
                            <div key={idx} className="inline-flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer mx-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-cream flex items-center justify-center font-bold text-xl text-brand-blue shadow-sm border border-brand-blue/10">
                                    {partner.icon}
                                </div>
                                <span className="font-bold text-gray-600 text-xl font-heading">{partner.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-16 items-center ml-0">
                        {/* Duplicate for seamless loop if needed, but Tailwind 'animate-marquee' handles simple translation. 
                   Standard marquee techniques usually require doubling content. 
                   The above single div with tripled content is usually enough for screen width coverage.
               */}
                    </div>
                </div>
            </div>
        </section>
    );
}
