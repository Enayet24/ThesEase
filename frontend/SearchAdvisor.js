import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchAdvisor() {
  const [expertise, setExpertise] = useState("");
  const [advisors, setAdvisors] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/advisors/search?expertise=${expertise}`
      );

      setAdvisors(res.data);
    } catch {
      alert("Error fetching advisors");
    }
  };

  return (
    <div className="page-container">
      <div className="header">📘 ThesEase</div>

      <div className="card">
        <h2 className="section-title">Search Advisor By Expertise</h2>

        <input
          type="text"
          placeholder="Enter Expertise"
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>

        {advisors.map((advisor) => (
          <div className="result-card" key={advisor._id}>
            <h3>{advisor.name}</h3>
            <p>{advisor.email}</p>

            <button onClick={() => navigate(`/advisor/${advisor._id}`)}>
              View Slots
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchAdvisor;