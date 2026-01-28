import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! Welcome to Romashka Health Care. How can I assist you today?' }
    ]);
    const [showOptions, setShowOptions] = useState(true);

    const options = [
        "Book an Appointment",
        "View Test Reports",
        "Insurance Checks",
        "Others"
    ];

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

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-brand-blue text-white rounded-full shadow-lg shadow-brand-blue/40 flex items-center justify-center z-[100]"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
}
