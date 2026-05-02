import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdvisorProfile, upsertAdvisorProfile } from '../../services/advisorService';
import './AdvisorProfile.css';

function AdvisorProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    department: '',
    bio: '',
    expertiseTags: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Load existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getAdvisorProfile(user._id);
        const { department, bio, expertiseTags } = res.data;
        setFormData({
          department: department || '',
          bio: bio || '',
          expertiseTags: expertiseTags ? expertiseTags.join(', ') : '',
        });
      } catch (err) {
        // No profile yet — form stays empty, that's fine
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user._id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      // Convert comma-separated tags string into an array
      const payload = {
        ...formData,
        expertiseTags: formData.expertiseTags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag !== ''),
      };
      await upsertAdvisorProfile(payload);
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Computer Science & Engineering"
              required
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short bio about yourself..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Expertise Tags</label>
            <input
              type="text"
              name="expertiseTags"
              value={formData.expertiseTags}
              onChange={handleChange}
              placeholder="e.g. Machine Learning, NLP, Computer Vision"
            />
            <small>Separate tags with commas</small>
          </div>

          <div className="tag-preview">
            {formData.expertiseTags
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag !== '')
              .map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdvisorProfile;