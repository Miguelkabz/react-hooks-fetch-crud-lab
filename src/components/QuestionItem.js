import React, { useState } from "react";

function QuestionItem({ question, onDelete, onUpdate }) {
  const { id, prompt, answers, correctIndex: initialIndex } = question;
  const [correctIndex, setCorrectIndex] = useState(initialIndex);

  function handleChange(e) {
    const newIndex = Number(e.target.value);
    setCorrectIndex(newIndex);
    onUpdate({ ...question, correctIndex: newIndex });
  }

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select
          aria-label="Correct Answer"
          value={correctIndex}
          onChange={handleChange}
        >
          {answers.map((ans, idx) => (
            <option key={idx} value={idx}>
              {ans}
            </option>
          ))}
        </select>
      </label>
      <button onClick={() => onDelete(id)}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;
