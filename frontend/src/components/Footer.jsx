import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer id="footer" className="bg-white pt-20 pb-10 border-t border-brand-blue/10 mt-20">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold">V</div>
                        <span className="text-xl font-bold text-brand-dark">Visionary</span>
                    </div>
                    <p className="text-gray-500 leading-relaxed mb-6">
                        Providing clarity and vision to the world through advanced ophthalmology and compassionate care.
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Twitter, Instagram].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-colors">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-brand-dark mb-6">Quick Links</h4>
                    <ul className="space-y-4">
                        {['Home', 'About Us', 'Services', 'Doctors', 'Book Appointment'].map(link => (
                            <li key={link}><a href="#" className="text-gray-500 hover:text-brand-blue transition-colors">{link}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-brand-dark mb-6">Services</h4>
                    <ul className="space-y-4">
                        {['Cataract Surgery', 'LASIK', 'Glaucoma Treatment', 'Retina Care', 'Pediatric Ophthalmology'].map(link => (
                            <li key={link}><a href="#" className="text-gray-500 hover:text-brand-blue transition-colors">{link}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-brand-dark mb-6">Contact Us</h4>
                    <ul className="space-y-4 text-gray-500">
                        <li className="flex gap-3">
                            <MapPin className="text-brand-blue shrink-0" size={20} />
                            <span>123 Vision Street, Medical District, NY 10001</span>
                        </li>
                        <li className="flex gap-3">
                            <Phone className="text-brand-blue shrink-0" size={20} />
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li className="flex gap-3">
                            <Mail className="text-brand-blue shrink-0" size={20} />
                            <span>hello@visionaryeye.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Map Section */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h4 className="font-bold text-brand-dark mb-6 text-2xl text-center">Visit Us</h4>
                <div className="w-full h-80 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564756836!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>

            <div className="text-center text-gray-400 text-sm border-t border-gray-100 pt-8 max-w-7xl mx-auto">
                © 2024 Visionary Eye Care. All rights reserved.
            </div>
        </footer>
    );
}
