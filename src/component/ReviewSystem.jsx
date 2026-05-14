import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../apiConfig";

function ReviewSystem() {
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/school`).then(res => res.json()).then(data => setSchools(data));
    fetch(`${API_BASE_URL}/api/students`).then(res => res.json()).then(data => setStudents(data));
  }, []);

  const handleReview = async (e) => {
    e.preventDefault();
    const reviewPayload = {
      school: { id: selectedSchool },
      student: { id: selectedStudent },
      rating,
      comment
    };

    const res = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewPayload)
    });
    if (res.ok) alert("Review Posted!");
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-lg border-primary">
        <h4 className="text-primary">Post a School Review</h4>
        <form onSubmit={handleReview}>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label>Select School</label>
              <select className="form-select" onChange={e => setSelectedSchool(e.target.value)}>
                <option>-- School --</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="col-md-6 mb-2">
              <label>Reviewing as Student:</label>
              <select className="form-select" onChange={e => setSelectedStudent(e.target.value)}>
                <option>-- Student --</option>
                {students.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
              </select>
            </div>
          </div>
          <div className="my-3">
            <label>Rating: {rating}/5</label>
            <input type="range" className="form-range" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} />
          </div>
          <textarea className="form-control mb-3" placeholder="Write review..." onChange={e => setComment(e.target.value)} />
          <button className="btn btn-primary w-100">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
}
export default ReviewSystem;