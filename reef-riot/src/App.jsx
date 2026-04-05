import React from "react";
import "./App.css";
import useGameState from "./hooks/useGameState";
import MovableShark from "./components/MovableShark";
import PollutionNode from "./components/PollutionNode";
import ObjectiveList from "./components/ObjectiveList";
import StatsPanel from "./components/StatsPanel";
import GlitchOverlay from "./components/GlitchOverlay";
import FactCard from "./components/FactCard";
import SharkAvatar from "./components/SharkAvatar";

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
