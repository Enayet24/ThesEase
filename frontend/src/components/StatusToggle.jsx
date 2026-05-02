import { useState } from 'react';
import { toggleAcceptingStatus } from '../services/advisorService';
import './StatusToggle.css';

function StatusToggle({ initialStatus }) {
  const [isAccepting, setIsAccepting] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await toggleAcceptingStatus();
      setIsAccepting(res.data.isAccepting);
    } catch (err) {
      alert('Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-toggle-card">
      <div className="status-info">
        <h3>Thesis Supervision Status</h3>
        <p>Control whether students can see you as available for thesis supervision.</p>
      </div>
      <div className="status-right">
        <span className={`status-badge ${isAccepting ? 'accepting' : 'not-accepting'}`}>
          {isAccepting ? 'Accepting' : 'Not Accepting'}
        </span>
        <button
          className={`toggle-btn ${isAccepting ? 'active' : 'inactive'}`}
          onClick={handleToggle}
          disabled={loading}
        >
          <span className="toggle-knob" />
        </button>
      </div>
    </div>
  );
}

export default StatusToggle;