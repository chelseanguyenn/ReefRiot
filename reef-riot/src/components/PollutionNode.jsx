// // import React from "react";

// // export default function PollutionNode({ type, x, y, cleaned, onClean }) {
// //   return (
// //     <button
// //       className={`pollution-node ${cleaned ? "cleaned" : ""}`}
// //       onClick={onClean}
// //       style={{
// //         position: "absolute",
// //         left: `${x}px`,
// //         top: `${y}px`,
// //       }}
// //       disabled={cleaned}
// //     >
// //       {cleaned ? "✅" : type}
// //     </button>
// //   );
// // }

// import { useState, useEffect, useRef } from "react";

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

//   .node-root {
//     font-family: 'Share Tech Mono', monospace;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 10px;
//     width: 140px;
//   }

//   .node-frame {
//     position: relative;
//     width: 100px; height: 100px;
//     display: flex; align-items: center; justify-content: center;
//     cursor: pointer;
//   }

//   .node-outer-ring {
//     position: absolute; inset: 0;
//     border-radius: 8px;
//     border: 1.5px solid var(--node-color, #ff6b35);
//     opacity: 0.4;
//     transition: opacity 0.3s;
//   }

//   .node-frame:hover .node-outer-ring { opacity: 0.8; }

//   .node-body {
//     width: 80px; height: 80px;
//     border-radius: 6px;
//     background: #0a1a20;
//     border: 1px solid var(--node-color, #ff6b35);
//     display: flex; align-items: center; justify-content: center;
//     position: relative;
//     overflow: hidden;
//     transition: all 0.3s ease;
//   }

//   .node-body::before {
//     content: '';
//     position: absolute; inset: 0;
//     background: radial-gradient(circle at center, var(--node-glow, #ff6b3522) 0%, transparent 70%);
//     transition: opacity 0.3s;
//   }

//   .node-frame[data-state="active"] .node-body {
//     animation: nodeHum 1.5s ease-in-out infinite;
//   }

//   .node-frame[data-state="disrupting"] .node-body {
//     animation: nodeShake 0.1s linear infinite;
//     border-color: #ff2dff;
//   }

//   .node-frame[data-state="done"] .node-body {
//     border-color: #39ff14;
//     background: #0a1a14;
//   }

//   .node-frame[data-state="done"] .node-body::before {
//     background: radial-gradient(circle at center, #39ff1422 0%, transparent 70%);
//   }

//   @keyframes nodeHum {
//     0%, 100% { box-shadow: 0 0 8px var(--node-color, #ff6b35)44; }
//     50%       { box-shadow: 0 0 18px var(--node-color, #ff6b35)88; }
//   }

//   @keyframes nodeShake {
//     0%   { transform: translate(0,0); }
//     25%  { transform: translate(-2px, 1px); }
//     50%  { transform: translate(2px, -1px); }
//     75%  { transform: translate(-1px, 2px); }
//     100% { transform: translate(0,0); }
//   }

//   .node-icon {
//     font-size: 28px;
//     line-height: 1;
//     filter: drop-shadow(0 0 4px var(--node-color, #ff6b35));
//     transition: all 0.3s;
//     z-index: 1;
//   }

//   .node-frame[data-state="done"] .node-icon {
//     filter: grayscale(0.8) drop-shadow(0 0 6px #39ff14);
//     opacity: 0.5;
//   }

//   /* Hit progress arc (SVG overlay) */
//   .node-progress-svg {
//     position: absolute; inset: -4px;
//     width: calc(100% + 8px); height: calc(100% + 8px);
//     pointer-events: none;
//   }

//   .node-arc {
//     fill: none;
//     stroke: var(--node-color, #ff6b35);
//     stroke-width: 2;
//     stroke-linecap: round;
//     transition: stroke-dashoffset 0.2s ease;
//   }

//   .node-frame[data-state="disrupting"] .node-arc {
//     stroke: #ff2dff;
//   }

//   .node-frame[data-state="done"] .node-arc {
//     stroke: #39ff14;
//   }

//   /* Hit flash particles */
//   .node-particles {
//     position: absolute; inset: 0;
//     pointer-events: none;
//     overflow: visible;
//   }

//   .node-particle {
//     position: absolute;
//     width: 3px; height: 3px;
//     border-radius: 50%;
//     background: var(--node-color, #ff6b35);
//     animation: particleBurst 0.5s ease-out forwards;
//   }

//   @keyframes particleBurst {
//     0%   { transform: translate(0,0) scale(1); opacity: 1; }
//     100% { transform: translate(var(--px), var(--py)) scale(0); opacity: 0; }
//   }

//   /* Prompt */
//   .node-prompt {
//     font-size: 9px;
//     letter-spacing: 0.16em;
//     text-transform: uppercase;
//     padding: 3px 10px;
//     border-radius: 2px;
//     animation: promptPulse 1s ease-in-out infinite;
//     transition: all 0.3s;
//   }

//   .prompt-idle { color: #00ffe066; border: 1px solid #00ffe022; background: transparent; }
//   .prompt-active { color: #ff6b35; border: 1px solid #ff6b3555; background: #ff6b3511; }
//   .prompt-disrupting { color: #ff2dff; border: 1px solid #ff2dff55; background: #ff2dff11; animation: promptPulse 0.3s step-end infinite; }
//   .prompt-done { color: #39ff14; border: 1px solid #39ff1433; background: #39ff1411; animation: none; }

//   @keyframes promptPulse {
//     0%, 100% { opacity: 1; }
//     50%       { opacity: 0.5; }
//   }

//   .node-name {
//     font-size: 10px;
//     letter-spacing: 0.1em;
//     color: #c8e8e0;
//     text-align: center;
//   }

//   .node-frame[data-state="done"] ~ .node-name {
//     color: #39ff1488;
//     text-decoration: line-through;
//   }
// `;

// const NODE_CONFIGS = {
//   compactor: { color: "#ff6b35", glow: "#ff6b3522", icon: "♻", label: "Plastic Compactor", hits: 3 },
//   ghostnet:  { color: "#a855f7", glow: "#a855f722", icon: "🕸", label: "Ghost Net",         hits: 1, hold: true },
//   drill:     { color: "#ef4444", glow: "#ef444422", icon: "⚙", label: "Extraction Drill",  hits: 5 },
// };

// export default function PollutionNode({ type = "compactor", onComplete }) {
//   const cfg = NODE_CONFIGS[type] ?? NODE_CONFIGS.compactor;
//   const [hits, setHits] = useState(0);
//   const [state, setState] = useState("idle"); // idle | active | disrupting | done
//   const [particles, setParticles] = useState([]);
//   const holdTimer = useRef(null);

//   const totalHits = cfg.hits;
//   const circumference = 2 * Math.PI * 46;
//   const progress = hits / totalHits;
//   const dashOffset = circumference * (1 - progress);

//   const spawnParticles = () => {
//     const newP = Array.from({ length: 6 }, (_, i) => ({
//       id: Date.now() + i,
//       px: `${(Math.random() - 0.5) * 60}px`,
//       py: `${(Math.random() - 0.5) * 60}px`,
//     }));
//     setParticles(prev => [...prev, ...newP]);
//     setTimeout(() => setParticles(prev => prev.filter(p => !newP.find(n => n.id === p.id))), 500);
//   };

//   const handleInteract = () => {
//     if (state === "done") return;
//     setState("disrupting");
//     spawnParticles();
//     const next = hits + 1;
//     setHits(next);
//     if (next >= totalHits) {
//       setState("done");
//       onComplete?.();
//     } else {
//       setTimeout(() => setState("active"), 300);
//     }
//   };

//   const handleMouseEnter = () => { if (state === "idle") setState("active"); };
//   const handleMouseLeave = () => {
//     if (state === "active") setState("idle");
//     clearInterval(holdTimer.current);
//   };

//   const handleMouseDown = () => {
//     if (cfg.hold) {
//       holdTimer.current = setInterval(handleInteract, 300);
//     }
//   };

//   const handleMouseUp = () => clearInterval(holdTimer.current);

//   const promptLabel = state === "done" ? "CLEARED"
//     : state === "disrupting" ? "!!"
//     : state === "active" ? (cfg.hold ? "HOLD" : "DISRUPT")
//     : "— — —";

//   const promptClass = `node-prompt prompt-${state === "idle" ? "idle" : state === "active" ? "active" : state === "disrupting" ? "disrupting" : "done"}`;

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="node-root">
//         <div
//           className="node-frame"
//           data-state={state}
//           style={{ "--node-color": cfg.color, "--node-glow": cfg.glow }}
//           onClick={!cfg.hold ? handleInteract : undefined}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//           onMouseDown={cfg.hold ? handleMouseDown : undefined}
//           onMouseUp={cfg.hold ? handleMouseUp : undefined}
//         >
//           <div className="node-outer-ring" />
//           <div className="node-body">
//             <span className="node-icon">{cfg.icon}</span>
//             {particles.map(p => (
//               <div key={p.id} className="node-particle"
//                 style={{ "--px": p.px, "--py": p.py, "--node-color": cfg.color,
//                   top: "50%", left: "50%", marginTop: "-1.5px", marginLeft: "-1.5px" }}
//               />
//             ))}
//           </div>

//           <svg className="node-progress-svg" viewBox="0 0 108 108" style={{ "--node-color": cfg.color }}>
//             <circle className="node-arc" cx="54" cy="54" r="46"
//               strokeDasharray={circumference}
//               strokeDashoffset={dashOffset}
//               transform="rotate(-90 54 54)"
//             />
//           </svg>
//         </div>

//         <span className={promptClass}>{promptLabel}</span>
//         <span className="node-name">{cfg.label}</span>
//       </div>
//     </>
//   );
// }

export default function PollutionNode({ node, onClick }) {
  const labels = {
    compactor: "♻",
    ghostnet: "🕸",
    drill: "⚙",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`pollution-node ${node.done ? "done" : ""}`}
      style={{
        position: "absolute",
        left: `${node.x}px`,
        top: `${node.y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        opacity: node.done ? 0.5 : 1,
        cursor: "pointer",
      }}
    >
      <div className="node-icon">{labels[node.type] ?? "•"}</div>
      <div className="node-label">{node.id}</div>
    </button>
  );
}