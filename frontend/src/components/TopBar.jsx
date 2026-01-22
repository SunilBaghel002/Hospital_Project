import { Phone, Clock } from 'lucide-react';

export default function TopBar() {
    return (
        <div className="bg-brand-dark text-white py-2 px-6 text-sm font-medium flex justify-between items-center relative z-[60]">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="bg-red-500 rounded-full p-1 animate-pulse">
                        <Phone size={12} fill="white" />
                    </div>
                    <span className="text-red-400 font-bold uppercase tracking-wider text-xs md:text-sm">Emergency: 911-EYE-CARE</span>
                </div>
                <div className="hidden md:flex items-center gap-2 text-gray-300">
                    <Clock size={14} />
                    <span>24/7 Casualty & Trauma Center Available</span>
                </div>
            </div>
            <div className="flex gap-4 text-xs md:text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Patient Portal</a>
                <span className="text-gray-600">|</span>
                <a href="#" className="hover:text-white transition-colors">Careers</a>
            </div>
        </div>
    );
}
