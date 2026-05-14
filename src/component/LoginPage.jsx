import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";

function LoginPage() {
  const [credentials, setCredentials] = useState({ name: "", password: "" });

const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        const user = await res.json(); 
        
        // 1. Save all necessary data
        localStorage.setItem("token", "authenticated_session"); 
        localStorage.setItem("username", user.name); 
        localStorage.setItem("role", user.role); // Important: Store 'ADMIN'
        localStorage.setItem("user", JSON.stringify(user)); // Store full object for easy access

        // 2. Redirect
        window.location.href = "/dashboard"; 
      } else {
        // If 401 occurs, this will show "Invalid password" or "User not found"
        const errorText = await res.text();
        alert(errorText || "Invalid Credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Backend not reachable.");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-lg p-4 border-0 bg-dark text-white rounded-4">
            <h3 className="text-center text-primary fw-bold mb-4">Staff Login</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label text-secondary small">Username</label>
                <input type="text" className="form-control bg-light border-0" required
                  onChange={(e) => setCredentials({...credentials, name: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="form-label text-secondary small">Password</label>
                <input type="password" className="form-control bg-light border-0" required
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
              </div>
              <button className="btn btn-primary w-100 py-2 fw-bold rounded-pill mb-3">SIGN IN</button>
              <p className="text-center small mb-0 text-secondary">
                New staff? <Link to="/register" className="text-info text-decoration-none">Register here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;