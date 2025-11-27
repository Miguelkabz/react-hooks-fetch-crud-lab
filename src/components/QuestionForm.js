import React, { useState } from "react";

function QuestionForm({ addQuestion }) {
  const [prompt, setPrompt] = useState("");
  const [firstAnswer, setFirstAnswer] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const newQuestion = {
      id: Date.now(),
      prompt,
      answers: firstAnswer ? [firstAnswer] : [],
      correctAnswer: 0,
    };
    addQuestion(newQuestion);
    setPrompt("");
    setFirstAnswer("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div>
        <label>
          Prompt:
          <input
            type="text"
            required
            style={{ marginLeft: "8px", padding: "4px", width: "300px" }}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginTop: "8px" }}>
        <label>
          First Answer (optional):
          <input
            type="text"
            style={{ marginLeft: "8px", padding: "4px", width: "300px" }}
            value={firstAnswer}
            onChange={(e) => setFirstAnswer(e.target.value)}
          />
        </label>
      </div>

      <button
        type="submit"
        style={{ marginTop: "12px", padding: "6px 12px" }}
      >
        Add Question
      </button>
    </form>
  );
}

export default QuestionForm;
