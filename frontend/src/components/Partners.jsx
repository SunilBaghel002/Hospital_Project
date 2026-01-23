export default function Partners({ data }) {
    // Support both formats:
    // 1. data.logos = ['url1', 'url2'] (New Admin Format)
    // 2. data.partners = [{name, icon}] (Legacy/Seed Format - we will deprecate or support)

    // We favor 'logos' if it exists and has items
    const hasLogos = data?.logos && data.logos.length > 0;
    const hasPartners = data?.partners && data.partners.length > 0;

    // Fallback if nothing
    if (!hasLogos && !hasPartners) return null;

    // Items for Marquee
    // If logos, we just map the URLs. If partners, we map objects.
    // To make the marquee smooth, we triple the items.

    const items = hasLogos ? data.logos : data.partners;
    const tripleItems = [...items, ...items, ...items, ...items]; // Quadruple to be safe for wide screens

    return (
        <section className="py-8 bg-white/40 border-y border-brand-blue/5 overflow-hidden">
            <div className="max-w-full">
                <p className="text-center text-gray-400 text-xs font-semibold uppercase tracking-[0.2em] mb-8">
                    {data?.headline || "Trusted by Global Healthcare Leaders"}
                </p>

                <div className="relative flex overflow-x-hidden group">
                    <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
                        {tripleItems.map((item, idx) => (
                            <div key={idx} className="inline-flex items-center justify-center mx-4 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                                {hasLogos ? (
                                    <img
                                        src={item}
                                        alt="Partner"
                                        className="h-12 w-auto object-contain max-w-[150px]"
                                    />
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-brand-cream flex items-center justify-center font-bold text-xl text-brand-blue shadow-sm border border-brand-blue/10">
                                            {item.icon}
                                        </div>
                                        <span className="font-bold text-gray-600 text-xl font-heading">{item.name}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-16 items-center ml-0">
                        {/* CSS Animation handles duplication visually, but having ample items in the first div is key. 
                             If using the 'duplicate div' method, we'd replicate the above children here. 
                             For now, let's stick to the single div with many items approach which works well with standard tailwind marquee plugins, 
                             or if we need the duplicate, we need to copy exact code. 
                             Let's leave this empty as the first div is usually sufficient with 4x duplication.
                         */}
                    </div>
                </div>
            </div>
        </section>
    );
}
