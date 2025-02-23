import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Home.css";
import CapsuleCarousel from "../CapsuleCarousel/CapsuleCarousel";

const Home = () => {
  const [capsules, setCapsules] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    alert("Logged out successfully.");
    navigate("/login");
  };

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:6969/api/capsule/my-capsules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setCapsules(Array.isArray(data.capsules) ? data.capsules : []);
      } catch (error) {
        console.error("Error fetching capsules:", error);
      }
    };

    fetchCapsules();
  }, []);

  return (
    <>
      <Navbar />
      <button onClick={handleLogout}>Logout</button>

      <div className="dashboard-container">
        <h1>Your Capsules</h1>

        <div className="capsule-grid">
          {capsules.length > 0 ? (
            capsules.map((capsule) => (
              <div
                key={capsule.id}
                className="capsule-item"
                onClick={() => navigate(`/carousel/${capsule.id}`)} // Navigate on click
                style={{ cursor: "pointer" }} // Indicate clickable item
              >
                <CapsuleCarousel capsuleId={capsule.id} />
              </div>
            ))
          ) : (
            <p>No capsules available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
