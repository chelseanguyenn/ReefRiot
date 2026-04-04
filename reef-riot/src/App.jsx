// import { useState, useCallback } from "react";
// import SharkAvatar from "./components/SharkAvatar";
// import GlitchOverlay from "./components/GlitchOverlay";
// import RestorationMeter from "./components/RestorationMeter";
// import ObjectiveList from "./components/ObjectiveList";
// import PollutionNode from "./components/PollutionNode";
// import FactCard from "./components/FactCard";

// const INITIAL_OBJECTIVES = [
//   { id: 1, name: "Plastic Compactor", active: true,  done: false },
//   { id: 2, name: "Ghost Net",         active: false, done: false },
//   { id: 3, name: "Extraction Drill",  active: false, done: false },
// ];

// const NODE_TYPES = ["compactor", "ghostnet", "drill"];

// export default function App() {
//   const [nodesComplete, setNodesComplete] = useState(0);
//   const [nodeDone, setNodeDone] = useState([false, false, false]);
//   const [objectives, setObjectives] = useState(INITIAL_OBJECTIVES);
//   const [factNode, setFactNode] = useState("compactor");
//   const [showFact, setShowFact] = useState(true);

//   const allDone = nodesComplete === 3;
//   const sharkState = allDone ? "restored" : nodesComplete > 0 ? "disrupting" : "idle";
//   const glitchIntensity = allDone ? "none"
//     : nodesComplete === 2 ? "low"
//     : nodesComplete === 1 ? "medium"
//     : "high";

//   const handleNodeComplete = useCallback((idx) => {
//     setNodeDone(prev => {
//       const next = [...prev];
//       next[idx] = true;
//       return next;
//     });
//     setNodesComplete(prev => prev + 1);
//     setObjectives(prev => prev.map((o, i) => ({
//       ...o,
//       done:   i === idx     ? true  : o.done,
//       active: i === idx + 1 ? true  : i === idx ? false : o.active,
//     })));
//     const nextType = NODE_TYPES[idx + 1];
//     if (nextType) { setFactNode(nextType); setShowFact(true); }
//   }, []);

//   const handleRestart = () => {
//     setNodesComplete(0);
//     setNodeDone([false, false, false]);
//     setObjectives(INITIAL_OBJECTIVES);
//     setFactNode("compactor");
//     setShowFact(true);
//   };

//   return (
//     <div style={styles.root}>

//       {/* ── Full-screen game arena ── */}
//       <div style={styles.arena}>

//         {/* Glitch overlay — sits behind HUD, above background */}
//         <GlitchOverlay intensity={glitchIntensity} active={true} />

//         {/* TOP HUD BAR */}
//         <div style={styles.hudTop}>
//           <RestorationMeter progress={nodesComplete} totalNodes={3} />
//           <ObjectiveList objectives={objectives} />
//         </div>

//         {/* CENTER ARENA — nodes spread across, shark below */}
//         <div style={styles.arenaCenter}>
//           <div style={styles.nodesRow}>
//             {NODE_TYPES.map((type, i) => (
//               <PollutionNode
//                 key={type}
//                 type={type}
//                 done={nodeDone[i]}
//                 onComplete={() => handleNodeComplete(i)}
//               />
//             ))}
//           </div>

//           <div style={styles.sharkRow}>
//             <SharkAvatar state={sharkState} hp={3} maxHp={3} />
//           </div>
//         </div>

//         {/* FACT CARD — bottom left, absolute */}
//         {showFact && !allDone && (
//           <div style={styles.factCardAnchor}>
//             <FactCard
//               nodeType={factNode}
//               duration={7000}
//               onDismiss={() => setShowFact(false)}
//             />
//           </div>
//         )}

//         {/* WIN OVERLAY */}
//         {allDone && (
//           <div style={styles.winOverlay}>
//             <div style={styles.winBox}>
//               <div style={styles.winTitle}>REEF RESTORED</div>
//               <div style={styles.winSub}>
//                 Remove the systems causing harm, and life can return.
//               </div>
//               <button style={styles.restartBtn} onClick={handleRestart}>
//                 RESTART
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ── Styles ─────────────────────────────────────────────────────────────── */
// const styles = {
//   root: {
//     width: "100vw",
//     height: "100vh",
//     overflow: "hidden",
//     background: "#020d10",
//     fontFamily: "'Share Tech Mono', monospace",
//     display: "flex",
//     alignItems: "stretch",
//   },

//   /* Game arena fills the whole screen, position:relative so
//      GlitchOverlay (absolute inset:0) and FactCard anchor correctly */
//   arena: {
//     flex: 1,
//     position: "relative",
//     display: "flex",
//     flexDirection: "column",
//     background: "radial-gradient(ellipse at center, #071a22 0%, #020d10 100%)",
//     overflow: "hidden",
//   },

//   /* Top bar: meter left, objectives right */
//   hudTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     padding: "16px 24px",
//     zIndex: 10,
//     position: "relative",
//     flexShrink: 0,
//   },

//   /* Center area grows to fill remaining space */
//   arenaCenter: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 32,
//     padding: "0 24px 24px",
//     position: "relative",
//     zIndex: 10,
//   },

//   /* Three nodes in a row, evenly spaced */
//   nodesRow: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-evenly",
//     width: "100%",
//     maxWidth: 680,
//     gap: 16,
//   },

//   /* Shark centered below the nodes */
//   sharkRow: {
//     display: "flex",
//     justifyContent: "center",
//   },

//   /* FactCard pinned bottom-left */
//   factCardAnchor: {
//     position: "absolute",
//     bottom: 24,
//     left: 24,
//     zIndex: 20,
//   },

//   /* Win state */
//   winOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "#020d10cc",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 50,
//   },

//   winBox: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 16,
//     padding: "40px 48px",
//     border: "1px solid #39ff1433",
//     borderRadius: 8,
//     background: "#020d10dd",
//   },

//   winTitle: {
//     fontSize: 18,
//     letterSpacing: "0.4em",
//     color: "#39ff14",
//     textShadow: "0 0 20px #39ff14",
//   },

//   winSub: {
//     fontSize: 11,
//     color: "#39ff1066",
//     letterSpacing: "0.1em",
//     textAlign: "center",
//     maxWidth: 300,
//     lineHeight: 1.7,
//   },

//   restartBtn: {
//     marginTop: 8,
//     padding: "8px 24px",
//     fontSize: 10,
//     letterSpacing: "0.2em",
//     fontFamily: "inherit",
//     cursor: "pointer",
//     background: "#39ff1411",
//     border: "1px solid #39ff1444",
//     color: "#39ff14",
//     borderRadius: 3,
//   },
// };

import React from "react";
import UseGameState from "./hooks/UseGameState";
import MoveableShark from "./components/MoveableShark";
import PollutionNode from "./components/PollutionNode";
import ObjectiveList from "./components/ObjectiveList";
import StatsPanel from "./components/StatsPanel";
import GlitchOverlay from "./components/GlitchOverlay";
import FactCard from "./components/FactCard";

export default function App() {
  const { state, handleNodeClick, handleInteract, reset, dismissFact } = useGameState();

  return (
    <div className="reef-scene">
      <GlitchOverlay active={state.sharkState === "disrupting"} />

      <div className="arena">
        {state.nodes.map((node) => (
          <PollutionNode
            key={node.id}
            node={node}
            onClick={() => handleNodeClick(node.id)}
          />
        ))}

        <MovableShark
          x={state.sharkX}
          y={state.sharkY}
          facing={state.sharkFacing}
          state={state.sharkState}
          nearNodeId={state.nearNodeId}
          health={state.health}
          onInteract={handleInteract}
        />

        <ObjectiveList objectives={state.objectives} />
        <StatsPanel state={state} reset={reset} />
      </div>

      {state.showFact && (
        <FactCard
          title="Ocean Fact"
          fact={state.factNode}
          onClose={dismissFact}
        />
      )}
    </div>
  );
}