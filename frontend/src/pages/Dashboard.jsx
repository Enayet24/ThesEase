import { useAuth } from "../context/AuthContext";
import CreateSlot from "./CreateSlot";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>ThesEase System</h2>

      <h3>Welcome {user.email}</h3>

      {/* ROLE-BASED ACCESS CONTROL */}
      {user.role === "advisor" ? (
        <p>You are Advisor</p>
      ) : (
        <p>You are Student</p>
      )}

      {/* ONLY ADVISOR CAN CREATE SLOT */}
      <CreateSlot />
    </div>
  );
};

export default Dashboard;