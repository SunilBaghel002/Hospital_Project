import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function ErrorModal({ isOpen, onClose, title = 'Error', message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="bg-red-50 px-6 py-4 flex items-center gap-3 border-b border-red-100">
                    <div className="p-2 bg-red-100 rounded-full text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-red-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {message || 'An unexpected error occurred. Please try again.'}
                    </p>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow"
                    >
                        Okay, got it
                    </button>
                </div>
            </div>
        </div>
    );
}
