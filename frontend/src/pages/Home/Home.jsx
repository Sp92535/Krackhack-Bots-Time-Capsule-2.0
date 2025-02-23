import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../../components/Navbar";
import "./Home.css";
import CapsuleCard from "../../components/CapsuleCard";

const Home = () => {
  const [capsules, setCapsules] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("expiryTime");
  //   alert("Logged out successfully.");
  //   navigate("/login"); // Navigate after logout
  // };
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
  useEffect(() => {

    fetchCapsules();
  }, []);

  return (
    <>
      <Navbar />
      {/* <button onClick={handleLogout}>Logout</button> */}

      <div className="dashboard-container">
        <h1>Your Capsules</h1>
        <div className="capsule-grid">
          {capsules.map((capsule) => (
            <CapsuleCard key={capsule.id} capsule={capsule} fetchCapsules={fetchCapsules} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;