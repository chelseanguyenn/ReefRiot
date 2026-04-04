import React from "react";

export default function FactCard({ title, fact, onClose }) {
  return (
    <div className="fact-card">
      <h4>{title}</h4>
      <p>{fact}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}