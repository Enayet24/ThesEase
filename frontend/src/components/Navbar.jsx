import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Navbar.css';

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if the API call fails, clear locally
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to={user.role === 'advisor' ? '/advisor/dashboard' : '/student/dashboard'} className="navbar-brand">
        Thes<span>Ease</span>
      </Link>

      <div className="navbar-links">
        {user.role === 'advisor' && (
          <>
            <Link to="/advisor/dashboard">Dashboard</Link>
            <Link to="/advisor/profile">Profile</Link>
            <Link to="/advisor/routine">Routine</Link>
            <Link to="/advisor/slots">Slots</Link>
          </>
        )}
        {user.role === 'student' && (
          <>
            <Link to="/student/dashboard">Dashboard</Link>
            <Link to="/student/browse">Browse Advisors</Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;