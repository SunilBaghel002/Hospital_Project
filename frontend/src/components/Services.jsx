import { ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { servicesData } from '../data/services';
import { Link } from 'react-router-dom';

export default function Services({ data }) {
    // const services = data?.services || data?.cards || servicesData; // Handle both keys
    const services = servicesData; // Force local data update for now (User request)
    const tagline = data?.tagline || 'Premium Care';
    const title = data?.title || 'Our Specialities';
    const subtitle = data?.subtitle || 'Comprehensive eye care solutions tailored to your unique vision needs, powered by advanced technology.';

    const scrollContainer = (direction) => {
        if (typeof window === 'undefined') return;
        
        const container = document.getElementById('services-container');
        if (container) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="services" className="py-20 px-6 max-w-[95%] mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div className="max-w-xl">
                    <span className="text-brand-blue font-bold tracking-wider text-sm uppercase mb-2 block">{tagline}</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">{title}</h2>
                    <p className="text-gray-500 text-lg">{subtitle}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => scrollContainer('left')} className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-brand-blue hover:text-white transition-colors active:scale-95">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => scrollContainer('right')} className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 hover:bg-brand-blue hover:text-white transition-colors active:scale-95">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div
                id="services-container"
                className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {services.map((service, idx) => (
                    <div key={idx} className="min-w-[300px] md:min-w-[350px] snap-center group relative pt-4 h-full">
                        {/* Organic Background Shape */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cream/50 rounded-full blur-xl group-hover:bg-brand-blue/10 transition-colors duration-500" />

                        <Link to={`/services/${service.id}`} className="block relative z-10 rounded-[2.5rem] bg-white hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 border border-gray-100 group-hover:border-brand-blue/20 overflow-hidden h-full flex flex-col">
                            {/* Image Section */}
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={service.img}
                                    alt={service.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:bg-brand-blue group-hover:border-transparent transition-colors">
                                    <ArrowUpRight size={18} />
                                </div>
                            </div>

                            <div className="p-6 pt-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-brand-dark mb-2 leading-tight">{service.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4 opacity-80 group-hover:opacity-100 transition-opacity whitespace-normal line-clamp-3">{service.shortDesc || service.description}</p>
                            </div>
                        </Link>
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
