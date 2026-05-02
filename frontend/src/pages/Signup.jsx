import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Signup.css';

function Signup() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1: Role, Step 2: Details
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });
      setUser(res.data.user);
      if (role === 'advisor') {
        navigate('/advisor/profile');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">

        {/* Logo */}
        <div className="signup-logo">
          <h1>Thes<span>Ease</span></h1>
          <p>Thesis Slot Booking System</p>
        </div>

        {/* Step 1 — Role Selection */}
        {step === 1 && (
          <>
            <h2>Create your account</h2>
            <p className="signup-subtitle">Choose your role to get started</p>
            <div className="role-cards">
              <button
                className="role-card"
                onClick={() => handleRoleSelect('student')}
              >
                <span className="role-icon">🎓</span>
                <h3>Student</h3>
                <p>Browse advisors, book consultation slots, and manage your thesis journey.</p>
              </button>
              <button
                className="role-card"
                onClick={() => handleRoleSelect('advisor')}
              >
                <span className="role-icon">👨‍🏫</span>
                <h3>Advisor</h3>
                <p>Set your availability, manage bookings, and supervise thesis students.</p>
              </button>
            </div>
            <p className="login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </>
        )}

        {/* Step 2 — Details Form */}
        {step === 2 && (
          <>
            <div className="step-header">
              <button className="btn-back" onClick={() => { setStep(1); setError(null); }}>
                ← Back
              </button>
              <span className="selected-role-badge">
                {role === 'advisor' ? '👨‍🏫 Advisor' : '🎓 Student'}
              </span>
            </div>

            <h2>Fill in your details</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Ahmed Rahman"
                  required
                />
              </div>

              <div className="form-group">
                <label>University Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@university.edu"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              <button type="submit" className="btn-signup" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;