import { useState } from 'react';
import ImageUploader from '../../components/admin/ImageUploader';
import ArrayEditor from '../../components/admin/ArrayEditor';

// ==================== HERO SECTION EDITOR ====================
export function HeroEditor({ data = {}, onChange }) {
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 text-white relative overflow-hidden">
                {data.backgroundImage && (
                    <img src={data.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="relative">
                    {data.tagline && <p className="text-blue-300 text-xs font-semibold mb-1">✦ {data.tagline}</p>}
                    <h2 className="text-xl font-bold mb-1">{data.title || 'Hero Title'}</h2>
                    <p className="text-slate-300 text-sm">{data.subtitle || 'Add a subtitle'}</p>
                    {data.ctaText && <span className="inline-block mt-3 px-3 py-1 bg-blue-500 rounded text-xs">{data.ctaText}</span>}
                </div>
            </div>

            {/* Editor Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                    <input
                        type="text"
                        value={data.tagline || ''}
                        onChange={(e) => update('tagline', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="e.g., STATE-OF-THE-ART"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CTA Button Text</label>
                    <input
                        type="text"
                        value={data.ctaText || ''}
                        onChange={(e) => update('ctaText', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="e.g., Book Appointment"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Main Title</label>
                <input
                    type="text"
                    value={data.title || ''}
                    onChange={(e) => update('title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-lg font-semibold"
                    placeholder="See the World with Clarity"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                <textarea
                    value={data.subtitle || ''}
                    onChange={(e) => update('subtitle', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                    placeholder="Advanced Eye Care Solutions for a Brighter Tomorrow"
                />
            </div>
            <ImageUploader
                label="Background Image"
                value={data.backgroundImage}
                onChange={(url) => update('backgroundImage', url)}
            />
        </div>
    );
}

// ==================== CONTENT SECTION EDITOR ====================
export function ContentEditor({ data = {}, onChange }) {
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex gap-4">
                    {data.image && (
                        <img src={data.image} alt="" className="w-24 h-24 rounded-lg object-cover" />
                    )}
                    <div>
                        <p className="text-slate-700 text-sm">{data.content || 'Add content text here...'}</p>
                    </div>
                </div>
            </div>

            {/* Editor */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content Text</label>
                <textarea
                    value={data.content || ''}
                    onChange={(e) => update('content', e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                    placeholder="Write your content here..."
                />
            </div>
            <ImageUploader
                label="Side Image (optional)"
                value={data.image}
                onChange={(url) => update('image', url)}
            />
        </div>
    );
}

// ==================== STATS SECTION EDITOR ====================
export function StatsEditor({ data = {}, onChange }) {
    const stats = data.stats || [];
    const updateStats = (newStats) => onChange({ ...data, stats: newStats });

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.length > 0 ? stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl font-bold">{stat.number || '0'}</p>
                            <p className="text-blue-200 text-xs">{stat.label || 'Label'}</p>
                        </div>
                    )) : (
                        <p className="col-span-4 text-center text-blue-200 text-sm">Add statistics below</p>
                    )}
                </div>
            </div>

            {/* Editor */}
            <ArrayEditor
                items={stats}
                onChange={updateStats}
                addLabel="Add Statistic"
                emptyMessage="No statistics added yet"
                renderItem={(stat, update) => (
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            value={stat.number || ''}
                            onChange={(e) => update({ number: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="50+"
                        />
                        <input
                            type="text"
                            value={stat.label || ''}
                            onChange={(e) => update({ label: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="Years Experience"
                        />
                    </div>
                )}
            />
        </div>
    );
}

// ==================== CARDS/SERVICES SECTION EDITOR ====================
export function CardsEditor({ data = {}, onChange }) {
    const cards = data.cards || [];
    const updateCards = (newCards) => onChange({ ...data, cards: newCards });

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {cards.length > 0 ? cards.map((card, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 text-center relative overflow-hidden group">
                        {card.img && (
                            <img src={card.img} alt="" className="w-full h-24 object-cover rounded-md mb-2" />
                        )}
                        {!card.img && (
                            <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xs">
                                {card.icon || '📦'}
                            </div>
                        )}
                        <p className="text-sm font-medium text-slate-800">{card.title || 'Card Title'}</p>
                        <p className="text-xs text-slate-500 mt-1">{card.description || ''}</p>
                    </div>
                )) : (
                    <p className="col-span-3 text-center text-slate-400 text-sm py-4">Add cards below</p>
                )}
            </div>

            {/* Editor */}
            <ArrayEditor
                items={cards}
                onChange={updateCards}
                addLabel="Add Card"
                emptyMessage="No cards added yet"
                renderItem={(card, update) => (
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                value={card.title || ''}
                                onChange={(e) => update({ title: e.target.value })}
                                className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                placeholder="Card Title"
                            />
                            <input
                                type="text"
                                value={card.icon || ''}
                                onChange={(e) => update({ icon: e.target.value })}
                                className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                placeholder="Icon (emoji or name)"
                            />
                        </div>
                        <input
                            type="text"
                            value={card.description || ''}
                            onChange={(e) => update({ description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="Short description"
                        />
                        <input
                            type="text"
                            value={card.link || ''}
                            onChange={(e) => update({ link: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="Link URL (optional)"
                        />
                        <ImageUploader
                            label="Card Image"
                            value={card.img}
                            onChange={(url) => update({ img: url })}
                        />
                    </div>
                )}
            />
        </div>
    );
}

// ==================== TESTIMONIALS SECTION EDITOR ====================
export function TestimonialsEditor({ data = {}, onChange }) {
    const testimonials = data.testimonials || [];
    const updateTestimonials = (newTestimonials) => onChange({ ...data, testimonials: newTestimonials });

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testimonials.length > 0 ? testimonials.map((t, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                {(t.name || 'A')[0]}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800">{t.name || 'Name'}</p>
                                <div className="text-yellow-400 text-xs">{'★'.repeat(t.rating || 5)}</div>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm italic">"{t.text || 'Testimonial text...'}"</p>
                    </div>
                )) : (
                    <p className="col-span-2 text-center text-slate-400 text-sm py-4">Add testimonials below</p>
                )}
            </div>

            {/* Editor */}
            <ArrayEditor
                items={testimonials}
                onChange={updateTestimonials}
                addLabel="Add Testimonial"
                emptyMessage="No testimonials added yet"
                renderItem={(t, update) => (
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                value={t.name || ''}
                                onChange={(e) => update({ name: e.target.value })}
                                className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                placeholder="Patient Name"
                            />
                            <select
                                value={t.rating || 5}
                                onChange={(e) => update({ rating: parseInt(e.target.value) })}
                                className="px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            >
                                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                                <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                                <option value={3}>⭐⭐⭐ 3 Stars</option>
                            </select>
                        </div>
                        <textarea
                            value={t.text || ''}
                            onChange={(e) => update({ text: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                            placeholder="What did the patient say?"
                        />
                    </div>
                )}
            />
        </div>
    );
}

// ==================== CTA SECTION EDITOR ====================
export function CtaEditor({ data = {}, onChange }) {
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
                <h3 className="text-lg font-bold mb-1">{data.title || 'Call to Action Title'}</h3>
                <p className="text-blue-100 text-sm mb-3">{data.subtitle || 'Subtitle text here'}</p>
                {data.buttonText && (
                    <span className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm">
                        {data.buttonText}
                    </span>
                )}
            </div>

            {/* Editor */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                    type="text"
                    value={data.title || ''}
                    onChange={(e) => update('title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Ready to See Better?"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                <input
                    type="text"
                    value={data.subtitle || ''}
                    onChange={(e) => update('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Book your appointment today"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
                    <input
                        type="text"
                        value={data.buttonText || ''}
                        onChange={(e) => update('buttonText', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="Book Now"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Button Link</label>
                    <input
                        type="text"
                        value={data.buttonLink || ''}
                        onChange={(e) => update('buttonLink', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="/appointment"
                    />
                </div>
            </div>
        </div>
    );
}

// ==================== GALLERY SECTION EDITOR ====================
export function GalleryEditor({ data = {}, onChange }) {
    const images = data.images || [];
    const updateImages = (newImages) => onChange({ ...data, images: newImages });

    const addImage = (url) => {
        if (url) updateImages([...images, url]);
    };

    const removeImage = (index) => {
        updateImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {/* Preview Grid */}
            <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {/* Upload */}
            <ImageUploader
                label="Add Image to Gallery"
                value=""
                onChange={addImage}
                showPreview={false}
            />
        </div>
    );
}

// ==================== PARTNERS/LOGOS SECTION EDITOR ====================
export function PartnersEditor({ data = {}, onChange }) {
    const logos = data.logos || [];
    const updateLogos = (newLogos) => onChange({ ...data, logos: newLogos });

    const addLogo = (url) => {
        if (url) updateLogos([...logos, url]);
    };

    const removeLogo = (index) => {
        updateLogos(logos.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
                <div className="flex gap-4 items-center">
                    {logos.length > 0 ? logos.map((logo, i) => (
                        <div key={i} className="relative shrink-0 group">
                            <img src={logo} alt="" className="h-12 w-auto object-contain" />
                            <button
                                onClick={() => removeLogo(i)}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                            >
                                ×
                            </button>
                        </div>
                    )) : (
                        <p className="text-slate-400 text-sm">Add partner logos below</p>
                    )}
                </div>
            </div>

            {/* Upload */}
            <ImageUploader
                label="Add Partner Logo"
                value=""
                onChange={addLogo}
                showPreview={false}
            />
        </div>
    );
}

// ==================== DOCTORS SECTION EDITOR ====================
export function DoctorsEditor({ data = {}, onChange }) {
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-slate-600">
                    {data.showAll ? '📋 Showing ALL doctors' : `📋 Showing ${data.showCount || 4} doctors`}
                </p>
                <p className="text-sm text-slate-400 mt-1">Layout: {data.layout || 'grid'}</p>
            </div>

            {/* Editor */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Number to Show</label>
                    <input
                        type="number"
                        value={data.showCount || 4}
                        onChange={(e) => update('showCount', parseInt(e.target.value) || 4)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        min={1}
                        max={20}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Layout</label>
                    <select
                        value={data.layout || 'grid'}
                        onChange={(e) => update('layout', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    >
                        <option value="grid">Grid</option>
                        <option value="carousel">Carousel</option>
                        <option value="list">List</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showAll"
                    checked={data.showAll || false}
                    onChange={(e) => update('showAll', e.target.checked)}
                    className="rounded"
                />
                <label htmlFor="showAll" className="text-sm text-slate-700">Show all doctors</label>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showBookBtn"
                    checked={data.showBookButton !== false}
                    onChange={(e) => update('showBookButton', e.target.checked)}
                    className="rounded"
                />
                <label htmlFor="showBookBtn" className="text-sm text-slate-700">Show "Book Appointment" button</label>
            </div>
        </div>
    );
}

// ==================== FAQ SECTION EDITOR ====================
export function FaqEditor({ data = {}, onChange }) {
    const faqs = data.faqs || [];
    const updateFaqs = (newFaqs) => onChange({ ...data, faqs: newFaqs });

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="space-y-2">
                {faqs.length > 0 ? faqs.map((faq, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-slate-200">
                        <p className="font-medium text-slate-800 text-sm">❓ {faq.question || 'Question?'}</p>
                        <p className="text-slate-500 text-xs mt-1">{faq.answer || 'Answer...'}</p>
                    </div>
                )) : (
                    <p className="text-center text-slate-400 text-sm py-4">Add FAQs below</p>
                )}
            </div>

            {/* Editor */}
            <ArrayEditor
                items={faqs}
                onChange={updateFaqs}
                addLabel="Add FAQ"
                emptyMessage="No FAQs added yet"
                renderItem={(faq, update) => (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={faq.question || ''}
                            onChange={(e) => update({ question: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="What is the question?"
                        />
                        <textarea
                            value={faq.answer || ''}
                            onChange={(e) => update({ answer: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                            placeholder="Write the answer here..."
                        />
                    </div>
                )}
            />
        </div>
    );
}

// ==================== CONTACT SECTION EDITOR ====================
export function ContactEditor({ data = {}, onChange }) {
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    📧
                </div>
                <div>
                    <p className="text-sm">
                        {data.showForm ? '✅ Contact Form' : '❌ No Form'}
                        {data.showInfo ? ' | ✅ Info Cards' : ' | ❌ No Info'}
                    </p>
                </div>
            </div>

            {/* Editor */}
            <div className="flex gap-6">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="showForm"
                        checked={data.showForm !== false}
                        onChange={(e) => update('showForm', e.target.checked)}
                        className="rounded"
                    />
                    <label htmlFor="showForm" className="text-sm text-slate-700">Show contact form</label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="showInfo"
                        checked={data.showInfo !== false}
                        onChange={(e) => update('showInfo', e.target.checked)}
                        className="rounded"
                    />
                    <label htmlFor="showInfo" className="text-sm text-slate-700">Show contact info cards</label>
                </div>
            </div>
        </div>
    );
}

// ==================== MAP SECTION EDITOR ====================
export function MapEditor({ data = {}, onChange }) {
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="bg-slate-100 rounded-xl h-40 flex items-center justify-center">
                {data.embedUrl ? (
                    <iframe
                        src={data.embedUrl}
                        className="w-full h-full rounded-xl"
                        loading="lazy"
                    />
                ) : (
                    <p className="text-slate-400">📍 Add Google Maps embed URL below</p>
                )}
            </div>

            {/* Editor */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps Embed URL</label>
                <input
                    type="text"
                    value={data.embedUrl || ''}
                    onChange={(e) => update('embedUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="https://www.google.com/maps/embed?..."
                />
                <p className="text-xs text-slate-400 mt-1">
                    Go to Google Maps → Share → Embed a map → Copy the src URL
                </p>
            </div>
        </div>
    );
}

// ==================== SECTION EDITOR SELECTOR ====================
export default function SectionEditor({ type, data, onChange }) {
    const editors = {
        hero: HeroEditor,
        content: ContentEditor,
        stats: StatsEditor,
        cards: CardsEditor,
        services: CardsEditor,
        testimonials: TestimonialsEditor,
        cta: CtaEditor,
        gallery: GalleryEditor,
        partners: PartnersEditor,
        doctors: DoctorsEditor,
        faq: FaqEditor,
        contact: ContactEditor,
        map: MapEditor,
        advertisement: AdvertisementEditor,
        network: NetworkEditor,
        partition: PartitionEditor,
        about: AboutEditor,
        technology: TechnologyEditor,
        blogs: BlogsEditor,
    };

    const Editor = editors[type];

    if (!Editor) {
        return (
            <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700 text-sm">
                No visual editor available for "{type}" section.
                <br />Please contact support to add this editor.
            </div>
        );
    }

    return <Editor data={data} onChange={onChange} />;
}

// ==================== ADVERTISEMENT EDITOR ====================
function AdvertisementEditor({ data = {}, onChange }) {
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-purple-700 text-sm font-medium">
                    🎯 Popup Advertisement - Shows once every {data.showFrequency || '1 hour'}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                    {data.enabled ? '✅ Enabled' : '❌ Disabled'}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="adEnabled"
                    checked={data.enabled !== false}
                    onChange={(e) => update('enabled', e.target.checked)}
                    className="rounded"
                />
                <label htmlFor="adEnabled" className="text-sm text-slate-700">Enable popup advertisement</label>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CTA Text</label>
                <input
                    type="text"
                    value={data.ctaText || ''}
                    onChange={(e) => update('ctaText', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Limited Time Offer. Visit us today!"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Show Frequency</label>
                <select
                    value={data.showFrequency || '1 hour'}
                    onChange={(e) => update('showFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                >
                    <option value="always">Every visit</option>
                    <option value="1 hour">Once per hour</option>
                    <option value="1 day">Once per day</option>
                    <option value="1 week">Once per week</option>
                </select>
            </div>

            <ImageUploader
                label="Advertisement Image"
                value={data.image}
                onChange={(url) => update('image', url)}
            />
        </div>
    );
}

// ==================== NETWORK EDITOR ====================
function NetworkEditor({ data = {}, onChange }) {
    const centers = data.centers || [];
    const updateCenters = (newCenters) => onChange({ ...data, centers: newCenters });
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
                {centers.map((c, i) => (
                    <div key={i} className="bg-slate-100 rounded-lg p-2 text-center text-sm font-medium">
                        📍 {c.city}
                    </div>
                ))}
            </div>

            <ArrayEditor
                items={centers}
                onChange={updateCenters}
                addLabel="Add Location"
                emptyMessage="No locations added"
                renderItem={(center, updateItem) => (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={center.city || ''}
                                onChange={(e) => updateItem({ city: e.target.value })}
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                placeholder="City Name"
                            />
                        </div>
                        <ImageUploader
                            label="Location Image"
                            value={center.img}
                            onChange={(url) => updateItem({ img: url })}
                            showPreview={true}
                        />
                    </div>
                )}
            />

            <div className="border-t pt-4 space-y-3">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CTA Title</label>
                    <input
                        type="text"
                        value={data.cta?.title || ''}
                        onChange={(e) => update('cta', { ...data.cta, title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="Can't find a center near you?"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CTA Subtitle</label>
                    <input
                        type="text"
                        value={data.cta?.subtitle || ''}
                        onChange={(e) => update('cta', { ...data.cta, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="Description text"
                    />
                </div>
            </div>
        </div>
    );
}

// ==================== PARTITION/DIVIDER EDITOR ====================
function PartitionEditor({ data = {}, onChange }) {
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center py-4">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full"></div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Divider Style</label>
                <select
                    value={data.style || 'gradient-line'}
                    onChange={(e) => update('style', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                >
                    <option value="gradient-line">Gradient Line with Dot</option>
                    <option value="simple">Simple Line</option>
                    <option value="dots">Dotted Line</option>
                </select>
            </div>
        </div>
    );
}

// ==================== ABOUT SECTION EDITOR ====================
function AboutEditor({ data = {}, onChange }) {
    const features = data.features || [];
    const updateFeatures = (newFeatures) => onChange({ ...data, features: newFeatures });
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                <input
                    type="text"
                    value={data.headline || ''}
                    onChange={(e) => update('headline', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Excellence in Vision Care"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                    value={data.description || ''}
                    onChange={(e) => update('description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                    placeholder="About description..."
                />
            </div>

            <div className="border-t pt-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Feature Cards ({features.length})</p>
                <ArrayEditor
                    items={features}
                    onChange={updateFeatures}
                    addLabel="Add Feature"
                    renderItem={(f, updateItem) => (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={f.title || ''}
                                onChange={(e) => updateItem({ title: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                placeholder="Feature Title"
                            />
                            <textarea
                                value={f.desc || ''}
                                onChange={(e) => updateItem({ desc: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                                placeholder="Short description"
                            />
                            <input
                                type="text"
                                value={f.link || ''}
                                onChange={(e) => updateItem({ link: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                placeholder="Link (e.g., /services/diagnostics)"
                            />
                            <ImageUploader
                                label="Feature Image"
                                value={f.img}
                                onChange={(url) => updateItem({ img: url })}
                            />
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

// ==================== TECHNOLOGY SECTION EDITOR ====================
function TechnologyEditor({ data = {}, onChange }) {
    const technologies = data.technologies || [];
    const updateTech = (newTech) => onChange({ ...data, technologies: newTech });
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                    <input
                        type="text"
                        value={data.tagline || ''}
                        onChange={(e) => update('tagline', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="Innovation"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                    <input
                        type="text"
                        value={data.headline || ''}
                        onChange={(e) => update('headline', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="World-Class Technology"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                    value={data.description || ''}
                    onChange={(e) => update('description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                />
            </div>

            <div className="border-t pt-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Technology Cards</p>
                <ArrayEditor
                    items={technologies}
                    onChange={updateTech}
                    addLabel="Add Technology"
                    renderItem={(t, updateItem) => (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={t.name || ''}
                                onChange={(e) => updateItem({ name: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                placeholder="Technology Name"
                            />
                            <textarea
                                value={t.desc || ''}
                                onChange={(e) => updateItem({ desc: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                                placeholder="Description"
                            />
                            <ImageUploader
                                label="Technology Image"
                                value={t.img}
                                onChange={(url) => updateItem({ img: url })}
                            />
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

// ==================== BLOGS SECTION EDITOR ====================
function BlogsEditor({ data = {}, onChange }) {
    const update = (key, value) => onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-slate-600">📝 Showing {data.showCount || 3} latest blog posts</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                    <input
                        type="text"
                        value={data.tagline || ''}
                        onChange={(e) => update('tagline', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="Our Blog"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                    <input
                        type="text"
                        value={data.headline || ''}
                        onChange={(e) => update('headline', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                        placeholder="Latest News & Insights"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Number of Posts to Show</label>
                <input
                    type="number"
                    value={data.showCount || 3}
                    onChange={(e) => update('showCount', parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    min={1}
                    max={10}
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showViewAll"
                    checked={data.showViewAll !== false}
                    onChange={(e) => update('showViewAll', e.target.checked)}
                    className="rounded"
                />
                <label htmlFor="showViewAll" className="text-sm text-slate-700">Show "View All Articles" link</label>
            </div>
        </div>
    );
}
