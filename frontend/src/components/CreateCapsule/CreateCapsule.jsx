import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateCapsule.css";

const CreateCapsule = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
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
    setFormData({ ...formData, files: e.target.files });
  };

  const handleLock = (e) => {
    e.preventDefault();
    setIsLocked(true);
    handleSubmit(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const capsuleData = new FormData();
    capsuleData.append("title", formData.title);
    capsuleData.append("description", formData.description);
    capsuleData.append("unlockDate", formData.unlockDate);
    capsuleData.append("editor", formData.editor);
    capsuleData.append("viewers", formData.viewers);
    capsuleData.append("isLocked", isLocked);

    for (let i = 0; i < formData.files.length; i++) {
      capsuleData.append("files", formData.files[i]);
    }

    try {
      await axios.post("http://localhost:6969/api/capsules", capsuleData);
      navigate("/explore");
    } catch (error) {
      console.error("Error saving capsule:", error);
    }
  };

  return (
    <div className="create-capsule-container">
      <h1>Create a New Digital Time Capsule</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Title of Capsule</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="Write a detailed description..."
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Unlock Date and Time</label>
          <input type="datetime-local" name="unlockDate" value={formData.unlockDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Upload Files</label>
          <input type="file" name="files" multiple onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label>Editor</label>
          <input type="text" name="editor" value={formData.editor} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Viewers</label>
          <input type="text" name="viewers" value={formData.viewers} onChange={handleChange} />
        </div>

        {/* <button type="button" onClick={handleLock}>Lock Capsule</button> */}
        <button type="submit" disabled={!isLocked}>Save Changes</button>
        <button type="button" disabled={!isLocked}>Create</button>
      </form>
    </div>
  );
};

export default CreateCapsule;
