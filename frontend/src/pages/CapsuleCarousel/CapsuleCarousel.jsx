import { useEffect, useState, useCallback, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./CapsuleCarousel.css";

const CapsuleCarousel = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const [currentIndex, setCurrentIndex] = useState(0);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const capsule = location.state?.capsule;
  const capsuleId = capsule.id;
  const videoRefs = useRef([]);
  const carouselRef = useRef(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const processStreamData = useCallback(async (reader, decoder) => {
    let buffer = "";
    const processedFiles = new Set();

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let startIdx = 0;

        while (true) {
          try {
            const endIdx = buffer.indexOf("}", startIdx) + 1;
            if (endIdx === 0) break;

            const jsonStr = buffer.substring(startIdx, endIdx);
            const parsed = JSON.parse(jsonStr);

            if (parsed.files?.length) {
              const newFiles = parsed.files.filter(
                (file) => !processedFiles.has(file.fileName)
              );

              newFiles.forEach((file) => processedFiles.add(file.fileName));
              if (newFiles.length) {
                setFiles((prev) => [...prev, ...newFiles]);
                setProgress(processedFiles.size);
              }
            }
            startIdx = endIdx;
          } catch (err) {
            break;
          }
        }
        buffer = buffer.substring(startIdx);
      }

      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer);
          if (parsed.files?.length) {
            const newFiles = parsed.files.filter(
              (file) => !processedFiles.has(file.fileName)
            );
            if (newFiles.length) {
              setFiles((prev) => [...prev, ...newFiles]);
              setProgress(processedFiles.size + newFiles.length);
            }
          }
        } catch (err) {
          console.error("Error processing final buffer:", err);
        }
      }
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    setLoading(true)
    const abortController = new AbortController()

    const fetchFiles = async () => {
      try {
        setError(null)
        setFiles([])
        setProgress(0)

        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:6969/api/capsule/open/${capsuleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: abortController.signal,
          }
        );

        if (response.status == 404) throw new Error(`No files were uploaded in this capsule.: ${response.status}`)

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        await processStreamData(reader, decoder);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch files");
        }
      } finally {
        setLoading(false);
      }
    };

    if (capsuleId) fetchFiles();

    return () => {
      abortController.abort();
      setFiles([]);
      setCurrentIndex(0);
    };
  }, [capsuleId, processStreamData]);

  // Handle video autoplay
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === currentIndex) {
          video.play().catch((err) => console.log("Autoplay prevented:", err));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (files.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % files.length);
    }
  }, [files.length]);

  const goToPrevious = useCallback(() => {
    if (files.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
    }
  }, [files.length]);

  // Auto advance for images (not videos)
  useEffect(() => {
    let timer;
    if (files[currentIndex]?.contentType?.startsWith("image")) {
      timer = setTimeout(goToNext, 5000);
    }
    return () => clearTimeout(timer);
  }, [currentIndex, files, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToNext, goToPrevious]);

  if (loading) {
    return (
      <div className="carousel-outer-container">
        <div className="carousel-loading">
          <h2>Opening Your Time Capsule...</h2>
          <p>Loading your memories ({progress} files loaded)</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carousel-outer-container">
        <div className="carousel-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!loading && !files.length) {
    return (
      <div className="carousel-outer-container">
        <div className="carousel-empty">
          <h2>No Files Found</h2>
          <p>This time capsule appears to be empty.</p>
        </div>
      </div>
    );
  }

  return (<>

<button type="button" onClick={handleGoBack}>Back</button>

    <div className="carousel-outer-container">
      <div className="carousel-container">
        <div className="carousel-wrapper" ref={carouselRef}>
          <button className="carousel-button prev" onClick={goToPrevious}>
            <span>‹</span>
          </button>
          <div className="carousel-content" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {files.map((file, index) => (
              <div
                key={`${file.fileName}_${index}`}
                className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
              >
                <div className="media-wrapper">
                  {file.contentType?.startsWith("image") ? (
                    <img
                      src={file.data || "/placeholder.svg"}
                      alt={file.fileName || `Image ${index + 1}`}
                      className="carousel-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/300"
                        e.target.alt = "Failed to load image"
                      }}
                    />
                  ) : file.contentType?.startsWith("video") ? (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[index] = el
                      }}
                      controls
                      className="carousel-video"
                      src={file.data}
                      loop
                      autoPlay
                      playsInline
                      onError={(e) => {
                        e.target.src = "/api/placeholder/video.mp4"
                      }}
                    />
                  ) : (
                    <div className="unsupported-file">
                      <p>Unsupported file type: {file.contentType}</p>
                    </div>
                  )}
                </div>
                <div className="slide-caption">
                  <h3>{file.fileName}</h3>
                  <p className="file-counter">
                    {index + 1} of {files.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-button next" onClick={goToNext}>
            <span>›</span>
          </button>
        </div>
        <div className="carousel-indicators">
          {files.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default CapsuleCarousel;
