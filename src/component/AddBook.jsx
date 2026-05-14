import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../apiConfig";
import "bootstrap/dist/css/bootstrap.min.css";

function AddBook() {
  // Form State
  const [bookTitle, setBookTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shelf, setShelf] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1); 
  const [imageFile, setImageFile] = useState(null);

  // Search text states to allow typing in the boxes
  const [authorSearch, setAuthorSearch] = useState("");
  const [publisherSearch, setPublisherSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // Dropdown Data State
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);

 // Fetch dropdown data on component load
  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const [authorsRes, publishersRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/authors`),
          fetch(`${API_BASE_URL}/api/publishers`),
          fetch(`${API_BASE_URL}/api/categories`),
        ]);

        const authorsData = await authorsRes.json();
        const publishersData = await publishersRes.json();
        const categoriesData = await categoriesRes.json();

        // Sort data alphabetically by name using localeCompare
        setAuthors(authorsData.sort((a, b) => a.name.localeCompare(b.name)));
        setPublishers(publishersData.sort((a, b) => a.name.localeCompare(b.name)));
        setCategories(categoriesData.sort((a, b) => a.name.localeCompare(b.name)));

      } catch (err) { 
        console.error("Dropdown fetch failed:", err); 
      }
    }
    fetchDropdowns();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Check if IDs are set (prevents submitting random text)
    if (!authorId || !publisherId || !categoryId) {
        alert("Please select a valid Author, Publisher, and Category from the list.");
        return;
    }

    const formData = new FormData();
    formData.append("title", bookTitle);
    formData.append("authorId", authorId);
    formData.append("publisherId", publisherId);
    formData.append("categoryId", categoryId);
    formData.append("shelf", shelf);
    formData.append("description", description);
    formData.append("quantity", quantity); 

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/books`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Book added to the Vault successfully!");
        setBookTitle("");
        setAuthorId("");
        setPublisherId("");
        setCategoryId("");
        setAuthorSearch("");
        setPublisherSearch("");
        setCategorySearch("");
        setShelf("");
        setDescription("");
        setQuantity(1);
        setImageFile(null);
      } else {
        const errorMsg = await response.text();
        alert(`Failed to add book. Server responded with ${response.status}`);
      }
    } catch (err) {
      alert("Network error. Please check if the backend server is running.");
    }
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "800px", borderRadius: "15px" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Add a New Book</h2>
        <form onSubmit={handleSubmit}>
          
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-bold">Book Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={bookTitle} 
              onChange={(e) => setBookTitle(e.target.value)} 
              placeholder="e.g. Ponniyin Selvan"
              required 
            />
          </div>
          
          {/* Searchable Dropdowns Row */}
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Author</label>
              <input
                list="authorList"
                className="form-control"
                value={authorSearch}
                onChange={(e) => {
                    setAuthorSearch(e.target.value);
                    const selected = authors.find(a => a.name === e.target.value);
                    if (selected) setAuthorId(selected.id);
                }}
                placeholder="Type to search..."
                required
              />
              <datalist id="authorList">
                {authors.map(a => <option key={a.id} value={a.name} />)}
              </datalist>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Publisher</label>
              <input
                list="publisherList"
                className="form-control"
                value={publisherSearch}
                onChange={(e) => {
                    setPublisherSearch(e.target.value);
                    const selected = publishers.find(p => p.name === e.target.value);
                    if (selected) setPublisherId(selected.id);
                }}
                placeholder="Type to search..."
                required
              />
              <datalist id="publisherList">
                {publishers.map(p => <option key={p.id} value={p.name} />)}
              </datalist>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Category</label>
              <input
                list="categoryList"
                className="form-control"
                value={categorySearch}
                onChange={(e) => {
                    setCategorySearch(e.target.value);
                    const selected = categories.find(c => c.name === e.target.value);
                    if (selected) setCategoryId(selected.id);
                }}
                placeholder="Type to search..."
                required
              />
              <datalist id="categoryList">
                {categories.map(c => <option key={c.id} value={c.name} />)}
              </datalist>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Shelf Location</label>
              <input 
                type="text" 
                className="form-control" 
                value={shelf} 
                onChange={(e) => setShelf(e.target.value)} 
                placeholder="e.g. HF-01"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Quantity (Stock)</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea 
              className="form-control" 
              rows="3" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Brief summary of the book..."
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Cover Image</label>
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files[0])} 
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
            Add Book to Vault
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBook;