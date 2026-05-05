import { useState } from 'react';
import { cancelBooking } from '../services/studentService';

function CancelBooking() {
  const [bookingId, setBookingId] = useState('');

  const handleCancel = async () => {
    try {
      await cancelBooking(bookingId);
      alert("Booking cancelled! Notification triggered.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>🔔 Cancel Booking</h3>

      <input
        placeholder="Enter Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
      />

      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default CancelBooking;