import { useState } from 'react';
import { bookSlot } from '../../services/slotService';
import toast from 'react-hot-toast';
import './BookSlot.css';

function BookSlot({ slot, onBooked, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    setLoading(true);
    try {
      await bookSlot(slot._id);
      toast.success('Slot booked successfully!');
      setTimeout(() => {
        onBooked && onBooked();
        onClose && onClose();
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-slot-overlay" onClick={onClose}>
      <div className="book-slot-card" onClick={e => e.stopPropagation()}>
        <h2>Confirm Booking</h2>

        <div className="slot-summary">
          <div className="summary-row">
            <span className="summary-label">📅 Date</span>
            <span className="summary-value">
              {new Date(slot.date).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
              })}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">🕐 Time</span>
            <span className="summary-value">{slot.startTime} – {slot.endTime}</span>
          </div>
        </div>

        <div className="book-slot-actions">
          <button className="btn btn-primary" onClick={handleBook} disabled={loading}>
            {loading ? <><div className="spinner"></div> Booking...</> : 'Confirm Booking'}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default BookSlot;