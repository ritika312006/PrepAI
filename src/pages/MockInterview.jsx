import { useState, useEffect } from "react";
import PageLayout from "../layout/PageLayout";
import SectionCard from "../components/SectionCard";
import PrimaryButton from "../components/PrimaryButton";

function MockInterview() {
  const [interviewType, setInterviewType] = useState("theory");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [answerReviews, setAnswerReviews] = useState([]);
  const [score, setScore] = useState(0);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finalFeedback, setFinalFeedback] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);

  const theoryTopics = [
    "python",
    "sql",
    "ml",
    "statistics",
    "dbms",
    "oops",
    "os",
    "cn",
    "hr"
  ];

  const codingLanguages = ["python", "java", "cpp", "javascript"];

  const theoryQuestionBank = {
    python: [
      "What is the difference between a list and a tuple in Python?",
      "What is list comprehension?",
      "Explain decorators in Python.",
      "What is the difference between deep copy and shallow copy?"
    ],
    sql: [
      "What is the difference between INNER JOIN and LEFT JOIN?",
      "What is normalization in SQL?",
      "What is the use of GROUP BY?",
      "What is the difference between WHERE and HAVING?"
    ],
    ml: [
      "What is overfitting in machine learning?",
      "What is the difference between supervised and unsupervised learning?",
      "Explain bias and variance.",
      "What is cross-validation?"
    ],
    statistics: [
      "What is the difference between mean and median?",
      "What is standard deviation?",
      "Explain probability distribution.",
      "What is hypothesis testing?"
    ],
    dbms: [
      "What is DBMS and why is it used?",
      "What is the difference between primary key and foreign key?",
      "What is normalization and why is it important?",
      "What is the difference between DBMS and RDBMS?"
    ],
    oops: [
      "What are the four pillars of OOP?",
      "What is the difference between inheritance and polymorphism?",
      "What is encapsulation?",
      "What is the difference between abstraction and encapsulation?"
    ],
    os: [
      "What is an operating system?",
      "What is the difference between process and thread?",
      "What is deadlock in operating systems?",
      "What is virtual memory?"
    ],
    cn: [
      "What is the difference between TCP and UDP?",
      "What is an IP address?",
      "What is the role of the OSI model?",
      "What is the difference between hub, switch, and router?"
    ],
    hr: [
      "Tell me about yourself.",
      "What are your strengths and weaknesses?",
      "Why should we hire you?",
      "Where do you see yourself in five years?"
    ]
  };

  const codingQuestionBank = {
    python: [
      "Write a Python program to reverse a string.",
      "Write a Python program to check whether a number is prime.",
      "Write a Python program to find the largest element in a list.",
      "Write a Python function to count vowels in a string."
    ],
    java: [
      "Write a Java program to reverse a string.",
      "Write a Java program to check whether a number is prime.",
      "Write a Java program to find the factorial of a number.",
      "Write a Java program to count vowels in a string."
    ],
    cpp: [
      "Write a C++ program to reverse a string.",
      "Write a C++ program to check whether a number is prime.",
      "Write a C++ program to find the factorial of a number.",
      "Write a C++ program to find the largest number in an array."
    ],
    javascript: [
      "Write a JavaScript function to reverse a string.",
      "Write a JavaScript function to check whether a number is prime.",
      "Write a JavaScript function to find duplicates in an array.",
      "Write a JavaScript function to count vowels in a string."
    ]
  };

  useEffect(() => {
    if (questions.length === 0 || interviewFinished) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (timeLeft === 0) {
      handleNext(true);
    }
  }, [timeLeft, questions.length, interviewFinished]);

  const getKeywordsByTopic = (selectedTopic, selectedType) => {
    if (selectedType === "coding") {
      const codingKeywords = {
        python: ["def", "for", "if", "return", "list", "string"],
        java: ["public", "static", "void", "class", "return", "int"],
        cpp: ["int", "cout", "cin", "for", "return", "include"],
        javascript: ["function", "const", "let", "return", "if", "array"]
      };

      return codingKeywords[selectedTopic] || [];
    }

    const theoryKeywords = {
      python: ["list", "tuple", "decorator", "copy", "mutable", "function"],
      sql: ["join", "table", "group by", "where", "having", "normalization"],
      ml: ["model", "training", "overfitting", "bias", "variance", "validation"],
      statistics: ["mean", "median", "probability", "distribution", "hypothesis", "deviation"],
      dbms: ["database", "primary key", "foreign key", "normalization", "table", "rdbms"],
      oops: ["class", "object", "inheritance", "polymorphism", "encapsulation", "abstraction"],
      os: ["process", "thread", "deadlock", "memory", "cpu", "scheduler"],
      cn: ["tcp", "udp", "ip", "router", "switch", "osi"],
      hr: ["strength", "weakness", "goal", "team", "learn", "responsibility"]
    };

    return theoryKeywords[selectedTopic] || [];
  };

  const calculateAnswerScore = (text, selectedTopic, selectedType) => {
    const cleanText = text.trim();
    const lower = cleanText.toLowerCase();
    let points = 0;

    if (!lower) return 0;

    if (cleanText.length > 20) points += 1;
    if (cleanText.length > 60) points += 1;
    if (cleanText.length > 120) points += 1;

    if (
      lower.includes("because") ||
      lower.includes("used") ||
      lower.includes("example") ||
      lower.includes("difference") ||
      lower.includes("helps") ||
      lower.includes("means") ||
      lower.includes("return") ||
      lower.includes("function")
    ) {
      points += 1;
    }

    if (selectedType === "coding") {
      if (
        cleanText.includes("{") ||
        cleanText.includes("}") ||
        cleanText.includes(";") ||
        cleanText.includes("(") ||
        cleanText.includes(")")
      ) {
        points += 1;
      }
    }

    const keywords = getKeywordsByTopic(selectedTopic, selectedType);
    const matchedKeywords = keywords.filter((word) => lower.includes(word)).length;

    if (matchedKeywords >= 1) points += 1;
    if (matchedKeywords >= 2) points += 1;

    return points;
  };

  const getLocalEvaluation = (text, selectedTopic, selectedType) => {
    const localScore = calculateAnswerScore(text, selectedTopic, selectedType);

    if (!text.trim()) {
      return {
        score: 0,
        feedback: "No answer submitted.",
        strength: "You reached the question.",
        improvement: "Try answering in at least 2-3 lines."
      };
    }

    if (localScore >= 5) {
      return {
        score: localScore,
        feedback:
          selectedType === "coding"
            ? "Very good answer with proper coding structure."
            : "Very good answer with decent explanation.",
        strength:
          selectedType === "coding"
            ? "You wrote a structured and relevant coding solution."
            : "You gave a detailed and topic-related response.",
        improvement:
          selectedType === "coding"
            ? "Add one more edge case or short explanation."
            : "Add one short example to make your answer stronger."
      };
    }

    if (localScore >= 3) {
      return {
        score: localScore,
        feedback:
          selectedType === "coding"
            ? "Good coding attempt, but it needs more correctness or structure."
            : "Good attempt, but it needs more depth.",
        strength:
          selectedType === "coding"
            ? "You understood the coding idea."
            : "You covered the basic concept.",
        improvement:
          selectedType === "coding"
            ? "Add cleaner syntax, logic flow, and output handling."
            : "Add more explanation and topic keywords."
      };
    }

    return {
      score: localScore,
      feedback:
        selectedType === "coding"
          ? "Basic coding attempt. More complete logic is needed."
          : "Basic answer. More detail is needed.",
      strength: "You attempted the question.",
      improvement:
        selectedType === "coding"
          ? "Write clearer logic or code with proper syntax."
          : "Explain clearly and include examples or important terms."
    };
  };

  const generateFinalFeedback = (finalScore, totalQuestions, reviews, selectedType) => {
    const feedback = [];
    const maxPossibleScore = totalQuestions * 7;

    if (finalScore >= maxPossibleScore * 0.75) {
      feedback.push(
        selectedType === "coding"
          ? "Strong coding performance with good logic and structure."
          : "Strong performance with detailed answers."
      );
      feedback.push(
        selectedType === "coding"
          ? "You handled the coding round well."
          : "You explained concepts clearly and used relevant points."
      );
    } else if (finalScore >= maxPossibleScore * 0.5) {
      feedback.push(
        selectedType === "coding"
          ? "Good coding attempt, but some solutions need refinement."
          : "Good attempt, but some answers need more depth."
      );
      feedback.push(
        selectedType === "coding"
          ? "Practice syntax, edge cases, and cleaner logic."
          : "Try adding clearer explanations and examples."
      );
    } else {
      feedback.push(
        selectedType === "coding"
          ? "Your coding answers need more practice and better structure."
          : "Your answers were short or lacked topic depth."
      );
      feedback.push(
        selectedType === "coding"
          ? "Practice basic coding questions regularly."
          : "Practice answering in a more structured way."
      );
    }

    const weakAnswers = reviews.filter((item) => item.score <= 2).length;
    const strongAnswers = reviews.filter((item) => item.score >= 5).length;
    const skippedAnswers = reviews.filter(
      (item) => !item.answer || item.answer === "No answer submitted"
    ).length;

    if (weakAnswers > 0) {
      feedback.push(`${weakAnswers} answer(s) need more improvement.`);
    }

    if (strongAnswers > 0) {
      feedback.push(`${strongAnswers} answer(s) were very strong.`);
    }

    if (skippedAnswers > 0) {
      feedback.push(`${skippedAnswers} question(s) were skipped or left unanswered.`);
    }

    return feedback;
  };

  const saveInterviewResult = (finalScore, finalTopic, totalQuestions, selectedType) => {
    const oldHistory =
      JSON.parse(localStorage.getItem("interviewHistory")) || [];

    const newEntry = {
      topic: finalTopic,
      type: selectedType,
      score: finalScore,
      totalQuestions: totalQuestions,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };

    localStorage.setItem(
      "interviewHistory",
      JSON.stringify([newEntry, ...oldHistory])
    );
  };

  const fetchQuestions = async (selectedTopic) => {
    try {
      setLoadingQuestions(true);

      let questionList = [];

      if (interviewType === "theory") {
        try {
          const res = await fetch(`http://localhost:5000/questions/${selectedTopic}`);
          const data = await res.json();

          if (res.ok && data.questions && data.questions.length > 0) {
            questionList = data.questions;
          } else {
            questionList = theoryQuestionBank[selectedTopic] || [];
          }
        } catch (apiError) {
          console.error("Theory API failed, using local theory questions:", apiError);
          questionList = theoryQuestionBank[selectedTopic] || [];
        }
      } else {
        questionList = codingQuestionBank[selectedTopic] || [];
      }

      setTopic(selectedTopic);
      setQuestions(questionList);
      setCurrentIndex(0);
      setAnswer("");
      setSubmittedAnswers([]);
      setAnswerReviews([]);
      setScore(0);
      setInterviewFinished(false);
      setTimeLeft(interviewType === "coding" ? 120 : 60);
      setFinalFeedback([]);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch questions");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleNext = async (isSkip = false) => {
    if (loadingEvaluation) return;
    if (!questions[currentIndex]) return;

    setLoadingEvaluation(true);

    try {
      let evaluationData = null;
      const answerToEvaluate = isSkip ? "" : answer;

      if (interviewType === "theory") {
        try {
          const res = await fetch("http://localhost:5000/evaluate-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              topic,
              question: questions[currentIndex],
              answer: answerToEvaluate
            })
          });

          if (res.ok) {
            evaluationData = await res.json();
          } else {
            evaluationData = getLocalEvaluation(answerToEvaluate, topic, interviewType);
          }
        } catch (apiError) {
          console.error("Backend evaluation failed, using local scoring:", apiError);
          evaluationData = getLocalEvaluation(answerToEvaluate, topic, interviewType);
        }
      } else {
        evaluationData = getLocalEvaluation(answerToEvaluate, topic, interviewType);
      }

      const currentAnswer = answerToEvaluate.trim()
        ? answerToEvaluate
        : "No answer submitted";

      const updatedAnswers = [...submittedAnswers, currentAnswer];
      const updatedReviews = [
        ...answerReviews,
        {
          question: questions[currentIndex],
          answer: currentAnswer,
          score: evaluationData.score || 0,
          feedback: evaluationData.feedback || "No feedback available.",
          strength: evaluationData.strength || "Answer submitted.",
          improvement: evaluationData.improvement || "Try improving clarity."
        }
      ];

      const newScore = score + (evaluationData.score || 0);

      setSubmittedAnswers(updatedAnswers);
      setAnswerReviews(updatedReviews);
      setScore(newScore);
      setAnswer("");
      setTimeLeft(interviewType === "coding" ? 120 : 60);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setInterviewFinished(true);
        saveInterviewResult(newScore, topic, questions.length, interviewType);
        const feedback = generateFinalFeedback(
          newScore,
          questions.length,
          updatedReviews,
          interviewType
        );
        setFinalFeedback(feedback);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process answer");
    } finally {
      setLoadingEvaluation(false);
    }
  };

  const handleRestart = () => {
    setTopic("");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswer("");
    setSubmittedAnswers([]);
    setAnswerReviews([]);
    setScore(0);
    setInterviewFinished(false);
    setTimeLeft(interviewType === "coding" ? 120 : 60);
    setFinalFeedback([]);
    setLoadingQuestions(false);
    setLoadingEvaluation(false);
  };

  const handleTypeChange = (selectedType) => {
    setInterviewType(selectedType);
    setTopic("");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswer("");
    setSubmittedAnswers([]);
    setAnswerReviews([]);
    setScore(0);
    setInterviewFinished(false);
    setTimeLeft(selectedType === "coding" ? 120 : 60);
    setFinalFeedback([]);
    setLoadingQuestions(false);
    setLoadingEvaluation(false);
  };

  const getCodingHint = () => {
    const hints = {
      python: "Tip: use proper indentation, def, return, and simple examples.",
      java: "Tip: include method structure, data type, and return statement.",
      cpp: "Tip: write clear logic with int, loops, and proper output handling.",
      javascript: "Tip: use function, return, and clean array/string handling."
    };

    return hints[topic] || "Write clean code and explain the logic briefly.";
  };

  const options = interviewType === "theory" ? theoryTopics : codingLanguages;
  const progressPercent =
    questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;
  const maxScore = questions.length * 7;

  return (
    <PageLayout
      title="Mock Interview"
      subtitle="Practice theory and coding interviews in one place"
    >
      <SectionCard>
        <h2 style={{ marginTop: 0 }}>Select Interview Type</h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "10px",
            marginBottom: "20px"
          }}
        >
          <button
            onClick={() => handleTypeChange("theory")}
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: interviewType === "theory" ? "#4f46e5" : "#e5e7eb",
              color: interviewType === "theory" ? "white" : "#111827",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Theory Interview
          </button>

          <button
            onClick={() => handleTypeChange("coding")}
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: interviewType === "coding" ? "#4f46e5" : "#e5e7eb",
              color: interviewType === "coding" ? "white" : "#111827",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Coding Interview
          </button>
        </div>

        <h2 style={{ marginBottom: "10px" }}>
          {interviewType === "theory" ? "Select Topic" : "Select Language"}
        </h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "10px"
          }}
        >
          {options.map((item, index) => (
            <button
              key={index}
              onClick={() => fetchQuestions(item)}
              disabled={loadingQuestions || loadingEvaluation}
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                border: "none",
                backgroundColor: topic === item ? "#4f46e5" : "#e5e7eb",
                color: topic === item ? "white" : "#111827",
                cursor:
                  loadingQuestions || loadingEvaluation ? "not-allowed" : "pointer",
                fontWeight: "600",
                textTransform: "capitalize",
                opacity: loadingQuestions || loadingEvaluation ? 0.7 : 1
              }}
            >
              {item === "cn" ? "computer networks" : item}
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: "16px",
            padding: "12px 14px",
            borderRadius: "12px",
            backgroundColor: "#f8fafc",
            color: "#475569",
            fontSize: "14px"
          }}
        >
          {interviewType === "theory"
            ? "Theory round includes conceptual questions. Time per question: 60 seconds."
            : "Coding round includes programming questions. Time per question: 120 seconds."}
        </div>

        {loadingQuestions && (
          <p style={{ marginTop: "12px", color: "#6b7280" }}>
            Loading questions...
          </p>
        )}
      </SectionCard>

      {questions.length > 0 && !interviewFinished && currentIndex < questions.length && (
        <SectionCard style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "10px"
            }}
          >
            <p style={{ color: "#6b7280", margin: 0 }}>
              Type: <span style={{ textTransform: "capitalize" }}>{interviewType}</span> |{" "}
              {interviewType === "theory" ? "Topic" : "Language"}:{" "}
              <span style={{ textTransform: "capitalize" }}>
                {topic === "cn" ? "computer networks" : topic}
              </span>
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap"
              }}
            >
              <div
                style={{
                  backgroundColor: "#eef2ff",
                  color: "#4338ca",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontWeight: "600"
                }}
              >
                Score: {score}
              </div>

              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#b91c1c",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontWeight: "600"
                }}
              >
                Time Left: {timeLeft}s
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#6b7280"
              }}
            >
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span>{progressPercent}% completed</span>
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
                  width: `${progressPercent}%`,
                  height: "100%",
                  backgroundColor: "#4f46e5"
                }}
              ></div>
            </div>
          </div>

          <h2 style={{ marginTop: 0 }}>{questions[currentIndex]}</h2>

          {interviewType === "coding" && (
            <div
              style={{
                marginTop: "12px",
                marginBottom: "12px",
                padding: "12px 14px",
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0"
              }}
            >
              <p style={{ margin: 0, color: "#475569", fontSize: "14px" }}>
                <strong>Hint:</strong> {getCodingHint()}
              </p>
            </div>
          )}

          <textarea
            placeholder={
              interviewType === "coding"
                ? "Write your code or logic here..."
                : "Write your answer here..."
            }
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={interviewType === "coding" ? 12 : 6}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: interviewType === "coding" ? "monospace" : "inherit",
              fontSize: interviewType === "coding" ? "14px" : "15px",
              backgroundColor: interviewType === "coding" ? "#0f172a" : "white",
              color: interviewType === "coding" ? "#f8fafc" : "#111827"
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "15px"
            }}
          >
            <PrimaryButton onClick={() => handleNext(false)}>
              {loadingEvaluation
                ? "Evaluating..."
                : currentIndex === questions.length - 1
                ? "Finish Interview"
                : "Next Question"}
            </PrimaryButton>

            <button
              onClick={() => handleNext(true)}
              disabled={loadingEvaluation}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                backgroundColor: "#f8fafc",
                cursor: loadingEvaluation ? "not-allowed" : "pointer",
                fontWeight: "600"
              }}
            >
              Skip Question
            </button>

            <button
              onClick={handleRestart}
              disabled={loadingEvaluation}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                backgroundColor: "white",
                cursor: loadingEvaluation ? "not-allowed" : "pointer",
                fontWeight: "600"
              }}
            >
              Restart
            </button>
          </div>

          {timeLeft === 0 && (
            <p style={{ marginTop: "12px", color: "#b91c1c" }}>
              Time is up. Moving to next question...
            </p>
          )}
        </SectionCard>
      )}

      {interviewFinished && (
        <SectionCard style={{ marginTop: "20px" }}>
          <h2>Interview Result</h2>

          <p style={{ fontSize: "20px", fontWeight: "600", color: "#4f46e5" }}>
            Your Score: {score} / {maxScore}
          </p>

          <p style={{ color: "#6b7280", marginBottom: "8px" }}>
            Interview Type:{" "}
            <strong style={{ textTransform: "capitalize" }}>{interviewType}</strong>
          </p>

          <p style={{ color: "#6b7280", marginBottom: "8px" }}>
            Topic/Language:{" "}
            <strong style={{ textTransform: "uppercase" }}>
              {topic === "cn" ? "COMPUTER NETWORKS" : topic}
            </strong>
          </p>

          <p style={{ color: "#6b7280", marginBottom: "16px" }}>
            This score is based on answer quality, explanation depth, structure,
            syntax, and relevance.
          </p>

          <PrimaryButton onClick={handleRestart}>
            Restart Interview
          </PrimaryButton>
        </SectionCard>
      )}

      {interviewFinished && finalFeedback.length > 0 && (
        <SectionCard style={{ marginTop: "20px" }}>
          <h2>Final Feedback</h2>

          <ul style={{ color: "#4b5563", paddingLeft: "18px" }}>
            {finalFeedback.map((item, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {answerReviews.length > 0 && (
        <SectionCard style={{ marginTop: "20px" }}>
          <h2>Answer Review</h2>

          {answerReviews.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom:
                  index !== answerReviews.length - 1 ? "1px solid #e5e7eb" : "none"
              }}
            >
              <p style={{ fontWeight: "700", marginBottom: "6px" }}>
                Question {index + 1}
              </p>

              <p style={{ margin: "0 0 8px 0", color: "#111827" }}>
                {item.question}
              </p>

              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#4b5563",
                  whiteSpace: "pre-wrap",
                  fontFamily:
                    interviewType === "coding" ? "monospace" : "inherit"
                }}
              >
                <strong>Your Answer:</strong> {item.answer}
              </p>

              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#4f46e5",
                  fontWeight: "600"
                }}
              >
                Score: {item.score}
              </p>

              <p style={{ margin: "0 0 6px 0", color: "#4b5563" }}>
                <strong>Feedback:</strong> {item.feedback}
              </p>

              <p style={{ margin: "0 0 6px 0", color: "#16a34a" }}>
                <strong>Strength:</strong> {item.strength}
              </p>

              <p style={{ margin: 0, color: "#dc2626" }}>
                <strong>Improve:</strong> {item.improvement}
              </p>
            </div>
          ))}
        </SectionCard>
      )}

      {questions.length === 0 && !topic && (
        <SectionCard style={{ marginTop: "20px" }}>
          <p style={{ margin: 0, color: "#6b7280" }}>
            Select an interview type and topic/language to start your mock interview.
          </p>
        </SectionCard>
      )}
    </PageLayout>
  );
}

export default MockInterview;