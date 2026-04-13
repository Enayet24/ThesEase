import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const CreateSlot = () => {
  const { user } = useAuth();
  const [time, setTime] = useState("");

  const handleCreate = () => {
    alert("Slot created at: " + time);
    setTime("");
  };

  // ONLY advisor can see this
  if (user.role !== "advisor") return null;

  return (
    <div>
      <h3>Create Consultation Slot</h3>

      <input
        placeholder="Enter time (e.g. Sun 10 AM)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <button onClick={handleCreate}>
        Create Slot
      </button>
    </div>
  );
};

export default CreateSlot;