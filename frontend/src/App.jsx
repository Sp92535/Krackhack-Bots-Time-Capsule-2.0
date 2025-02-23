import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore/Explore";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/Signup";
import AuthContainer from "./components/AuthContainer/AuthContainer";
import CreateCapsule from "./pages/CreateCapsule/CreateCapsule"; // Import CreateCapsule
import "./index.css"; // Global styles
import CapsuleUploadPage from "./pages/CapsuleUploadPage/CapsuleUploadPage";
import "./pages/CreateCapsule/CreateCapsule.css"; // Import capsule styles
import CapsuleCarousel from "./pages/CapsuleCarousel/CapsuleCarousel";

const App = () => {
  return (
    <Router>
      {/* <Navbar /> */}
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
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create-capsule" element={<CreateCapsule />} />
      <Route path="/login" element={<AuthContainer />} />
      <Route path="/signup" element={<AuthContainer />} />
      <Route path="/capsule/:id" element={<CapsuleUploadPage />} />
      <Route path="/capsule/view/:id" element={<CapsuleCarousel />} />
    </Routes>
  );
};

export default App;
