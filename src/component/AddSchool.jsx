import React, { useState } from "react";
import { API_BASE_URL } from "../apiConfig";

function AddSchool() {
  const [schoolName, setSchoolName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/school`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // CRITICAL: The key here MUST be "name" to match the Java private String name;
        body: JSON.stringify({ name: schoolName }), 
      });

      if (response.ok) {
        alert("School added successfully!");
        setSchoolName(""); // Clear input
      } else {
        // If status 400, this will help you see the exact reason
        const errorData = await response.text();
        console.error("Server Error:", errorData);
        alert("Failed to add school. Check console for details.");
      }
    } catch (err) {
      console.error("Network Error:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow bg-dark text-white border-0">
        <h3>Adding New School</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">School Name</label>
            <input
              type="text"
              className="form-control"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100">Add School</button>
        </form>
      </div>
    </div>
  );
}

export default AddSchool;