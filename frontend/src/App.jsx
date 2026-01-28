import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';

// Components
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';
import Loading from './components/Loading';

// Pages - Lazy Loaded
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const DoctorsPage = lazy(() => import('./pages/Doctors'));
const Specialities = lazy(() => import('./pages/Specialities'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Appointment = lazy(() => import('./pages/Appointment'));
const VisionCare = lazy(() => import('./pages/VisionCare'));
const VisionCareServiceDetail = lazy(() => import('./pages/VisionCareServiceDetail'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const DynamicPage = lazy(() => import('./pages/DynamicPage'));

// Admin Pages - Lazy Loaded
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const PagesManager = lazy(() => import('./pages/admin/PagesManager'));
const SubPagesManager = lazy(() => import('./pages/admin/SubPagesManager'));
const SubPageEditor = lazy(() => import('./pages/admin/SubPageEditor'));
const TestServicePage = lazy(() => import('./pages/TestServicePage'));
const SiteSettingsEditor = lazy(() => import('./pages/admin/SiteSettingsEditor'));
const MediaLibrary = lazy(() => import('./pages/admin/MediaLibrary'));
const PageEditor = lazy(() => import('./pages/admin/PageEditor'));
const DoctorManager = lazy(() => import('./pages/admin/DoctorManager'));
const BlogManager = lazy(() => import('./pages/admin/BlogManager'));
const AppointmentManager = lazy(() => import('./pages/admin/AppointmentManager'));
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const DoctorLayout = lazy(() => import('./pages/doctor/DoctorLayout'));
const ConsultationPad = lazy(() => import('./pages/doctor/ConsultationPad'));
const PrescriptionHistory = lazy(() => import('./pages/doctor/PrescriptionHistory'));
const PendingRequests = lazy(() => import('./pages/doctor/PendingRequests'));
const Appointments = lazy(() => import('./pages/doctor/Appointments'));
const DoctorSettings = lazy(() => import('./pages/doctor/DoctorSettings'));
const SecurePrescription = lazy(() => import('./pages/public/SecurePrescription'));

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

      <Suspense fallback={<Loading />}>
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
            <Route path="requests" element={<PendingRequests />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="consultation" element={<ConsultationPad />} />
            <Route path="history" element={<PrescriptionHistory />} />
            <Route path="settings" element={<DoctorSettings />} />
          </Route>

          {/* Public Secure Routes */}
          <Route path="/prescription/view/:token" element={<SecurePrescription />} />

          {/* Dynamic CMS Pages - catches custom pages created from admin */}
          <Route path="/:slug" element={<DynamicPage onBook={openBookModal} />} />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

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
