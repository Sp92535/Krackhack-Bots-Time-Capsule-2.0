import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "./CapsuleUploadPage.css";

const CapsuleUploadPage = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [capsuleName, setCapsuleName] = useState("");
  const [description, setDescription] = useState("");
  const [viewers, setViewers] = useState("");
  const [editors, setEditors] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const location = useLocation()
  const navigate = useNavigate()
  const capsule = location.state?.capsule;
  const [loading, setLoading] = useState(false); // Add loading state

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }
    setLoading(true); // Disable buttons while uploading
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("capsuleId", id);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:6969/api/capsule/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Files uploaded successfully!");
        setFiles([]);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to upload files.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files");
    } finally {
      setLoading(false)
    }
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    setLoading(true); // Disable buttons while uploading
    const newEditors = editors
      .split(',')
      .map(email => email.trim())
      .filter(email => email);

    const newViewers = viewers
      .split(',')
      .map(email => email.trim())
      .filter(email => email);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:6969/api/capsule/update-capsule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          capsuleId: id,
          unlockDate: unlockDate || undefined,
          newEditors,
          newViewers,
        }),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (response.ok) {
        alert("Capsule updated successfully!");
      } else {
        alert(responseData.message || "Failed to update capsule.");
      }
    } catch (error) {
      console.error("Error updating capsule:", error);
      alert("Error updating capsule");
    } finally {
      setLoading(false)
    }
  };

  const handleLock = async () => {
    setLoading(true); // Disable buttons while uploading
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:6969/api/capsule/lock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          capsuleId: id
        }),
      });
      alert("LOCKED")
      navigate('/home')
    } catch (error) {
      console.log(error);
      alert("Failed to Lock capsule.");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="capsule-upload-container">
      <h1>Update Capsule {capsule.capsuleName}</h1>

      <form onSubmit={handleSaveChanges}>
        <label>
          Capsule Name:
          <input
            type="text"
            value={capsuleName}
            onChange={(e) => setCapsuleName(e.target.value)}
            disabled={isLocked}
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLocked}
          />
        </label>

        <label>
          Unlock Date:
          <input
            type="datetime-local"
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            disabled={isLocked}
            min={new Date().toISOString().split('T')[0]}
          />
        </label>

        <label>
          Upload Files:
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={isLocked}
          />
        </label>

        <label>
          Viewers (comma-separated emails):
          <input
            type="text"
            value={viewers}
            onChange={(e) => setViewers(e.target.value)}
            placeholder="viewer1@example.com, viewer2@example.com"
            disabled={isLocked}
          />
        </label>

        <label>
          Editors (comma-separated emails):
          <input
            type="text"
            value={editors}
            onChange={(e) => setEditors(e.target.value)}
            placeholder="editor1@example.com, editor2@example.com"
            disabled={isLocked}
          />
        </label>



        <div className="button-container">
          <button type="button" onClick={handleLock} disabled={loading}>
            {"Lock Capsule"}
          </button>
          <button type="button" onClick={handleUpload} disabled={loading}>
            Upload Files
          </button>
          <button type="submit" disabled={loading}>Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default CapsuleUploadPage;