import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Save,
    ArrowLeft,
    Loader2,
    Eye,
    EyeOff,
    Plus,
    Trash2,
    GripVertical,
    Settings,
    Image,
    Type,
    Layout,
    Users,
    MessageSquare,
    Sparkles,
    AlertCircle,
    Check,
    ChevronDown,
    ChevronUp,
    Megaphone,
    MapPin,
    Minus,
    Info,
    Cpu,
    BookOpen
} from 'lucide-react';
import { pagesAPI, sectionsAPI } from '../../services/adminApi';
import SectionEditor from './SectionEditor';

const SECTION_TYPES = [
    { type: 'hero', label: 'Hero Banner', icon: Sparkles },
    { type: 'content', label: 'Content Block', icon: Type },
    { type: 'cards', label: 'Cards Grid', icon: Layout },
    { type: 'services', label: 'Services Grid', icon: Layout },
    { type: 'doctors', label: 'Doctors List', icon: Users },
    { type: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { type: 'gallery', label: 'Image Gallery', icon: Image },
    { type: 'cta', label: 'Call to Action', icon: Sparkles },
    { type: 'stats', label: 'Statistics', icon: Layout },
    { type: 'faq', label: 'FAQ Section', icon: MessageSquare },
    { type: 'partners', label: 'Partners/Logos', icon: Image },
    { type: 'contact', label: 'Contact Form', icon: MessageSquare },
    { type: 'map', label: 'Map Embed', icon: Layout },
    { type: 'advertisement', label: 'Popup Ad', icon: Megaphone },
    { type: 'network', label: 'Network Locations', icon: MapPin },
    { type: 'partition', label: 'Divider', icon: Minus },
    { type: 'about', label: 'About Section', icon: Info },
    { type: 'technology', label: 'Technology', icon: Cpu },
    { type: 'blogs', label: 'Latest Blogs', icon: BookOpen },
    { type: 'custom', label: 'Custom HTML', icon: Settings },
];

export default function PageEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id; // id is undefined for /pages/new route

    const [page, setPage] = useState({
        title: '',
        slug: '',
        type: 'main',
        navbarOrder: 0,
        isPublished: false,
        showInNavbar: true,
        metaTitle: '',
        metaDescription: '',
        icon: '',
        hero: {
            title: '',
            subtitle: '',
            tagline: '',
            image: ''
        }
    });

    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeSection, setActiveSection] = useState(null);
    const [showAddSection, setShowAddSection] = useState(false);

    useEffect(() => {
        if (!isNew && id) {
            fetchPage();
        }
    }, [id, isNew]);

    const fetchPage = async () => {
        setIsLoading(true);
        try {
            const response = await pagesAPI.getOne(id);
            if (response.success) {
                setPage(response.data);
                setSections(response.data.sections || []);
            }
        } catch (err) {
            setError('Failed to load page');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            if (isNew) {
                const response = await pagesAPI.create(page);
                if (response.success) {
                    setSuccess('Page created successfully!');
                    navigate(`/admin/pages/edit/${response.data._id}`);
                }
            } else {
                // 1. Update Page Metadata
                await pagesAPI.update(id, page);

                // 2. Update All Sections (Parallel)
                // We map over sections and update them.
                // Note: Only updating existing sections. New sections are created via handleAddSection immediately (which is fine, or we could defer that too).
                // For now, we assume sections exist in DB because handleAddSection creates them.
                const sectionUpdates = sections.map(section =>
                    sectionsAPI.update(section._id, {
                        title: section.title,
                        subtitle: section.subtitle,
                        data: section.data,
                        isVisible: section.isVisible
                    })
                );

                await Promise.all(sectionUpdates);

                setSuccess('Page and sections saved successfully!');
            }
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to save page');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddSection = async (type) => {
        try {
            const response = await sectionsAPI.create({
                pageId: id,
                type,
                title: `New ${type} section`,
                data: {},
                isVisible: true
            });

            if (response.success) {
                setSections([...sections, response.data]);
                setActiveSection(response.data._id);
                setShowAddSection(false);
            }
        } catch (err) {
            setError('Failed to add section');
        }
    };

    // LOCAL UPDATE ONLY - Fixes typing lag
    const handleUpdateSection = (sectionId, updates) => {
        setSections(prevSections => prevSections.map(s =>
            s._id === sectionId ? { ...s, ...updates } : s
        ));
    };

    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm("Are you sure you want to delete this section?")) return;
        try {
            await sectionsAPI.delete(sectionId);
            setSections(sections.filter(s => s._id !== sectionId));
        } catch (err) {
            setError('Failed to delete section');
        }
    };

    const handleToggleSectionVisibility = async (sectionId) => {
        try {
            const response = await sectionsAPI.toggleVisibility(sectionId);
            if (response.success) {
                setSections(sections.map(s =>
                    s._id === sectionId ? { ...s, isVisible: response.data.isVisible } : s
                ));
            }
        } catch (err) {
            setError('Failed to toggle visibility');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/pages"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isNew ? 'Create New Page' : `Edit: ${page.title}`}
                        </h1>
                        {!isNew && <p className="text-slate-500">/{page.slug}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setPage({ ...page, isPublished: !page.isPublished })}
                        className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${page.isPublished
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                    >
                        {page.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                        {page.isPublished ? 'Published' : 'Draft'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl font-medium flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
                    <Check size={20} />
                    <span>{success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Page Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="font-semibold text-slate-800 mb-4">Page Settings</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={page.title}
                                    onChange={(e) => setPage({ ...page, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Page Title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                                <div className="flex items-center">
                                    <span className="text-slate-400 text-sm mr-1">/</span>
                                    <input
                                        type="text"
                                        value={page.slug}
                                        onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="page-slug"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Page Type</label>
                                <select
                                    value={page.type}
                                    onChange={(e) => setPage({ ...page, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                >
                                    <option value="main">Main Page (Navbar)</option>
                                    <option value="sub">Sub Page</option>
                                </select>
                            </div>

                            {page.type === 'main' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Navbar Order</label>
                                    <input
                                        type="number"
                                        value={page.navbarOrder}
                                        onChange={(e) => setPage({ ...page, navbarOrder: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="showInNavbar"
                                    checked={page.showInNavbar}
                                    onChange={(e) => setPage({ ...page, showInNavbar: e.target.checked })}
                                    className="rounded border-slate-300"
                                />
                                <label htmlFor="showInNavbar" className="text-sm text-slate-700">Show in Navbar</label>
                            </div>
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="font-semibold text-slate-800 mb-4">SEO</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                                <input
                                    type="text"
                                    value={page.metaTitle || ''}
                                    onChange={(e) => setPage({ ...page, metaTitle: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="SEO Title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                                <textarea
                                    value={page.metaDescription || ''}
                                    onChange={(e) => setPage({ ...page, metaDescription: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="SEO Description"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-800">Page Sections</h2>
                            {!isNew && (
                                <button
                                    onClick={() => setShowAddSection(!showAddSection)}
                                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-1"
                                >
                                    <Plus size={16} />
                                    Add Section
                                </button>
                            )}
                        </div>

                        {/* Add Section Dialog */}
                        {showAddSection && (
                            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                                <p className="text-sm text-blue-800 mb-3">Choose a section type:</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {SECTION_TYPES.map((sectionType) => (
                                        <button
                                            key={sectionType.type}
                                            onClick={() => handleAddSection(sectionType.type)}
                                            className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all text-left"
                                        >
                                            <sectionType.icon size={18} className="text-blue-500 mb-1" />
                                            <span className="text-sm font-medium text-slate-700">{sectionType.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isNew ? (
                            <div className="px-6 py-12 text-center text-slate-500">
                                <Layout className="mx-auto mb-3 text-slate-300" size={48} />
                                <p>Save the page first to add sections</p>
                            </div>
                        ) : sections.length > 0 ? (
                            <div className="space-y-4 px-4 pb-4">
                                {sections.map((section, index) => (
                                    <div
                                        key={section._id}
                                        className={`rounded-xl border transition-all duration-200 ${activeSection === section._id
                                            ? 'border-blue-200 shadow-lg bg-white ring-1 ring-blue-100'
                                            : 'border-slate-200 shadow-sm bg-white hover:border-blue-300'
                                            } ${!section.isVisible ? 'opacity-70 bg-slate-50' : ''}`}
                                    >
                                        <div
                                            className={`px-4 py-3 flex items-center justify-between cursor-pointer rounded-t-xl ${activeSection === section._id ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                                                }`}
                                            onClick={() => setActiveSection(activeSection === section._id ? null : section._id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="cursor-move p-1 text-slate-400 hover:text-slate-600">
                                                    <GripVertical size={20} />
                                                </div>
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeSection === section._id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {(() => {
                                                        const TypeIcon = SECTION_TYPES.find(t => t.type === section.type)?.icon || Layout;
                                                        return <TypeIcon size={16} />;
                                                    })()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-slate-800 text-sm">{section.title || `Section ${index + 1}`}</h3>
                                                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium uppercase tracking-wide border border-slate-200">
                                                            {section.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleToggleSectionVisibility(section._id)}
                                                    className={`p-2 rounded-lg transition-colors ${section.isVisible ? 'text-slate-400 hover:text-blue-600 hover:bg-blue-50' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'}`}
                                                    title={section.isVisible ? "Hide Section" : "Show Section"}
                                                >
                                                    {section.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSection(section._id)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Delete Section"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                                <button
                                                    onClick={() => setActiveSection(activeSection === section._id ? null : section._id)}
                                                    className={`p-2 rounded-lg transition-colors ${activeSection === section._id ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {activeSection === section._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Section Editor (Expanded) */}
                                        {activeSection === section._id && (
                                            <div className="p-4 border-t border-blue-100/50 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Section Title (Internal)</label>
                                                        <input
                                                            type="text"
                                                            value={section.title || ''}
                                                            onChange={(e) => handleUpdateSection(section._id, { title: e.target.value })}
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                                                            placeholder="e.g. Hero Banner"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subtitle (Optional)</label>
                                                        <input
                                                            type="text"
                                                            value={section.subtitle || ''}
                                                            onChange={(e) => handleUpdateSection(section._id, { subtitle: e.target.value })}
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                                                            placeholder="Detailed description"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Visual Section Editor */}
                                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 shadow-inner">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                            <Sparkles size={14} className="text-blue-500" />
                                                            Content Editor
                                                        </h4>
                                                        <span className="text-xs text-slate-400">Live Changes</span>
                                                    </div>
                                                    <SectionEditor
                                                        type={section.type}
                                                        data={section.data || {}}
                                                        onChange={(newData) => handleUpdateSection(section._id, { data: newData })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center text-slate-500">
                                <Layout className="mx-auto mb-3 text-slate-300" size={48} />
                                <p>No sections yet. Click "Add Section" to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
