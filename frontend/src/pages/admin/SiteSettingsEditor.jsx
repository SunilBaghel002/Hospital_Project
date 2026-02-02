import { useState, useEffect } from 'react';
import {
    Save,
    Loader2,
    Building2,
    Phone,
    Mail,
    MapPin,
    Clock,
    Share2,
    AlertCircle,
    Check,
    Palette,
    Navigation,
    LayoutGrid,
    Trash2,
    Plus,
    GripVertical,
    Image
} from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader';
import { settingsAPI } from '../../services/adminApi';

export default function SiteSettingsEditor() {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const response = await settingsAPI.get();
            setSettings(response.data || {});
        } catch (err) {
            setError('Failed to load settings');
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
            await settingsAPI.update(settings);
            setSuccess('Settings saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to save settings');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const updateSetting = (path, value) => {
        setSettings(prev => {
            const newSettings = { ...prev };
            const keys = path.split('.');
            let current = newSettings;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newSettings;
        });
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Building2 },
        { id: 'navbar', label: 'Navbar', icon: Navigation },
        { id: 'footer', label: 'Footer', icon: LayoutGrid },
        { id: 'contact', label: 'Contact', icon: Phone },
        { id: 'social', label: 'Social', icon: Share2 },
        { id: 'whatsapp', label: 'WhatsApp', icon: Phone },
        { id: 'seo', label: 'SEO', icon: Palette },
    ];

    // Helper to add a new navbar item
    const addNavbarItem = () => {
        const items = settings.navbar?.items || [];
        updateSetting('navbar.items', [...items, { name: '', href: '', order: items.length }]);
    };

    const removeNavbarItem = (index) => {
        const items = settings.navbar?.items || [];
        updateSetting('navbar.items', items.filter((_, i) => i !== index));
    };

    const updateNavbarItem = (index, field, value) => {
        const items = [...(settings.navbar?.items || [])];
        items[index] = { ...items[index], [field]: value };
        updateSetting('navbar.items', items);
    };

    // Helper for footer quick links
    const addFooterLink = (section) => {
        const links = settings.footer?.[section] || [];
        updateSetting(`footer.${section}`, [...links, { name: '', href: '' }]);
    };

    const removeFooterLink = (section, index) => {
        const links = settings.footer?.[section] || [];
        updateSetting(`footer.${section}`, links.filter((_, i) => i !== index));
    };

    const updateFooterLink = (section, index, field, value) => {
        const links = [...(settings.footer?.[section] || [])];
        links[index] = { ...links[index], [field]: value };
        updateSetting(`footer.${section}`, links);
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
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Site Settings</h1>
                    <p className="text-slate-500">Manage your website's global settings</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl font-medium transition-colors"
                >
                    {isSaving ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <Save size={18} />
                    )}
                    Save Changes
                </button>
            </div>

            {/* Success/Error Messages */}
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

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'text-blue-600 border-b-2 border-blue-500'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                            <input
                                type="text"
                                value={settings.siteName || ''}
                                onChange={(e) => updateSetting('siteName', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="Your Site Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tagline</label>
                            <input
                                type="text"
                                value={settings.tagline || ''}
                                onChange={(e) => updateSetting('tagline', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="Your tagline here"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Footer Description</label>
                            <textarea
                                value={settings.footer?.description || ''}
                                onChange={(e) => updateSetting('footer.description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                                placeholder="Brief description for footer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Copyright Text</label>
                            <input
                                type="text"
                                value={settings.footer?.copyright || ''}
                                onChange={(e) => updateSetting('footer.copyright', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="© 2024 Your Company"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'navbar' && (
                    <div className="space-y-6">
                        {/* Logo Section */}
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Image size={18} /> Logo & Branding
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Site Name (Logo Text)</label>
                                    <input
                                        type="text"
                                        value={settings.navbar?.siteName || settings.siteName || ''}
                                        onChange={(e) => updateSetting('navbar.siteName', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="Romashka"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Logo Initial</label>
                                    <input
                                        type="text"
                                        value={settings.navbar?.logoInitial || 'V'}
                                        onChange={(e) => updateSetting('navbar.logoInitial', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="V"
                                        maxLength={2}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <ImageUploader
                                    label="Logo Image (optional - overrides initial)"
                                    value={settings.navbar?.logoImage}
                                    onChange={(url) => updateSetting('navbar.logoImage', url)}
                                />
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-slate-800 mb-4">CTA Button</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Button Text</label>
                                    <input
                                        type="text"
                                        value={settings.navbar?.ctaText || 'Book an Appointment'}
                                        onChange={(e) => updateSetting('navbar.ctaText', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="Book an Appointment"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Button Link</label>
                                    <input
                                        type="text"
                                        value={settings.navbar?.ctaLink || '/appointment'}
                                        onChange={(e) => updateSetting('navbar.ctaLink', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="/appointment"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-800">Menu Items</h3>
                                <button
                                    onClick={addNavbarItem}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                                >
                                    <Plus size={16} /> Add Item
                                </button>
                            </div>
                            <div className="space-y-3">
                                {(settings.navbar?.items || []).map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                                        <GripVertical size={18} className="text-slate-400 cursor-grab" />
                                        <input
                                            type="text"
                                            value={item.name || ''}
                                            onChange={(e) => updateNavbarItem(index, 'name', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                            placeholder="Link Name"
                                        />
                                        <input
                                            type="text"
                                            value={item.href || ''}
                                            onChange={(e) => updateNavbarItem(index, 'href', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                            placeholder="/link-path"
                                        />
                                        <button
                                            onClick={() => removeNavbarItem(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {(settings.navbar?.items || []).length === 0 && (
                                    <p className="text-slate-400 text-center py-8">No menu items. Click "Add Item" to create one.</p>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Note: Menu items are also managed via the Pages section. Items here will override.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'footer' && (
                    <div className="space-y-6">
                        {/* Footer Description & Copyright */}
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <h3 className="font-semibold text-slate-800 mb-4">Footer Content</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Footer Description</label>
                                    <textarea
                                        value={settings.footer?.description || ''}
                                        onChange={(e) => updateSetting('footer.description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none resize-none"
                                        placeholder="Brief description for footer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Copyright Text</label>
                                    <input
                                        type="text"
                                        value={settings.footer?.copyright || ''}
                                        onChange={(e) => updateSetting('footer.copyright', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="© 2024 Your Company"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-800">Quick Links</h3>
                                <button
                                    onClick={() => addFooterLink('quickLinks')}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                                >
                                    <Plus size={16} /> Add Link
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(settings.footer?.quickLinks || []).map((link, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                                        <input
                                            type="text"
                                            value={link.name || ''}
                                            onChange={(e) => updateFooterLink('quickLinks', index, 'name', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                            placeholder="Link Name"
                                        />
                                        <input
                                            type="text"
                                            value={link.href || ''}
                                            onChange={(e) => updateFooterLink('quickLinks', index, 'href', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                            placeholder="/link-path"
                                        />
                                        <button
                                            onClick={() => removeFooterLink('quickLinks', index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {(settings.footer?.quickLinks || []).length === 0 && (
                                    <p className="text-slate-400 text-center py-4 bg-slate-50 rounded-xl">No quick links. Click "Add Link" to create one.</p>
                                )}
                            </div>
                        </div>

                        {/* Services Links */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-800">Services Links</h3>
                                <button
                                    onClick={() => addFooterLink('servicesLinks')}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                                >
                                    <Plus size={16} /> Add Service
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(settings.footer?.servicesLinks || []).map((link, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                                        <input
                                            type="text"
                                            value={link.name || ''}
                                            onChange={(e) => updateFooterLink('servicesLinks', index, 'name', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                            placeholder="Service Name"
                                        />
                                        <input
                                            type="text"
                                            value={link.href || ''}
                                            onChange={(e) => updateFooterLink('servicesLinks', index, 'href', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                                            placeholder="/service-path"
                                        />
                                        <button
                                            onClick={() => removeFooterLink('servicesLinks', index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {(settings.footer?.servicesLinks || []).length === 0 && (
                                    <p className="text-slate-400 text-center py-4 bg-slate-50 rounded-xl">No services links. Click "Add Service" to create one.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <Phone size={16} className="inline mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={settings.contact?.phone || ''}
                                    onChange={(e) => updateSetting('contact.phone', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    placeholder="+91 XXX XXX XXXX"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Mail size={16} className="inline mr-2" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={settings.contact?.email || ''}
                                onChange={(e) => updateSetting('contact.email', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="contact@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <MapPin size={16} className="inline mr-2" />
                                Address
                            </label>
                            <textarea
                                value={settings.contact?.address || ''}
                                onChange={(e) => updateSetting('contact.address', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                                placeholder="Your full address"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Weekday Hours</label>
                                <input
                                    type="text"
                                    value={settings.contact?.workingHours?.weekdays || ''}
                                    onChange={(e) => updateSetting('contact.workingHours.weekdays', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    placeholder="9 AM - 6 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Saturday Hours</label>
                                <input
                                    type="text"
                                    value={settings.contact?.workingHours?.saturday || ''}
                                    onChange={(e) => updateSetting('contact.workingHours.saturday', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    placeholder="10 AM - 4 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Sunday Hours</label>
                                <input
                                    type="text"
                                    value={settings.contact?.workingHours?.sunday || ''}
                                    onChange={(e) => updateSetting('contact.workingHours.sunday', e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    placeholder="Closed"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Google Maps Embed URL</label>
                            <input
                                type="text"
                                value={settings.mapEmbedUrl || ''}
                                onChange={(e) => updateSetting('mapEmbedUrl', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="https://www.google.com/maps/embed?..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className="space-y-6">
                        {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
                            <div key={platform}>
                                <label className="block text-sm font-medium text-slate-700 mb-2 capitalize">{platform}</label>
                                <input
                                    type="url"
                                    value={settings.social?.[platform] || ''}
                                    onChange={(e) => updateSetting(`social.${platform}`, e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    placeholder={`https://${platform}.com/...`}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'whatsapp' && (
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-green-800">WhatsApp Quick Chat</h3>
                                    <p className="text-sm text-green-600">Configure the WhatsApp button shown on all pages</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.whatsapp?.enabled !== false}
                                    onChange={(e) => updateSetting('whatsapp.enabled', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                            <span className="text-sm font-medium text-slate-700">Enable WhatsApp Button</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp Number</label>
                            <div className="flex gap-2">
                                <span className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500">+</span>
                                <input
                                    type="text"
                                    value={settings.whatsapp?.number || ''}
                                    onChange={(e) => updateSetting('whatsapp.number', e.target.value.replace(/[^0-9]/g, ''))}
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                                    placeholder="919999999999 (country code + number, no spaces)"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Enter full number with country code (e.g., 919876543210 for India)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Default Message</label>
                            <textarea
                                value={settings.whatsapp?.defaultMessage || ''}
                                onChange={(e) => updateSetting('whatsapp.defaultMessage', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none resize-none"
                                placeholder="Hello! I would like to know more about your services."
                            />
                            <p className="text-xs text-slate-500 mt-1">This message will be pre-filled when users click the WhatsApp button</p>
                        </div>

                        {settings.whatsapp?.number && (
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-sm text-slate-600 mb-2">Preview link:</p>
                                <code className="text-xs text-green-600 break-all">
                                    https://wa.me/{settings.whatsapp.number}?text={encodeURIComponent(settings.whatsapp?.defaultMessage || '')}
                                </code>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Default Page Title</label>
                            <input
                                type="text"
                                value={settings.seo?.defaultTitle || ''}
                                onChange={(e) => updateSetting('seo.defaultTitle', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="Your Default Page Title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Default Meta Description</label>
                            <textarea
                                value={settings.seo?.defaultDescription || ''}
                                onChange={(e) => updateSetting('seo.defaultDescription', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                                placeholder="Brief description for search engines..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Keywords (comma-separated)</label>
                            <input
                                type="text"
                                value={settings.seo?.keywords || ''}
                                onChange={(e) => updateSetting('seo.keywords', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                placeholder="keyword1, keyword2, keyword3"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
