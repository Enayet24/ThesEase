import { useState, useEffect } from 'react';
import { browseAdvisors, getAdvisorDetails, getFilteredSlots } from '../../services/studentService';
import toast from 'react-hot-toast';
import BookSlot from './BookSlot';
import './AdvisorBrowse.css';

function AdvisorBrowse() {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [expertise, setExpertise] = useState('');
  const [isAccepting, setIsAccepting] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [bookingSlot, setBookingSlot] = useState(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [advisorDetails, setAdvisorDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => { fetchAdvisors(); }, []);

  const fetchAdvisors = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await browseAdvisors(params);
      setAdvisors(res.data);
    } catch {
      setError('Failed to load advisors.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAdvisors({
      ...(search && { search }),
      ...(department && { department }),
      ...(expertise && { expertise }),
      ...(isAccepting !== '' && { isAccepting }),
    });
  };

  const handleReset = () => {
    setSearch(''); setDepartment(''); setExpertise(''); setIsAccepting('');
    fetchAdvisors();
  };

  const handleViewAdvisor = async (advisor) => {
    setSelectedAdvisor(advisor);
    setDetailsLoading(true);
    try {
      const res = await getAdvisorDetails(advisor.user._id);
      setAdvisorDetails(res.data);
    } catch {
      setAdvisorDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedAdvisor(null);
    setAdvisorDetails(null);
    setFilterDate('');
  };

  const handleFilterSlots = async () => {
    if (!selectedAdvisor) return;
    try {
      const res = await getFilteredSlots({
        advisorId: selectedAdvisor.user._id,
        date: filterDate
      });
      setAdvisorDetails({ ...advisorDetails, slots: res.data });
    } catch {
      toast.error('Failed to filter slots');
    }
  };

  const handleBookingComplete = () => {
    setBookingSlot(null);
    // Refresh the advisor details to update slot statuses
    if (selectedAdvisor) handleViewAdvisor(selectedAdvisor);
    toast.success('Slot booked! Check your dashboard.');
  };

  return (
    <div className="browse-container">
      <div className="browse-inner">
        <div className="browse-header">
          <h1>Find an Advisor</h1>
          <p>Browse thesis advisors and book consultation slots</p>
        </div>

        {/* Search/Filter Bar */}
        <form className="filter-bar" onSubmit={handleSearch}>
          <input type="text" placeholder="Search by name..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field filter-input" />
          <input type="text" placeholder="Department..." value={department}
            onChange={e => setDepartment(e.target.value)} className="input-field filter-input" />
          <input type="text" placeholder="Expertise..." value={expertise}
            onChange={e => setExpertise(e.target.value)} className="input-field filter-input" />
          <select value={isAccepting} onChange={e => setIsAccepting(e.target.value)} className="input-field filter-select">
            <option value="">All Status</option>
            <option value="true">Accepting</option>
            <option value="false">Not Accepting</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
        </form>

        {/* Advisors Grid */}
        {loading ? (
          <div className="browse-loading"><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }}></div></div>
        ) : error ? (
          <div className="browse-error">{error}</div>
        ) : advisors.length === 0 ? (
          <div className="browse-empty">
            <span className="empty-icon">🔍</span>
            <p>No advisors found</p>
          </div>
        ) : (
          <div className="advisors-grid">
            {advisors.map(advisor => (
              <div key={advisor._id} className="advisor-card" onClick={() => handleViewAdvisor(advisor)}>
                <div className="advisor-card-header">
                  <div className="advisor-avatar">
                    {advisor.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="advisor-card-info">
                    <h3>{advisor.user.name}</h3>
                    <span className="advisor-dept">{advisor.department}</span>
                  </div>
                </div>

                {/* Tags */}
                {advisor.expertiseTags?.length > 0 && (
                  <div className="advisor-tags">
                    {advisor.expertiseTags.slice(0, 3).map(tag => (
                      <span key={tag} className="expertise-tag">{tag}</span>
                    ))}
                    {advisor.expertiseTags.length > 3 && (
                      <span className="expertise-tag more">+{advisor.expertiseTags.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="advisor-card-footer">
                  <span className={`accepting-badge ${advisor.isAccepting ? 'open' : 'closed'}`}>
                    {advisor.isAccepting ? '● Accepting' : '○ Not Accepting'}
                  </span>
                  <button className="btn-view">View →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advisor Detail Modal */}
      {selectedAdvisor && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>✕</button>

            {detailsLoading ? (
              <div className="modal-loading"><div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }}></div></div>
            ) : (
              <>
                {/* Header */}
                <div className="detail-header">
                  <div className="detail-avatar">{selectedAdvisor.user.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <h2>{selectedAdvisor.user.name}</h2>
                    <span className="detail-dept">{selectedAdvisor.department}</span>
                  </div>
                </div>

                {/* Date Filter */}
                <div className="slot-filter-row">
                  <input type="date" className="input-field" value={filterDate}
                    onChange={e => setFilterDate(e.target.value)} />
                  <button className="btn btn-secondary" onClick={handleFilterSlots}>Filter</button>
                </div>

                {/* Slots List */}
                {!advisorDetails || advisorDetails.slots.length === 0 ? (
                  <div className="modal-empty">No slots available</div>
                ) : (
                  <div className="slots-list">
                    {advisorDetails.slots.map(slot => (
                      <div key={slot._id} className={`slot-row ${slot.status}`}>
                        <div className="slot-row-info">
                          <span className="slot-row-date">
                            {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="slot-row-time">{slot.startTime} – {slot.endTime}</span>
                        </div>
                        <span className={`slot-status ${slot.status}`}>
                          {slot.status === 'available' ? '● Available' : '● Booked'}
                        </span>
                        <button
                          className="btn btn-primary btn-book-slot"
                          disabled={slot.status !== 'available' || !selectedAdvisor.isAccepting}
                          onClick={() => setBookingSlot(slot)}
                        >
                          {slot.status === 'available' ? 'Book' : 'Taken'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingSlot && (
        <BookSlot
          slot={bookingSlot}
          onClose={() => setBookingSlot(null)}
          onBooked={handleBookingComplete}
        />
      )}
    </div>
  );
}

export default AdvisorBrowse;