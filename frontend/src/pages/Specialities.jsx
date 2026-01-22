import Services from '../components/Services';
import Technology from '../components/Technology';

export default function Specialities() {
    return (
        <main className="pt-20">
            {/* Minimalist Editorial Hero */}
            <section className="px-6 max-w-[90rem] mx-auto pb-12 pt-10">
                <div className="max-w-7xl mx-auto">
                    {/* Split layout: Title Left, Tagline Right */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight tracking-tight">
                            Precision in every <br />
                            <span className="text-brand-blue italic font-serif">procedure.</span>
                        </h1>

                        {/* Right-aligned tagline */}
                        <div className="flex items-center gap-4 md:self-end">
                            <div className="hidden md:block h-[1px] w-16 bg-brand-blue/30"></div>
                            <span className="text-lg text-gray-500 font-light tracking-tight md:text-right leading-snug">
                                Advanced technology.<br className="hidden md:inline" /> Human touch.
                            </span>
                        </div>
                    </div>

                    <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl">
                        Comprehensive eye care services powered by the latest medical technology.
                    </p>
                </div>
            </section>

            <Services />

            {/* Smart Treatment Process */}
            <section className="py-24 px-6 max-w-7xl mx-auto bg-white rounded-[3rem] my-10 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="text-center mb-16 relative z-10">
                    <span className="text-brand-blue font-bold tracking-widest uppercase text-sm">How It Works</span>
                    <h2 className="text-4xl font-bold text-brand-dark mt-2">Your Journey to Clear Vision</h2>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative z-10">
                    {[
                        { step: "01", title: "Holistic Exam", desc: "We don't just check numbers. We use AI topography to map 22,000 points of your eye for a complete health profile." },
                        { step: "02", title: "Custom Plan", desc: "No two eyes are alike. Your treatment—whether LASIK, lenses, or therapy—is 100% personalized to your lifestyle." },
                        { step: "03", title: "Precision Care", desc: "Our surgeries are blade-free, using Femtosecond lasers for micron-level accuracy and faster healing times." },
                        { step: "04", title: "Lifetime Support", desc: "We track your vision health long-term. Our post-op care ensures your results remain stable for years to come." }
                    ].map((item, idx) => (
                        <div key={idx} className="group p-6 rounded-3xl hover:bg-brand-cream/30 transition-colors relative">
                            <div className="text-6xl font-bold text-gray-100 mb-4 group-hover:text-brand-blue/10 transition-colors">{item.step}</div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                            {idx < 3 && (
                                <div className="hidden md:block absolute top-1/2 right-[-20px] w-10 h-[2px] bg-gray-100 -translate-y-1/2"></div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <Technology />
        </main>
    );
}
