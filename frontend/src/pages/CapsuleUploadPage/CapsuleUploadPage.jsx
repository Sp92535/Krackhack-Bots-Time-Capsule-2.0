import { useParams } from "react-router-dom";
import { useState } from "react";
import "./CapsuleUploadPage.css"; // Import CSS for styling

const CapsuleUploadPage = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files)); // Store all selected files
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, files); // Appending each file
    });
    formData.append("capsuleId", id);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:6969/api/capsule/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        alert("Files uploaded successfully!");
        setFiles([]); // Clear the file input
      } else {
        alert("Failed to upload files.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="capsule-upload-container">
      <h1>Upload to Capsule {id}</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default CapsuleUploadPage;
