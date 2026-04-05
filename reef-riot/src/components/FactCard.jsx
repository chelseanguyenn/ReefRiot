import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  .fact-card-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
  }

  .fact-card {
    position: absolute;
    pointer-events: all;
    width: 280px;
    background: #020e14;
    border: 1px solid #00ffe044;
    border-radius: 4px;
    padding: 18px 16px 14px;
    font-family: 'Share Tech Mono', monospace;
    box-shadow: 0 0 24px #00ffe022, inset 0 0 12px #00ffe008;
    animation: factFadeIn 0.4s ease forwards;
  }

  @keyframes factFadeIn {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  .fact-card-label {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #00ffe0;
    margin-bottom: 10px;
    opacity: 0.6;
  }

  .fact-card-title {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00ffe0;
    margin: 0 0 10px;
    border-bottom: 1px solid #00ffe022;
    padding-bottom: 8px;
  }

  .fact-card-body {
    font-size: 11px;
    color: #7addd4;
    line-height: 1.65;
    margin: 0 0 14px;
  }

  .fact-card-close {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 4px 14px;
    background: transparent;
    border: 1px solid #00ffe033;
    color: #00ffe0;
    border-radius: 2px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    display: block;
    margin-left: auto;
  }

  .fact-card-close:hover {
    background: #00ffe011;
    border-color: #00ffe099;
  }
`;

const PADDING = 40;

function randomPosition(cardW = 280, cardH = 160) {
  const maxX = window.innerWidth  - cardW - PADDING;
  const maxY = window.innerHeight - cardH - PADDING;
  return {
    left: Math.floor(Math.random() * (maxX - PADDING) + PADDING),
    top:  Math.floor(Math.random() * (maxY - PADDING) + PADDING),
  };
}

export default function FactCard({ fact, onClose }) {
  const [pos] = useState(() => randomPosition());

  return (
    <>
      <style>{styles}</style>
      <div className="fact-card-overlay">
        <div className="fact-card" style={{ left: pos.left, top: pos.top }}>
          <div className="fact-card-label">// ocean fact</div>
          <h4 className="fact-card-title">Ocean Fact</h4>
          <p className="fact-card-body">{fact}</p>
          <button className="fact-card-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
}