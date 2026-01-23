export default function Cards({ data }) {
    if (!data || !data.cards) return null;

    const { headline, cards } = data;

    return (
        <section className="px-6 max-w-5xl mx-auto py-24 md:py-32">
            {headline && (
                <h2 className="text-3xl font-serif text-brand-dark mb-16 italic">{headline}</h2>
            )}

            <div className="space-y-12">
                {cards.map((item, idx) => (
                    <div key={idx} className="group border-b border-gray-100 pb-12 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-16 hover:pl-4 transition-all duration-300">
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-300 group-hover:text-brand-dark transition-colors">0{idx + 1}</h3>
                        <div>
                            <h4 className="text-2xl font-medium text-brand-dark mb-2">{item.title}</h4>
                            <p className="text-gray-500 font-light">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
