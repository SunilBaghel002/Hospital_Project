import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { publicAPI } from '../services/adminApi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [links, setLinks] = useState([
        { name: 'Home', href: '/' },
        { name: 'About US', href: '/about' },
        { name: 'Doctors', href: '/doctors' },
        { name: 'Specialities', href: '/specialties' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Contact', href: '/contact' },
    ]);
    const [settings, setSettings] = useState({});
    const location = useLocation();
    const { token } = useAuth();

    useEffect(() => {
        const fetchNavbar = async () => {
            try {
                // Fetch settings for navbar customization
                const settingsRes = await publicAPI.getSettings();
                if (settingsRes.success || settingsRes.data) {
                    setSettings(settingsRes.data || {});

                    // If navbar items are defined in settings, use them
                    if (settingsRes.data?.navbar?.items?.length > 0) {
                        setLinks(settingsRes.data.navbar.items);
                        return;
                    }
                }

                // Otherwise, fetch from pages API
                const res = await publicAPI.getNavbar();
                if (res.success && res.data && res.data.length > 0) {
                    const navLinks = res.data.map(page => ({
                        name: page.title,
                        href: page.isCustomLink ? page.link : `/${page.slug === 'home' ? '' : page.slug}`
                    }));
                    setLinks(navLinks);
                }
            } catch (err) {
                console.error("Failed to fetch navbar:", err);
            }
        };
        fetchNavbar();
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Get navbar settings with defaults
    const siteName = settings.navbar?.siteName || settings.siteName || 'Romashka Health Care';
    const logoInitial = settings.navbar?.logoInitial || 'R';
    const logoImage = settings.navbar?.logoImage;

    // Auth Button Logic
    const ctaText = token ? 'Dashboard' : 'Login';
    const ctaLink = token ? '/dashboard' : '/login';

    return (
        <>
            <nav className="fixed top-10 md:top-16 left-0 right-0 z-50 px-3 md:px-6 flex justify-center pointer-events-none">
                <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm rounded-full pl-2 md:pl-3 pr-2 py-1.5 md:py-2 flex items-center gap-2 md:gap-6 max-w-7xl w-full justify-between">
                    {/* Logo - Responsive */}
                    <Link to="/" className="flex items-center gap-1.5 md:gap-2 pl-1 md:pl-2 min-w-0">
                        {logoImage ? (
                            <img src={logoImage} alt={siteName} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl object-cover flex-shrink-0" />
                        ) : (
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-brand-blue to-emerald-400 rounded-lg md:rounded-xl flex items-center justify-center text-white font-bold text-sm md:text-base shadow-lg shadow-emerald-200 flex-shrink-0">{logoInitial}</div>
                        )}
                        <span className="text-sm md:text-xl font-bold text-brand-dark tracking-tight font-sans truncate max-w-[120px] sm:max-w-[180px] md:max-w-none">{siteName}</span>
                    </Link>

                    {/* Nav Content - Desktop */}
                    <div className="hidden md:flex items-center relative">
                        {links.map((link, index) => (
                            <NavLink
                                key={link.name}
                                to={link.href}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={({ isActive }) => `relative px-4 py-2.5 text-sm font-medium transition-colors z-10 ${isActive ? 'text-brand-blue' : 'text-gray-600 hover:text-brand-blue'}`}
                            >
                                {({ isActive }) => (
                                    <>
                                        {(hoveredIndex === index || isActive) && (
                                            <motion.div
                                                layoutId="navbar-hover"
                                                className="absolute inset-0 bg-brand-cream rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                initial={false}
                                            />
                                        )}
                                        <span className="relative z-10">{link.name}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to={ctaLink} className="hidden md:block bg-brand-blue text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-blue/90 transition-all hover:shadow-lg hover:shadow-emerald-200 active:scale-95 text-sm">
                            {ctaText}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors relative z-50" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={22} className="text-brand-dark" /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Sidebar Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                />
            )}

            {/* Mobile Menu Sidebar */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: isOpen ? 0 : '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl z-40 md:hidden flex flex-col pointer-events-auto"
            >
                <div className="p-6 flex flex-col h-full overflow-y-auto">
                    <div className="flex flex-col gap-1 flex-1 mt-24">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-lg font-medium text-gray-700 px-4 py-3 hover:bg-brand-cream rounded-xl transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <Link
                            to={ctaLink}
                            className="w-full block bg-brand-blue text-white py-3.5 rounded-xl font-bold shadow-lg text-center"
                            onClick={() => setIsOpen(false)}
                        >
                            {ctaText}
                        </Link>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
