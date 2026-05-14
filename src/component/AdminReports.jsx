import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../apiConfig";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminReports() {
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFines: 0,
    activeLoans: 0,
    totalBooks: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const overdueRes = await fetch(`${API_BASE_URL}/api/borrow/overdue`);
      
      // Safety Check: If 404 or 500, don't try to parse as JSON list
      if (!overdueRes.ok) {
          throw new Error("Endpoint not found or Server Error");
      }

      const overdueData = await overdueRes.json();
      
      // Ensure overdueData is actually an array before setting state
      const safeData = Array.isArray(overdueData) ? overdueData : [];
      setDefaulters(safeData);

      const totalFine = safeData.reduce((acc, curr) => acc + (curr.fineAmount || 0), 0);
      setStats(prev => ({
        ...prev,
        totalFines: totalFine,
        activeLoans: safeData.length
      }));

    } catch (error) {
      console.error("Error fetching report data:", error);
      setDefaulters([]); // Reset to empty array on error to prevent .map crash
    } finally {
      setLoading(false);
    }
};
  // Helper function to calculate how many days have passed since the due date
  const calculateDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(today - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return today > due ? diffDays : 0;
  };

  if (loading) return <div className="text-center mt-5">Loading Admin Reports...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">Admin Analytics Dashboard</h2>

      {/* --- Quick Stats Row --- */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white shadow-sm p-3">
            <h6>Total Pending Fines</h6>
            <h3>₹{stats.totalFines.toFixed(2)}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="col card bg-warning text-dark shadow-sm p-3">
            <h6>Overdue Items</h6>
            <h3>{defaulters.length} Books</h3>
          </div>
        </div>
      </div>

      {/* --- Defaulters Table --- */}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-danger text-white py-3">
          <h4 className="mb-0">🚨 Overdue Alert (Defaulters)</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Student/Member</th>
                  <th>Book Title</th>
                  <th>Due Date</th>
                  <th>Days Overdue</th>
                  <th>Estimated Fine</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No overdue books found. Great job!
                    </td>
                  </tr>
                ) : (
                  defaulters.map((d) => (
                    <tr key={d.id}>
                      <td className="fw-bold">
                        {d.student ? d.student.name : d.member ? d.member.name : "Unknown"}
                      </td>
                      <td>{d.book.title}</td>
                      <td>{new Date(d.dueDate).toLocaleDateString()}</td>
                      <td>
                        <span className="badge bg-danger">
                          {calculateDaysOverdue(d.dueDate)} Days
                        </span>
                      </td>
                      <td className="text-danger fw-bold">
                        ₹{(calculateDaysOverdue(d.dueDate) * 5).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-4 text-end">
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchData}>
          🔄 Refresh Reports
        </button>
      </div>
    </div>
  );
}

export default AdminReports;