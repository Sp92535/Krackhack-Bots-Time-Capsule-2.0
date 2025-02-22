import React from "react";
import "./CapsuleCard.css";

const CapsuleCard = ({ title, creator, openDate }) => {
  return (
    <div className="capsule-card">
      <h3 className="capsule-title">{title}</h3>
      <p className="capsule-creator">Created by: {creator}</p>
      <p className="capsule-countdown">Opens on: {openDate}</p>
    </div>
  );
};

export default CapsuleCard;
