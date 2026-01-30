import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicAPI } from '../services/adminApi';

const SOCIAL_ICONS = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube
};

export default function Footer() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await publicAPI.getSettings();
                if (res.success || res.data) {
                    setSettings(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch settings for footer:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Defaults if settings not loaded yet or empty
    const footerDesc = settings?.footer?.description || "Providing clarity and vision to the world through advanced ophthalmology and compassionate care.";
    const copyright = settings?.footer?.copyright || "© 2024 Romashka Health Care. All rights reserved.";

    const contact = settings?.contact || {};
    const address = contact.address || "Sector 62, Noida, Uttar Pradesh 201301";
    const phone = contact.phone || "+91 120 456 7890";
    const email = contact.email || "info@romashkahealthcare.in";

    const socialLinks = settings?.social || {};
    const mapUrl = settings?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56066.65089631422!2d77.33685559999999!3d28.6124282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

    return (
        <footer id="footer" className="bg-white pt-20 pb-10 border-t border-brand-blue/10 mt-20">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold">R</div>
                        <span className="text-xl font-bold text-brand-dark">{settings?.siteName || "Romashka Health Care"}</span>
                    </div>
                    <p className="text-gray-500 leading-relaxed mb-6">
                        {footerDesc}
                    </p>
                    <div className="flex gap-4">
                        {Object.entries(socialLinks).map(([platform, url]) => {
                            if (!url) return null;
                            const Icon = SOCIAL_ICONS[platform] || Facebook;
                            return (
                                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-colors">
                                    <Icon size={18} />
                                </a>
                            );
                        })}
                        {/* Show defaults if no social links managed */}
                        {Object.keys(socialLinks).length === 0 && [Facebook, Twitter, Instagram].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-colors">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-brand-dark mb-6">Quick Links</h4>
                    <ul className="space-y-4">
                        {(settings?.footer?.quickLinks?.length > 0 ? settings.footer.quickLinks : [
                            { name: 'Home', href: '/' },
                            { name: 'About Us', href: '/about' },
                            { name: 'Services', href: '/services' },
                            { name: 'Doctors', href: '/doctors' },
                            { name: 'Book Appointment', href: '/appointment' }
                        ]).map((link, i) => (
                            <li key={i}><a href={link.href} className="text-gray-500 hover:text-brand-blue transition-colors">{link.name}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-brand-dark mb-6">Services</h4>
                    <ul className="space-y-4">
                        {(settings?.footer?.servicesLinks?.length > 0 ? settings.footer.servicesLinks : [
                            { name: 'Cataract Surgery', href: '/services/cataract-surgery' },
                            { name: 'Glaucoma Surgery', href: '/services/glaucoma-surgery' },
                            { name: 'Retina Check-up', href: '/services/retina-checkup' },
                            { name: 'Vision Check-up', href: '/services/vision-checkup' },
                            { name: 'Pediatric Vision', href: '/services/pediatric-vision' }
                        ]).map((link, i) => (
                            <li key={i}><a href={link.href} className="text-gray-500 hover:text-brand-blue transition-colors">{link.name}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-brand-dark mb-6">Contact Us</h4>
                    <ul className="space-y-4 text-gray-500">
                        <li className="flex gap-3">
                            <MapPin className="text-brand-blue shrink-0" size={20} />
                            <span>{address}</span>
                        </li>
                        <li className="flex gap-3">
                            <Phone className="text-brand-blue shrink-0" size={20} />
                            <span>{phone}</span>
                        </li>
                        <li className="flex gap-3">
                            <Mail className="text-brand-blue shrink-0" size={20} />
                            <span>{email}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Map Section */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h4 className="font-bold text-brand-dark mb-6 text-2xl text-center">Visit Us</h4>
                <div className="w-full h-80 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            <div className="text-center text-gray-400 text-sm border-t border-gray-100 pt-8 max-w-7xl mx-auto">
                {copyright}
            </div>
        </footer>
    );
}
