import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore/Explore";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login"; // Import Login Page
import Signup from "./pages/SignUp/Signup"; // Import Signup Page
import AuthContainer from "./components/AuthContainer/AuthContainer"; // Import AuthContainer
import "./index.css"; // Global styles

const App = () => {
  return (
    <Router>
      <AuthRoutes />
    </Router>
  );
};

const AuthRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryTime = localStorage.getItem("expiryTime");

    if (token && expiryTime) {
      const currentTime = new Date().getTime();
      if (currentTime > expiryTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("expiryTime");
        alert("Session expired. Please log in again.");
        navigate("/login"); // Redirect to login if token expired
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/home" element={<Home />} />

      {/* Wrap Login and Signup inside AuthContainer */}
      <Route
        path="/login"
        element={
          <AuthContainer />
        }
      />
      <Route
        path="/signup"
        element={
          <AuthContainer />
        }
      />
    </Routes>
  );
};

export default App;
