import { ArrowRight } from 'lucide-react';

export default function Content({ data }) {
    if (!data) return null;

    // Variant 1: Full Width Image with Overlay Text (Quote style)
    if (data.image && data.content) {
        return (
            <section className="relative w-full aspect-video md:aspect-[2.4/1] overflow-hidden">
                <img
                    src={data.image}
                    alt={data.title || "Content Image"}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out scale-105 hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 md:p-20">
                    <p className="text-white text-lg md:text-xl font-light tracking-wide max-w-2xl">
                        {data.content}
                    </p>
                </div>
            </section>
        );
    }

    // Variant 2: Text Block (Philosophy style)
    if (data.content && !data.image) {
        return (
            <section className="px-6 max-w-5xl mx-auto py-24 md:py-32">
                <div className="flex flex-col md:flex-row gap-16 md:gap-32">
                    <div className="md:w-1/3">
                        {data.title && <h3 className="text-sm font-bold uppercase tracking-widest text-brand-blue mb-4">{data.title}</h3>}
                        {/* We might want a separate headline field, but for now using title */}
                    </div>
                    <div className="md:w-2/3 space-y-8 text-lg text-gray-600 leading-relaxed font-light">
                        <p>{data.content}</p>

                        {/* Example CTA if needed */}
                        <div className="pt-8">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <span className="text-brand-dark font-medium group-hover:underline">Learn More</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return null;
}
