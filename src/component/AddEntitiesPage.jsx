import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";

function AddEntitiesPage() {
  const [authorName, setAuthorName] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [publisherBio, setPublisherBio] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");

  const handleSubmit = async (endpoint, data) => {
    try {
      const res = await fetch(`http://localhost:8081/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(`${endpoint.charAt(0).toUpperCase() + endpoint.slice(1, -1)} added!`);
        if (endpoint === "authors") { setAuthorName(""); setAuthorBio(""); }
        if (endpoint === "publishers") { setPublisherName(""); setPublisherBio(""); }
        if (endpoint === "categories") { setCategoryName(""); setCategoryDesc(""); }
      } else {
        const errorData = await res.text();
        alert(`Error: ${errorData || "Check backend console"}`);
      }
    } catch (err) {
      alert("Connection failed. Is the backend running?");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-white mb-5 fw-bold">Library Registry</h2>
      <div className="row g-4">
        {/* Author Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow border-0 p-3 bg-white bg-opacity-75">
            <h4 className="text-primary border-bottom pb-2">New Author</h4>
            <input className="form-control mb-2" placeholder="Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            <textarea className="form-control mb-3" placeholder="Biography" rows="3" value={authorBio} onChange={(e) => setAuthorBio(e.target.value)} />
            <button className="btn btn-primary mt-auto" onClick={() => handleSubmit("authors", { name: authorName, bio: authorBio })}>Add Author</button>
          </div>
        </div>

        {/* Publisher Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow border-0 p-3 bg-white bg-opacity-75">
            <h4 className="text-success border-bottom pb-2">New Publisher</h4>
            <input className="form-control mb-2" placeholder="Company Name" value={publisherName} onChange={(e) => setPublisherName(e.target.value)} />
            <textarea className="form-control mb-3" placeholder="About" rows="3" value={publisherBio} onChange={(e) => setPublisherBio(e.target.value)} />
            <button className="btn btn-success mt-auto" onClick={() => handleSubmit("publishers", { name: publisherName, bio: publisherBio })}>Add Publisher</button>
          </div>
        </div>

        {/* Category Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow border-0 p-3 bg-white bg-opacity-75">
            <h4 className="text-info border-bottom pb-2">New Category</h4>
            <input className="form-control mb-2" placeholder="Genre/Category" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            <textarea className="form-control mb-3" placeholder="Description" rows="3" value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)} />
            <button className="btn btn-info mt-auto text-white" onClick={() => handleSubmit("categories", { name: categoryName, description: categoryDesc })}>Add Category</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEntitiesPage;
