import Network from '../components/Network';
import Partners from '../components/Partners';
import { Quote, ArrowRight } from 'lucide-react';

export default function AboutUs() {
    return (
        <main className="pt-24 bg-white">
            {/* Minimalist Editorial Hero - Modern Split */}
            <section className="relative px-6 max-w-[90rem] mx-auto pb-12 pt-8 md:pt-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
                        {/* Content Side */}
                        <div className="order-2 lg:order-1">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-12 h-[2px] bg-brand-blue"></span>
                                <span className="text-brand-blue font-bold tracking-widest uppercase text-sm">Our Story</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-brand-dark leading-[1.1] mb-6 tracking-tight">
                                We see the world <br />
                                <span className="text-gray-400 font-light">differently.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-10 max-w-lg">
                                Visionary isn't just a clinic. It's a promise to restore not just sight, but the connection to the world around you.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-lg hover:bg-brand-blue transition-all shadow-lg hover:shadow-brand-blue/30 flex items-center justify-center gap-2 group">
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    Explore Our Legacy
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex gap-8 border-t border-gray-100 pt-8">
                                <div>
                                    <span className="block text-2xl font-bold text-brand-dark">30+</span>
                                    <span className="text-sm text-gray-500">Years Experience</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold text-brand-dark">15k+</span>
                                    <span className="text-sm text-gray-500">Happy Patients</span>
                                </div>
                            </div>
                        </div>

                        {/* Image Side */}
                        <div className="order-1 lg:order-2 relative">
                            <div className="relative z-10 rounded-tl-[100px] rounded-br-[100px] overflow-hidden aspect-[4/5] md:aspect-square shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2080&auto=format&fit=crop"
                                    alt="Surgical Excellence"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
                                />
                                {/* Floating Badge */}
                                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 max-w-xs">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-brand-blue/10 rounded-full text-brand-blue">
                                            <Quote size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm italic text-brand-dark">"Precision is not an act, it is a habit."</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Blob */}
                            <div className="absolute -top-10 -right-10 w-full h-full bg-brand-peach/30 rounded-full blur-3xl -z-10 opacity-60"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Fluid Image & Narrative Section */}
            <section className="relative w-full aspect-video md:aspect-[2.4/1] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1516574187841-6930022476c9?q=80&w=2080&auto=format&fit=crop"
                    alt="Surgical Precision"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out scale-105 hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 md:p-20">
                    <p className="text-white text-lg md:text-xl font-light tracking-wide max-w-2xl">
                        "Precision is not an act, it is a habit. Our surgeons cultivate this habit every single day."
                    </p>
                </div>
            </section>

            {/* 3. The Philosophy - Text Heavy, No Boxes */}
            <section className="px-6 max-w-5xl mx-auto py-24 md:py-32">
                <div className="flex flex-col md:flex-row gap-16 md:gap-32">
                    <div className="md:w-1/3">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-blue mb-4">Our Philosophy</h3>
                        <h2 className="text-4xl font-serif text-brand-dark">Human-Centric Care</h2>
                    </div>
                    <div className="md:w-2/3 space-y-8 text-lg text-gray-600 leading-relaxed font-light">
                        <p>
                            In an era of assembly-line medicine, we chose a different path. We believe that every eye has a story, and every patient deserves to be heard, understood, and treated with unparalleled empathy.
                        </p>
                        <p>
                            We don't hide behind complex medical jargon. We believe clarity begins with communication. From your first consultation to your final check-up, you are a partner in your own care, not just a recipient of it.
                        </p>
                        <div className="pt-8">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <span className="text-brand-dark font-medium group-hover:underline">Meet our Medical Director</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Minimal Timeline - Just text flow */}
            <section className="bg-brand-cream/30 py-24 md:py-32">
                <div className="px-6 max-w-[90rem] mx-auto">
                    <h2 className="text-5xl md:text-[10rem] font-bold text-black/5 leading-none mb-12 md:-mb-24 select-none">
                        LEGACY
                    </h2>

                    <div className="grid md:grid-cols-4 gap-12 md:gap-8 max-w-7xl mx-auto relative z-10">
                        {[
                            { year: '1995', text: 'Born from a desire to do better.' },
                            { year: '2008', text: 'First blade-free studio in the region.' },
                            { year: '2019', text: 'Recognized globally for safety standards.' },
                            { year: 'Now', text: 'Pioneering AI in preventative care.' },
                        ].map((item, idx) => (
                            <div key={idx} className="border-t border-brand-dark/20 pt-6">
                                <span className="block text-3xl font-serif text-brand-blue mb-4">{item.year}</span>
                                <p className="text-gray-600 text-sm max-w-[150px]">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Values - Editorial List */}
            <section className="px-6 max-w-5xl mx-auto py-24 md:py-32">
                <h2 className="text-3xl font-serif text-brand-dark mb-16 italic">We stand for...</h2>

                <div className="space-y-12">
                    {[
                        { title: "Transparency", desc: "No hidden costs. No surprise procedures. Complete clarity." },
                        { title: "Innovation", desc: "Investing in the future of sight, today." },
                        { title: "Compassion", desc: "Treating the person, not just the condition." }
                    ].map((item, idx) => (
                        <div key={idx} className="group border-b border-gray-100 pb-12 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-16 hover:pl-4 transition-all duration-300">
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-300 group-hover:text-brand-dark transition-colors">0{idx + 1}</h3>
                            <div>
                                <h4 className="text-2xl font-medium text-brand-dark mb-2">{item.title}</h4>
                                <p className="text-gray-500 font-light">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Partners />
            <Network />
        </main>
    );
}
