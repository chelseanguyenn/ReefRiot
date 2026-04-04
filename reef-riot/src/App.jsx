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

import React, { useState } from "react";
import SharkAvatar from "./components/SharkAvatar";
import PollutionNode from "./components/PollutionNode";
import RestorationMeter from "./components/RestorationMeter";
import ObjectiveList from "./components/ObjectiveList";
import GlitchOverlay from "./components/GlitchOverlay";
import FactCard from "./components/FactCard";

export default function ReefScene() {
  const [restoration, setRestoration] = useState(30);
  const [showFact, setShowFact] = useState(false);

  const [objectives, setObjectives] = useState([
    { id: 1, text: "Clean 3 trash piles", completed: false },
    { id: 2, text: "Restore coral health", completed: false },
  ]);

  const handleClean = () => {
    const newValue = Math.min(restoration + 10, 100);
    setRestoration(newValue);
    setShowFact(true);
  };

  return (
    <div className="reef-scene">
      <GlitchOverlay active={restoration < 40} />

      <SharkAvatar
        health={restoration}
        mood={restoration > 60 ? "happy" : "worried"}
        stage={restoration > 60 ? "clean" : "polluted"}
      />

      <RestorationMeter value={restoration} />

      <PollutionNode
        type="🛢"
        x={120}
        y={200}
        cleaned={false}
        onClean={handleClean}
      />

      <ObjectiveList objectives={objectives} />

      {showFact && (
        <FactCard
          title="Ocean Fact"
          fact="Sharks help keep marine ecosystems balanced."
          onClose={() => setShowFact(false)}
        />
      )}
    </div>
  );
}