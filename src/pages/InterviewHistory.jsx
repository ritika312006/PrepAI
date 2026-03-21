import { useEffect, useState } from "react";
import PageLayout from "../layout/PageLayout";
import SectionCard from "../components/SectionCard";
import PrimaryButton from "../components/PrimaryButton";

function InterviewHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("interviewHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("interviewHistory");
    setHistory([]);
  };

  const getPerformanceLabel = (score, totalQuestions) => {
    const maxScore = totalQuestions * 3;
    const percentage = (score / maxScore) * 100;

    if (percentage >= 75) return "Excellent";
    if (percentage >= 50) return "Good";
    if (percentage >= 30) return "Average";
    return "Needs Practice";
  };

  return (
    <PageLayout
      title="Interview History"
      subtitle="Track all your previous mock interview attempts"
    >
      <SectionCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div>
            <h2 style={{ marginBottom: "6px" }}>Your Past Attempts</h2>
            <p style={{ color: "#6b7280", margin: 0 }}>
              Total Attempts: {history.length}
            </p>
          </div>

          {history.length > 0 && (
            <PrimaryButton onClick={handleClearHistory}>
              Clear History
            </PrimaryButton>
          )}
        </div>
      </SectionCard>

      {history.length === 0 ? (
        <SectionCard style={{ marginTop: "20px" }}>
          <h2>No Interview History Yet</h2>
          <p style={{ color: "#6b7280", marginBottom: 0 }}>
            Complete a mock interview to see your results here.
          </p>
        </SectionCard>
      ) : (
        <div style={{ marginTop: "20px", display: "grid", gap: "20px" }}>
          {history.map((item, index) => {
            const performance = getPerformanceLabel(
              item.score,
              item.totalQuestions
            );

            return (
              <SectionCard key={index}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "16px"
                  }}
                >
                  <div>
                    <h2
                      style={{
                        marginTop: 0,
                        marginBottom: "10px",
                        textTransform: "capitalize"
                      }}
                    >
                      {item.topic} Interview
                    </h2>

                    <p style={{ margin: "6px 0", color: "#4b5563" }}>
                      <strong>Score:</strong> {item.score}
                    </p>

                    <p style={{ margin: "6px 0", color: "#4b5563" }}>
                      <strong>Total Questions:</strong> {item.totalQuestions}
                    </p>

                    <p style={{ margin: "6px 0", color: "#4b5563" }}>
                      <strong>Date:</strong> {item.date}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "999px",
                      fontWeight: "600",
                      backgroundColor:
                        performance === "Excellent"
                          ? "#dcfce7"
                          : performance === "Good"
                          ? "#dbeafe"
                          : performance === "Average"
                          ? "#fef3c7"
                          : "#fee2e2",
                      color:
                        performance === "Excellent"
                          ? "#166534"
                          : performance === "Good"
                          ? "#1d4ed8"
                          : performance === "Average"
                          ? "#b45309"
                          : "#b91c1c"
                    }}
                  >
                    {performance}
                  </div>
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}

export default InterviewHistory;