import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import AdminReports from "../component/AdminReports"; // Path is correct based on your previous error

function Dashboard() {
  const [stats, setStats] = useState({ books: 0, members: 0, borrowed: 0 });
  const [loading, setLoading] = useState(true);
  const adminName = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, membersRes, borrowRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/books`),
          fetch(`${API_BASE_URL}/api/members`),
          fetch(`${API_BASE_URL}/api/borrow`)
        ]);

        const booksData = booksRes.ok ? await booksRes.json() : [];
        const membersData = membersRes.ok ? await membersRes.json() : [];
        const borrowData = borrowRes.ok ? await borrowRes.json() : [];

        setStats({
          books: Array.isArray(booksData) ? booksData.length : 0,
          members: Array.isArray(membersData) ? membersData.length : 0,
          borrowed: Array.isArray(borrowData) 
            ? borrowData.filter(r => r.status === 'BORROWED').length 
            : 0
        });
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-5 text-white">Loading Analytics...</div>;

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-5 bg-dark p-3 rounded-4 shadow-lg border border-secondary">
        <div>
          <h2 className="text-white fw-bold mb-0">Vanakkam, {adminName}!</h2>
          <small className="text-info font-monospace">System Status: Online</small>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
          Logout
        </button>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="row g-4 mb-5"> {/* Added mb-5 for spacing */}
        <div className="col-md-4">
          <div className="card h-100 border-0 border-start border-primary border-5 shadow">
            <div className="card-body">
              <h6 className="text-muted small fw-bold">Total Books</h6>
              <h2 className="mb-0 fw-bold">{stats.books}</h2>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 border-0 border-start border-success border-5 shadow">
            <div className="card-body">
              <h6 className="text-muted small fw-bold">Active Members</h6>
              <h2 className="mb-0 fw-bold">{stats.members}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 border-start border-warning border-5 shadow">
            <div className="card-body">
              <h6 className="text-muted small fw-bold">Borrowed Books</h6>
              <h2 className="mb-0 fw-bold">{stats.borrowed}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* 🚨 THE MISSION CRITICAL LINE: Inserting the AdminReports Component */}
      <div className="mt-5">
         <AdminReports />
      </div>

    </div>
  );
}

export default Dashboard;