import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
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
import DynamicPage from './pages/DynamicPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import PagesManager from './pages/admin/PagesManager';
import SubPagesManager from './pages/admin/SubPagesManager';
import SubPageEditor from './pages/admin/SubPageEditor';
import TestServicePage from './pages/TestServicePage';
import SiteSettingsEditor from './pages/admin/SiteSettingsEditor';
import MediaLibrary from './pages/admin/MediaLibrary';
import PageEditor from './pages/admin/PageEditor';
import DoctorManager from './pages/admin/DoctorManager';
import BlogManager from './pages/admin/BlogManager';
import AppointmentManager from './pages/admin/AppointmentManager';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorLayout from './pages/doctor/DoctorLayout';
import ConsultationPad from './pages/doctor/ConsultationPad';
import PrescriptionHistory from './pages/doctor/PrescriptionHistory';
import SecurePrescription from './pages/public/SecurePrescription';

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

  // Admin Shortcut: Ctrl + Shift + F
  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Check if current route is admin or doctor route (hide global nav)
  const isExcludedRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/doctor') || location.pathname.startsWith('/prescription/view/');

  return (
    <div className="bg-brand-cream/30 min-h-screen font-sans selection:bg-brand-peach/50 selection:text-brand-dark overflow-x-hidden flex flex-col">
      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialDoctor={selectedDoctor} />

      {!isExcludedRoute && (
        <>
          <TopBar />
          <Navbar />
        </>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home onBook={openBookModal} />} />
        <Route path="/test" element={<TestServicePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/doctors" element={<DoctorsPage onBook={openBookModal} />} />
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

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pages" element={<PagesManager />} />
          <Route path="pages/new" element={<PageEditor />} />
          <Route path="pages/edit/:id" element={<PageEditor />} />
          <Route path="pages/edit/:id" element={<PageEditor />} />
          <Route path="subpages" element={<SubPagesManager />} />
          <Route path="subpages/new" element={<SubPageEditor />} />
          <Route path="subpages/edit/:id" element={<SubPageEditor />} />
          <Route path="doctors" element={<DoctorManager />} />
          <Route path="blogs" element={<BlogManager />} />
          <Route path="settings" element={<SiteSettingsEditor />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="appointments" element={<AppointmentManager />} />
        </Route>

        {/* Doctor Routes */}
        {/* Doctor Routes */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<Navigate to="/doctor/dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="consultation" element={<ConsultationPad />} />
          <Route path="history" element={<PrescriptionHistory />} />
        </Route>

        {/* Public Secure Routes */}
        <Route path="/prescription/view/:token" element={<SecurePrescription />} />

        {/* Dynamic CMS Pages - catches custom pages created from admin */}
        <Route path="/:slug" element={<DynamicPage onBook={openBookModal} />} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isExcludedRoute && (
        <>
          <Footer />
          <Chatbot />
        </>
      )}
    </div>
  );
}

import { ErrorProvider } from './context/ErrorContext';

function App() {
  return (
    <ErrorProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorProvider>
  );
}

export default App;
