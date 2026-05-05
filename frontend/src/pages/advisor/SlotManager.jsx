import { useState, useEffect } from 'react';
import { createSlot, getAdvisorSlots, updateSlot, deleteSlot } from '../../services/slotService';
import './SlotManager.css';

const emptyForm = { date: '', startTime: '', endTime: '' };

function SlotManager() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => { fetchSlots(); }, []);

  const fetchSlots = async () => {
    try {
      const res = await getAdvisorSlots();
      setSlots(res.data);
    } catch {
      setError('Failed to load slots.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.startTime >= form.endTime) {
      setError('End time must be after start time.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (editingId) {
        const res = await updateSlot(editingId, form);
        setSlots(slots.map(s => s._id === editingId ? res.data.slot : s));
        setSuccess('Slot updated successfully!');
        setEditingId(null);
      } else {
        const res = await createSlot(form);
        setSlots([...slots, res.data.slot]);
        setSuccess('Slot created successfully!');
      }
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save slot.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (slot) => {
    setEditingId(slot._id);
    setForm({
      date: slot.date.split('T')[0],
      startTime: slot.startTime,
      endTime: slot.endTime
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await deleteSlot(id);
      setSlots(slots.filter(s => s._id !== id));
      setSuccess('Slot deleted.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete slot.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const available = slots.filter(s => s.status === 'available');
  const booked = slots.filter(s => s.status === 'booked');

  return (
    <div className="slot-manager-container">
      <div className="slot-manager-inner">
        <h1 className="slot-manager-title">Manage Consultation Slots</h1>
        <p className="slot-manager-subtitle">Create and manage your available consultation slots.</p>

        {/* Form */}
        <div className="slot-form-card">
          <h2>{editingId ? 'Edit Slot' : 'Create New Slot'}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="slot-form">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Slot' : 'Create Slot'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Stats */}
        <div className="slot-stats">
          <div className="slot-stat available">
            <span>{available.length}</span>
            <p>Available</p>
          </div>
          <div className="slot-stat booked">
            <span>{booked.length}</span>
            <p>Booked</p>
          </div>
          <div className="slot-stat total">
            <span>{slots.length}</span>
            <p>Total</p>
          </div>
        </div>

        {/* Slot List */}
        <div className="slot-list-card">
          <h2>Your Slots</h2>
          {loading ? (
            <p className="empty-msg">Loading slots...</p>
          ) : slots.length === 0 ? (
            <div className="empty-state">
              <p>No slots created yet.</p>
              <span>Use the form above to create your first slot.</span>
            </div>
          ) : (
            <div className="slot-list">
              {slots.map(slot => (
                <div key={slot._id} className={`slot-item ${slot.status}`}>
                  <div className="slot-item-date">
                    <span className="slot-day">
                      {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="slot-full-date">
                      {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="slot-item-time">
                    {slot.startTime} – {slot.endTime}
                  </div>
                  <span className={`slot-badge ${slot.status}`}>
                    {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                  </span>
                  {slot.status === 'available' && (
                    <div className="slot-item-actions">
                      <button className="btn-edit" onClick={() => handleEdit(slot)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(slot._id)}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlotManager;