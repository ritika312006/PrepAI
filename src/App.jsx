import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import MockInterview from "./pages/MockInterview";
import Analytics from "./pages/Analytics";
import ResumeReview from "./pages/ResumeReview";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/resume-review" element={<ResumeReview />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;