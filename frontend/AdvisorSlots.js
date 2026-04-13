import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdvisorSlots() {
  const { id } = useParams();

  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/advisors/${id}/slots`)
      .then((res) => {
        setSlots(res.data);
        setFilteredSlots([]);
      });
  }, [id]);

  const handleFilter = () => {
    if (!selectedDate) {
      setMessage("Please Select A Date");
      setFilteredSlots([]);
      return;
    }

    const filtered = slots.filter(
      (slot) => slot.date === selectedDate
    );

    setFilteredSlots(filtered);

    if (filtered.length === 0) {
      setMessage("No Slots Available For This Date");
    } else {
      const availableCount = filtered.filter(
        (slot) => slot.status === "Available"
      ).length;

      setMessage(
        `${availableCount} Slot(s) Available On This Date`
      );
    }
  };

  return (
    <div className="page-container">
      <div className="header">📘 ThesEase</div>

      <div className="card">
        <h2 className="section-title">Advisor Slots</h2>

        <h3>Filter By Date</h3>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button onClick={handleFilter}>Filter</button>

        <br /><br />

        <h3>{message}</h3>

        {filteredSlots.map((slot) => (
          <div
            key={slot._id}
            className={`slot-card ${
              slot.status === "Booked"
                ? "booked"
                : "available"
            }`}
          >
            <h3>{slot.date}</h3>

            <p>Time: {slot.time}</p>

            <p>Status: {slot.status}</p>

            {slot.status === "Available" ? (
              <button>Book Slot</button>
            ) : (
              <button disabled>Already Booked</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdvisorSlots;