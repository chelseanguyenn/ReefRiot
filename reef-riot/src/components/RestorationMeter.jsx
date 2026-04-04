// import React from "react";

// export default function RestorationMeter({ value = 0 }) {
//   return (
//     <div className="restoration-meter">
//       <p>Reef Restoration: {value}%</p>
//       <div className="meter-bar">
//         <div
//           className="meter-fill"
//           style={{ width: `${value}%` }}
//         />
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  .meter-root {
    font-family: 'Share Tech Mono', monospace;
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 200px;
  }

  .meter-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .meter-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #00ffe066;
  }

  .meter-pct {
    font-size: 11px;
    letter-spacing: 0.1em;
    color: #00ffe0;
    transition: color 0.6s ease;
  }

  .meter-pct.full { color: #39ff14; }

  .meter-track {
    width: 100%;
    height: 10px;
    background: #00ffe009;
    border: 1px solid #00ffe022;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .meter-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, #00ffe0 0%, #39ff14 100%);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .meter-fill::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 4px; height: 100%;
    background: #ffffff66;
    filter: blur(1px);
    animation: shimmer 1.2s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1; }
  }

  .meter-fill.full {
    background: linear-gradient(90deg, #00ffe0, #39ff14, #00ffe0);
    background-size: 200% 100%;
    animation: flowFull 1.5s linear infinite;
  }

  @keyframes flowFull {
    from { background-position: 0% 0%; }
    to   { background-position: 200% 0%; }
  }

  .meter-segments {
    position: absolute;
    inset: 0;
    display: flex;
  }

  .meter-seg-line {
    flex: 1;
    border-right: 1px solid #020d1066;
  }

  .meter-nodes {
    display: flex;
    justify-content: space-between;
    padding: 0 1px;
  }

  .meter-node-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00ffe022;
    border: 1px solid #00ffe033;
    transition: all 0.4s ease;
  }

  .meter-node-dot.done {
    background: #39ff14;
    border-color: #39ff14;
    box-shadow: 0 0 6px #39ff1488;
  }
`;

export default function RestorationMeter({ progress = 0, nodesComplete = 0, totalNodes = 3 }) {
  const [displayPct, setDisplayPct] = useState(0);
  const pct = Math.round((progress / totalNodes) * 100);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayPct(pct), 50);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <>
      <style>{styles}</style>
      <div className="meter-root">
        <div className="meter-label-row">
          <span className="meter-label">Reef Restored</span>
          <span className={`meter-pct${displayPct === 100 ? " full" : ""}`}>{displayPct}%</span>
        </div>

        <div className="meter-track">
          <div
            className={`meter-fill${displayPct === 100 ? " full" : ""}`}
            style={{ width: `${displayPct}%` }}
          />
          <div className="meter-segments">
            {Array.from({ length: totalNodes }).map((_, i) => (
              <div key={i} className="meter-seg-line" />
            ))}
          </div>
        </div>

        <div className="meter-nodes">
          {Array.from({ length: totalNodes }).map((_, i) => (
            <div key={i} className={`meter-node-dot${i < nodesComplete ? " done" : ""}`} />
          ))}
        </div>
      </div>
    </>
  );
}