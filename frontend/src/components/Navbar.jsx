import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar" id="main-navbar">
        <div className="navbar-inner">
          <Link
            to={user
              ? user.role === 'advisor' ? '/advisor/dashboard' : '/student/dashboard'
              : '/login'}
            className="navbar-logo"
          >
            <span className="navbar-logo-icon">📚</span>
            <span className="navbar-logo-text">ThesEase</span>
          </Link>

          {user && (
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
          )}

          <div className="navbar-actions">
            {user ? (
              <div className="navbar-user">
                <div className="navbar-user-info">
                  <div className="navbar-user-name">{user.name}</div>
                  <div className="navbar-user-role">{user.role}</div>
                </div>
                <div className="navbar-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button
                  className="btn-logout"
                  onClick={handleLogout}
                  id="logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-auth-link" id="nav-login-btn">
                  Log In
                </Link>
                <Link to="/signup" className="nav-signup-btn" id="nav-register-btn">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="navbar-spacer"></div>
    </>
  );
}

export default Navbar;