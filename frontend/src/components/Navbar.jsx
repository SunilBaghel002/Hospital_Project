import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { publicAPI } from '../services/adminApi';

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
    const location = useLocation();

    useEffect(() => {
        const fetchNavbar = async () => {
            try {
                const res = await publicAPI.getNavbar();
                if (res.success && res.data && res.data.length > 0) {
                    // Start Mapping: Ensure we have valid names and hrefs
                    const navLinks = res.data.map(page => ({
                        name: page.title,
                        href: page.isCustomLink ? page.link : `/${page.slug === 'home' ? '' : page.slug}`
                    }));

                    // If backend returns only partial list or empty (unlikely with check above), merge or replace? 
                    // Strategy: Completely replace if we get data, assuming admin controls full menu.
                    // But we might want some hardcoded "System" pages if they aren't in CMS (like Appointment??)
                    // For now, let's append 'Appointment' button separately as it is in the UI already.
                    setLinks(navLinks);
                }
            } catch (err) {
                console.error("Failed to fetch navbar:", err);
            }
        };
        fetchNavbar();
    }, []);

    return (
        <nav className="fixed top-10 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none">
            <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm rounded-full pl-3 pr-2 py-2 flex items-center gap-6 max-w-7xl w-full justify-between">
                {/* Logo - Now Inside */}
                <Link to="/" className="flex items-center gap-2 pl-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-brand-blue to-emerald-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200">V</div>
                    <span className="text-xl font-bold text-brand-dark tracking-tight font-sans">Visionary</span>
                </Link>

                {/* Nav Content */}
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
                    <Link to="/appointment" className="hidden md:block bg-brand-blue text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-blue/90 transition-all hover:shadow-lg hover:shadow-emerald-200 active:scale-95 text-sm">
                        Book an Appointment
                    </Link>

                    <button className="md:hidden text-gray-700 p-2" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute top-24 right-6 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-white/20 md:hidden pointer-events-auto"
                >
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="text-lg font-medium text-gray-600 p-2 hover:bg-gray-50 rounded-lg"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/appointment" className="w-full bg-brand-blue text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-200 text-center" onClick={() => setIsOpen(false)}>
                        Book Appointment
                    </Link>
                </motion.div>
            )}
        </nav>
    );
}
