import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Explore.css";
import Navbar from "../../components/Navbar";
import CapsuleCard from "../../components/CapsuleCard";

const Explore = () => {
  const [myCapsules, setMyCapsules] = useState([]);
  const [allCapsules, setAllCapsules] = useState([]);
  const navigate = useNavigate();

  // Fetch all public capsules
  useEffect(() => {
    const fetchAllCapsules = async () => {
      try {
        const response = await axios.get("http://localhost:6969/api/capsule/all-capsules");
        // If the response is directly an array, use it; otherwise, check if it's nested under a property.\n
        setAllCapsules(Array.isArray(response.data) ? response.data : response.data.capsules || []);
      } catch (error) {
        console.error("Error fetching all capsules:", error);
      }
    };

    fetchAllCapsules();
  }, []);

  const handleCreateCapsule = () => {
    navigate("/create-capsule");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    alert("Logged out successfully.");
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <button onClick={handleLogout}>Logout</button>
      <div className="explore-container">
        <h1>Discover the Digital Time Capsule</h1>
        <p>Explore how our platform works and start preserving memories today!</p>
        <div className="capsules-container">
          <div className="capsule-card create-capsule" onClick={handleCreateCapsule}>
            <h3>Create New Capsule</h3>
            <p>Click here to create a new digital time capsule</p>
          </div>
          {myCapsules.map((capsule) => (
            <CapsuleCard
              key={capsule.id}
              title={capsule.title}
              creator={capsule.creator}
              openDate={capsule.openDate}
              isLocked={capsule.isLocked}
            />
          ))}
        </div>
        {/* All Public Capsules Section */}
        <div className="all-capsules-section">
          <h2>All Capsules</h2>
          <div className="capsules-container">
            {allCapsules.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                title={capsule.title}
                creator={capsule.creator}
                openDate={capsule.openDate}
                isLocked={capsule.isLocked}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
