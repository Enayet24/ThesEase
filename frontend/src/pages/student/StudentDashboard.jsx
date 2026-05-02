import { useState, useEffect } from 'react';
import { getStudentDashboard } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './StudentDashboard.css';

function StudentDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getStudentDashboard();
        setDashboard(res.data);
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  const { activeBookings, cancelledBookings } = dashboard;
  const displayed = activeTab === 'active' ? activeBookings : cancelledBookings;

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Manage your thesis consultation bookings here.</p>
        </div>
        <Link to="/student/browse" className="btn-primary">
          Browse Advisors
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card active-stat">
          <span className="stat-number">{activeBookings.length}</span>
          <span className="stat-label">Active Bookings</span>
        </div>
        <div className="stat-card cancelled-stat">
          <span className="stat-number">{cancelledBookings.length}</span>
          <span className="stat-label">Cancelled</span>
        </div>
        <div className="stat-card total-stat">
          <span className="stat-number">
            {activeBookings.length + cancelledBookings.length}
          </span>
          <span className="stat-label">Total Bookings</span>
        </div>
      </div>

      {/* Booking History */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Booking History</h2>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active ({activeBookings.length})
            </button>
            <button
              className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled ({cancelledBookings.length})
            </button>
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="empty-state">
            {activeTab === 'active' ? (
              <>
                <p>No active bookings.</p>
                <span>
                  <Link to="/student/browse">Browse advisors</Link> to book a slot.
                </span>
              </>
            ) : (
              <p>No cancelled bookings.</p>
            )}
          </div>
        ) : (
          <div className="bookings-list">
            {displayed.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-avatar">
                  {booking.advisor.name.charAt(0).toUpperCase()}
                </div>
                <div className="booking-info">
                  <h3>{booking.advisor.name}</h3>
                  <p>{booking.advisor.email}</p>
                </div>
                <div className="booking-slot">
                  <span className="slot-date">
                    {new Date(booking.slot.date).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </span>
                  <span className="slot-time">
                    {booking.slot.startTime} – {booking.slot.endTime}
                  </span>
                </div>
                <span className={`status-pill ${booking.status}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;