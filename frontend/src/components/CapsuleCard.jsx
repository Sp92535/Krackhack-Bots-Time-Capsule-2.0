import React from "react";
import { useNavigate } from "react-router-dom";
import "./CapsuleCard.css";

const CapsuleCard = ({ capsule, fetchCapsules }) => {
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

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:6969/api/capsule/delete-capsule",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            capsuleId: capsule.id
          }),
        }
      )

      if (response.ok) {
        fetchCapsules();
        return;
      }
      const data = await response.json()
      alert(data.message)
    } catch (error) {
      alert("CLIENT ERROR")
    }
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
          <br />
          {capsule.isLocked && <p className="locked-status">🔒 Locked</p>}
          {!capsule.isLocked && !capsule.canModify && <p className="locked-status">🔓 Ready to open</p>}
        </div>
        {/* Delete Button */}
        <button className="delete-btn" onClick={handleDelete}>
          🗑️
        </button>
      </div>
    </>
  );
};

export default CapsuleCard;
