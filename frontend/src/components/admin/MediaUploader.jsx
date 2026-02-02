import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Film, Trash2, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

export default function MediaUploader({
    value,
    onChange,
    label = 'Media',
    type = 'image', // 'image' or 'video'
    showPreview = true
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const accept = type === 'video' 
        ? 'video/mp4,video/webm,video/ogg,video/quicktime' 
        : 'image/*';

    const getToken = () => localStorage.getItem('adminToken');

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (100MB for video, 10MB for image)
        const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setError(`File too large. Max size: ${type === 'video' ? '100MB' : '10MB'}`);
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError('');

        try {
            const token = getToken();
            const formData = new FormData();
            formData.append('file', file);

            // Use XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();
            
            const uploadPromise = new Promise((resolve, reject) => {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(progress);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            if (response.success) {
                                resolve(response.data.url);
                            } else {
                                reject(new Error(response.message || 'Upload failed'));
                            }
                        } catch (e) {
                            reject(new Error('Invalid response from server'));
                        }
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error during upload'));
                });

                xhr.addEventListener('abort', () => {
                    reject(new Error('Upload cancelled'));
                });

                xhr.open('POST', `${API_BASE}/upload`);
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                xhr.send(formData);
            });

            const url = await uploadPromise;
            onChange(url);
            setUploadProgress(100);
            
            // Brief delay to show completion
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);

        } catch (err) {
            setError(err.message || 'Upload failed. Please try again.');
            console.error(err);
            setIsUploading(false);
            setUploadProgress(0);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    const isVideo = type === 'video' || (value && /\.(mp4|webm|ogg|mov)$/i.test(value));
    const Icon = type === 'video' ? Film : ImageIcon;

    return (
        <>
            {/* Upload Progress Overlay */}
            {isUploading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                                {uploadProgress === 100 ? (
                                    <CheckCircle className="text-green-500" size={32} />
                                ) : (
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                )}
                            </div>
                            
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                {uploadProgress === 100 ? 'Upload Complete!' : `Uploading ${type === 'video' ? 'Video' : 'Image'}...`}
                            </h3>
                            
                            <p className="text-sm text-slate-500 mb-4">
                                {uploadProgress === 100 
                                    ? 'Your file has been uploaded successfully.' 
                                    : 'Please wait while your file is being uploaded.'}
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            
                            <p className="text-sm font-medium text-blue-600">{uploadProgress}%</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Component */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">{label}</label>

                {value && showPreview ? (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        {isVideo ? (
                            <video
                                src={value}
                                className="w-full h-40 object-cover"
                                controls
                            />
                        ) : (
                            <img
                                src={value}
                                alt="Preview"
                                className="w-full h-40 object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-2 bg-white rounded-lg text-sm font-medium hover:bg-slate-100"
                            >
                                Change
                            </button>
                            <button
                                type="button"
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
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
                                <Icon className="text-blue-500" size={24} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Click to upload {type}</span>
                            <span className="text-xs text-slate-400 mt-1">
                                {type === 'video' 
                                    ? 'MP4, WebM, MOV up to 100MB' 
                                    : 'PNG, JPG, WEBP up to 10MB'}
                            </span>
                        </div>
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
        </>
    );
}
