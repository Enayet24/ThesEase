import { useEffect, useState } from 'react';
import { getBookingHistory } from '../services/studentService';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getBookingHistory();
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <h3>📚 Booking History</h3>

      {bookings.map(b => (
        <div key={b._id}>
          <p>Advisor: {b.advisor?.name}</p>
          <p>Date: {new Date(b.slot?.date).toDateString()}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}

export default BookingHistory;