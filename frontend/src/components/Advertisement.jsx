import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import adv1 from '../assets/Offer-1.jpeg';
import adv2 from '../assets/Offer-2.jpeg';
import adv3 from '../assets/Offer-3.jpeg';

export default function Advertisement() {
    const [isVisible, setIsVisible] = useState(false);
    const [adImage, setAdImage] = useState(null);

    useEffect(() => {
        const lastShown = localStorage.getItem('lastAdShown');
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

        // Check if it's the first time or if 1 hour has passed
        if (!lastShown || now - parseInt(lastShown) > oneHour) {
            const images = [adv1, adv2, adv3];
            const randomImage = images[Math.floor(Math.random() * images.length)];
            setAdImage(randomImage);
            setIsVisible(true);
        }
    }, []);

    // Lock body scroll when ad is visible
    useEffect(() => {
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
        localStorage.setItem('lastAdShown', Date.now().toString());
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

                {/* Image */}
                <div className="w-full">
                    <img src={adImage} alt="Special Offer" className="w-full h-auto object-cover" />
                </div>

                {/* Optional: Call to Action below image if needed, or just the image */}
                <div className="bg-brand-blue p-4 text-center">
                    <p className="text-white text-sm font-medium">Limited Time Offer. Visit us today!</p>
                </div>
            </div>
        </div>
    );
}
