import React from "react";

export default function ObjectiveList({ objectives = [] }) {
  return (
    <div className="objective-list">
      <h3>Objectives</h3>
      <ul>
        {objectives.map((objective) => (
          <li key={objective.id} className={objective.completed ? "done" : ""}>
            {objective.completed ? "✅" : "⬜"} {objective.text}
          </li>
        ))}
      </ul>
    </div>
  );
}