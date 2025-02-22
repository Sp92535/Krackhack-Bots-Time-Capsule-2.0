import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateCapsule.css";

const CreateCapsule = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    unlockDate: "",
    files: [],
    editor: "",
    viewers: "",
  });
  const [isLocked, setIsLocked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: [...e.target.files] });
  };

  const handleLock = () => {
    setIsLocked(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the capsule details (You can save this to local storage, backend, or state)
    const newCapsule = {
      id: Date.now(),
      title: formData.title,
      creator: "User", // You can replace this with logged-in user
      openDate: formData.unlockDate,
      files: formData.files,
      isLocked,
    };
    // Update the state with the new capsule (this could also involve a backend API)
    navigate("/explore"); // Redirect back to the explore page after creation
  };

  return (
    <div className="create-capsule-container">
      <h1>Create a New Digital Time Capsule</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title of Capsule</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Unlock Date and Time</label>
          <input
            type="datetime-local"
            name="unlockDate"
            value={formData.unlockDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Upload Files</label>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label>Editor</label>
          <input
            type="text"
            name="editor"
            value={formData.editor}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Viewers</label>
          <input
            type="text"
            name="viewers"
            value={formData.viewers}
            onChange={handleChange}
          />
        </div>

        <button type="button" onClick={handleLock}>
          Lock Capsule
        </button>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default CreateCapsule;
