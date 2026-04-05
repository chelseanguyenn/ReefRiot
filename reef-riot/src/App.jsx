// import React from "react";
// import UseGameState from "./hooks/UseGameState";
// import MoveableShark from "./components/MoveableShark";
// import PollutionNode from "./components/PollutionNode";
// import ObjectiveList from "./components/ObjectiveList";
// import StatsPanel from "./components/StatsPanel";
// import GlitchOverlay from "./components/GlitchOverlay.jsx";
// import FactCard from "./components/FactCard";

// export default function App() {
//   const { state, handleNodeClick, handleInteract, reset, dismissFact } = useGameState();

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

import React from "react";
import "./App.css";
import useGameState from "./hooks/useGameState";
import MovableShark from "./components/MovableShark";
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
