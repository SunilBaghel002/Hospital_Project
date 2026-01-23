import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
    Save,
    ArrowLeft,
    Loader2,
    Check,
    AlertCircle,
    Image,
    Plus,
    Trash2,
    Eye,
    EyeOff
} from 'lucide-react';
import { pagesAPI, sectionsAPI } from '../../services/adminApi';
import ImageUploader from '../../components/admin/ImageUploader';
import { doctors } from '../../data/doctors';

import ServiceLayout from '../../components/ServiceLayout';

export default function SubPageEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialType = searchParams.get('type') || 'sub';
    const isNew = !id;

    // Page state
    const [page, setPage] = useState({
        title: '',
        slug: '',
        type: initialType,
        isPublished: false,
        navbarOrder: 0,
        showInNavbar: initialType === 'main',
        parentPage: null
    });

    // Content state - mapped to specific sections
    const [content, setContent] = useState({
        // Hero Section
        heroTitle: '',
        heroSubtitle: '',
        heroTagline: '',
        heroImage: '',

        // Overview Section
        overviewTitle: 'Overview',
        overviewText: '', // Bold intro text
        shortDesc: '',    // Overlay on image
        longDesc: '',     // HTML content (Quill)
        overviewImage: '',

        // Scope Section
        scopeTitle: 'Scope of Services',
        scopePoints: [], // { title, desc }
        scopeImage: '',

        // Experts Section
        doctorRoleKeyword: '',
        selectedDoctorIds: []
    });

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newPoint, setNewPoint] = useState({ title: '', desc: '' });
    const [showPreview, setShowPreview] = useState(true); // Default to showing preview

    // Fetch existing data
    useEffect(() => {
        if (!isNew && id) {
            fetchPageData();
        }
    }, [id, isNew]);

    const fetchPageData = async () => {
        setIsLoading(true);
        try {
            const res = await pagesAPI.getOne(id);
            if (res.success) {
                setPage(res.data);

                // Map sections back to flat content state
                const sections = res.data.sections || [];
                const newContent = { ...content }; // Start with defaults

                sections.forEach(s => {
                    if (s.type === 'hero') {
                        newContent.heroTitle = s.data.title;
                        newContent.heroSubtitle = s.data.subtitle;
                        newContent.heroTagline = s.data.tagline;
                        newContent.heroImage = s.data.backgroundImage;
                    } else if (s.type === 'service_overview') {
                        newContent.overviewTitle = s.data.title;
                        newContent.overviewText = s.data.overviewText;
                        newContent.shortDesc = s.data.shortDesc;
                        newContent.longDesc = s.data.longDesc;
                        newContent.overviewImage = s.data.image;
                    } else if (s.type === 'service_scope') {
                        newContent.scopeTitle = s.data.title;
                        newContent.scopePoints = s.data.points || [];
                        newContent.scopeImage = s.data.image;
                        newContent.scopeImage = s.data.image;
                    } else if (s.type === 'service_experts') {
                        newContent.doctorRoleKeyword = s.data.roleKeyword;
                        newContent.selectedDoctorIds = s.data.selectedDoctorIds || []; // Load IDs
                    }
                });

                setContent(newContent);
            }
        } catch (err) {
            setError('Failed to load page data');
        } finally {
            setIsLoading(false);
        }
    };

    // GENERATE PREVIEW DATA
    const previewData = {
        title: page.title,
        sections: [
            {
                type: 'hero',
                data: {
                    title: content.heroTitle || 'Your Hero Title',
                    subtitle: content.heroSubtitle || 'Subtitle goes here',
                    tagline: content.heroTagline || 'Tagline',
                    backgroundImage: content.heroImage,
                    ctaText: 'Book Appointment',
                }
            },
            {
                type: 'service_overview',
                data: {
                    title: content.overviewTitle,
                    overviewText: content.overviewText || 'Overview text will appear here.',
                    shortDesc: content.shortDesc,
                    longDesc: content.longDesc || '<p>Detailed description...</p>',
                    image: content.overviewImage
                }
            },
            {
                type: 'service_scope',
                data: {
                    title: content.scopeTitle,
                    points: content.scopePoints,
                    image: content.scopeImage
                }
            },
            {
                type: 'service_experts',
                data: {
                    roleKeyword: content.doctorRoleKeyword,
                    selectedDoctorIds: content.selectedDoctorIds, // Preview IDs
                    title: 'Meet Our Experts'
                }
            },
            {
                type: 'cta',
                data: {
                    title: 'Ready to restore your vision?',
                    subtitle: 'Take the first step towards a clearer tomorrow.',
                    buttonText: 'Book Appointment',
                }
            }
        ]
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            let pageId = id;

            // 1. Create or Update Page
            const pageData = {
                ...page,
                // Type is already in state
                showInNavbar: page.type === 'main' // Ensure consistency
            };

            if (isNew) {
                const res = await pagesAPI.create(pageData);
                if (res.success) {
                    pageId = res.data._id;
                }
            } else {
                await pagesAPI.update(id, pageData);
            }

            // 2. Manage Sections (Upsert based on type)
            const existingSections = isNew ? [] : (await pagesAPI.getOne(pageId)).data.sections || [];
            const getSectionId = (type) => existingSections.find(s => s.type === type)?._id;

            const upsertSection = async (type, title, data, order) => {
                const sectionId = getSectionId(type);
                const sectionData = {
                    pageId,
                    type,
                    title,
                    isVisible: true,
                    order,
                    data
                };

                if (sectionId) {
                    await sectionsAPI.update(sectionId, sectionData);
                } else {
                    await sectionsAPI.create(sectionData);
                }
            };

            await upsertSection('hero', 'Hero Section', previewData.sections[0].data, 0);
            await upsertSection('service_overview', 'Overview', previewData.sections[1].data, 1);
            await upsertSection('service_scope', 'Scope of Services', previewData.sections[2].data, 2);
            await upsertSection('service_experts', 'Experts', previewData.sections[3].data, 3);
            await upsertSection('cta', 'Final CTA', { ...previewData.sections[4].data, link: '/appointment' }, 4);

            setSuccess('Page saved successfully!');
            if (isNew) {
                navigate(`/admin/subpages/edit/${pageId}${page.type === 'main' ? '?type=main' : ''}`);
            }

        } catch (err) {
            setError(err.message || 'Failed to save page');
        } finally {
            setIsSaving(false);
        }
    };

    const addScopePoint = () => {
        if (newPoint.title && newPoint.desc) {
            setContent({
                ...content,
                scopePoints: [...content.scopePoints, newPoint]
            });
            setNewPoint({ title: '', desc: '' });
        }
    };

    const removeScopePoint = (index) => {
        const newPoints = [...content.scopePoints];
        newPoints.splice(index, 1);
        setContent({ ...content, scopePoints: newPoints });
    };

    if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* LEFT: Editor Scrollable */}
            <div className={`flex-1 overflow-y-auto bg-slate-50 p-6 ${showPreview ? 'w-1/2' : 'w-full'}`}>
                <div className="max-w-3xl mx-auto space-y-6 pb-20">
                    {/* Header */}
                    <div className="flex items-center justify-between sticky top-0 bg-slate-50 z-20 py-2">
                        <div className="flex items-center gap-4">
                            <Link to={page.type === 'main' ? '/admin/pages' : '/admin/subpages'} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">
                                    {isNew ? 'Create Page' : `Edit ${page.title}`}
                                </h1>
                                <p className="text-xs text-slate-500">{page.type === 'main' ? 'Main Navbar Page' : 'Sub/Service Page'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="hidden lg:flex px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 items-center gap-2 text-sm font-medium"
                            >
                                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                                {showPreview ? 'Hide Preview' : 'Show Live Preview'}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Notifications */}
                    {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2"><AlertCircle /> {error}</div>}
                    {success && <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2"><Check /> {success}</div>}

                    {/* 1. Page Settings */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</span>
                            Page Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Page Title</label>
                                <input
                                    type="text"
                                    value={page.title}
                                    onChange={(e) => setPage({ ...page, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="e.g. Cataract Surgery"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                                <div className="flex items-center">
                                    <span className="text-slate-400 mr-1">/</span>
                                    <input
                                        type="text"
                                        value={page.slug}
                                        onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                        placeholder="cataract-surgery"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Page Type</label>
                                <select
                                    value={page.type}
                                    onChange={(e) => setPage({ ...page, type: e.target.value, showInNavbar: e.target.value === 'main' })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                >
                                    <option value="sub">Sub Page (Hidden/Service)</option>
                                    <option value="main">Main Page (Navbar)</option>
                                </select>
                                {page.type === 'main' && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={page.showInNavbar}
                                            onChange={(e) => setPage({ ...page, showInNavbar: e.target.checked })}
                                            id="showInNavbar"
                                            className="rounded border-slate-300"
                                        />
                                        <label htmlFor="showInNavbar" className="text-sm text-slate-700">Show in Navbar</label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Hero Section */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">2</span>
                            Hero / Banner
                        </h2>
                        <div className="grid gap-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
                                    <input
                                        type="text"
                                        value={content.heroTitle}
                                        onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Main heading on banner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                                    <input
                                        type="text"
                                        value={content.heroSubtitle}
                                        onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Lighter text next to title"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                                <input
                                    type="text"
                                    value={content.heroTagline}
                                    onChange={(e) => setContent({ ...content, heroTagline: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Small descriptive text"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hero Background Image</label>
                                <ImageUploader
                                    value={content.heroImage}
                                    onChange={(url) => setContent({ ...content, heroImage: url })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Overview Section */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">3</span>
                            Overview Content
                        </h2>
                        <div className="grid gap-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={content.overviewTitle}
                                        onChange={(e) => setContent({ ...content, overviewTitle: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Intro Text (Bold)</label>
                                    <input
                                        type="text"
                                        value={content.overviewText}
                                        onChange={(e) => setContent({ ...content, overviewText: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Key value proposition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description (Rich Text)</label>
                                <div className="bg-white rounded-lg border border-slate-200">
                                    <ReactQuill
                                        theme="snow"
                                        value={content.longDesc}
                                        onChange={(val) => setContent({ ...content, longDesc: val })}
                                        className="h-48 mb-12"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mt-8">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Side Image</label>
                                    <ImageUploader
                                        value={content.overviewImage}
                                        onChange={(url) => setContent({ ...content, overviewImage: url })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Image Overlay Text</label>
                                    <textarea
                                        value={content.shortDesc}
                                        onChange={(e) => setContent({ ...content, shortDesc: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border rounded-lg resize-none"
                                        placeholder="Short quote or description shown on top of the image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Scope of Services */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">4</span>
                            Services List
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Side Image</label>
                                    <ImageUploader
                                        value={content.scopeImage}
                                        onChange={(url) => setContent({ ...content, scopeImage: url })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={content.scopeTitle}
                                        onChange={(e) => setContent({ ...content, scopeTitle: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl">
                                <h3 className="text-sm font-bold text-slate-700 mb-3">Service Points</h3>

                                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                                    {content.scopePoints.map((point, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group">
                                            <button
                                                onClick={() => removeScopePoint(idx)}
                                                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <p className="font-bold text-slate-800">{point.title}</p>
                                            <p className="text-sm text-slate-500">{point.desc}</p>
                                        </div>
                                    ))}
                                    {content.scopePoints.length === 0 && <p className="text-slate-400 text-sm text-center italic">No points added yet</p>}
                                </div>

                                <div className="border-t border-slate-200 pt-3">
                                    <input
                                        type="text"
                                        placeholder="Point Title (e.g. Advanced Diagnostics)"
                                        value={newPoint.title}
                                        onChange={(e) => setNewPoint({ ...newPoint, title: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg mb-2 text-sm"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={newPoint.desc}
                                        onChange={(e) => setNewPoint({ ...newPoint, desc: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg mb-2 text-sm resize-none"
                                        rows={2}
                                    />
                                    <button
                                        onClick={addScopePoint}
                                        className="w-full py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-medium text-sm flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Add Point
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Experts */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">5</span>
                            Expert Filtering
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Doctors to Show</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border border-slate-200 rounded-lg">
                                    {doctors.map(doc => (
                                        <div
                                            key={doc.id}
                                            onClick={() => {
                                                const current = content.selectedDoctorIds || [];
                                                const exists = current.includes(doc.id);
                                                const newIds = exists ? current.filter(id => id !== doc.id) : [...current, doc.id];
                                                setContent({ ...content, selectedDoctorIds: newIds });
                                            }}
                                            className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${(content.selectedDoctorIds || []).includes(doc.id)
                                                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                                                    : 'hover:bg-slate-50 border-slate-200'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${(content.selectedDoctorIds || []).includes(doc.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                                                }`}>
                                                {(content.selectedDoctorIds || []).includes(doc.id) && <Check size={14} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800 text-sm">{doc.name}</p>
                                                <p className="text-xs text-slate-500">{doc.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    {(content.selectedDoctorIds || []).length} doctors selected. (Clear selection to use role filtering)
                                </p>
                            </div>

                            {(content.selectedDoctorIds || []).length === 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Or Filter by Role Keyword</label>
                                    <input
                                        type="text"
                                        value={content.doctorRoleKeyword}
                                        onChange={(e) => setContent({ ...content, doctorRoleKeyword: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="e.g. Surgeon, Cornea, Retina"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Leave empty to show all or specific keyword to filter relevant specialists.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-8"></div>
                </div>
            </div>

            {/* RIGHT: Live Preview */}
            {showPreview && (
                <div className="hidden lg:block w-1/2 border-l border-slate-200 bg-white overflow-hidden relative shadow-2xl">
                    <div className="absolute top-4 right-4 z-50 bg-black/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                        Live Preview
                    </div>
                    <div className="h-full overflow-y-auto transform scale-[0.85] origin-top p-4 h-[115%]">
                        <div className="bg-white shadow-2xl rounded-b-xl min-h-screen pointer-events-none select-none">
                            {/* Mock Navigation for Preview */}
                            <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
                                <div className="font-bold text-2xl text-brand-blue">Hospital</div>
                                <div className="flex gap-6 text-sm font-medium text-gray-600">
                                    <span>Home</span>
                                    <span>About</span>
                                    <span className="text-brand-blue">Services</span>
                                    <span>Contact</span>
                                </div>
                            </div>
                            <ServiceLayout data={previewData} onBook={() => { }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
