import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../apiConfig";

function ReviewFeed() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-white mb-4">Latest School Reviews</h2>
      <div className="row">
        {reviews.map(r => (
          <div className="col-md-6 mb-3" key={r.id}>
            <div className="card shadow-sm p-3">
              <h5 className="text-primary">{r.school?.name}</h5>
              <p className="mb-1">"{r.comment}"</p>
              <div className="d-flex justify-content-between">
                <span className="badge bg-info">Rating: {r.rating}/5</span>
                <small className="text-muted">- {r.student?.name}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewFeed;