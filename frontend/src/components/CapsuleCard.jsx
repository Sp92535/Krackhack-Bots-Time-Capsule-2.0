import React from "react";
import "./CapsuleCard.css";
import Navbar from "./Navbar";

const CapsuleCard = ({ title, creator, openDate, isLocked }) => {
  return (<>
    <Navbar />
    <div className="capsule-card">
      <h3>{title}</h3>
      <p>Created by: {creator}</p>
      <p>Unlock Date: {openDate}</p>
      {isLocked && <p className="locked-status">🔒 Locked</p>}
    </div>
    </>
  );
};

export default CapsuleCard;
