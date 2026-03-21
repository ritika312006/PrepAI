import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import ActivityItem from "../components/ActivityItem";
import FocusCard from "../components/FocusCard";
import SectionCard from "../components/SectionCard";
import TrendBar from "../components/TrendBar";
import Loader from "../components/Loader";
import PageLayout from "../layout/PageLayout";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedHistory =
        JSON.parse(localStorage.getItem("interviewHistory")) || [];
      const savedResume =
        JSON.parse(localStorage.getItem("resumeAnalysis")) || null;

      setHistory(savedHistory);
      setResumeAnalysis(savedResume);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  const interviewsTaken = history.length;
  const theoryInterviews = history.filter((item) => item.type === "theory").length;
  const codingInterviews = history.filter((item) => item.type === "coding").length;

  const averageScore =
    history.length > 0
      ? Math.round(
          history.reduce((sum, item) => sum + item.score, 0) / history.length
        )
      : 0;

  const latestInterview = history.length > 0 ? history[0] : null;

  const latestTopic = latestInterview
    ? latestInterview.topic?.toUpperCase()
    : "None";

  const latestType = latestInterview
    ? latestInterview.type?.toUpperCase()
    : "None";

  const bestInterview =
    history.length > 0
      ? history.reduce((best, current) =>
          current.score > best.score ? current : best
        )
      : null;

  const bestTopic = bestInterview ? bestInterview.topic?.toUpperCase() : "None";

  const getMostPracticedByType = (selectedType) => {
    const filtered = history.filter((item) => item.type === selectedType);
    if (filtered.length === 0) return "None";

    const counts = {};
    filtered.forEach((item) => {
      counts[item.topic] = (counts[item.topic] || 0) + 1;
    });

    return Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );
  };

  const mostPracticedTheory = getMostPracticedByType("theory");
  const mostPracticedCoding = getMostPracticedByType("coding");

  const getStrongestByType = (selectedType) => {
    const filtered = history.filter((item) => item.type === selectedType);
    if (filtered.length === 0) return "None";

    const best = filtered.reduce((top, current) =>
      current.score > top.score ? current : top
    );

    return best.topic;
  };

  const strongestTheory = getStrongestByType("theory");
  const strongestCoding = getStrongestByType("coding");

  const getImprovementText = () => {
    if (history.length < 2) {
      return "Complete more interviews to track your growth properly.";
    }

    const latest = history[0].score;
    const previous = history[1].score;

    if (latest > previous) {
      return "Your latest performance is better than your previous attempt.";
    }

    if (latest < previous) {
      return "Your recent score dropped slightly. Practice one more round today.";
    }

    return "Your performance is stable. Keep practicing for better scores.";
  };

  const stats = [
    { title: "Total Interviews", value: interviewsTaken.toString() },
    { title: "Theory Interviews", value: theoryInterviews.toString() },
    { title: "Coding Interviews", value: codingInterviews.toString() },
    {
      title: "Resume Score",
      value: resumeAnalysis ? `${resumeAnalysis.score}%` : "No Resume"
    }
  ];

  const focusTasks = [
    {
      title: "Practice Theory Round",
      desc:
        strongestTheory !== "None"
          ? `You are doing well in ${strongestTheory.toUpperCase()}. Revise one weak theory topic next.`
          : "Start with Python, SQL, DBMS, or OOP theory interview."
    },
    {
      title: "Practice Coding Round",
      desc:
        strongestCoding !== "None"
          ? `Your best coding performance is in ${strongestCoding.toUpperCase()}. Solve one more coding question today.`
          : "Try a coding interview in Python, Java, C++, or JavaScript."
    },
    {
      title: "Improve Resume Impact",
      desc: resumeAnalysis
        ? "Apply your latest resume suggestions and improve project impact points."
        : "Upload your resume and get review suggestions."
    }
  ];

  const getWeeklyTrend = () => {
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    if (history.length === 0) {
      return dayLabels.map((day, index) => ({
        label: day,
        value: `${10 + index * 5}%`
      }));
    }

    const recent = history.slice(0, 7).reverse();

    return dayLabels.map((day, index) => {
      const item = recent[index];

      if (!item) {
        return { label: day, value: "10%" };
      }

      const totalPossible =
        item.totalQuestions && item.type === "coding"
          ? item.totalQuestions * 7
          : item.totalQuestions
          ? item.totalQuestions * 6
          : 24;

      const percentage = Math.min(
        100,
        Math.round((item.score / totalPossible) * 100)
      );

      return {
        label: day,
        value: `${percentage}%`
      };
    });
  };

  const weeklyTrend = getWeeklyTrend();

  const getPerformanceBadge = () => {
    if (averageScore >= 20) {
      return {
        text: "Excellent Progress",
        color: "#16a34a",
        bg: "#dcfce7"
      };
    }

    if (averageScore >= 12) {
      return {
        text: "Good Progress",
        color: "#4338ca",
        bg: "#eef2ff"
      };
    }

    if (averageScore >= 6) {
      return {
        text: "Needs More Practice",
        color: "#b45309",
        bg: "#fef3c7"
      };
    }

    return {
      text: "Getting Started",
      color: "#b91c1c",
      bg: "#fee2e2"
    };
  };

  const performanceBadge = getPerformanceBadge();

  const getTypeBadgeStyle = (type) => {
    if (type === "coding") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534"
      };
    }

    return {
      backgroundColor: "#eef2ff",
      color: "#4338ca"
    };
  };

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Track your theory and coding interview progress in one place"
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px"
        }}
      >
        {stats.map((item, index) => (
          <StatCard key={index} title={item.title} value={item.value} />
        ))}
      </div>

      <SectionCard style={{ marginBottom: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "14px"
          }}
        >
          <div>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>Quick Overview</h2>

            <p style={{ color: "#6b7280", margin: "0 0 8px 0" }}>
              Best Overall Topic:{" "}
              <strong style={{ color: "#111827" }}>{bestTopic}</strong>
            </p>

            <p style={{ color: "#6b7280", margin: "0 0 8px 0" }}>
              Latest Interview:{" "}
              <strong style={{ color: "#111827" }}>
                {latestType} | {latestTopic}
              </strong>
            </p>

            <p style={{ color: "#6b7280", margin: "0 0 8px 0" }}>
              Strongest Theory Topic:{" "}
              <strong style={{ color: "#111827", textTransform: "uppercase" }}>
                {strongestTheory}
              </strong>
            </p>

            <p style={{ color: "#6b7280", margin: 0 }}>
              Strongest Coding Language:{" "}
              <strong style={{ color: "#111827", textTransform: "uppercase" }}>
                {strongestCoding}
              </strong>
            </p>
          </div>

          <div
            style={{
              backgroundColor: performanceBadge.bg,
              color: performanceBadge.color,
              padding: "10px 16px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "14px"
            }}
          >
            {performanceBadge.text}
          </div>
        </div>
      </SectionCard>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px"
        }}
      >
        <SectionCard style={{ flex: 1, minWidth: "280px" }}>
          <h2 style={{ marginTop: 0 }}>Theory Summary</h2>
          <p style={{ color: "#6b7280", margin: "0 0 10px 0" }}>
            Most Practiced Topic:{" "}
            <strong style={{ color: "#111827", textTransform: "uppercase" }}>
              {mostPracticedTheory}
            </strong>
          </p>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Total Theory Interviews:{" "}
            <strong style={{ color: "#111827" }}>{theoryInterviews}</strong>
          </p>
        </SectionCard>

        <SectionCard style={{ flex: 1, minWidth: "280px" }}>
          <h2 style={{ marginTop: 0 }}>Coding Summary</h2>
          <p style={{ color: "#6b7280", margin: "0 0 10px 0" }}>
            Most Practiced Language:{" "}
            <strong style={{ color: "#111827", textTransform: "uppercase" }}>
              {mostPracticedCoding}
            </strong>
          </p>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Total Coding Interviews:{" "}
            <strong style={{ color: "#111827" }}>{codingInterviews}</strong>
          </p>
        </SectionCard>
      </div>

      {resumeAnalysis && (
        <SectionCard style={{ marginBottom: "30px" }}>
          <h2 style={{ marginTop: 0 }}>Latest Resume Analysis</h2>

          <p style={{ color: "#6b7280", marginBottom: "10px" }}>
            File: {resumeAnalysis.fileName}
          </p>

          <p style={{ color: "#6b7280", marginBottom: "10px" }}>
            Date: {resumeAnalysis.date}
            {resumeAnalysis.time ? ` | Time: ${resumeAnalysis.time}` : ""}
          </p>

          <div
            style={{
              display: "inline-block",
              marginBottom: "14px",
              padding: "8px 14px",
              borderRadius: "999px",
              backgroundColor: "#eef2ff",
              color: "#4338ca",
              fontWeight: "700"
            }}
          >
            Resume Score: {resumeAnalysis.score}%
          </div>

          <ul style={{ color: "#6b7280", marginBottom: 0 }}>
            {(resumeAnalysis.suggestions || []).map((item, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <div style={{ marginBottom: "30px" }}>
        <SectionCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px"
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: "#111827" }}>Performance Trend</h2>
              <p style={{ margin: "6px 0 0 0", color: "#6b7280" }}>
                Based on your recent theory and coding interview activity
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#eef2ff",
                color: "#4338ca",
                padding: "8px 14px",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              {getImprovementText()}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "18px",
              flexWrap: "wrap",
              alignItems: "flex-end"
            }}
          >
            {weeklyTrend.map((item, index) => (
              <TrendBar key={index} label={item.label} value={item.value} />
            ))}
          </div>
        </SectionCard>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
          flexWrap: "wrap"
        }}
      >
        <div style={{ flex: 2, minWidth: "320px" }}>
          <h2 style={{ color: "#111827", marginBottom: "16px" }}>
            Recent Interview Activity
          </h2>

          {history.length > 0 ? (
            history.slice(0, 5).map((item, index) => {
              const badgeStyle = getTypeBadgeStyle(item.type);

              return (
                <div key={index} style={{ marginBottom: "14px" }}>
                  <ActivityItem
                    title={`Completed ${item.topic} ${item.type} interview with score ${item.score}`}
                    time={`${item.date}${item.time ? ` | ${item.time}` : ""}`}
                  />

                  <div
                    style={{
                      marginTop: "-6px",
                      marginLeft: "12px",
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      ...badgeStyle
                    }}
                  >
                    {item.type || "theory"}
                  </div>
                </div>
              );
            })
          ) : (
            <SectionCard>
              <p style={{ margin: 0, color: "#6b7280" }}>
                No interview activity yet.
              </p>
            </SectionCard>
          )}
        </div>

        <div style={{ flex: 1, minWidth: "280px" }}>
          <h2 style={{ color: "#111827", marginBottom: "16px" }}>
            Today’s Focus
          </h2>

          {focusTasks.map((item, index) => (
            <FocusCard key={index} title={item.title} desc={item.desc} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default Dashboard;