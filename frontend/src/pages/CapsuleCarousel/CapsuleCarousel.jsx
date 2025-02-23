import React, { useEffect, useState, useCallback, useRef } from "react";
import "./CapsuleCarousel.css";
import { useLocation } from "react-router-dom";

const CapsuleCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const location = useLocation();
    const capsule = location.state?.capsule;
    const capsuleId = capsule.id;
    const videoRefs = useRef([]);

    useEffect(() => {
        videoRefs.current.forEach((video, idx) => {
            if (video && idx !== currentIndex) {
                video.pause();
            }
        });
    }, [currentIndex]);

    const processStreamData = useCallback(async (reader, decoder) => {
        let buffer = "";
        let processedFiles = new Set();

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
        const abortController = new AbortController();

        const fetchFiles = async () => {
            try {
                setLoading(true);
                setError(null);
                setFiles([]);
                setProgress(0);

                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:6969/api/capsule/open/${capsuleId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        signal: abortController.signal,
                    }
                );

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "ArrowRight") goToNext();
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [goToNext, goToPrevious]);

    return (
        <div className="carousel-container">
            <div className="carousel-wrapper">
                <div className="carousel-content" key={files.length} aria-live="polite">
                    {files.map((file, index) => (
                        <div
                            key={`${file.fileName}_${index}`}
                            className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
                        >
                            <p>Slide {index + 1}</p>
                            {file.contentType?.startsWith("image") ? (
                                <img
                                    src={file.data}
                                    alt={file.fileName || `Image ${index + 1}`}
                                    className="carousel-image"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = "/api/placeholder/400/300";
                                        e.target.alt = "Failed to load image";
                                    }}
                                />
                            ) : file.contentType?.startsWith("video") ? (
                                <video
                                    ref={(el) => {
                                        if (el) videoRefs.current[index] = el;
                                    }}
                                    controls
                                    className="carousel-video"
                                    src={file.data} // ✅ Add this line
                                    onError={(e) => {
                                        e.target.src = "/api/placeholder/video.mp4"; // Optional fallback
                                    }}
                                />

                            ) : (
                                <div className="unsupported-file">
                                    <p>Unsupported file type: {file.contentType}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CapsuleCarousel;
