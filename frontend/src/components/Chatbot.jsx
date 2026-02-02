import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicAPI } from '../services/adminApi';

// WhatsApp Icon Component
const WhatsAppIcon = ({ size = 24 }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! Welcome to Romashka Health Care. How can I assist you today?' }
    ]);
    const [showOptions, setShowOptions] = useState(true);
    
    // WhatsApp settings from CMS
    const [whatsappSettings, setWhatsappSettings] = useState({
        enabled: true,
        number: '',
        defaultMessage: 'Hello! I would like to know more about your services.'
    });

    const options = [
        "Book an Appointment",
        "View Test Reports",
        "Insurance Checks",
        "Others"
    ];

    // Fetch WhatsApp settings from CMS
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await publicAPI.getSettings();
                if (res.success || res.data) {
                    const settings = res.data;
                    if (settings.whatsapp) {
                        setWhatsappSettings({
                            enabled: settings.whatsapp.enabled !== false,
                            number: settings.whatsapp.number || '',
                            defaultMessage: settings.whatsapp.defaultMessage || 'Hello! I would like to know more about your services.'
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch WhatsApp settings:", err);
            }
        };
        fetchSettings();
    }, []);

    // Generate WhatsApp link
    const whatsappLink = whatsappSettings.number 
        ? `https://wa.me/${whatsappSettings.number}?text=${encodeURIComponent(whatsappSettings.defaultMessage)}`
        : null;

    const handleOptionClick = (option) => {
        // User message
        const newMessages = [...messages, { type: 'user', text: option }];
        setMessages(newMessages);
        setShowOptions(false);

        // Bot response simulation delay
        setTimeout(() => {
            let botResponse = "";
            switch (option) {
                case "Book an Appointment":
                    botResponse = "You can book an appointment easily by clicking the 'Book Appointment' button in the menu, or call us at +1 (555) 123-4567.";
                    break;
                case "View Test Reports":
                    botResponse = "Please visit our Patient Portal (link in top bar) to login and view your latest reports.";
                    break;
                case "Insurance Checks":
                    botResponse = "We accept most major insurance plans including BlueCross, Aetna, and Medicare. Please contact billing for verification.";
                    break;
                case "Others":
                    botResponse = "Please describe your query or call our support line for immediate assistance.";
                    break;
                default:
                    botResponse = "How else can I help you?";
            }
            setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
            // Show options again after a delay
            setTimeout(() => setShowOptions(true), 1500);
        }, 600);
    };

    const handleToggleExpand = () => {
        if (isOpen) {
            setIsOpen(false);
        }
        setIsExpanded(!isExpanded);
    };

    const handleChatClick = () => {
        setIsOpen(true);
        setIsExpanded(false);
    };

    const handleWhatsAppClick = () => {
        if (whatsappLink) {
            window.open(whatsappLink, '_blank');
        }
        setIsExpanded(false);
    };

    // Check if WhatsApp should be shown
    const showWhatsApp = whatsappSettings.enabled && whatsappSettings.number;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 mb-4 border border-gray-100 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-brand-blue p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <MessageCircle size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Happy Assistant</h4>
                                    <p className="text-emerald-100 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Helping..
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                            {messages.map((msg, i) => (
                                <div key={i} className={`max-w-[80%] p-3 text-sm rounded-xl ${msg.type === 'bot' ? 'bg-white shadow-sm text-gray-700 self-start rounded-tl-none' : 'bg-brand-blue text-white self-end rounded-tr-none'}`}>
                                    {msg.text}
                                </div>
                            ))}

                            {showOptions && (
                                <div className="flex flex-col gap-2 mt-2 ml-1">
                                    {options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleOptionClick(opt)}
                                            className="text-left text-xs font-medium text-brand-blue bg-emerald-50 hover:bg-white hover:shadow-md border border-emerald-100 py-2 px-3 rounded-lg transition-all"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Input Area (Mock) */}
                        <div className="p-3 border-t bg-white flex items-center gap-2">
                            <input type="text" placeholder="Type a message..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-blue" disabled={true} />
                            <button className="bg-brand-blue text-white p-2 rounded-full opacity-50 cursor-not-allowed">
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Expanded Options - Chat & WhatsApp */}
            <AnimatePresence>
                {isExpanded && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-3 mb-3"
                    >
                        {/* Chat Button */}
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleChatClick}
                            className="w-12 h-12 bg-brand-blue text-white rounded-full shadow-lg shadow-brand-blue/30 flex items-center justify-center group relative"
                        >
                            <MessageCircle size={22} />
                            <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Chat with us
                            </span>
                        </motion.button>

                        {/* WhatsApp Button */}
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleWhatsAppClick}
                            className="w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center group relative"
                        >
                            <WhatsAppIcon size={24} />
                            <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                WhatsApp
                            </span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleExpand}
                className={`w-14 h-14 ${isOpen ? 'bg-red-500' : 'bg-brand-blue'} text-white rounded-full shadow-lg ${isOpen ? 'shadow-red-500/40' : 'shadow-brand-blue/40'} flex items-center justify-center z-[100] transition-colors`}
            >
                {isOpen ? (
                    <X size={28} />
                ) : isExpanded ? (
                    <ChevronDown size={28} />
                ) : (
                    <ChevronUp size={28} />
                )}
            </motion.button>
        </div>
    );
}
