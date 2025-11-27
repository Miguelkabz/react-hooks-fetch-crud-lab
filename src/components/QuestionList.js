import React, { useState } from "react";

function QuestionForm({ onNewQuestion }) {
  const [title, setTitle] = useState("");
  const [answerText, setAnswerText] = useState(""); // single answer for simplicity
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Construct question object
    const newQuestion = {
      title: title.trim(),
      answers: answerText ? [{ id: Date.now(), text: answerText }] : [],
    };

    fetch("http://localhost:3001/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to create question");
        return r.json();
      })
      .then((data) => {
        onNewQuestion(data); // send back to parent to update list
        setTitle("");
        setAnswerText("");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div>
        <label>
          Question Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ marginLeft: "8px", padding: "4px", width: "300px" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "8px" }}>
        <label>
          First Answer (optional):
          <input
            type="text"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            style={{ marginLeft: "8px", padding: "4px", width: "300px" }}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{ marginTop: "12px", padding: "6px 12px" }}
      >
        {loading ? "Adding..." : "Add Question"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </form>
  );
}

export default QuestionForm;
