import React, { useState, useEffect } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [newAnswer, setNewAnswer] = useState("0");

  // Fetch existing questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:3001/questions");
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuestions();
  }, []);

  // Add a new question
  const addQuestion = async () => {
    const payload = { prompt: newPrompt, answer: newAnswer };
    try {
      const res = await fetch("http://localhost:3001/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      // Functional update avoids stale closures
      setQuestions((prev) => [...prev, data]);
      setShowForm(false);
      setNewPrompt("");
      setNewAnswer("0");
    } catch (error) {
      console.error(error);
    }
  };

  // Delete a question
  const deleteQuestion = async (id) => {
    try {
      await fetch(`http://localhost:3001/questions/${id}`, { method: "DELETE" });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Update answer
  const updateAnswer = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer: value } : q))
    );
  };

  return (
    <div>
      <div>
        <button onClick={() => setShowForm(false)}>View Questions</button>
        <button onClick={() => setShowForm(true)}>New Question</button>
      </div>

      {showForm ? (
        <div>
          <h2>Add New Question</h2>
          <label>
            Prompt
            <input
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              aria-label="Prompt"
            />
          </label>
          <label>
            Correct Answer
            <select
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              aria-label="Correct Answer"
            >
              <option value="0">A</option>
              <option value="1">B</option>
              <option value="2">C</option>
              <option value="3">D</option>
            </select>
          </label>
          <button onClick={addQuestion}>Add Question</button>
        </div>
      ) : (
        <div>
          <h2>Questions</h2>
          {questions.map((q) => (
            <div key={q.id}>
              <p>{q.prompt}</p>
              <label>
                Correct Answer
                <select
                  value={q.answer}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  aria-label="Correct Answer"
                >
                  <option value="0">A</option>
                  <option value="1">B</option>
                  <option value="2">C</option>
                  <option value="3">D</option>
                </select>
              </label>
              <button onClick={() => deleteQuestion(q.id)}>Delete Question</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
