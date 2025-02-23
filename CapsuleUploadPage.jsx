import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import "./CapsuleUploadPage.css";

const CapsuleUploadPage = () => {
  const { id } = useParams();
  const [search] = useSearchParams();
  const isPublic = search.get("isPublic") === "true";
  const location = useLocation();
  const navigate = useNavigate();
  const capsule = location.state?.capsule;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    capsuleName: "",
    description: "",
    viewers: "",
    editors: "",
    unlockDate: "",
    files: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, files: Array.from(e.target.files) }));
  };

  const handleUpload = async () => {
    if (!formData.files.length) return alert("Please select at least one file.");
    setLoading(true);
    try {

      const token = localStorage.getItem("token");
      const uploadData = new FormData();

      for (const file of formData.files) {
        const fileType = file.type.startsWith("video") ? "video" : "image";
  
        // const fd = new FormData();
        // fd.append("file", file);
  
        // // Step 1: Check NSFW content
        // const nsfwResponse = await fetch(`http://localhost:5000/upload/${fileType}`, {
        //   method: "POST",
        //   body: fd,
        // });
  
        // const nsfwResult = await nsfwResponse.json();
        // if (!nsfwResponse.ok) {
        //   alert(nsfwResult.message || "NSFW content detected. Upload blocked.");
        //   return;
        // }
  
        uploadData.append("files", file); // Ensure all files are added properly
      }
      uploadData.append("capsuleId", id);

      const response = await fetch("http://localhost:6969/api/capsule/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });

      if (response.ok) {
        alert("Files uploaded successfully!");
        setFormData((prev) => ({ ...prev, files: [] }));
      } else {
        alert("Failed to upload files.");
      }
    } catch (error) {
      alert("Error uploading files");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:6969/api/capsule/update-capsule", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          capsuleId: id,
          unlockDate: formData.unlockDate || undefined,
          newEditors: formData.editors.split(",").map((e) => e.trim()).filter(Boolean),
          newViewers: formData.viewers.split(",").map((e) => e.trim()).filter(Boolean),
        }),
      });
      if (response.ok) alert("Capsule updated successfully!");
      else alert("Failed to update capsule.");
    } catch (error) {
      alert("Error updating capsule");
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:6969/api/capsule/lock", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ capsuleId: id }),
      });
      alert("LOCKED");
      navigate("/home");
    } catch (error) {
      alert("Failed to Lock capsule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="capsule-upload-container">
      <h1>Update Capsule {capsule?.capsuleName}</h1>
      {isPublic && <h2>This is a public capsule. You can only upload files!</h2>}
      <form onSubmit={handleSaveChanges}>
        <label>
          Capsule Name:
          <input type="text" name="capsuleName" value={formData.capsuleName} onChange={handleInputChange} />
        </label>

        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleInputChange} />
        </label>

        <label>
          Unlock Date:
          <input type="datetime-local" name="unlockDate" value={formData.unlockDate} onChange={handleInputChange} />
        </label>

        <label>
          Upload Files:
          <input type="file" multiple onChange={handleFileChange} />
        </label>

        <label>
          Viewers (comma-separated emails):
          <input type="text" name="viewers" value={formData.viewers} onChange={handleInputChange} />
        </label>

        <label>
          Editors (comma-separated emails):
          <input type="text" name="editors" value={formData.editors} onChange={handleInputChange} />
        </label>

        <div className="button-container">
          <button type="button" onClick={handleLock} disabled={loading}>Lock Capsule</button>
          <button type="button" onClick={handleUpload} disabled={loading}>Upload Files</button>
          <button type="submit" disabled={loading}>Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default CapsuleUploadPage;
