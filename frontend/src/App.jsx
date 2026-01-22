import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';

// Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import DoctorsPage from './pages/Doctors';
import Specialities from './pages/Specialities';
import ServiceDetail from './pages/ServiceDetail';
import Appointment from './pages/Appointment';
import VisionCare from './pages/VisionCare';
import VisionCareServiceDetail from './pages/VisionCareServiceDetail';
import ContactUs from './pages/ContactUs';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import PagesManager from './pages/admin/PagesManager';
import SubPagesManager from './pages/admin/SubPagesManager';
import SiteSettingsEditor from './pages/admin/SiteSettingsEditor';
import MediaLibrary from './pages/admin/MediaLibrary';

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const location = useLocation();

  const openBookModal = (doctorName = null) => {
    setSelectedDoctor(doctorName);
    setIsModalOpen(true);
  };

  // Listen for custom event to open modal from other pages
  useEffect(() => {
    const handleOpenModal = () => openBookModal();
    const triggerBtn = document.getElementById('trigger-appointment-modal');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', handleOpenModal);
    }
    return () => {
      if (triggerBtn) triggerBtn.removeEventListener('click', handleOpenModal);
    };
  }, [location]); // Re-run on page change to finding new button

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Don't render main site layout for admin routes
  if (isAdminRoute) {
    return null;
  }

  return (
    <div className="bg-brand-cream/30 min-h-screen font-sans selection:bg-brand-peach/50 selection:text-brand-dark overflow-x-hidden flex flex-col">
      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialDoctor={selectedDoctor} />

      <TopBar />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home onBook={openBookModal} />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/doctors" element={<DoctorsPage onBook={openBookModal} />} />
        <Route path="/specialties" element={<Specialities />} />
        <Route path="/specialties" element={<Specialities />} />

        {/* Custom Layout Routes for Vision Care */}
        <Route path="/services/advanced-diagnostics" element={<VisionCareServiceDetail onBook={openBookModal} serviceSlug="advanced-diagnostics" />} />
        <Route path="/services/robotic-surgery" element={<VisionCareServiceDetail onBook={openBookModal} serviceSlug="robotic-surgery" />} />
        <Route path="/services/pediatric-care" element={<VisionCareServiceDetail onBook={openBookModal} serviceSlug="pediatric-care" />} />
        <Route path="/services/emergency-trauma" element={<VisionCareServiceDetail onBook={openBookModal} serviceSlug="emergency-trauma" />} />

        <Route path="/services/:slug" element={<ServiceDetail onBook={openBookModal} />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/vision-care" element={<VisionCare onBook={openBookModal} />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Routes>

      <Footer />
      <Chatbot />
    </div>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="pages" element={<PagesManager />} />
        <Route path="subpages" element={<SubPagesManager />} />
        <Route path="settings" element={<SiteSettingsEditor />} />
        <Route path="media" element={<MediaLibrary />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <AdminRoutes />
    </BrowserRouter>
  );
}

export default App;
