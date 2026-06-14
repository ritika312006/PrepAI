require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Groq = require("groq-sdk");

const app = express();

// Groq AI Setup
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.post("/upload", (req, res) => {
  upload.single("resume")(req, res, function (err) {
    try {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File size should be less than 5 MB"
          });
        }

        return res.status(400).json({
          message: err.message || "Upload failed"
        });
      }

      if (err) {
        return res.status(400).json({
          message: err.message || "Invalid file"
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileName = req.file.originalname.toLowerCase();

      let score = 78;
      let suggestions = [
        "Add measurable achievements in your experience section.",
        "Mention key tools and technologies clearly.",
        "Keep project descriptions short and impact-focused."
      ];

      if (
        fileName.includes("data") ||
        fileName.includes("ml") ||
        fileName.includes("ai") ||
        fileName.includes("ds")
      ) {
        score = 84;
        suggestions = [
          "Add more project results with numbers.",
          "Highlight machine learning models and datasets used.",
          "Mention deployment or full project workflow."
        ];
      }

      if (
        fileName.includes("frontend") ||
        fileName.includes("react") ||
        fileName.includes("mern")
      ) {
        score = 80;
        suggestions = [
          "Show UI projects with clear outcomes.",
          "Mention React, routing, state handling, and component design.",
          "Add one strong full-stack project with impact."
        ];
      }

      if (
        fileName.includes("resume") &&
        !fileName.includes("data") &&
        !fileName.includes("ml") &&
        !fileName.includes("ai") &&
        !fileName.includes("frontend") &&
        !fileName.includes("react")
      ) {
        score = 82;
        suggestions = [
          "Use stronger action verbs in experience points.",
          "Add numbers to show impact wherever possible.",
          "Make technical skills and projects more targeted to the job role."
        ];
      }

      res.json({
        message: "File uploaded successfully",
        file: {
          originalname: req.file.originalname,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size
        },
        score,
        suggestions
      });
    } catch (error) {
      console.error("Upload route error:", error);
      res.status(500).json({
        message: "Upload failed",
        error: error.message
      });
    }
  });
});

app.get("/questions/:topic", (req, res) => {
  try {
    const topic = req.params.topic.toLowerCase();

    const questionBank = {
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

    const questions = questionBank[topic] || [
      "Tell me about yourself.",
      "What are your strengths?",
      "Why should we hire you?"
    ];

    res.json({
      topic,
      questions
    });
  } catch (error) {
    console.error("Questions route error:", error);
    res.status(500).json({
      message: "Failed to fetch questions",
      error: error.message
    });
  }
});

app.post("/evaluate-answer", (req, res) => {
  try {
    const { topic, question, answer } = req.body;

    if (!topic || !question || answer === undefined) {
      return res.status(400).json({
        message: "Topic, question, and answer are required"
      });
    }

    const text = String(answer).trim();
    const lower = text.toLowerCase();

    if (!text) {
      return res.json({
        score: 0,
        feedback: "No answer submitted.",
        strength: "You reached the question.",
        improvement: "Try answering in at least 2-3 lines."
      });
    }

    let score = 0;

    if (text.length > 20) score += 1;
    if (text.length > 60) score += 1;
    if (text.length > 120) score += 1;

    if (
      lower.includes("because") ||
      lower.includes("used") ||
      lower.includes("example") ||
      lower.includes("difference") ||
      lower.includes("helps") ||
      lower.includes("means") ||
      lower.includes("important") ||
      lower.includes("used for")
    ) {
      score += 1;
    }

    const topicKeywords = {
      python: ["list", "tuple", "decorator", "copy", "mutable", "function"],
      sql: ["join", "table", "group by", "where", "having", "normalization"],
      ml: ["model", "training", "overfitting", "bias", "variance", "validation"],
      statistics: ["mean", "median", "probability", "distribution", "hypothesis", "deviation"],
      dbms: ["database", "table", "primary key", "foreign key", "normalization", "rdbms"],
      oops: ["class", "object", "inheritance", "polymorphism", "encapsulation", "abstraction"],
      os: ["process", "thread", "deadlock", "memory", "cpu", "virtual memory"],
      cn: ["tcp", "udp", "ip", "osi", "router", "switch"],
      hr: ["strength", "weakness", "goal", "team", "learn", "responsibility"]
    };

    const keywords = topicKeywords[topic] || [];
    const matchedKeywords = keywords.filter((word) => lower.includes(word)).length;

    if (matchedKeywords >= 1) score += 1;
    if (matchedKeywords >= 2) score += 1;

    let feedback = "";
    let strength = "";
    let improvement = "";

    if (score >= 5) {
      feedback = "Very good answer with solid explanation.";
      strength = "You gave a detailed and topic-relevant response.";
      improvement = "Add one short example or practical point to make it even stronger.";
    } else if (score >= 3) {
      feedback = "Good answer, but it needs more depth.";
      strength = "You covered the main idea correctly.";
      improvement = "Add more explanation, topic keywords, and a practical example.";
    } else {
      feedback = "Basic answer. More detail is needed.";
      strength = "You attempted the question.";
      improvement = "Explain the concept more clearly using important topic terms.";
    }

    res.json({
      score,
      feedback,
      strength,
      improvement
    });
  } catch (error) {
    console.error("Evaluate answer error:", error);
    res.status(500).json({
      message: "Failed to evaluate answer",
      error: error.message
    });
  }
});

// ============================================
// AI ROUTE USING GROQ
// ============================================
app.post("/ai-evaluate", async (req, res) => {
  try {
    const { topic, question, answer, type } = req.body;

    if (!topic || !question || answer === undefined) {
      return res.status(400).json({
        message: "Topic, question, and answer are required"
      });
    }

   const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

Interview Type: ${type || "theory"}
Topic: ${topic}
Question: ${question}
Candidate's Answer: ${answer || "No answer provided"}

Please evaluate the answer and respond in this exact JSON format only, no extra text:
{
  "score": <number from 0 to 7>,
  "feedback": "<one sentence overall feedback>",
  "strength": "<one sentence about what was good>",
  "improvement": "<one sentence about what to improve>",
  "model_answer": "<write a complete correct answer to this question in 3-4 sentences>"
}`;
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 200
    });

    const text = chatCompletion.choices[0]?.message?.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (error) {
    console.error("AI evaluation error:", error);
    res.status(500).json({
      message: "AI evaluation failed",
      error: error.message
    });
  }
});

// ============================================
// AI RESUME REVIEW ROUTE USING GROQ
// ============================================
app.post("/ai-resume-review", async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        message: "Resume text is required"
      });
    }

    const prompt = `You are an expert resume reviewer and career coach. Review this resume and respond in this exact JSON format only, no extra text:
{
  "score": <number from 0 to 100>,
  "overall_feedback": "<2-3 sentence overall review of the resume>",
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "suggestions": [
    "<suggestion 1>",
    "<suggestion 2>",
    "<suggestion 3>",
    "<suggestion 4>"
  ],
  "missing_skills": [
    "<missing or weak area 1>",
    "<missing or weak area 2>",
    "<missing or weak area 3>"
  ],
  "ats_score": <number from 0 to 100>
}

Resume Content:
${resumeText}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 800
    });

    const text = chatCompletion.choices[0]?.message?.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (error) {
    console.error("AI resume review error:", error);
    res.status(500).json({
      message: "AI resume review failed",
      error: error.message
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    message: "Something went wrong on the server",
    error: err.message
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
