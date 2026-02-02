import { Phone, Clock } from 'lucide-react';

export default function TopBar() {
    return (
        <div className="fixed top-0 left-0 right-0 bg-brand-dark text-white py-2 px-3 sm:px-4 md:px-6 text-sm font-medium flex justify-between items-center z-[70]">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-gray-300 font-medium text-xs md:text-sm">Welcome to Romashka Health Care</span>
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
