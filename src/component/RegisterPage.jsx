import React, { useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  // Changed 'username' to 'name' to match your MySQL 'name' column
  const [formData, setFormData] = useState({ name: "", email: "", password: "", libraryCardsId: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Registration Successful! Please login.");
        navigate("/login");
      } else {
        const errorMsg = await res.text();
        alert(`Registration failed: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Connection error:", err);
      alert("Could not connect to the backend server.");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg p-4 border-0 bg-dark text-white">
            <h3 className="text-center text-primary mb-4">Create Account</h3>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" required
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" required
                  onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              {/* Added Library Card ID field as it is NOT NULL in your SQL */}
              <div className="mb-3">
                <label className="form-label">Library Card ID</label>
                <input type="number" className="form-control" required
                  onChange={(e) => setFormData({...formData, libraryCardsId: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" required
                  onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
              <button className="btn btn-primary w-100 py-2 fw-bold">REGISTER</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;