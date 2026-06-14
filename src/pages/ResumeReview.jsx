import { useState } from "react";
import PageLayout from "../layout/PageLayout";
import SectionCard from "../components/SectionCard";
import PrimaryButton from "../components/PrimaryButton";

function ResumeReview() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [error, setError] = useState("");
  const [uploadDone, setUploadDone] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setScore(null);
      setSuggestions([]);
      setAiFeedback(null);
      setError("");
      setUploadDone(false);
      setResumeText("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("https://prepai-backend-4lx6.onrender.com/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setScore(data.score);
        setSuggestions(data.suggestions || []);
        setUploadDone(true);
      } else {
        setError(data.message || "Upload failed.");
      }
    } catch (err) {
      setError("Failed to upload. Make sure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const handleAIReview = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text below for AI review.");
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      const res = await fetch("https://prepai-backend-4lx6.onrender.com/ai-resume-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText })
      });

      const data = await res.json();

      if (res.ok) {
        setAiFeedback(data);
      } else {
        setError(data.message || "AI review failed.");
      }
    } catch (err) {
      setError("AI review failed. Make sure backend is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (s) => {
    if (s >= 80) return "#16a34a";
    if (s >= 60) return "#d97706";
    return "#dc2626";
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return "Strong Resume";
    if (s >= 60) return "Good Resume";
    return "Needs Improvement";
  };

  return (
    <PageLayout title="Resume Review" subtitle="Upload your resume and get AI-powered feedback">

      {/* Upload Section */}
      <SectionCard>
        <h2 style={{ marginTop: 0 }}>Upload Your Resume</h2>
        <p style={{ color: "#6b7280", marginBottom: "16px" }}>
          Supported formats: PDF, DOC, DOCX (Max 5MB)
        </p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ marginBottom: "16px", display: "block" }}
        />

        {file && (
          <p style={{ color: "#4b5563", marginBottom: "12px", fontSize: "14px" }}>
            Selected: <strong>{file.name}</strong>
          </p>
        )}

        <PrimaryButton onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Upload Resume"}
        </PrimaryButton>

        {error && (
          <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "10px", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "14px" }}>
            ⚠️ {error}
          </div>
        )}
      </SectionCard>

      {/* Basic Score Result */}
      {uploadDone && score !== null && (
        <SectionCard style={{ marginTop: "20px" }}>
          <h2>Resume Score</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div style={{ fontSize: "48px", fontWeight: "800", color: getScoreColor(score) }}>
              {score}
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: getScoreColor(score) }}>
                {getScoreLabel(score)}
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>out of 100</div>
            </div>
          </div>

          {suggestions.length > 0 && (
            <>
              <h3 style={{ marginBottom: "10px" }}>Quick Suggestions</h3>
              <ul style={{ color: "#4b5563", paddingLeft: "18px" }}>
                {suggestions.map((s, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </SectionCard>
      )}

      {/* AI Review Section */}
      <SectionCard style={{ marginTop: "20px" }}>
        <h2 style={{ marginTop: 0 }}>✨ AI Detailed Review</h2>
        <p style={{ color: "#6b7280", marginBottom: "12px" }}>
          Paste your resume text below to get detailed AI feedback on your resume content, skills, and improvements.
        </p>

        <textarea
          placeholder="Paste your full resume text here...

Example:
John Doe
Software Engineer
Skills: Python, React, Node.js
Experience: 2 years at XYZ Company..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={12}
          style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ccc", resize: "vertical", boxSizing: "border-box", fontSize: "14px", fontFamily: "inherit" }}
        />

        <div style={{ marginTop: "12px" }}>
          <PrimaryButton onClick={handleAIReview} disabled={analyzing || !resumeText.trim()}>
            {analyzing ? "AI Analyzing..." : "Get AI Review"}
          </PrimaryButton>
        </div>
      </SectionCard>

      {/* AI Feedback Result */}
      {aiFeedback && (
        <SectionCard style={{ marginTop: "20px" }}>
          <h2>AI Review Result</h2>

          {/* AI Score */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", padding: "16px", borderRadius: "12px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "48px", fontWeight: "800", color: getScoreColor(aiFeedback.score) }}>
              {aiFeedback.score}
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: getScoreColor(aiFeedback.score) }}>
                {getScoreLabel(aiFeedback.score)}
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>AI Score out of 100</div>
            </div>
          </div>

          {/* Overall Feedback */}
          {aiFeedback.overall_feedback && (
            <div style={{ marginBottom: "16px", padding: "14px", borderRadius: "10px", backgroundColor: "#eef2ff", border: "1px solid #c7d2fe" }}>
              <p style={{ margin: 0, color: "#3730a3", fontWeight: "600", marginBottom: "6px" }}>Overall Feedback</p>
              <p style={{ margin: 0, color: "#4338ca" }}>{aiFeedback.overall_feedback}</p>
            </div>
          )}

          {/* Strengths */}
          {aiFeedback.strengths && aiFeedback.strengths.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ color: "#16a34a", marginBottom: "10px" }}>✅ Strengths</h3>
              <ul style={{ color: "#4b5563", paddingLeft: "18px" }}>
                {aiFeedback.strengths.map((s, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {aiFeedback.suggestions && aiFeedback.suggestions.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ color: "#d97706", marginBottom: "10px" }}>💡 Suggestions</h3>
              <ul style={{ color: "#4b5563", paddingLeft: "18px" }}>
                {aiFeedback.suggestions.map((s, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Skills */}
          {aiFeedback.missing_skills && aiFeedback.missing_skills.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ color: "#dc2626", marginBottom: "10px" }}>⚠️ Missing or Weak Areas</h3>
              <ul style={{ color: "#4b5563", paddingLeft: "18px" }}>
                {aiFeedback.missing_skills.map((s, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ATS Score */}
          {aiFeedback.ats_score && (
            <div style={{ padding: "14px", borderRadius: "10px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <p style={{ margin: 0, color: "#166534", fontWeight: "600" }}>
                ATS Compatibility Score: {aiFeedback.ats_score}/100
              </p>
              <p style={{ margin: "6px 0 0 0", color: "#166534", fontSize: "14px" }}>
                {aiFeedback.ats_score >= 70 ? "Your resume is ATS friendly!" : "Improve keywords to pass ATS filters."}
              </p>
            </div>
          )}
        </SectionCard>
      )}
    </PageLayout>
  );
}

export default ResumeReview;
