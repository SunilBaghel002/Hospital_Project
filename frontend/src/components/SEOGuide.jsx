import { ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';

export default function SEOGuide() {
    const [openIndex, setOpenIndex] = useState(0);

    const items = [
        {
            title: "Common Eye Conditions Explained",
            content: "Understanding your eye health is crucial. Common conditions include Myopia (Nearsightedness), Hyperopia (Farsightedness), Astigmatism, and Presbyopia. More serious conditions like Cataracts causing cloudy vision, Glaucoma damaging the optic nerve, and Macular Degeneration affecting central vision require immediate professional attention. Our clinic specializes in early detection and management of these ocular pathologies."
        },
        {
            title: "The Importance of Regular Eye Exams",
            content: "Comprehensive eye exams do more than just check your prescription. They assess your overall eye health and can detect early signs of systemic diseases like diabetes and hypertension. We recommend annual exams for adults over 60, and bi-annual exams for younger adults, unless risk factors indicate otherwise. Early diagnosis is key to preventing reversible blindness."
        },
        {
            title: "Latest Advances in LASIK Surgery",
            content: "LASIK technology has evolved significantly. We utilize Contoura® Vision, a topography-guided LASIK that maps up to 22,000 points on your cornea for personalized treatment. This results in sharper vision, often better than 20/20, with fewer side effects like halos or glare. Recovery is rapid, with most patients returning to normal activities within 24 hours."
        },
        {
            title: "Pediatric Eye Care Guidelines",
            content: "Children's vision development is critical for learning. The American Academy of Ophthalmology recommends screenings at birth, age 1, age 3, and before first grade. Watch for signs like squinting, eye rubbing, or head tilting. Our pediatric specialists are trained to manage Amblyopia (Lazy Eye) and Strabismus (Crossed Eyes) using gentle, child-friendly therapies."
        },
        {
            title: "Technology at Visionary Eye Care",
            content: "We pride ourselves on hosting the region's most advanced diagnostic suite. From Optical Coherence Tomography (OCT) for retinal cross-sections to Humphrey Visual Field testing for glaucoma monitoring, our equipment ensures no detail is missed. Our surgical suites are equipped with the Zeiss Callisto Eye system for precise astigmatism management during cataract surgery."
        }
    ];

    return (
        <section className="py-20 px-6 max-w-4xl mx-auto border-t border-brand-blue/5">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-brand-dark mb-4">Patient Education & Resources</h2>
                <p className="text-gray-500">In-depth guides to help you make informed decisions about your vision.</p>
            </div>

            <div className="space-y-4">
                {items.map((item, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                            className="w-full text-left p-6 flex items-center justify-between font-bold text-brand-dark hover:text-brand-blue transition-colors"
                        >
                            {item.title}
                            <div className={`p-2 rounded-full bg-gray-50 text-brand-blue transition-transform ${openIndex === i ? 'rotate-180 bg-brand-blue text-white' : ''}`}>
                                <ChevronDown size={20} />
                            </div>
                        </button>
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                            <div className="overflow-hidden">
                                <p className="p-6 pt-0 text-gray-500 leading-relaxed border-t border-dashed border-gray-100 mx-6 mt-2">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
