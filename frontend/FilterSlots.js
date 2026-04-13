import React, { useState } from "react";
import axios from "axios";

function FilterSlots() {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  const handleFilter = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/slots/filter?date=${date}`
      );
      setSlots(res.data);
    } catch {
      alert("Error fetching slots");
    }
  };

  return (
    <div>
      <h2>📅 Filter Available Slots</h2>

      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={handleFilter}>Filter</button>

      {slots.map((slot) => (
        <div className="result-box" key={slot._id}>
          <p><strong>Date:</strong> {slot.date}</p>
          <p><strong>Time:</strong> {slot.time}</p>
        </div>
      ))}
    </div>
  );
}

export default FilterSlots;