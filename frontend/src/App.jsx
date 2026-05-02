import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';

import AdvisorDashboard from './pages/advisor/AdvisorDashboard';
import AdvisorProfile from './pages/advisor/AdvisorProfile';
import RoutineManager from './pages/advisor/RoutineManager';
import StudentDashboard from './pages/student/StudentDashboard';
import AdvisorBrowse from './pages/student/AdvisorBrowse';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>

        {/* Public */}
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === 'advisor'
            ? '/advisor/dashboard'
            : '/student/dashboard'}
          /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to={user.role === 'advisor'
            ? '/advisor/dashboard'
            : '/student/dashboard'}
          /> : <Signup />}
        />

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

        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/browse" element={
          <ProtectedRoute role="student"><AdvisorBrowse /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={
          <Navigate to={user
            ? user.role === 'advisor'
              ? '/advisor/dashboard'
              : '/student/dashboard'
            : '/login'}
          />}
        />

      </Routes>
    </>
  );
}

export default App;