import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";

function HomePage() {
  const [groupedBooks, setGroupedBooks] = useState({});

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("http://localhost:8081/api/books");
        
        if (!res.ok) {
          console.error(`Server error: ${res.status}`);
          setGroupedBooks({});
          return;
        }

        const text = await res.text();
        if (!text || text.trim().length === 0) {
          setGroupedBooks({});
          return;
        }

        const data = JSON.parse(text);

        // 1. Sort ALL books by title first
        const sortedData = data.sort((a, b) => 
          a.title.localeCompare(b.title)
        );
        
        // 2. Group the already-sorted books into categories
        const groups = sortedData.reduce((acc, book) => {
          const genre = book.category?.name || "General";
          if (!acc[genre]) acc[genre] = [];
          acc[genre].push(book);
          return acc;
        }, {});

        // 3. Sort the Category keys themselves alphabetically
        const sortedGroups = Object.keys(groups)
          .sort()
          .reduce((acc, key) => {
            acc[key] = groups[key];
            return acc;
          }, {});
        
        setGroupedBooks(sortedGroups);
      } catch (e) {
        console.error("Fetch failed:", e);
        setGroupedBooks({});
      }
    }
    fetchBooks();
  }, []);

  return (
    <div className="home-container">
      <h2 className="home-main-title">Library Collections</h2>
      
      {Object.entries(groupedBooks).length === 0 ? (
        <p className="text-center text-white">No books available in the vault.</p>
      ) : (
        Object.entries(groupedBooks).map(([genre, books]) => (
          <div key={genre} className="mb-5">
            <h4 className="genre-title">{genre}</h4>
            <div className="vault-scroll-container">
              {books.map((book) => (
                <Link to={`/books/${book.id}`} key={book.id} className="text-decoration-none">
                  <div className="card vault-card h-100">
                    {book.image ? (
                      <img 
                        src={`http://localhost:8081${book.image}`} 
                        className="card-img-top" 
                        alt={book.title} 
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "250px", color: "#64748b" }}>
                        No Image
                      </div>
                    )}
                    <div className="card-body">
                      <h6 className="card-title text-center">{book.title}</h6>
                      <p className="card-text text-center text-muted small mb-0">
                        Shelf: {book.shelf || "N/A"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HomePage;