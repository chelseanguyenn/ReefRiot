// import React from "react";

// export default function FactCard({ title, fact, onClose }) {
//   return (
//     <div className="fact-card">
//       <h4>{title}</h4>
//       <p>{fact}</p>
//       <button onClick={onClose}>Close</button>
//     </div>
//   );
// }

import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  .shark-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-family: 'Share Tech Mono', monospace;
  }

  .shark-frame {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shark-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid #00ffe0;
    opacity: 0.3;
    animation: pulseRing 2.4s ease-in-out infinite;
  }

  .shark-ring-2 {
    inset: 8px;
    border-color: #ff2dff;
    opacity: 0.15;
    animation: pulseRing 2.4s ease-in-out infinite 0.6s;
  }

  @keyframes pulseRing {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.08); opacity: 0.6; }
  }

  .shark-bubble {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #0a2a3a, #041218);
    border: 1.5px solid #00ffe022;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .shark-bubble::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #00ffe011 0%, transparent 60%);
  }

  .shark-svg {
    width: 64px;
    height: 64px;
    filter: drop-shadow(0 0 6px #00ffe066);
    transition: transform 0.15s ease;
  }

  .shark-wrapper[data-state="disrupting"] .shark-svg {
    filter: drop-shadow(0 0 10px #ff2dffaa);
    animation: sharkCharge 0.4s ease-in-out infinite alternate;
  }

  .shark-wrapper[data-state="restored"] .shark-svg {
    filter: drop-shadow(0 0 12px #00ffe0cc);
    animation: sharkCelebrate 1s ease-in-out infinite alternate;
  }

  @keyframes sharkCharge {
    from { transform: translateX(-3px) rotate(-5deg); }
    to   { transform: translateX(3px)  rotate(5deg); }
  }

  @keyframes sharkCelebrate {
    from { transform: translateY(0px) rotate(-4deg); }
    to   { transform: translateY(-6px) rotate(4deg); }
  }

  .shark-status {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .status-idle    { color: #00ffe0; background: #00ffe011; border: 1px solid #00ffe033; }
  .status-disrupting { color: #ff2dff; background: #ff2dff11; border: 1px solid #ff2dff44; animation: blinkStatus 0.5s step-end infinite; }
  .status-restored   { color: #39ff14; background: #39ff1411; border: 1px solid #39ff1444; }

  @keyframes blinkStatus {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  .shark-hp {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .hp-pip {
    width: 8px;
    height: 8px;
    border-radius: 1px;
    background: #00ffe0;
    opacity: 0.9;
    transition: all 0.3s ease;
  }

  .hp-pip.empty {
    background: transparent;
    border: 1px solid #00ffe033;
    opacity: 0.4;
  }
`;

const STATUS_LABELS = {
  idle: "ROGUE SHARK",
  disrupting: "DISRUPTING",
  restored: "REEF FREED",
};

export default function SharkAvatar({ state = "idle", hp = 3, maxHp = 3 }) {
  const [glitchFrame, setGlitchFrame] = useState(false);

  useEffect(() => {
    if (state !== "disrupting") return;
    const interval = setInterval(() => {
      setGlitchFrame(true);
      setTimeout(() => setGlitchFrame(false), 80);
    }, 700);
    return () => clearInterval(interval);
  }, [state]);

  return (
    <>
      <style>{styles}</style>
      <div className="shark-wrapper" data-state={state}>
        <div className="shark-frame">
          <div className="shark-ring" />
          <div className="shark-ring shark-ring-2" />
          <div className="shark-bubble">
            <svg
              className="shark-svg"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={glitchFrame ? { transform: "translateX(4px) skewX(-8deg)" } : {}}
            >
              {/* Body */}
              <ellipse cx="32" cy="36" rx="22" ry="13" fill="#0d4a5c" />
              {/* Belly */}
              <ellipse cx="32" cy="40" rx="14" ry="7" fill="#e8f4f0" opacity="0.18" />
              {/* Dorsal fin */}
              <path d="M28 24 L32 10 L38 24 Z" fill="#0d4a5c" />
              {/* Accent stripe */}
              <path d="M14 36 Q32 30 50 36" stroke="#00ffe0" strokeWidth="1.5" opacity="0.7" fill="none" />
              {/* Tail */}
              <path d="M54 36 L62 28 L62 44 Z" fill="#0a3a4a" />
              {/* Pectoral fin */}
              <path d="M20 38 L10 48 L28 42 Z" fill="#0a3a4a" />
              {/* Eye */}
              <circle cx="20" cy="33" r="3" fill="#00ffe0" />
              <circle cx="20" cy="33" r="1.5" fill="#041218" />
              <circle cx="19" cy="32" r="0.7" fill="#ffffff" opacity="0.8" />
              {/* Mouth / grin */}
              <path d="M14 37 Q17 40 22 38" stroke="#00ffe0" strokeWidth="1" fill="none" opacity="0.6" />
            </svg>
          </div>
        </div>

        <span className={`shark-status status-${state}`}>
          {STATUS_LABELS[state] ?? "ROGUE SHARK"}
        </span>

        <div className="shark-hp">
          {Array.from({ length: maxHp }).map((_, i) => (
            <div key={i} className={`hp-pip${i >= hp ? " empty" : ""}`} />
          ))}
        </div>
      </div>
    </>
  );
}