import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../apiConfig";

function AddStudent() {
  const [student, setStudent] = useState({
    name: "",
    place: "",
    schoolId: ""
  });
  const [schools, setSchools] = useState([]);

  // Fetch schools so the user can select one from a dropdown
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/school`)
      .then((res) => res.json())
      .then((data) => setSchools(data))
      .catch((err) => console.error("Error fetching schools:", err));
  }, []);

  // 1. DEFINING THE MISSING FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data - ensuring schoolId is a Number
    const payload = {
      name: student.name,
      place: student.place,
      schoolId: Number(student.schoolId) 
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Student registered successfully! 🎉");
        setStudent({ name: "", place: "", schoolId: "" }); // Reset form
      } else {
        const errorMsg = await response.text();
        alert("Server Error: " + errorMsg);
      }
    } catch (err) {
      console.error("Connection failed:", err);
      alert("Could not connect to the Java backend.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 bg-dark text-white p-4">
            <h2 className="text-center text-primary mb-4">Add New Student</h2>
            
            {/* 2. ATTACHING THE FUNCTION */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={student.name}
                  onChange={(e) => setStudent({...student, name: e.target.value})}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Place (Town/City)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={student.place}
                  onChange={(e) => setStudent({...student, place: e.target.value})}
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Select School</label>
                <select 
                  className="form-select" 
                  value={student.schoolId}
                  onChange={(e) => setStudent({...student, schoolId: e.target.value})}
                  required
                >
                  <option value="">-- Choose School --</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                REGISTER STUDENT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;