import { useState, useEffect } from 'react';
import { getRoutines, addRoutine, updateRoutine, deleteRoutine } from '../../services/advisorService';
import './RoutineManager.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const emptyForm = { dayOfWeek: 'Sunday', startTime: '', endTime: '' };

function RoutineManager() {
  const [routines, setRoutines] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const res = await getRoutines();
      setRoutines(res.data);
    } catch {
      setError('Failed to load routines.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.startTime >= form.endTime) {
      setError('End time must be after start time.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const res = await updateRoutine(editingId, form);
        setRoutines(routines.map(r => r._id === editingId ? res.data.routine : r));
        setEditingId(null);
      } else {
        const res = await addRoutine(form);
        setRoutines([...routines, res.data.routine]);
      }
      setForm(emptyForm);
    } catch {
      setError('Failed to save routine. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (routine) => {
    setEditingId(routine._id);
    setForm({
      dayOfWeek: routine.dayOfWeek,
      startTime: routine.startTime,
      endTime: routine.endTime,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this routine entry?')) return;
    try {
      await deleteRoutine(id);
      setRoutines(routines.filter(r => r._id !== id));
    } catch {
      setError('Failed to delete routine.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  // Group routines by day for display
  const groupedRoutines = DAYS.reduce((acc, day) => {
    const dayRoutines = routines.filter(r => r.dayOfWeek === day);
    if (dayRoutines.length > 0) acc[day] = dayRoutines;
    return acc;
  }, {});

  return (
    <div className="routine-container">
      <div className="routine-inner">
        <h1 className="routine-title">Weekly Consultation Routine</h1>
        <p className="routine-subtitle">
          Set your weekly availability. Students will be able to book slots based on your routine.
        </p>

        {/* Form */}
        <div className="routine-form-card">
          <h2>{editingId ? 'Edit Routine Entry' : 'Add Routine Entry'}</h2>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="routine-form">
            <div className="form-group">
              <label>Day of Week</label>
              <select name="dayOfWeek" value={form.dayOfWeek} onChange={handleChange}>
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
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
                {saving ? 'Saving...' : editingId ? 'Update Entry' : 'Add Entry'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Routine List */}
        <div className="routine-list">
          <h2>Your Current Routine</h2>
          {loading ? (
            <p className="empty-msg">Loading...</p>
          ) : Object.keys(groupedRoutines).length === 0 ? (
            <div className="empty-state">
              <p>No routine entries yet.</p>
              <span>Add your first availability slot above.</span>
            </div>
          ) : (
            DAYS.filter(day => groupedRoutines[day]).map(day => (
              <div key={day} className="day-group">
                <h3 className="day-label">{day}</h3>
                {groupedRoutines[day].map(routine => (
                  <div key={routine._id} className="routine-item">
                    <div className="routine-time">
                      <span className="time-icon">🕐</span>
                      <span>{routine.startTime} – {routine.endTime}</span>
                    </div>
                    <div className="routine-item-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(routine)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(routine._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RoutineManager;