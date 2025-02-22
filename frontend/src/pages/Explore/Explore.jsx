import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Explore.css";
import Navbar from "../../components/Navbar";
import CapsuleCard from "../../components/CapsuleCard";

const Explore = () => {
  const [capsules, setCapsules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/capsules");
        setCapsules(response.data);
      } catch (error) {
        console.error("Error fetching capsules:", error);
      }
    };

    fetchCapsules();
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

          {capsules.map((capsule) => (
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
    </>
  );
};

export default Explore;
