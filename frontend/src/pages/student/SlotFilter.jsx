import { useState } from 'react';
import { getFilteredSlots } from '../services/studentService';

function SlotFilter() {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);

  const handleFilter = async () => {
    try {
      const res = await getFilteredSlots({
        date,
        status: "available"
      });
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>📅 Slot Filtering</h3>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={handleFilter}>Filter</button>

      {slots.map(s => (
        <div key={s._id}>
          <p>{new Date(s.date).toDateString()}</p>
          <p>{s.startTime} - {s.endTime}</p>
          <p>Status: {s.status}</p>
        </div>
      ))}
    </div>
  );
}

export default SlotFilter;