import React from "react";

export default function GlitchOverlay({ active }) {
  if (!active) return null;

  return <div className="glitch-overlay">⚠ Reef unstable...</div>;
}