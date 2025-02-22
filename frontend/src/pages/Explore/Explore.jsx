import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";
import Navbar from "../../components/Navbar";
import CapsuleCard from "../../components/CapsuleCard";

const Explore = () => {
  const [capsules, setCapsules] = useState([]);
  const navigate = useNavigate();

  const handleCreateCapsule = () => {
    navigate("/create-capsule"); // Redirect to the form for creating a new capsule
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    alert("Logged out successfully.");
    navigate("/login"); // Redirect to login page after logout
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

          {capsules.map((capsule) => (
            <CapsuleCard
              key={capsule.id}
              title={capsule.title}
              creator={capsule.creator}
              openDate={capsule.openDate}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
