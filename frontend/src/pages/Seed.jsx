import { useState } from 'react';
import api from '../services/api';

function Seed() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await api.post('/test/seed');
      setMessage('✅ ' + res.data.message + ' — now go to /login');
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
      <h2>Seed Test Users</h2>
      <p>This creates an advisor and student account for testing.</p>
      <button
        onClick={handleSeed}
        disabled={loading}
        style={{ padding: '12px 28px', background: '#1A3557', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
      >
        {loading ? 'Creating...' : 'Create Test Users'}
      </button>
      {message && <p style={{ color: '#166534', fontWeight: 600 }}>{message}</p>}
      <p style={{ fontSize: 13, color: '#64748b' }}>
        After seeding: <strong>advisor@test.com</strong> / <strong>student@test.com</strong> — password: <strong>password123</strong>
      </p>
    </div>
  );
}

export default Seed;