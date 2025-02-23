import React from "react";
import { useNavigate } from "react-router-dom";
import "./CapsuleCard.css";
import Navbar from "./Navbar";

const CapsuleCard = ({ capsule }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!capsule.isLocked) {
      navigate(`/capsule/${capsule.id}`);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className={`capsule-card ${capsule.isLocked ? "locked" : "unlocked"}`}
        onClick={handleClick}
      >
        <h2>{capsule.capsuleName}</h2>
        {/* <p>Created by: {capsule.creator}</p> */}
        <p>Unlock Date: {capsule.unlockDate}</p>
        {capsule.isLocked && <p className="locked-status">🔒 Locked</p>}
      </div>
    </>
  );
};

export default CapsuleCard;
