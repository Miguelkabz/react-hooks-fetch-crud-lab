import React from "react";

function QuestionItem({ question }) {
  if (!question) return null; // safeguard if question is undefined

  return (
    <div className="question-item" style={{ border: "1px solid #ccc", margin: "8px", padding: "8px", borderRadius: "4px" }}>
      <h3>{question.title || "No Title"}</h3>
      
      {/* Optional: check if answers exist */}
      {question.answers && question.answers.length > 0 ? (
        <ul>
          {question.answers.map((answer) => (
            <li key={answer.id || Math.random()}>{answer.text || "No Answer"}</li>
          ))}
        </ul>
      ) : (
        <p>No answers yet.</p>
      )}
    </div>
  );
}

export default QuestionItem;
