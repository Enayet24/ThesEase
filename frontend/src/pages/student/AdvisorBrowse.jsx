import { useState, useEffect } from 'react';
import { browseAdvisors, getAdvisorDetails, getFilteredSlots } from '../../services/studentService';
import './AdvisorBrowse.css';

import BookSlot from './BookSlot'; 



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

  useEffect(() => {
    fetchAdvisors();
  }, []);

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
    setSearch('');
    setDepartment('');
    setExpertise('');
    setIsAccepting('');
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
      console.error("Failed to fetch filtered slots");
    }
  };

  return (
    <div className="browse-container">
      <div className="browse-inner">

        <div className="browse-header">
          <h1>Find an Advisor</h1>
        </div>

        <form className="filter-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Department..."
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Expertise..."
            value={expertise}
            onChange={e => setExpertise(e.target.value)}
            className="filter-input"
          />
          <select
            value={isAccepting}
            onChange={e => setIsAccepting(e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="true">Accepting</option>
            <option value="false">Not Accepting</option>
          </select>
          <button type="submit" className="btn-search">Search</button>
          <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
        </form>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : advisors.length === 0 ? (
          <div>No advisors found</div>
        ) : (
          <div className="advisors-grid">
            {advisors.map(advisor => (
              <div key={advisor._id} className="advisor-card">
                <h3>{advisor.user.name}</h3>
                <p>{advisor.department}</p>

                <button onClick={() => handleViewAdvisor(advisor)}>
                  View Profile & Slots
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAdvisor && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseModal}>X</button>

            {detailsLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <h2>{selectedAdvisor.user.name}</h2>
                <p>{selectedAdvisor.department}</p>

                {/* 🔥 Filter */}
                <div>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                  <button onClick={handleFilterSlots}>
                    Filter Slots
                  </button>
                </div>

                {/* 🔥 Slots */}
                {!advisorDetails || advisorDetails.slots.length === 0 ? (
                  <p>No slots available</p>
                ) : (
                  advisorDetails.slots.map(slot => (
                    <div key={slot._id}>
                      {slot.startTime} - {slot.endTime} |{" "}
                      <span style={{
                        color: slot.status === "available" ? "green" : "red"
                      }}>
                        {slot.status === "available" ? "Available" : "Booked"}
                      </span>

                      <button
                        className="btn-book"
                        disabled={!selectedAdvisor.isAccepting}
                        onClick={() => setBookingSlot(slot)}
                      >
                        Book
                      </button>

                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}

      {bookingSlot && (
        <BookSlot
        slot={bookingSlot}
        onClose={() => setBookingSlot(null)}
        onBooking={() => {
          setBookingSlot(null);
          handleCloseModal();
          }}
        />
      )}

    </div>
  );
}

export default AdvisorBrowse;