import React, { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";

function App() {
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(true); // default to showing questions

  // Fetch questions on mount
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err));
  }, []);

  // Delete question
  function handleDelete(id) {
    fetch(`http://localhost:4000/questions/${id}`, { method: "DELETE" })
      .then(() => setQuestions(questions.filter((q) => q.id !== id)))
      .catch(console.error);
  }

  // Update question (correct answer change)
  function handleUpdate(updatedQ) {
    fetch(`http://localhost:4000/questions/${updatedQ.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedQ),
    })
      .then((res) => res.json())
      .then((data) =>
        setQuestions(questions.map((q) => (q.id === data.id ? data : q)))
      )
      .catch(console.error);
  }

  return (
    <div className="App">
      <nav>
        <button onClick={() => setShowQuestions(false)}>New Question</button>
        <button onClick={() => setShowQuestions(true)}>View Questions</button>
      </nav>

      <main>
        {showQuestions ? (
          <QuestionList
            questions={questions}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ) : (
          <QuestionForm setQuestions={setQuestions} />
        )}
      </main>
    </div>
  );
}

export default App;
