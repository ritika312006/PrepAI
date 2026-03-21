import { useEffect, useMemo, useState } from "react";
import PageLayout from "../layout/PageLayout";
import SectionCard from "../components/SectionCard";
import InsightCard from "../components/InsightCard";
import PrimaryButton from "../components/PrimaryButton";

function Analytics() {
  const [history, setHistory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("interviewHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("interviewHistory");
    setHistory([]);
    setSearchText("");
    setTypeFilter("all");
    setPerformanceFilter("all");
  };

  const getTotalPossible = (item) => {
    if (item.totalQuestions && item.type === "coding") {
      return item.totalQuestions * 7;
    }

    if (item.totalQuestions) {
      return item.totalQuestions * 6;
    }

    return 24;
  };

  const getPercent = (item) => {
    const totalPossible = getTotalPossible(item);
    return Math.min(100, Math.round((item.score / totalPossible) * 100));
  };

  const getPerformanceLabel = (percent) => {
    if (percent >= 75) return "excellent";
    if (percent >= 50) return "good";
    if (percent >= 30) return "average";
    return "needs work";
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const topic = (item.topic || "").toLowerCase();
      const type = item.type || "theory";
      const percent = getPercent(item);
      const label = getPerformanceLabel(percent);

      const matchesSearch =
        !searchText.trim() || topic.includes(searchText.trim().toLowerCase());

      const matchesType =
        typeFilter === "all" || type === typeFilter;

      const matchesPerformance =
        performanceFilter === "all" || label === performanceFilter;

      return matchesSearch && matchesType && matchesPerformance;
    });
  }, [history, searchText, typeFilter, performanceFilter]);

  const interviewsTaken = history.length;
  const theoryHistory = history.filter((item) => item.type === "theory");
  const codingHistory = history.filter((item) => item.type === "coding");

  const getAveragePercentage = (items) => {
    if (items.length === 0) return 0;

    const total = items.reduce((sum, item) => sum + getPercent(item), 0);
    return Math.min(100, Math.round(total / items.length));
  };

  const overallPercentage = getAveragePercentage(history);
  const theoryPercentage = getAveragePercentage(theoryHistory);
  const codingPercentage = getAveragePercentage(codingHistory);

  const topicStats = {};

  history.forEach((item) => {
    const key = `${item.type || "theory"}-${item.topic || "unknown"}`;

    if (!topicStats[key]) {
      topicStats[key] = {
        topic: item.topic || "unknown",
        type: item.type || "theory",
        totalScore: 0,
        count: 0,
        totalPossible: 0
      };
    }

    topicStats[key].totalScore += item.score;
    topicStats[key].count += 1;
    topicStats[key].totalPossible += getTotalPossible(item);
  });

  const performanceData = Object.values(topicStats).map((item) => {
    const avgScore = Math.round(item.totalScore / item.count);
    const avgPossible = Math.round(item.totalPossible / item.count);
    const percentage =
      avgPossible > 0
        ? Math.min(100, Math.round((avgScore / avgPossible) * 100))
        : 0;

    return {
      ...item,
      avgScore,
      avgPossible,
      percentage
    };
  });

  const sortedPerformance = [...performanceData].sort(
    (a, b) => b.percentage - a.percentage
  );

  const strongestOverall =
    sortedPerformance.length > 0 ? sortedPerformance[0] : null;

  const weakestOverall =
    sortedPerformance.length > 0
      ? sortedPerformance[sortedPerformance.length - 1]
      : null;

  const strongestTheory =
    performanceData
      .filter((item) => item.type === "theory")
      .sort((a, b) => b.percentage - a.percentage)[0] || null;

  const strongestCoding =
    performanceData
      .filter((item) => item.type === "coding")
      .sort((a, b) => b.percentage - a.percentage)[0] || null;

  const weakestTheory =
    performanceData
      .filter((item) => item.type === "theory")
      .sort((a, b) => a.percentage - b.percentage)[0] || null;

  const weakestCoding =
    performanceData
      .filter((item) => item.type === "coding")
      .sort((a, b) => a.percentage - b.percentage)[0] || null;

  const latestAttempt = history.length > 0 ? history[0] : null;

  const bestAttempt =
    history.length > 0
      ? history.reduce((best, current) =>
          current.score > best.score ? current : best
        )
      : null;

  const analyticsData = [
    { title: "Overall Performance", value: `${overallPercentage}%` },
    { title: "Total Interviews", value: `${interviewsTaken}` },
    { title: "Theory Interviews", value: `${theoryHistory.length}` },
    { title: "Coding Interviews", value: `${codingHistory.length}` }
  ];

  const getPerformanceColor = (percentage) => {
    if (percentage >= 75) return "#16a34a";
    if (percentage >= 50) return "#4f46e5";
    if (percentage >= 30) return "#d97706";
    return "#dc2626";
  };

  const getPerformanceBg = (percentage) => {
    if (percentage >= 75) return "#dcfce7";
    if (percentage >= 50) return "#eef2ff";
    if (percentage >= 30) return "#fef3c7";
    return "#fee2e2";
  };

  const getGrowthText = () => {
    if (history.length < 2) {
      return "Complete more interviews to measure your growth clearly.";
    }

    const latest = history[0];
    const previous = history[1];

    const latestPercent = getPercent(latest);
    const previousPercent = getPercent(previous);

    if (latestPercent > previousPercent) {
      return "Your latest interview performance improved compared to the previous one.";
    }

    if (latestPercent < previousPercent) {
      return "Your latest score dropped slightly. One more focused round can help.";
    }

    return "Your performance is stable. Keep going to improve further.";
  };

  const insights = [
    {
      title: "Top Strength",
      text: strongestOverall
        ? `You are currently strongest in ${strongestOverall.type.toUpperCase()} | ${strongestOverall.topic.toUpperCase()}.`
        : "Start interviews to discover your strengths."
    },
    {
      title: "Focus Area",
      text: weakestOverall
        ? `Your lowest performance is in ${weakestOverall.type.toUpperCase()} | ${weakestOverall.topic.toUpperCase()}.`
        : "No weak area identified yet."
    },
    {
      title: "Growth Insight",
      text: getGrowthText()
    },
    {
      title: "Next Best Action",
      text: weakestOverall
        ? `Practice one more ${weakestOverall.type} round in ${weakestOverall.topic.toUpperCase()} today.`
        : "Start with one theory or coding interview today."
    }
  ];

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

  const getLabelBadgeStyle = (label) => {
    if (label === "excellent") {
      return { backgroundColor: "#dcfce7", color: "#166534" };
    }

    if (label === "good") {
      return { backgroundColor: "#eef2ff", color: "#4338ca" };
    }

    if (label === "average") {
      return { backgroundColor: "#fef3c7", color: "#b45309" };
    }

    return { backgroundColor: "#fee2e2", color: "#b91c1c" };
  };

  return (
    <PageLayout
      title="Analytics"
      subtitle="Track theory and coding interview performance in one dashboard"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <h2 style={{ margin: 0 }}>Performance Overview</h2>

        <PrimaryButton onClick={clearHistory} style={{ background: "#dc2626" }}>
          Clear History
        </PrimaryButton>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px"
        }}
      >
        {analyticsData.map((item, index) => (
          <SectionCard key={index} style={{ width: "220px" }}>
            <p style={{ margin: 0, color: "#6b7280" }}>{item.title}</p>
            <h2 style={{ margin: "10px 0 0 0", color: "#111827" }}>
              {item.value}
            </h2>
          </SectionCard>
        ))}
      </div>

      <SectionCard style={{ marginBottom: "30px" }}>
        <h2 style={{ marginTop: 0 }}>Quick Summary</h2>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "999px",
              backgroundColor: getPerformanceBg(overallPercentage),
              color: getPerformanceColor(overallPercentage),
              fontWeight: "700"
            }}
          >
            Overall: {overallPercentage}%
          </div>

          <div
            style={{
              padding: "10px 14px",
              borderRadius: "999px",
              backgroundColor: getPerformanceBg(theoryPercentage),
              color: getPerformanceColor(theoryPercentage),
              fontWeight: "700"
            }}
          >
            Theory: {theoryPercentage}%
          </div>

          <div
            style={{
              padding: "10px 14px",
              borderRadius: "999px",
              backgroundColor: getPerformanceBg(codingPercentage),
              color: getPerformanceColor(codingPercentage),
              fontWeight: "700"
            }}
          >
            Coding: {codingPercentage}%
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
          <h2 style={{ marginTop: 0 }}>Theory Insights</h2>
          <p style={{ color: "#6b7280", margin: "0 0 10px 0" }}>
            Strongest Topic:{" "}
            <strong style={{ color: "#111827", textTransform: "uppercase" }}>
              {strongestTheory ? strongestTheory.topic : "None"}
            </strong>
          </p>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Needs Practice:{" "}
            <strong style={{ color: "#111827", textTransform: "uppercase" }}>
              {weakestTheory ? weakestTheory.topic : "None"}
            </strong>
          </p>
        </SectionCard>

        <SectionCard style={{ flex: 1, minWidth: "280px" }}>
          <h2 style={{ marginTop: 0 }}>Coding Insights</h2>
          <p style={{ color: "#6b7280", margin: "0 0 10px 0" }}>
            Strongest Language:{" "}
            <strong style={{ color: "#111827", textTransform: "uppercase" }}>
              {strongestCoding ? strongestCoding.topic : "None"}
            </strong>
          </p>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Needs Practice:{" "}
            <strong style={{ color: "#111827", textTransform: "uppercase" }}>
              {weakestCoding ? weakestCoding.topic : "None"}
            </strong>
          </p>
        </SectionCard>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "flex-start"
        }}
      >
        <SectionCard style={{ flex: 2, minWidth: "320px" }}>
          <h2 style={{ marginTop: 0 }}>Skill Performance</h2>

          {sortedPerformance.length > 0 ? (
            sortedPerformance.map((item, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                    gap: "10px",
                    flexWrap: "wrap"
                  }}
                >
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ textTransform: "uppercase", fontWeight: "600" }}>
                      {item.topic}
                    </span>

                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        ...getTypeBadgeStyle(item.type)
                      }}
                    >
                      {item.type}
                    </span>
                  </div>

                  <span style={{ color: "#6b7280" }}>
                    {item.percentage}% ({item.avgScore}/{item.avgPossible}) | Attempts:{" "}
                    {item.count}
                  </span>
                </div>

                <div
                  style={{
                    height: "10px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "999px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: "100%",
                      backgroundColor: getPerformanceColor(item.percentage)
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#6b7280" }}>No performance data yet.</p>
          )}
        </SectionCard>

        <SectionCard style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>
            Performance Insights
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {insights.map((item, index) => (
              <InsightCard key={index} title={item.title} text={item.text} />
            ))}
          </div>
        </SectionCard>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px"
        }}
      >
        <SectionCard style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ marginTop: 0 }}>Best Attempt</h2>

          {bestAttempt ? (
            <>
              <p style={{ margin: "0 0 8px 0", color: "#111827", fontWeight: "600" }}>
                Topic:{" "}
                <span style={{ textTransform: "uppercase" }}>{bestAttempt.topic}</span>
              </p>

              <p style={{ margin: "0 0 8px 0", color: "#6b7280" }}>
                Type:{" "}
                <span style={{ textTransform: "capitalize" }}>{bestAttempt.type}</span>
              </p>

              <p style={{ margin: "0 0 8px 0", color: "#6b7280" }}>
                Score: {bestAttempt.score}
              </p>

              <p style={{ margin: 0, color: "#6b7280" }}>
                Date: {bestAttempt.date}
                {bestAttempt.time ? ` | ${bestAttempt.time}` : ""}
              </p>
            </>
          ) : (
            <p style={{ color: "#6b7280" }}>No best attempt yet.</p>
          )}
        </SectionCard>

        <SectionCard style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ marginTop: 0 }}>Latest Attempt</h2>

          {latestAttempt ? (
            <>
              <p style={{ margin: "0 0 8px 0", color: "#111827", fontWeight: "600" }}>
                Topic:{" "}
                <span style={{ textTransform: "uppercase" }}>{latestAttempt.topic}</span>
              </p>

              <p style={{ margin: "0 0 8px 0", color: "#6b7280" }}>
                Type:{" "}
                <span style={{ textTransform: "capitalize" }}>{latestAttempt.type}</span>
              </p>

              <p style={{ margin: "0 0 8px 0", color: "#6b7280" }}>
                Score: {latestAttempt.score}
              </p>

              <p style={{ margin: 0, color: "#6b7280" }}>
                Date: {latestAttempt.date}
                {latestAttempt.time ? ` | ${latestAttempt.time}` : ""}
              </p>
            </>
          ) : (
            <p style={{ color: "#6b7280" }}>No latest attempt yet.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard style={{ marginTop: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "18px"
          }}
        >
          <h2 style={{ margin: 0 }}>Interview History</h2>
          <div style={{ color: "#6b7280", fontWeight: "600" }}>
            Showing {filteredHistory.length} of {history.length}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px"
          }}
        >
          <input
            type="text"
            placeholder="Search by topic or language"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              flex: "1 1 240px",
              minWidth: "220px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              outline: "none"
            }}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              minWidth: "160px"
            }}
          >
            <option value="all">All Types</option>
            <option value="theory">Theory</option>
            <option value="coding">Coding</option>
          </select>

          <select
            value={performanceFilter}
            onChange={(e) => setPerformanceFilter(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              minWidth: "180px"
            }}
          >
            <option value="all">All Performance</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="needs work">Needs Work</option>
          </select>
        </div>

        {filteredHistory.length > 0 ? (
          filteredHistory.map((item, index) => {
            const totalPossible = getTotalPossible(item);
            const percent = getPercent(item);
            const label = getPerformanceLabel(percent);

            return (
              <div
                key={index}
                style={{
                  padding: "14px 0",
                  borderBottom:
                    index !== filteredHistory.length - 1
                      ? "1px solid #e5e7eb"
                      : "none"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: "6px"
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "700",
                      textTransform: "capitalize",
                      color: "#111827"
                    }}
                  >
                    {item.topic}
                  </p>

                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      ...getTypeBadgeStyle(item.type || "theory")
                    }}
                  >
                    {item.type || "theory"}
                  </span>

                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      ...getLabelBadgeStyle(label)
                    }}
                  >
                    {label}
                  </span>
                </div>

                <p style={{ margin: 0, color: "#6b7280" }}>
                  Score: {item.score} / {totalPossible} | Performance: {percent}% |
                  Questions: {item.totalQuestions} | Date: {item.date}
                  {item.time ? ` | ${item.time}` : ""}
                </p>
              </div>
            );
          })
        ) : (
          <p style={{ color: "#6b7280", margin: 0 }}>
            No matching interview history found.
          </p>
        )}
      </SectionCard>
    </PageLayout>
  );
}

export default Analytics;