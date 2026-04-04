import SharkAvatar from "./SharkAvatar";
import PollutionNode from "./PollutionNode";
import RestorationMeter from "./RestorationMeter";
import ObjectiveList from "./ObjectiveList";
import GlitchOverlay from "./GlitchOverlay";
import FactCard from "./FactCard";

export default function ReefScene({
  gameState,
  showFact,
  factText,
  setShowFact,
  doAction,
  resetGame,
}) {
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

      <div className="game-stats">
        <p>Health: {gameState.health}</p>
        <p>Stage: {gameState.zone_stage}</p>
        <p>Pollution Removed: {gameState.pollution_removed}</p>
        <p>Coral Planted: {gameState.coral_planted}</p>
        <p>Fish Saved: {gameState.fish_saved}</p>
      </div>

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
        <button onClick={() => doAction("plant_coral")}>Plant Coral</button>
        <button onClick={() => doAction("save_fish")}>Save Fish</button>
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