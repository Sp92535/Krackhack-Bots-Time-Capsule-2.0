import React from "react";
import { useNavigate } from "react-router-dom";
import "./CapsuleCard.css";
import Navbar from "./Navbar";

const CapsuleCard = ({ capsule }) => {
  const navigate = useNavigate();

  const utcDate = new Date(capsule.unlockDate); // Convert to Date object
  const formattedDate = utcDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata" // Adjust to Indian Standard Time (IST)
  });
  const handleClick = () => {
    if (!capsule.isLocked) {
      navigate(`/capsule/${capsule.id}`, { state: { capsule } });
    }
  };

  return (
    <>
      <div
        className={`capsule-card ${capsule.isLocked ? "locked" : "unlocked"}`}
        onClick={handleClick}
      >
        <h2>{capsule.capsuleName}</h2>
        <p>Description: {capsule.description}</p>
        <p>Unlock Date: {formattedDate}</p>
        {capsule.isLocked && <p className="locked-status">🔒 Locked</p>}
      </div>
    </>
  );
};

export default CapsuleCard;
