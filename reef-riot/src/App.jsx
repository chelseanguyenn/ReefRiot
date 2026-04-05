// import React from "react";
// import "./App.css";
// import UseGameState from "./hooks/UseGameState";
// import MovableShark from "./components/MovableShark";
// import PollutionNode from "./components/PollutionNode";
// import PollutionEnemy from "./components/PollutionEnemy";
// import ObjectiveList from "./components/ObjectiveList";
// import StatsPanel from "./components/StatsPanel";
// import GlitchOverlay from "./components/GlitchOverlay";
// import FactCard from "./components/FactCard";
// import TrashParticle from "./components/TrashParticle";
// import { ParticleLayer, useParticles } from "./components/ParticleLayer";

// import reefCorrupted from "./assets/reef_corrupted.svg";
// import reefMain from "./assets/reef_main.svg";
// import reefRestored from "./assets/reef_restored.svg";

// const BG_MAP = {
//   corrupted: reefCorrupted,
//   healing: reefMain,
//   restored: reefRestored,
// };

// export default function App() {
//   const { state, handleNodeClick, handleInteract, reset, dismissFact } =
//     UseGameState();
//   const isDamaged = state.damagedAt && Date.now() - state.damagedAt < 400;
//   const { particles, spawnParticles } = useParticles();

//   React.useEffect(() => {
//     if (state.collisionEvents?.length) {
//       spawnParticles(state.collisionEvents);
//     }
//   }, [state.collisionEvents, spawnParticles]);

//   return (
//     <div className="game-shell">
//       <div
//         className="ocean-layer reef-bg"
//         style={{
//           backgroundImage: `url(${BG_MAP[state.stage] ?? reefCorrupted})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           transition: "opacity 1s ease",
//         }}
//       />

//       <div className="ocean-layer ocean-gradient" />
//       <div className="ocean-layer ocean-waves" />
//       <div className="ocean-layer ocean-beams" />
//       <div className="ocean-layer ocean-particles" />

//       <div className="main-ui">
//         <div className="reef-scene">
//           <GlitchOverlay active={state.sharkState === "disrupting"} />

//           <div className="arena">
//             {state.enemies.map((enemy) => (
//               <PollutionEnemy key={enemy.id} enemy={enemy} />
//             ))}

//             {state.trash?.map((t) => (
//               <TrashParticle key={t.id} trash={t} />
//             ))}

//             {state.nodes.map((node) => (
//               <PollutionNode
//                 key={node.id}
//                 node={node}
//                 onClick={() => handleNodeClick(node.id)}
//               />
//             ))}

//             <MovableShark
//               x={state.sharkX}
//               y={state.sharkY}
//               facing={state.sharkFacing}
//               state={state.sharkState}
//               nearNodeId={state.nearNodeId}
//               health={state.health}
//               damaged={isDamaged}
//               onInteract={handleInteract}
//             />

//             <ParticleLayer particles={particles} />

//             <ObjectiveList objectives={state.objectives} />
//             <StatsPanel state={state} reset={reset} />
//           </div>

//           {state.showFact && state.stage === "restored" && (
//             <FactCard fact={state.currentFact} onClose={dismissFact} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import "./App.css";
import UseGameState from "./hooks/UseGameState";
import MovableShark from "./components/MovableShark";
import PollutionNode from "./components/PollutionNode";
import PollutionEnemy from "./components/PollutionEnemy";
import ObjectiveList from "./components/ObjectiveList";
import StatsPanel from "./components/StatsPanel";
import GlitchOverlay from "./components/GlitchOverlay";
import FactCard from "./components/FactCard";
import TrashParticle from "./components/TrashParticle";
import { ParticleLayer, useParticles } from "./components/ParticleLayer";

import reefCorrupted from "./assets/reef_corrupted.svg";
import reefMain from "./assets/reef_main.svg";
import reefRestored from "./assets/reef_restored.svg";

const BG_MAP = {
  corrupted: reefCorrupted,
  healing: reefMain,
  restored: reefRestored,
};

export default function App() {
  const { state, handleNodeClick, handleInteract, reset, dismissFact } =
    UseGameState();

  const isDamaged = state.damagedAt && Date.now() - state.damagedAt < 400;
  const { particles, spawnParticles } = useParticles();

  React.useEffect(() => {
    if (state.collisionEvents?.length) {
      spawnParticles(state.collisionEvents);
    }
  }, [state.collisionEvents, spawnParticles]);

  return (
    <div className="game-shell">
      <div
        className="ocean-layer reef-bg"
        style={{
          backgroundImage: `url(${BG_MAP[state.stage] ?? reefCorrupted})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 1s ease",
        }}
      />

      <div className="ocean-layer ocean-gradient" />
      <div className="ocean-layer ocean-waves" />
      <div className="ocean-layer ocean-beams" />
      <div className="ocean-layer ocean-particles" />

      <div className="main-ui">
        <div className="reef-scene">
          <GlitchOverlay active={state.sharkState === "disrupting"} />

          <div className="arena">
            {state.enemies?.map((enemy) => (
              <PollutionEnemy key={enemy.id} enemy={enemy} />
            ))}

            {state.trash?.map((t) => (
              <TrashParticle key={t.id} trash={t} />
            ))}

            {state.nodes?.map((node) => (
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
              damaged={isDamaged}
              onInteract={handleInteract}
            />

            <ParticleLayer particles={particles} />

            <ObjectiveList objectives={state.objectives} />
            <StatsPanel state={state} reset={reset} />
          </div>

          {state.showFact && state.stage === "restored" && (
            <FactCard fact={state.currentFact} onClose={dismissFact} />
          )}
        </div>
      </div>
    </div>
  );
}