import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="advisor">Advisor</option>
      </select>

      <button onClick={() => login(email, role)}>
        Login
      </button>
    </div>
  );
};

export default Login;