import { useState } from 'react';
import { bookSlot, cancelBooking } from '../../services/slotService';
import './BookSlot.css';

function BookSlot({ slot, onBooked, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBook = async () => {
    setLoading(true);
    setError(null);
    try {
      await bookSlot(slot._id);
      setSuccess(true);
      setTimeout(() => {
        onBooked && onBooked();
        onClose && onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book slot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-slot-modal">
      <div className="book-slot-card">
        <h2>Confirm Booking</h2>

        {success ? (
          <div className="booking-success">
            <span className="success-icon">✅</span>
            <p>Booking confirmed!</p>
          </div>
        ) : (
          <>
            <div className="slot-summary">
              <div className="summary-row">
                <span className="summary-label">Date</span>
                <span className="summary-value">
                  {new Date(slot.date).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Time</span>
                <span className="summary-value">{slot.startTime} – {slot.endTime}</span>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="book-slot-actions">
              <button className="btn-confirm" onClick={handleBook} disabled={loading}>
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
              <button className="btn-cancel-modal" onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookSlot;