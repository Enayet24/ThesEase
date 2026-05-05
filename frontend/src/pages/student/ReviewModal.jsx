import { useState } from 'react';
import { submitReview } from '../../services/slotService';
import './ReviewModal.css';

function ReviewModal({ booking, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating.'); return; }
    setLoading(true);
    setError(null);
    try {
      await submitReview(booking._id, { rating, comment });
      setSuccess(true);
      setTimeout(() => {
        onSubmitted && onSubmitted();
        onClose && onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-overlay" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Rate Your Consultation</h2>
        <p className="review-subtitle">with <strong>{booking.advisor?.name}</strong></p>

        {success ? (
          <div className="review-success">
            <span>⭐</span>
            <p>Review submitted! Thank you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="review-form">
            {/* Star Rating */}
            <div className="star-rating">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= (hovered || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="rating-label">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>

            <div className="form-group">
              <label>Comment (optional)</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="btn-submit-review" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReviewModal;