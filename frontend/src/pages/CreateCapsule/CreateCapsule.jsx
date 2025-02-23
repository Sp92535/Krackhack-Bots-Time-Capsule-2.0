import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateCapsule.css";

const CreateCapsule = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    capsuleName: "",
    description: "",
    unlockDate: "",
    editors: [],
    viewers: [],
    isPublic: false,
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "editors" || name === "viewers" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.capsuleName.trim()) {
      alert("Please enter a capsule name!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      console.log(JSON.stringify(formData)); // Fixed the incorrect console.log9

      const response = await fetch("http://localhost:6969/api/capsule/create-capsule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Capsule created successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error saving capsule:", error);
      alert("Failed to create capsule.");
    }


  };

  return (
    <>
      <button type="button" onClick={handleGoBack}>Back</button>

      <div className="create-capsule-container">
        <h1>Create a New Digital Time Capsule</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Capsule Name</label>
            <input type="text" name="capsuleName" value={formData.capsuleName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required></textarea>
          </div>
          <div className="form-group">
  <label className="checkbox-label" htmlFor="isPublic">
    Make Capsule Public
  </label>
  <input 
    type="checkbox" 
    id="isPublic" 
    className="checkbox" 
    name="isPublic" 
    checked={formData.isPublic} 
    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })} 
  />
</div>

          <div className="form-group">
            <label>Unlock Date</label>
            <input type="datetime-local" name="unlockDate" value={formData.unlockDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Editors (comma-separated emails)</label>
            <input type="text" name="editors" value={formData.editors} onChange={handleChange} disabled={formData.isPublic} />
          </div>
          <div className="form-group">
            <label>Viewers (comma-separated emails)</label>
            <input type="text" name="viewers" value={formData.viewers} onChange={handleChange} disabled={formData.isPublic}/>
          </div>
          <button type="submit">Create Capsule</button>
        </form>
      </div>
    </>
  );
};

export default CreateCapsule;