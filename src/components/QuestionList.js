import React from "react";
import QuestionItem from "./QuestionItem";

function QuestionList({ questions, onDelete, onUpdate }) {
  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((q) => (
          <QuestionItem
            key={q.id}
            question={q}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
