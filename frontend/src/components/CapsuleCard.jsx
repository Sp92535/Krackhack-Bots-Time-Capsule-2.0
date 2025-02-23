import React from "react";
import { useNavigate } from "react-router-dom";
import "./CapsuleCard.css";

const CapsuleCard = ({ capsule, onDelete }) => {
  const navigate = useNavigate();

  const utcDate = new Date(capsule.unlockDate); // Convert to Date object
  const formattedDate = utcDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata" // Adjust to Indian Standard Time (IST)
  });
  const handleClick = () => {
    if (!capsule.isLocked && !capsule.canModify) {
      navigate(`/capsule/view/${capsule.id}`, { state: { capsule } });
      return;
    }
    if (!capsule.isLocked) {
      navigate(`/capsule/${capsule.id}`, { state: { capsule } });
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    onDelete(capsule.id);
  };
  
  return (
    <>
      <div
        className={`capsule-card ${capsule.isLocked ? "locked" : "unlocked"}`}
        onClick={handleClick}
      >
        <div className="capsule-content">
        <h2>{capsule.capsuleName}</h2>
        <p>Description: {capsule.description}</p>
        <p>Unlock Date: {formattedDate}</p>
        <br/>
        {capsule.isLocked && <p className="locked-status">🔒 Locked</p>}
        {!capsule.isLocked && !capsule.canModify && <p className="locked-status">🔓 Ready to open</p>}
        </div>
        {/* Delete Button */}
      <button className="delete-btn" onClick={handleDelete}>
        🗑️ Trash
      </button>
      </div>
    </>
  );
};

export default CapsuleCard;
