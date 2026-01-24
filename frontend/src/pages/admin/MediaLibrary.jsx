import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import {
    Upload,
    Trash2,
    Image as ImageIcon,
    Loader2,
    Search,
    Grid,
    List,
    Copy,
    Check,
    X,
    AlertCircle,
    FileImage
} from 'lucide-react';
import { uploadAPI } from '../../services/adminApi';

export default function MediaLibrary() {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const response = await uploadAPI.list();
            setFiles(response.data || []);
        } catch (err) {
            setError('Failed to load media files');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        setError('');

        try {
            for (const file of selectedFiles) {
                const response = await uploadAPI.upload(file);
                if (response.success) {
                    setFiles(prev => [response.data, ...prev]);
                }
            }
        } catch (err) {
            setError('Failed to upload file(s)');
            console.error(err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (filename) => {
        try {
            await uploadAPI.delete(filename);
            setFiles(files.filter(f => f.filename !== filename));
            setDeleteConfirm(null);
        } catch (err) {
            setError('Failed to delete file');
            console.error(err);
        }
    };

    const copyToClipboard = (url) => {
        const fullUrl = uploadAPI.getUrl(url.replace('/uploads/', ''));
        navigator.clipboard.writeText(fullUrl);
        setCopied(url);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const filteredFiles = files.filter(file =>
        file?.filename?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

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
                    <h1 className="text-2xl font-bold text-slate-800">Media Library</h1>
                    <p className="text-slate-500">Upload and manage your images</p>
                </div>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl font-medium transition-colors"
                    >
                        {isUploading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Upload size={18} />
                        )}
                        Upload Image
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="ml-auto">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Search & View Mode */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-3 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-3 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Files Display */}
            {filteredFiles.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredFiles.map((file) => (
                            <div
                                key={file.filename}
                                className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:shadow-lg transition-all"
                            >
                                <div className="aspect-square bg-slate-100 relative">
                                    <img
                                        src={uploadAPI.getUrl(file.filename)}
                                        alt={file.filename}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="hidden absolute inset-0 items-center justify-center">
                                        <FileImage className="text-slate-300" size={32} />
                                    </div>

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => copyToClipboard(file.url)}
                                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                                            title="Copy URL"
                                        >
                                            {copied === file.url ? <Check size={18} /> : <Copy size={18} />}
                                        </button>
                                        {deleteConfirm === file.filename ? (
                                            <>
                                                <button
                                                    onClick={() => handleDelete(file.filename)}
                                                    className="p-2 rounded-lg bg-red-500 text-white"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="p-2 rounded-lg bg-white/20 text-white"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(file.filename)}
                                                className="p-2 rounded-lg bg-white/20 hover:bg-red-500/80 text-white"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="p-2">
                                    <p className="text-xs text-slate-600 truncate">{file.filename}</p>
                                    <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                        {filteredFiles.map((file) => (
                            <div
                                key={file.filename}
                                className="px-4 py-3 flex items-center gap-4 hover:bg-slate-50"
                            >
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                    <img
                                        src={uploadAPI.getUrl(file.filename)}
                                        alt={file.filename}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-700 truncate">{file.filename}</p>
                                    <p className="text-sm text-slate-400">{formatFileSize(file.size)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => copyToClipboard(file.url)}
                                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-500"
                                    >
                                        {copied === file.url ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.filename)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No media files</h3>
                    <p className="text-slate-500 mb-4">Upload your first image to get started.</p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium"
                    >
                        <Upload size={18} />
                        Upload Image
                    </button>
                </div>
            )}
        </div>
    );
}
