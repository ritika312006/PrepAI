import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

function Sidebar() {
  const [interviewCount, setInterviewCount] = useState(0);
  const [resumeScore, setResumeScore] = useState(null);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("interviewHistory")) || [];
    const savedResume =
      JSON.parse(localStorage.getItem("resumeAnalysis")) || null;

    setInterviewCount(savedHistory.length);
    setResumeScore(savedResume ? savedResume.score : null);
  }, []);

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "12px 14px",
    marginTop: "10px",
    borderRadius: "12px",
    textDecoration: "none",
    color: isActive ? "white" : "#d1d5db",
    background: isActive
      ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
      : "transparent",
    fontWeight: isActive ? "700" : "500",
    transition: "0.3s ease"
  });

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "24px",
        boxSizing: "border-box",
        borderRight: "1px solid rgba(255,255,255,0.06)"
      }}
    >
      <h2
        style={{
          color: "white",
          fontWeight: "800",
          fontSize: "26px",
          marginBottom: "8px"
        }}
      >
        PrepAI
      </h2>

      <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "22px" }}>
        AI Interview Preparation Platform
      </p>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "16px",
          padding: "14px",
          marginBottom: "24px"
        }}
      >
        <p
          style={{
            margin: "0 0 10px 0",
            color: "#cbd5e1",
            fontSize: "13px",
            fontWeight: "600"
          }}
        >
          Quick Stats
        </p>

        <div style={{ marginBottom: "10px" }}>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>
            Interviews
          </p>
          <p style={{ margin: "4px 0 0 0", fontWeight: "700", fontSize: "18px" }}>
            {interviewCount}
          </p>
        </div>

        <div>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>
            Resume Score
          </p>
          <p style={{ margin: "4px 0 0 0", fontWeight: "700", fontSize: "18px" }}>
            {resumeScore !== null ? `${resumeScore}%` : "No Review"}
          </p>
        </div>
      </div>

      <div>
        <NavLink to="/" style={linkStyle}>
          Dashboard
        </NavLink>

        <NavLink to="/mock-interview" style={linkStyle}>
          Mock Interview
        </NavLink>

        <NavLink to="/analytics" style={linkStyle}>
          Analytics
        </NavLink>

        <NavLink to="/resume-review" style={linkStyle}>
          Resume Review
        </NavLink>
      </div>

      <div
        style={{
          marginTop: "28px",
          padding: "14px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(124,58,237,0.2))"
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontWeight: "700" }}>
          Keep Practicing
        </p>
        <p style={{ margin: 0, color: "#cbd5e1", fontSize: "13px", lineHeight: "1.5" }}>
          Practice mock interviews regularly and improve your resume step by step.
        </p>
      </div>
    </div>
  );
}

export default Sidebar;