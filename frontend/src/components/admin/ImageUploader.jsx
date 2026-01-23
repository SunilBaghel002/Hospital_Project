import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Film, Trash2 } from 'lucide-react';
import { uploadAPI } from '../../services/adminApi';

export default function ImageUploader({
    value,
    onChange,
    label = 'Image',
    accept = 'image/*',
    showPreview = true
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError('');

        try {
            const response = await uploadAPI.upload(file);
            if (response.success) {
                onChange(response.data.url);
            }
        } catch (err) {
            setError('Upload failed. Please try again.');
            console.error(err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">{label}</label>

            {value && showPreview ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-2 bg-white rounded-lg text-sm font-medium hover:bg-slate-100"
                        >
                            Change
                        </button>
                        <button
                            onClick={handleRemove}
                            className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50/50 ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                            <span className="text-sm text-slate-500">Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
                                <ImageIcon className="text-blue-500" size={24} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Click to upload</span>
                            <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</span>
                        </div>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleUpload}
                className="hidden"
            />

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
