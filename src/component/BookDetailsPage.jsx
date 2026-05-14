import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig"; 
import "bootstrap/dist/css/bootstrap.min.css";

function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Failed to fetch book", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const cleanPath = imagePath.replace(/^(\/)?uploads\//, "");
    return `${API_BASE_URL}/uploads/${cleanPath}`;
  };

  if (loading) return <div className="text-center mt-5 text-white"><h4>Loading Details...</h4></div>;
  if (!book) return <div className="text-center mt-5 text-white"><h4>Book not found.</h4></div>;

  // Type-safe quantity check
  const isAvailable = Number(book.quantity) > 0;

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div 
        className="card shadow-lg border-0 overflow-hidden" 
        style={{ maxWidth: "1000px", width: "100%", backgroundColor: "#ffffff", borderRadius: "20px" }}
      >
        <div className="row g-0">
          
          {/* Left Section: Book Cover Image */}
          <div className="col-md-5 bg-light d-flex align-items-center justify-content-center p-4" style={{ borderRight: "1px solid #f1f5f9" }}>
            {book.image ? (
              <img
                src={getImageUrl(book.image)}
                alt={book.title}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "450px", objectFit: "contain" }}
                onError={(e) => {
                  e.target.src = "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg";
                }}
              />
            ) : (
              <div className="text-muted fw-bold">No Image Available</div>
            )}
          </div>

          {/* Right Section: Organized Book Info */}
          <div className="col-md-7 p-5 d-flex flex-column">
            <div className="mb-2">
              <span className="badge bg-primary px-3 py-2 text-uppercase" style={{ fontSize: "0.75rem" }}>
                {book.category?.name || "General"}
              </span>
            </div>
            
            <h2 className="fw-bold mb-1" style={{ color: "#0f172a", fontSize: "2.2rem" }}>{book.title}</h2>
            <p className="text-muted mb-4">By <span className="fw-bold text-dark">{book.author?.name || "Unknown Author"}</span></p>

            <div className="mb-4">
              <h6 className="text-uppercase fw-bold text-muted small mb-2">Description</h6>
              <p style={{ color: "#334155", lineHeight: "1.6", margin: 0 }}>
                {book.description || "No description provided for this title."}
              </p>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <h6 className="text-uppercase fw-bold text-muted small mb-1">Shelf Location</h6>
                <p className="fw-bold mb-0" style={{ color: "#0f172a" }}>{book.shelf || "N/A"}</p>
              </div>
              <div className="col-6">
                <h6 className="text-uppercase fw-bold text-muted small mb-1">Stock Status</h6>
                <span className={`badge ${isAvailable ? "bg-success" : "bg-danger"}`}>
                  {isAvailable ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </div>
              <div className="col-6">
                <h6 className="text-uppercase fw-bold text-muted small mb-1">Publisher</h6>
                <p className="fw-bold mb-0" style={{ color: "#0f172a" }}>{book.publisher?.name || "Unknown"}</p>
              </div>
              <div className="col-6">
                <h6 className="text-uppercase fw-bold text-muted small mb-1">Available Quantity</h6>
                <p className="fw-bold mb-0" style={{ color: "#3b82f6", fontSize: "1.1rem" }}>
                  {book.quantity ?? 0} Copies
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto">
              <div className="d-grid gap-2">
                <button 
                  className={`btn btn-lg fw-bold py-3 shadow-sm ${isAvailable ? 'btn-success' : 'btn-secondary'}`}
                  disabled={!isAvailable}
                  onClick={() => navigate('/book-borrow', { state: { bookId: book.id } })}
                >
                  {isAvailable ? "Borrow This Book" : "Currently Unavailable"}
                </button>
                <button className="btn btn-outline-dark fw-bold py-2" onClick={() => navigate(-1)}>
                  ← Back to Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPage;