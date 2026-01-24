import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, FileText, Search, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function BlogManager() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState(false);

    const emptyBlog = {
        title: '', slug: '', subtitle: '', content: '',
        author: { name: '', role: '' }, category: '',
        image: '', readTime: '5 min read', isPublished: false, tags: []
    };

    const [formData, setFormData] = useState(emptyBlog);

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/blogs/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setBlogs(await res.json());
        } catch (err) {
            console.error('Failed to fetch blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const url = editingBlog
                ? `${API_URL}/blogs/${editingBlog._id}`
                : `${API_URL}/blogs`;

            const dataToSend = {
                ...formData,
                slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            };

            const res = await fetch(url, {
                method: editingBlog ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (res.ok) {
                fetchBlogs();
                closeModal();
            } else {
                alert('Failed to save blog');
            }
        } catch (err) {
            alert('Error saving blog');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/blogs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchBlogs();
        } catch (err) {
            alert('Failed to delete blog');
        }
    };

    const togglePublish = async (blog) => {
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_URL}/blogs/${blog._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isPublished: !blog.isPublished })
            });
            fetchBlogs();
        } catch (err) {
            alert('Failed to update');
        }
    };

    const openModal = (blog = null) => {
        setEditingBlog(blog);
        setFormData(blog || emptyBlog);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBlog(null);
        setFormData(emptyBlog);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formDataUpload
            });
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image: data.url }));
            }
        } catch (err) {
            alert('Image upload failed');
        }
    };

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ['Innovation', 'Pediatrics', 'Emergency', 'Technology', 'Health Tips', 'Research'];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Blog Management</h1>
                    <p className="text-slate-500 mt-1">Create and manage blog articles</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                >
                    <Plus size={20} /> New Article
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-green-500 outline-none"
                />
            </div>

            {/* Blog List */}
            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading blogs...</div>
            ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">No blogs found. Write your first article!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBlogs.map((blog) => (
                        <div key={blog._id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-48 h-32 bg-slate-100 shrink-0">
                                    {blog.image ? (
                                        <img src={blog.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FileText size={32} className="text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">{blog.category}</span>
                                                <span className="text-slate-400 text-xs">{blog.readTime}</span>
                                                {blog.isPublished ? (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Published</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Draft</span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">{blog.title}</h3>
                                            <p className="text-slate-500 text-sm mt-1 line-clamp-1">{blog.subtitle}</p>
                                            <p className="text-slate-400 text-xs mt-2">By {blog.author?.name || 'Unknown'}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => togglePublish(blog)}
                                                className={`p-2 rounded-lg transition-colors ${blog.isPublished ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}
                                                title={blog.isPublished ? 'Unpublish' : 'Publish'}
                                            >
                                                {blog.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                            <button
                                                onClick={() => openModal(blog)}
                                                className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingBlog ? 'Edit Article' : 'New Article'}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Cover Image */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
                                <div className="h-48 rounded-xl bg-slate-100 overflow-hidden relative group">
                                    {formData.image ? (
                                        <img src={formData.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FileText size={48} className="text-slate-300" />
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="text-white" size={32} />
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Or paste image URL"
                                    value={formData.image}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                    className="w-full mt-2 px-4 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                            </div>

                            {/* Title & Slug */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-green-500 outline-none"
                                        placeholder="Article title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-green-500 outline-none"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-green-500 outline-none"
                                    placeholder="Brief description or subtitle"
                                />
                            </div>

                            {/* Author */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Author Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.author?.name || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, author: { ...prev.author, name: e.target.value } }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-green-500 outline-none"
                                        placeholder="Dr. John Smith"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Author Role</label>
                                    <input
                                        type="text"
                                        value={formData.author?.role || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, author: { ...prev.author, role: e.target.value } }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-green-500 outline-none"
                                        placeholder="Chief of Surgery"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Content *</label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                    rows={10}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-green-500 outline-none resize-none font-mono text-sm"
                                    placeholder="Write your article content here... (Supports HTML)"
                                />
                            </div>

                            {/* Publish Toggle */}
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                    className="w-5 h-5 rounded"
                                />
                                <label htmlFor="isPublished" className="text-slate-700 font-medium">Publish article (visible on website)</label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
