import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react';

export default function ContactUs() {
    return (
        <main className="pt-24 min-h-screen bg-gray-50">
            {/* Header Section */}
            <section className="bg-brand-dark text-white py-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Get in Touch</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            We're here to help. Reach out to us for appointments, inquiries, or just to say hello.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Left: Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold text-brand-dark mb-8">Contact Information</h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-brand-dark mb-1">Phone</h3>
                                        <p className="text-gray-500 mb-1">Mon-Fri from 8am to 8pm.</p>
                                        <p className="font-medium text-lg text-brand-blue">+91 120 456 7890</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-brand-dark mb-1">Email</h3>
                                        <p className="text-gray-500 mb-1">Our friendly team is here to help.</p>
                                        <p className="font-medium text-lg text-brand-blue">info@romashka.in</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-brand-dark mb-1">Office</h3>
                                        <p className="text-gray-500 mb-1">Come say hello at our office HQ.</p>
                                        <p className="font-medium text-lg text-brand-blue">Sector 62, Noida, Uttar Pradesh 201301</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="text-brand-blue" />
                                <h3 className="text-xl font-bold text-brand-dark">Opening Hours</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600 border-b border-gray-100 pb-2">
                                    <span>Monday - Friday</span>
                                    <span className="font-bold text-brand-dark">8:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between text-gray-600 border-b border-gray-100 pb-2">
                                    <span>Saturday</span>
                                    <span className="font-bold text-brand-dark">9:00 AM - 5:00 PM</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Sunday</span>
                                    <span className="font-bold text-red-500">Emergency Only</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-peach/20 rounded-bl-[2.5rem] rounded-tr-[2.5rem]"></div>

                        <h2 className="text-3xl font-bold text-brand-dark mb-2">Send us a Message</h2>
                        <p className="text-gray-500 mb-8">We'll get back to you within 24 hours.</p>

                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-brand-dark ml-1">First Name</label>
                                    <input type="text" className="w-full px-6 py-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-blue focus:ring-0 transition-all outline-none" placeholder="Enter Your First Name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Last Name</label>
                                    <input type="text" className="w-full px-6 py-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-blue focus:ring-0 transition-all outline-none" placeholder="Enter Your Last Name" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Email Address</label>
                                <input type="email" className="w-full px-6 py-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-blue focus:ring-0 transition-all outline-none" placeholder="Enter Your Email" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Message</label>
                                <textarea rows="4" className="w-full px-6 py-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-blue focus:ring-0 transition-all outline-none resize-none" placeholder="Enter Your Message Here..."></textarea>
                            </div>

                            <button className="w-full py-5 bg-brand-dark text-white rounded-xl font-bold text-lg hover:bg-brand-blue transition-all shadow-lg flex items-center justify-center gap-2 group">
                                Send Message
                                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Map Section Removed as per user request */}
        </main>
    );
}
