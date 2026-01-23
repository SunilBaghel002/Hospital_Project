export default function Stats({ data }) {
    if (!data || !data.stats) return null;

    const { stats, title } = data;

    return (
        <section className="bg-brand-cream/30 py-24 md:py-32">
            <div className="px-6 max-w-[90rem] mx-auto">
                {title && (
                    <h2 className="text-5xl md:text-[10rem] font-bold text-black/5 leading-none mb-12 md:-mb-24 select-none">
                        {title.toUpperCase()}
                    </h2>
                )}

                <div className="grid md:grid-cols-4 gap-12 md:gap-8 max-w-7xl mx-auto relative z-10">
                    {stats.map((item, idx) => (
                        <div key={idx} className="border-t border-brand-dark/20 pt-6">
                            <span className="block text-3xl font-serif text-brand-blue mb-4">{item.number}</span>
                            <p className="text-gray-600 text-sm max-w-[150px]">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
