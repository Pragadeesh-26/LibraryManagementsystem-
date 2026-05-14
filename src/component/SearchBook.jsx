import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import { API_BASE_URL } from "../apiConfig";
import "bootstrap/dist/css/bootstrap.min.css";

function SearchBook() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); 

  // Fetch books on component mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setLoading(false);
      });
  }, []);

  // Filter unique genres for the dropdown menu
  const genres = useMemo(() => {
    const allGenres = books.map((b) => b.category?.name).filter(Boolean);
    return ["All", ...new Set(allGenres)];
  }, [books]);

  // Handle multi-criteria filtering: Search Term (Title/Author/Genre) + Genre Dropdown
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = selectedGenre === "All" || book.category?.name === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  // Sanitizes image paths to prevent double /uploads/ errors
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg";
    const cleanPath = imagePath.replace(/^(\/)?uploads\//, "");
    return `${API_BASE_URL}/uploads/${cleanPath}`;
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-white mb-4 fw-bold">Explore Library Collection</h2>

      {/* Search Bar and Genre Filter Controls */}
      <div className="row justify-content-center mb-5 g-2">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm border-primary"
            placeholder="Search by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select 
            className="form-select form-select-lg shadow-sm border-primary"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <h3 className="mt-3">Loading Bookshelf...</h3>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div className="col" key={book.id}>
                <div className="card h-100 shadow border-0 overflow-hidden bg-white">
                  
                  {/* Image & Status Badges */}
                  <div className="position-relative">
                    <img
                      src={getImageUrl(book.image)}
                      className="card-img-top"
                      alt={book.title}
                      style={{ height: "280px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg";
                      }}
                    />
                    {/* Availability Status Badge */}
                    <span className={`position-absolute top-0 end-0 m-2 badge ${book.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {book.status}
                    </span>
                    {/* Genre Category Badge */}
                    <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark opacity-75">
                      {book.category?.name}
                    </span>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title text-dark text-truncate" title={book.title}>
                      {book.title}
                    </h5>
                    <p className="card-text mb-1 text-muted small">
                      By <span className="fw-bold">{book.author?.name || "Unknown Author"}</span>
                    </p>
                    
                    {/* Quantity and Location Section */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span className={`fw-bold ${book.quantity > 0 ? 'text-primary' : 'text-danger'}`}>
                          {book.quantity > 0 ? `${book.quantity} Left` : 'Out of Stock'}
                        </span>
                      </div>
                      <small className="text-secondary bg-light px-2 py-1 rounded border">
                        {book.shelf}
                      </small>
                    </div>
                  </div>

                  {/* Navigation Action */}
                  <div className="card-footer bg-transparent border-0 pb-3">
                    <button 
                       className="btn btn-primary btn-sm w-100 shadow-sm"
                       onClick={() => navigate(`/book-details/${book.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-white mt-5">
              <h4>No matching books found.</h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBook;