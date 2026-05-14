import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // 1. Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem("token");

  // 2. Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clears token and username
    window.location.href = "/login"; // Forces a full refresh to reset the App state
  };

  // Helper function to apply active styling to current page link
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container-fluid">
        {/* Brand/Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-book-half me-2 text-primary"></i>
          <span className="fw-bold">JP LIBRARY</span>
        </Link>

        {/* Hamburger Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navLibraryMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div className="collapse navbar-collapse" id="navLibraryMenu">
          <ul className="navbar-nav ms-auto gap-2 align-items-center">
            
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/home")}`} to="/home">Vault</Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive("/dashboard")}`} to="/dashboard">Dashboard</Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive("/search")}`} to="/search">
                <i className="bi bi-search me-1"></i>Search
              </Link>
            </li>

            {/* Library Management Dropdown */}
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle btn btn-link border-0" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Management
              </button>
              <ul className="dropdown-menu dropdown-menu-dark shadow">
                <li><Link className="dropdown-item" to="/add-book">Add New Book</Link></li>
                <li><Link className="dropdown-item" to="/add-entity">Authors & Publishers</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/add-members">Member Registry</Link></li>
                <li><Link className="dropdown-item" to="/book-borrow">Issue/Return Book</Link></li>
              </ul>
            </li>

            {/* School Review System Dropdown */}
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle btn btn-link border-0" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                School System
              </button>
              <ul className="dropdown-menu dropdown-menu-dark shadow">
                <li><Link className="dropdown-item" to="/add-school">Register School</Link></li>
                <li><Link className="dropdown-item" to="/add-student">Register Student</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/post-review">Write a Review</Link></li>
                <li><Link className="dropdown-item" to="/review-feed">Review Feed</Link></li>
              </ul>
            </li>

            {/* 3. THE TOGGLE BUTTON */}
            <li className="nav-item ms-lg-2">
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-danger px-4 rounded-pill fw-bold"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  className="btn btn-primary px-4 rounded-pill fw-bold" 
                  to="/login"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;