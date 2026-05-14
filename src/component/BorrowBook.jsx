import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom"; // FIX: Import useLocation
import { API_BASE_URL } from "../apiConfig"; 
import "bootstrap/dist/css/bootstrap.min.css";

function BorrowBook() {
  const location = useLocation(); // FIX: Initialize location hook
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [students, setStudents] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState("");
  const [borrowerType, setBorrowerType] = useState("MEMBER");

  // FIX: Catch the book ID from the navigation state
  useEffect(() => {
    if (location.state && location.state.bookId) {
      setSelectedBook(location.state.bookId.toString());
    }
  }, [location.state]);

  // Helper to calculate due date object for comparison
  const getDueDateObj = (borrowDateStr) => {
    if (!borrowDateStr) return null;
    const date = new Date(borrowDateStr);
    date.setDate(date.getDate() + 14);
    return date;
  };

  // Helper to check if the return is late or on time
  const getReturnStatusInfo = (borrowDateStr, returnDateStr) => {
    if (!returnDateStr) return { text: "Pending", class: "text-muted" };
    
    const dueDate = getDueDateObj(borrowDateStr);
    const returnDate = new Date(returnDateStr);

    dueDate.setHours(0, 0, 0, 0);
    returnDate.setHours(0, 0, 0, 0);

    if (returnDate > dueDate) {
      return { text: "LATE", class: "text-danger fw-bold" };
    }
    return { text: "ON TIME", class: "text-success fw-bold" };
  };

  const loadData = useCallback(async () => {
    try {
      const [booksRes, membersRes, studentsRes, borrowRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/books`),
        fetch(`${API_BASE_URL}/api/members`),
        fetch(`${API_BASE_URL}/api/students`),
        fetch(`${API_BASE_URL}/api/borrow`),
      ]);

      const booksData = await booksRes.json();
      const membersData = await membersRes.json();
      const studentsData = await studentsRes.json();
      let borrowData = await borrowRes.json();

      if (!Array.isArray(borrowData)) {
        borrowData = borrowData.content || [];
      }

      setBooks(booksData || []);
      setMembers(membersData || []);
      setStudents(studentsData || []);
      setBorrowRecords(borrowData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedBorrower) return alert("Please select all fields.");

    const record = {
      book: { id: parseInt(selectedBook) },
      borrowerType: borrowerType,
      member: borrowerType === "MEMBER" ? { id: parseInt(selectedBorrower) } : null,
      student: borrowerType === "STUDENT" ? { id: parseInt(selectedBorrower) } : null
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      if (response.ok) {
        alert("Book issued!");
        setSelectedBook("");
        setSelectedBorrower("");
        await loadData();
      }
    } catch (error) {
      alert("Error issuing book!");
    }
  };

  const handleReturn = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/borrow/${id}/return`, {
        method: "PUT",
      });

      if (response.ok) {
        alert("Book returned successfully!");
        await loadData();
      }
    } catch (error) {
      alert("Error returning book!");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-white">Issue/Return Center</h2>
      
      <div className="card p-4 shadow mb-5 bg-dark text-white border-primary">
        <form onSubmit={handleBorrow}>
          <div className="row">
            <div className="col-md-12 mb-3 d-flex justify-content-center">
              <div className="btn-group" role="group">
                <button 
                  type="button" 
                  className={`btn ${borrowerType === "MEMBER" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => { setBorrowerType("MEMBER"); setSelectedBorrower(""); }}
                > Member </button>
                <button 
                  type="button" 
                  className={`btn ${borrowerType === "STUDENT" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => { setBorrowerType("STUDENT"); setSelectedBorrower(""); }}
                > Student </button>
              </div>
            </div>

            <div className="col-md-5 mb-3">
              <label className="fw-bold">Select Book</label>
              <select className="form-select" value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
                <option value="">-- Choose Book --</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id} disabled={b.quantity <= 0}>
                    {b.title} {b.quantity <= 0 ? "(OUT OF STOCK)" : `(${b.quantity} Left)`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-5 mb-3">
              <label className="fw-bold">Select {borrowerType === "MEMBER" ? "Member" : "Student"}</label>
              <select className="form-select" value={selectedBorrower} onChange={(e) => setSelectedBorrower(e.target.value)}>
                <option value="">-- Choose {borrowerType} --</option>
                {borrowerType === "MEMBER" 
                  ? members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)
                  : students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)
                }
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end mb-3">
              <button type="submit" className="btn btn-primary w-100 fw-bold">Issue Book</button>
            </div>
          </div>
        </form>
      </div>

      <div className="card p-4 shadow bg-light">
        <h4 className="mb-4 text-primary">Live Borrow Records</h4>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Book</th>
                <th>Borrower</th>
                <th>Type</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowRecords.length > 0 ? (
                borrowRecords.map((r) => {
                  const dueDate = getDueDateObj(r.borrowDate);
                  const statusInfo = getReturnStatusInfo(r.borrowDate, r.returnDate);
                  
                  return (
                    <tr key={r.id}>
                      <td><span className="fw-bold">{r.book?.title}</span></td>
                      <td>{r.member?.name || r.student?.name || "Unknown"}</td>
                      <td>
                        <span className={`badge ${r.borrowerType === 'STUDENT' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                          {r.borrowerType}
                        </span>
                      </td>
                      <td>{r.borrowDate}</td>
                      <td><span className="text-primary fw-bold">{dueDate?.toLocaleDateString() || "N/A"}</span></td>
                      
                      <td>
                        {r.status === "RETURNED" ? (
                          <div>
                            <div>{r.returnDate}</div>
                            <small className={statusInfo.class}>{statusInfo.text}</small>
                          </div>
                        ) : (
                          <span className="text-muted">--</span>
                        )}
                      </td>

                      <td>
                        <span className={`badge rounded-pill ${r.status === 'BORROWED' ? 'bg-warning text-dark' : 'bg-success'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.status === "BORROWED" && (
                          <button className="btn btn-sm btn-success" onClick={() => handleReturn(r.id)}>
                            Return Book
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="8" className="text-center">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BorrowBook;