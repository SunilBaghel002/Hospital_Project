import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';

// Components
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';
import Loading from './components/Loading';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorProvider } from './context/ErrorContext';

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

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <Loading />;
  return token ? children : <Navigate to="/login" />;
};

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
    const handleOpenModal = (event) => {
      const doctorName = event.detail?.doctorName || null;
      openBookModal(doctorName);
    };

    window.addEventListener('open-appointment-modal', handleOpenModal);

    // Keep the old ID logic as a fallback for potential legacy buttons if any, 
    // or just remove it if we are sure. The user didn't complain about other buttons. 
    // But let's keep the ID listener attached to window or document if we want to support the old way via ID?
    // actually best to just support the new clean way.
    // But wait, the previous code attached listener TO THE ELEMENT.
    // Let's also support the old ID by attaching a click listener to document which checks target ID? 
    // No, simpler to just rely on the new event for the Dashboard.

    // However, there might be other parts of the app using the ID "trigger-appointment-modal".
    // Let's see... App.jsx said:
    /*
        const triggerBtn = document.getElementById('trigger-appointment-modal');
        if (triggerBtn) {
          triggerBtn.addEventListener('click', handleOpenModal);
        }
    */
    // This implies that on page load/location change it looks for the button.
    // If I change DashboardHome to emit the event, I don't need the ID logic for DashboardHome.

    // I Will keep the ID logic just in case other pages rely on it (like "Book Now" in Home hero? 
    // Home.jsx usually passes `onBook` prop. 
    // The ID approach was likely a hack for non-prop-drilled components.

    // I'll add the window event listener here.

    return () => {
      window.removeEventListener('open-appointment-modal', handleOpenModal);
    };
  }, []); // Run once on mount is enough for window listener

  // Maintain the old ID logic for backward compatibility in a separate effect or same one?
  // The old logic re-ran on `[location]`.
  useEffect(() => {
    const handleBtnClick = () => openBookModal();
    const triggerBtn = document.getElementById('trigger-appointment-modal');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', handleBtnClick);
    }
    return () => {
      if (triggerBtn) triggerBtn.removeEventListener('click', handleBtnClick);
    };
  }, [location]);

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
  // Fix: Ensure /doctors (public page) shows navbar, while /doctor (dashboard) hides it.
  const isExcludedRoute = location.pathname.startsWith('/admin') || (location.pathname.startsWith('/doctor') && !location.pathname.startsWith('/doctors')) || location.pathname.startsWith('/prescription/view/') || location.pathname.startsWith('/dashboard') || location.pathname === '/login' || location.pathname === '/register';

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          } />

          <Route path="/test" element={<TestServicePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/doctors" element={<DoctorsPage onBook={openBookModal} />} />
          <Route path="/specialties" element={<Specialities />} />

          {/* Custom Layout Routes for Vision Care */}
          <Route path="/services/advanced-diagnostics" element={<VisionCareServiceDetail onBook={openBookModal} serviceSlug="advanced-diagnostics" />} />


          <Route path="/services/:slug" element={<ServiceDetail onBook={openBookModal} />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/vision-care" element={<VisionCare onBook={openBookModal} />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/blogs/tag/:tag" element={<Blogs />} />

          {/* Admin Routes */}

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

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;
