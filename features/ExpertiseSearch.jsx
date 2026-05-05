import { useState } from 'react';
import { searchByExpertise } from '../services/studentService';

function ExpertiseSearch() {
  const [expertise, setExpertise] = useState('');
  const [advisors, setAdvisors] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await searchByExpertise({ expertise });
      setAdvisors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>🔍 Search by Expertise</h3>

      <input
        placeholder="Enter expertise"
        value={expertise}
        onChange={(e) => setExpertise(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {advisors.map(a => (
        <p key={a._id}>{a.user.name}</p>
      ))}
    </div>
  );
}

export default ExpertiseSearch;