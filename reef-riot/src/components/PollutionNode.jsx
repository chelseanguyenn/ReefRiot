import React from "react";

export default function PollutionNode({ type, x, y, cleaned, onClean }) {
  return (
    <button
      className={`pollution-node ${cleaned ? "cleaned" : ""}`}
      onClick={onClean}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
      }}
      disabled={cleaned}
    >
      {cleaned ? "✅" : type}
    </button>
  );
}