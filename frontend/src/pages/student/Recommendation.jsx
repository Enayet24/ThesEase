import { useState } from 'react';
import { recommendAdvisors } from '../services/studentService';

function Recommendation() {
  const [advisors, setAdvisors] = useState([]);
  const [interests, setInterests] = useState('');

  const handleRecommend = async () => {
    try {
      const res = await recommendAdvisors({ interests });
      setAdvisors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>🎯 Advisor Recommendation</h3>

      <input
        placeholder="Enter interests (e.g. ai,ml)"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
      />

      <button onClick={handleRecommend}>Recommend</button>

      {advisors.map(a => (
        <p key={a._id}>{a.user.name}</p>
      ))}
    </div>
  );
}

export default Recommendation;