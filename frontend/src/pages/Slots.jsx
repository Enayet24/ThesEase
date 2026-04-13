import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Slots = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/slots/available", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const data = await res.json();

        // SAFE CHECK (prevents crash)
        if (Array.isArray(data)) {
          setSlots(data);
        } else {
          setSlots([]);
          console.log("Backend response not array:", data);
        }
      } catch (error) {
        console.log("Error fetching slots:", error);
        setSlots([]);
      }
    };

    if (user?.token) {
      fetchSlots();
    }
  }, [user]);

  return (
    <div>
      <h3>Slots</h3>

      {slots.length === 0 && <p>No slots available</p>}

      {slots.map((slot) => (
        <div key={slot._id || Math.random()}>
          <p>Time: {slot.time}</p>
          <p>Status: {slot.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Slots;