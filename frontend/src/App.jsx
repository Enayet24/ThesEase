import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';

import AdvisorDashboard from './pages/advisor/AdvisorDashboard';
import AdvisorProfile from './pages/advisor/AdvisorProfile';
import RoutineManager from './pages/advisor/RoutineManager';
import StudentDashboard from './pages/student/StudentDashboard';
import AdvisorBrowse from './pages/student/AdvisorBrowse';

import SlotManager from './pages/advisor/SlotManager';

// Redirect authenticated users away from auth pages
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === 'advisor' ? '/advisor/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
};

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', background: 'var(--bg-dark)'
      }}>
        <div className="spinner" style={{ width: 48, height: 48, borderWidth: 3 }}></div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A2E',
            color: '#EAEAEA',
            border: '1px solid rgba(108, 99, 255, 0.2)',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '0.9rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          },
          success: { iconTheme: { primary: '#00D9A6', secondary: '#1A1A2E' } },
          error: { iconTheme: { primary: '#FF6B6B', secondary: '#1A1A2E' } },
        }}
      />
      <Navbar />
      <Routes>

        {/* Public / Auth */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Advisor Routes */}
        <Route path="/advisor/dashboard" element={
          <ProtectedRoute role="advisor"><AdvisorDashboard /></ProtectedRoute>
        } />
        <Route path="/advisor/profile" element={
          <ProtectedRoute role="advisor"><AdvisorProfile /></ProtectedRoute>
        } />
        <Route path="/advisor/routine" element={
          <ProtectedRoute role="advisor"><RoutineManager /></ProtectedRoute>
        } />
        <Route path="/advisor/slots" element={
          <ProtectedRoute role="advisor"><SlotManager /></ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/browse" element={
          <ProtectedRoute role="student"><AdvisorBrowse /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </>
  );
}

export default App;