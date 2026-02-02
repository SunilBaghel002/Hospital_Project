import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function Advertisement({ data }) {
    const [isVisible, setIsVisible] = useState(false);

    // Extract data from props or defaults
    // Note: If data is provided, we use it. If not, we might hide or use fallback?
    // User requested "no hardcoded content", so ideally we should rely on data.
    // However, for stability, if data is missing, we simply won't show the ad or we return null.
    const adImage = data?.image;
    const adLink = data?.link;
    const showAd = data?.isVisible !== false; // Active by default unless explicitly disabled in data

    useEffect(() => {
        if (!adImage || !showAd || typeof window === 'undefined') return;

        const lastShown = localStorage.getItem('lastAdShown');
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour

        // Logic: Show if logic met
        if (!lastShown || now - parseInt(lastShown) > oneHour) {
            setIsVisible(true);
        }
    }, [adImage, showAd]);

    // Lock body scroll when ad is visible
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isVisible]);

    const handleClose = () => {
        setIsVisible(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem('lastAdShown', Date.now().toString());
        }
    };

    if (!isVisible || !adImage) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 shadow-md transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Link wrapper if link exists */}
                {adLink ? (
                    <a href={adLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <img src={adImage} alt="Special Offer" className="w-full h-auto object-cover" />
                    </a>
                ) : (
                    <div className="w-full">
                        <img src={adImage} alt="Special Offer" className="w-full h-auto object-cover" />
                    </div>
                )}

                {/* Optional: Call to Action below image if needed, or just the image */}
                <div className="bg-brand-blue p-4 text-center">
                    <p className="text-white text-sm font-medium">{data?.text || "Limited Time Offer. Visit us today!"}</p>
                </div>
            </div>
        </div>
    );
}
