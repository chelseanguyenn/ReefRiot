// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

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

// export default function App() {
//   return (
//     <div>
//       <h1>Reef Riot</h1>
//       <p>My first React frontend is working.</p>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import SharkAvatar from "./components/SharkAvatar";
// import PollutionNode from "./components/PollutionNode";
// import RestorationMeter from "./components/RestorationMeter";
// import ObjectiveList from "./components/ObjectiveList";
// import GlitchOverlay from "./components/GlitchOverlay";
// import FactCard from "./components/FactCard";
// // import LandingSection from "./pages/LandingSection";
// // import MissionSection from "./pages/MissionSection";
// // import PlaySection from "./pages/PlaySection";
// // import ImpactSection from "./pages/ImpactSection";

// // export default function App() {
// //   return (
// //     <>
// //       <LandingSection />
// //       <MissionSection />
// //       <PlaySection />
// //       <ReefScene />
// //       <ImpactSection />
// //     </>
// //   );
// // }

// export default function ReefScene() {
//   const [restoration, setRestoration] = useState(30);
//   const [showFact, setShowFact] = useState(false);
//   const [message, setMessage] = useState("");

//   const [objectives, setObjectives] = useState([
//     { id: 1, text: "Clean 3 trash piles", completed: false },
//     { id: 2, text: "Restore coral health", completed: false },
//   ]);

//   const handleClean = () => {
//     const newValue = Math.min(restoration + 10, 100);
//     setRestoration(newValue);
//     setShowFact(true);
//   };

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/state")
//       .then((data) => setMessage(data.message));
//       .catch((err) => console.error(err));
      

//   return (
//     <div className="reef-scene">
//       <GlitchOverlay active={restoration < 40} />

//       <SharkAvatar
//         health={restoration}
//         mood={restoration > 60 ? "happy" : "worried"}
//         stage={restoration > 60 ? "clean" : "polluted"}
//       />

//       <RestorationMeter value={restoration} />

//       <h1>Reef Riot</h1>
//       <p>Backend says: {message}</p>

//       <PollutionNode
//         type="🛢"
//         x={120}
//         y={200}
//         cleaned={false}
//         onClean={handleClean}
//       />

//       <ObjectiveList objectives={objectives} />

//       {showFact && (
//         <FactCard
//           title="Ocean Fact"
//           fact="Sharks help keep marine ecosystems balanced."
//           onClose={() => setShowFact(false)}
//         />
//       )}
//     </div>
    
//   );
// }

import React, { useEffect, useState } from "react";
import SharkAvatar from "./components/SharkAvatar";
import PollutionNode from "./components/PollutionNode";
import RestorationMeter from "./components/RestorationMeter";
import ObjectiveList from "./components/ObjectiveList";
import GlitchOverlay from "./components/GlitchOverlay";
import FactCard from "./components/FactCard";

export default function App() {
  const [gameState, setGameState] = useState(null);
  const [showFact, setShowFact] = useState(false);
  const [factText, setFactText] = useState("");

  const loadState = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/state");
      const data = await res.json();
      setGameState(data);
    } catch (err) {
      console.error("Failed to load state:", err);
    }
  };

  const doAction = async (actionName) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: actionName }),
      });

      const data = await res.json();
      setGameState(data.state);

      if (actionName === "remove_pollution") {
        setFactText("Removing pollution helps sharks and coral survive.");
      } else if (actionName === "plant_coral") {
        setFactText("Coral reefs provide shelter for many ocean species.");
      } else if (actionName === "save_fish") {
        setFactText("Healthy fish populations keep reef ecosystems balanced.");
      }

      setShowFact(true);
    } catch (err) {
      console.error("Failed to do action:", err);
    }
  };

  const resetGame = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/reset", {
        method: "POST",
      });

      const data = await res.json();
      setGameState(data.state);
      setShowFact(false);
    } catch (err) {
      console.error("Failed to reset game:", err);
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  if (!gameState) {
    return <div>Loading...</div>;
  }

  const objectives = [
    {
      id: 1,
      text: "Remove pollution",
      completed: gameState.pollution_removed > 0,
    },
    {
      id: 2,
      text: "Plant coral",
      completed: gameState.coral_planted > 0,
    },
    {
      id: 3,
      text: "Save fish",
      completed: gameState.fish_saved > 0,
    },
  ];

  return (
    <div className="reef-scene">
      <GlitchOverlay active={gameState.health < 40} />

      <h1>Reef Riot</h1>

      <SharkAvatar
        health={gameState.health}
        mood={gameState.health > 60 ? "happy" : "worried"}
        stage={gameState.zone_stage}
      />

      <RestorationMeter value={gameState.health} />

      <p>Health: {gameState.health}</p>
      <p>Stage: {gameState.zone_stage}</p>
      <p>Pollution Removed: {gameState.pollution_removed}</p>
      <p>Coral Planted: {gameState.coral_planted}</p>
      <p>Fish Saved: {gameState.fish_saved}</p>

      <PollutionNode
        type="🛢"
        x={120}
        y={200}
        cleaned={false}
        onClean={() => doAction("remove_pollution")}
      />

      <div className="action-buttons">
        <button onClick={() => doAction("remove_pollution")}>
          Remove Pollution
        </button>

        <button onClick={() => doAction("plant_coral")}>
          Plant Coral
        </button>

        <button onClick={() => doAction("save_fish")}>
          Save Fish
        </button>

        <button onClick={resetGame}>Reset</button>
      </div>

      <ObjectiveList objectives={objectives} />

      {showFact && (
        <FactCard
          title="Ocean Fact"
          fact={factText}
          onClose={() => setShowFact(false)}
        />
      )}
    </div>
  );
}