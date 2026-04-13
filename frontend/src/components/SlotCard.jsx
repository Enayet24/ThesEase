const SlotCard = ({ time, status, onBook }) => {
  return (
    <div style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
      <h4>Time: {time}</h4>
      <p>Status: {status}</p>

      {status === "available" && (
        <button onClick={onBook}>Book Slot</button>
      )}
    </div>
  );
};

export default SlotCard;