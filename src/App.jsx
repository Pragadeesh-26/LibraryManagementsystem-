import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout
import Navbar from "./component/Navbar";

// Core Pages
import HomePage from "./component/HomePage";
import SearchBook from "./component/SearchBook";
import BookDetailsPage from "./component/BookDetailsPage";

// Management & Admin Pages
import Dashboard from "./component/Dashboard";
import LoginPage from "./component/LoginPage"; 
import RegisterPage from "./component/RegisterPage";

// Library Forms
import AddBook from "./component/AddBook";
import AddEntitiesPage from "./component/AddEntitiesPage";
import AddMemberPage from "./component/AddMemberPage";
import BorrowBook from "./component/BorrowBook";

// School & Review System
import AddSchool from "./component/AddSchool";    
import AddStudent from "./component/AddStudent";   
import ReviewSystem from "./component/ReviewSystem"; 
import ReviewFeed from "./component/ReviewFeed"; 
import AdminReports from "./component/AdminReports";

function App() {
  // Check if the admin has a session token in browser memory
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* Navbar stays hidden until the Admin is authenticated */}
      {isAuthenticated && <Navbar />}

      <div className="container-fluid p-0">
        <Routes>
          {/* AUTHENTICATION GATES */}
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />

          {/* PROTECTED ROUTES: If token is missing, kick back to /login */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/search" element={isAuthenticated ? <SearchBook /> : <Navigate to="/login" />} />
          <Route path="/books/:id" element={isAuthenticated ? <BookDetailsPage /> : <Navigate to="/login" />} />
          <Route path="/book-details/:id" element={isAuthenticated ? <BookDetailsPage /> : <Navigate to="/login" />} />
          
          {/* LIBRARY MANAGEMENT */}
          <Route path="/add-book" element={isAuthenticated ? <AddBook /> : <Navigate to="/login" />} />
          <Route path="/add-entity" element={isAuthenticated ? <AddEntitiesPage /> : <Navigate to="/login" />} />
          <Route path="/add-members" element={isAuthenticated ? <AddMemberPage /> : <Navigate to="/login" />} />
          <Route path="/book-borrow" element={isAuthenticated ? <BorrowBook /> : <Navigate to="/login" />} />

          {/* SCHOOL & REVIEW SYSTEM */}
          <Route path="/add-school" element={isAuthenticated ? <AddSchool /> : <Navigate to="/login" />} />
          <Route path="/add-student" element={isAuthenticated ? <AddStudent /> : <Navigate to="/login" />} />
          <Route path="/post-review" element={isAuthenticated ? <ReviewSystem /> : <Navigate to="/login" />} />
          <Route path="/review-feed" element={isAuthenticated ? <ReviewFeed /> : <Navigate to="/login" />} />

          {/* CATCH-ALL: Any unknown path forces a login check */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;