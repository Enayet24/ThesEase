import { useState, useEffect } from 'react';
import { getAdvisorDashboard } from '../../services/advisorService';
import { getAdvisorProfile } from '../../services/advisorService';
import { useAuth } from '../../context/AuthContext';
import StatusToggle from '../../components/StatusToggle';
import { Link } from 'react-router-dom';
import './AdvisorDashboard.css';

function AdvisorDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAdvisorDashboard();
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

  const { stats, slots, bookings } = dashboard;

  return (
    <div className="advisor-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user.name}</h1>
          <p>Here's an overview of your slots and bookings.</p>
        </div>
        <div className="header-actions">
          <Link to="/advisor/profile" className="btn-outline">Edit Profile</Link>
          <Link to="/advisor/routine" className="btn-primary">Manage Routine</Link>
        </div>
      </div>

      {/* Status Toggle */}
      <StatusToggle initialStatus={stats.isAccepting} />

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.totalSlots}</span>
          <span className="stat-label">Total Slots</span>
        </div>
        <div className="stat-card available">
          <span className="stat-number">{stats.availableSlots}</span>
          <span className="stat-label">Available</span>
        </div>
        <div className="stat-card booked">
          <span className="stat-number">{stats.bookedSlots}</span>
          <span className="stat-label">Booked</span>
        </div>
        <div className="stat-card bookings">
          <span className="stat-number">{stats.totalBookings}</span>
          <span className="stat-label">Active Bookings</span>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="dashboard-section">
        <h2>Upcoming Bookings</h2>
        {bookings.length === 0 ? (
          <div className="empty-state">No active bookings yet.</div>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-avatar">
                  {booking.student.name.charAt(0).toUpperCase()}
                </div>
                <div className="booking-info">
                  <h3>{booking.student.name}</h3>
                  <p>{booking.student.email}</p>
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
                <span className="status-pill active">Active</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Slots */}
      <div className="dashboard-section">
        <h2>Your Slots</h2>
        {slots.length === 0 ? (
          <div className="empty-state">
            No slots yet. <Link to="/advisor/routine">Set up your routine</Link> to get started.
          </div>
        ) : (
          <div className="slots-grid">
            {slots.map(slot => (
              <div key={slot._id} className={`slot-card ${slot.status}`}>
                <div className="slot-date-info">
                  <span className="slot-day">
                    {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="slot-full-date">
                    {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="slot-time-info">
                  {slot.startTime} – {slot.endTime}
                </div>
                <span className={`slot-status-badge ${slot.status}`}>
                  {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvisorDashboard;