// import React from "react";

// export default function ObjectiveList({ objectives = [] }) {
//   return (
//     <div className="objective-list">
//       <h3>Objectives</h3>
//       <ul>
//         {objectives.map((objective) => (
//           <li key={objective.id} className={objective.completed ? "done" : ""}>
//             {objective.completed ? "✅" : "⬜"} {objective.text}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  .obj-root {
    font-family: 'Share Tech Mono', monospace;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 200px;
  }

  .obj-header {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #00ffe055;
    margin-bottom: 2px;
  }

  .obj-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 3px;
    border: 1px solid #00ffe018;
    background: #00ffe005;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
  }

  .obj-item.active {
    border-color: #ff2dff55;
    background: #ff2dff08;
    animation: activePulse 2s ease-in-out infinite;
  }

  .obj-item.done {
    border-color: #39ff1433;
    background: #39ff1408;
  }

  .obj-item.done::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, #39ff1408, transparent);
    animation: doneSheen 2s ease-in-out infinite;
  }

  @keyframes activePulse {
    0%, 100% { border-color: #ff2dff55; }
    50%       { border-color: #ff2dffaa; }
  }

  @keyframes doneSheen {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }

  .obj-check {
    width: 14px; height: 14px;
    border-radius: 2px;
    border: 1.5px solid #00ffe033;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s ease;
    background: transparent;
  }

  .obj-item.done  .obj-check { border-color: #39ff14; background: #39ff1422; }
  .obj-item.active .obj-check { border-color: #ff2dff; animation: checkBlink 0.6s step-end infinite; }

  @keyframes checkBlink {
    0%, 100% { border-color: #ff2dff; }
    50%       { border-color: #ff2dff44; }
  }

  .check-mark {
    width: 8px; height: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .obj-item.done .check-mark { opacity: 1; }

  .obj-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .obj-name {
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #c8e8e0;
    transition: color 0.3s ease;
  }

  .obj-item.done  .obj-name { color: #39ff14; text-decoration: line-through; text-decoration-color: #39ff1466; }
  .obj-item.active .obj-name { color: #ff2dff; }

  .obj-sub {
    font-size: 9px;
    letter-spacing: 0.06em;
    color: #00ffe033;
    transition: color 0.3s ease;
  }

  .obj-item.active .obj-sub { color: #ff2dff66; }
  .obj-item.done   .obj-sub { color: #39ff1444; }

  .obj-tag {
    margin-left: auto;
    font-size: 8px;
    letter-spacing: 0.14em;
    padding: 2px 6px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .tag-done    { color: #39ff14; background: #39ff1411; border: 1px solid #39ff1433; }
  .tag-active  { color: #ff2dff; background: #ff2dff11; border: 1px solid #ff2dff44; animation: tagBlink 0.5s step-end infinite; }
  .tag-pending { color: #00ffe033; background: transparent; border: 1px solid #00ffe018; }

  @keyframes tagBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
`;

const TAG_LABELS = { done: "CLEARED", active: "TARGET", pending: "LOCKED" };

export default function ObjectiveList({ objectives = [] }) {
  return (
    <>
      <style>{styles}</style>
      <div className="obj-root">
        <div className="obj-header">Objectives</div>
        {objectives.map((obj) => {
          const status = obj.done ? "done" : obj.active ? "active" : "pending";
          return (
            <div key={obj.id} className={`obj-item ${status}`}>
              <div className="obj-check">
                <svg className="check-mark" viewBox="0 0 8 8" fill="none">
                  <path d="M1 4L3.5 6.5L7 2" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="obj-text">
                <span className="obj-name">{obj.name}</span>
                {obj.sub && <span className="obj-sub">{obj.sub}</span>}
              </div>
              <span className={`obj-tag tag-${status}`}>{TAG_LABELS[status]}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}