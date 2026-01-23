export default function Network({ data }) {
    const centers = data?.centers || [
        { city: "New York", img: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2000&auto=format&fit=crop" },
        { city: "Los Angeles", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop" },
        { city: "Chicago", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2000&auto=format&fit=crop" },
        { city: "Houston", img: "https://images.unsplash.com/photo-1582560465060-99804668d621?q=80&w=2000&auto=format&fit=crop" },
    ];

    const headline = data?.headline || "Our Extensive Network";
    const description = data?.description || "Providing accessible world-class eye care across major metropolitan areas.";

    // Bottom CTA customization
    const ctaTitle = data?.cta?.title || "Can't find a center near you?";
    const ctaText = data?.cta?.subtitle || data?.cta?.text || "We are rapidly expanding. Check our full list of 50+ satellite clinics.";
    const ctaBtn = data?.cta?.buttonText || "View All Locations";

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-brand-dark mb-4">{headline}</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">{description}</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {centers.map((center, i) => (
                        <div key={i} className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg">
                            <img src={center.img} alt={center.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-colors" />
                            <div className="absolute bottom-6 left-6 text-white transform translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-transform">
                                <h3 className="text-2xl font-bold">{center.city}</h3>
                                <p className="opacity-0 md:opacity-0 group-hover:opacity-100 transition-opacity text-sm mt-2 text-gray-200">
                                    See Locations &rarr;
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 bg-brand-cream rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-peach/20">
                    <div>
                        <h3 className="text-xl font-bold text-brand-dark mb-2">{ctaTitle}</h3>
                        <p className="text-gray-500 text-sm">{ctaText}</p>
                    </div>
                    <button className="bg-white px-6 py-3 rounded-xl font-semibold text-brand-blue shadow-sm hover:shadow-md transition-shadow">
                        {ctaBtn}
                    </button>
                </div>
            </div>
        </section>
    );
}
