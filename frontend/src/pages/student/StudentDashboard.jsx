import { useState, useEffect } from 'react';
import { getStudentDashboard } from '../../services/studentService';
import { cancelBookingWithReason } from '../../services/slotService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './StudentDashboard.css';

function StudentDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState({ activeBookings: [], cancelledBookings: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  // Cancel modal state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchDashboard = async () => {
    try {
      const dashRes = await getStudentDashboard();
      setDashboard(dashRes.data);
    } catch {
      // Show empty dashboard if backend fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelBookingWithReason(cancelTarget._id, cancelReason);
      toast.success('Booking cancelled successfully');
      setCancelTarget(null);
      setCancelReason('');
      setLoading(true);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="dashboard-loading">
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }}></div>
      <span>Loading dashboard...</span>
    </div>
  );

  const { activeBookings, cancelledBookings } = dashboard;
  const displayed = activeTab === 'active' ? activeBookings : cancelledBookings;

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Manage your thesis consultation bookings.</p>
        </div>
        <Link to="/student/browse" className="btn btn-primary">
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
          <span className="stat-number">{activeBookings.length + cancelledBookings.length}</span>
          <span className="stat-label">Total Bookings</span>
        </div>
      </div>

      {/* Booking History */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Booking History</h2>
          <div className="tabs">
            <button className={`tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
              Active ({activeBookings.length})
            </button>
            <button className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => setActiveTab('cancelled')}>
              Cancelled ({cancelledBookings.length})
            </button>
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="empty-state">
            {activeTab === 'active' ? (
              <>
                <span className="empty-icon">📅</span>
                <p>No active bookings</p>
                <span><Link to="/student/browse">Browse advisors</Link> to book a consultation slot.</span>
              </>
            ) : (
              <>
                <span className="empty-icon">✨</span>
                <p>No cancelled bookings</p>
              </>
            )}
          </div>
        ) : (
          <div className="bookings-list">
            {displayed.map(booking => (
              <div key={booking._id} className={`booking-card ${booking.status}`}>
                <div className="booking-avatar">
                  {booking.advisor?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="booking-info">
                  <h3>{booking.advisor?.name || 'Unknown'}</h3>
                  <p>{booking.advisor?.email || ''}</p>
                  {booking.status === 'cancelled' && booking.cancellationReason && (
                    <p className="cancel-reason">Reason: {booking.cancellationReason}</p>
                  )}
                </div>
                <div className="booking-slot">
                  <span className="slot-date">
                    {booking.slot ? new Date(booking.slot.date).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    }) : 'N/A'}
                  </span>
                  <span className="slot-time">
                    {booking.slot ? `${booking.slot.startTime} – ${booking.slot.endTime}` : ''}
                  </span>
                </div>
                <div className="booking-actions">
                  <span className={`status-pill ${booking.status}`}>
                    {booking.status === 'active' ? 'Active' : 'Cancelled'}
                  </span>
                  {booking.status === 'active' && (
                    <button className="btn-action btn-cancel-action" onClick={() => setCancelTarget(booking)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <div className="modal-overlay" onClick={() => setCancelTarget(null)}>
          <div className="cancel-modal" onClick={e => e.stopPropagation()}>
            <h3>Cancel Booking</h3>
            <p className="cancel-modal-desc">
              Are you sure you want to cancel your booking with <strong>{cancelTarget.advisor?.name}</strong>
              {cancelTarget.slot && (
                <> on {new Date(cancelTarget.slot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {cancelTarget.slot.startTime}</>
              )}?
            </p>
            <div className="input-group" style={{ marginTop: 16 }}>
              <label>Reason (optional)</label>
              <textarea
                className="input-field"
                placeholder="Why are you cancelling?"
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="cancel-modal-actions">
              <button className="btn btn-secondary" onClick={() => { setCancelTarget(null); setCancelReason(''); }}>
                Keep Booking
              </button>
              <button className="btn-cancel-confirm" onClick={handleCancelConfirm} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;