import { useState, useEffect } from "react";
import PageLayout from "../layout/PageLayout";
import SectionCard from "../components/SectionCard";
import PrimaryButton from "../components/PrimaryButton";

function ResumeReview() {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [score, setScore] = useState(0);
  const [feedbackPoints, setFeedbackPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const savedResume =
      JSON.parse(localStorage.getItem("resumeAnalysis")) || null;

    if (savedResume) {
      setUploadedFileName(savedResume.fileName || "");
      setScore(savedResume.score || 0);
      setFeedbackPoints(savedResume.suggestions || []);
    }
  }, []);

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return "Please select a file.";
    }

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const lowerName = selectedFile.name.toLowerCase();
    const isValidExtension = allowedExtensions.some((ext) =>
      lowerName.endsWith(ext)
    );

    if (!isValidExtension) {
      return "Only PDF, DOC, and DOCX files are allowed.";
    }

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      return "File size should be less than 5 MB.";
    }

    return "";
  };

  const handleFileSelect = (selectedFile) => {
    const errorMessage = validateFile(selectedFile);

    if (errorMessage) {
      setUploadError(errorMessage);
      setFile(null);
      return;
    }

    setUploadError("");
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file");
      return;
    }

    setLoading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.message || "Upload failed");
        setLoading(false);
        return;
      }

      setUploadedFileName(data.file.originalname);
      setScore(data.score);
      setFeedbackPoints(data.suggestions || []);

      const resumeAnalysis = {
        fileName: data.file.originalname,
        score: data.score,
        suggestions: data.suggestions || [],
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      };

      localStorage.setItem("resumeAnalysis", JSON.stringify(resumeAnalysis));
      alert("Resume uploaded successfully");
    } catch (err) {
      console.error(err);
      setUploadError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAnalysis = () => {
    localStorage.removeItem("resumeAnalysis");
    setFile(null);
    setUploadedFileName("");
    setScore(0);
    setFeedbackPoints([]);
    setUploadError("");
  };

  const getScoreLabel = (resumeScore) => {
    if (resumeScore >= 85) return "Excellent";
    if (resumeScore >= 75) return "Good";
    if (resumeScore >= 60) return "Average";
    return "Needs Improvement";
  };

  const getScoreColor = (resumeScore) => {
    if (resumeScore >= 85) return "#16a34a";
    if (resumeScore >= 75) return "#4f46e5";
    if (resumeScore >= 60) return "#d97706";
    return "#dc2626";
  };

  return (
    <PageLayout
      title="Resume Review"
      subtitle="Get smart feedback to improve your resume quality"
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "flex-start"
        }}
      >
        <SectionCard style={{ flex: 1, minWidth: "320px" }}>
          <h2 style={{ marginTop: 0 }}>Upload Resume</h2>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);

              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileSelect(e.dataTransfer.files[0]);
              }
            }}
            style={{
              border: dragActive ? "2px solid #4f46e5" : "2px dashed #cbd5e1",
              borderRadius: "14px",
              padding: "32px",
              textAlign: "center",
              marginTop: "20px",
              backgroundColor: dragActive ? "#eef2ff" : "#f8fafc",
              transition: "0.2s ease"
            }}
          >
            <p style={{ color: "#6b7280", marginTop: 0 }}>
              Drag and drop your resume here
            </p>

            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Supported files: PDF, DOC, DOCX | Max size: 5 MB
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              style={{ margin: "15px 0" }}
            />

            {file && (
              <p
                style={{
                  margin: "10px 0",
                  color: "#111827",
                  fontWeight: "600",
                  wordBreak: "break-word"
                }}
              >
                Selected: {file.name}
              </p>
            )}

            {uploadError && (
              <p
                style={{
                  color: "#dc2626",
                  marginTop: "12px",
                  marginBottom: "0",
                  fontWeight: "600"
                }}
              >
                {uploadError}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "18px"
              }}
            >
              <PrimaryButton onClick={handleUpload}>
                {loading ? "Uploading..." : "Upload Resume"}
              </PrimaryButton>

              {(uploadedFileName || feedbackPoints.length > 0) && (
                <button
                  onClick={handleRemoveAnalysis}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Clear Review
                </button>
              )}
            </div>

            {uploadedFileName && (
              <p
                style={{
                  marginTop: "16px",
                  color: "#16a34a",
                  fontWeight: "600",
                  wordBreak: "break-word"
                }}
              >
                Uploaded: {uploadedFileName}
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard style={{ flex: 1, minWidth: "320px" }}>
          <h2 style={{ marginTop: 0 }}>Resume Score</h2>

          {uploadedFileName ? (
            <>
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: "800",
                  color: getScoreColor(score),
                  marginBottom: "8px"
                }}
              >
                {score}%
              </div>

              <div
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  backgroundColor: "#f3f4f6",
                  color: getScoreColor(score),
                  fontWeight: "700",
                  marginBottom: "18px"
                }}
              >
                {getScoreLabel(score)}
              </div>

              <div
                style={{
                  height: "12px",
                  width: "100%",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "999px",
                  overflow: "hidden",
                  marginBottom: "20px"
                }}
              >
                <div
                  style={{
                    width: `${score}%`,
                    height: "100%",
                    backgroundColor: getScoreColor(score),
                    borderRadius: "999px"
                  }}
                ></div>
              </div>

              <h3 style={{ marginBottom: "10px" }}>Suggestions</h3>

              {feedbackPoints.length > 0 ? (
                <ul style={{ color: "#6b7280", paddingLeft: "18px" }}>
                  {feedbackPoints.map((item, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#6b7280" }}>No suggestions available yet.</p>
              )}
            </>
          ) : (
            <div>
              <p style={{ color: "#6b7280", marginBottom: "12px" }}>
                Upload your resume to get score and improvement suggestions.
              </p>

              <ul style={{ color: "#6b7280", paddingLeft: "18px" }}>
                <li style={{ marginBottom: "10px" }}>
                  Check resume quality quickly
                </li>
                <li style={{ marginBottom: "10px" }}>
                  Get improvement suggestions
                </li>
                <li style={{ marginBottom: "10px" }}>
                  Track your latest resume review on the dashboard
                </li>
              </ul>
            </div>
          )}
        </SectionCard>
      </div>
    </PageLayout>
  );
}

export default ResumeReview;