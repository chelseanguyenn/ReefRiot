import React, { useEffect, useState } from "react";
import SharkAvatar from "./components/SharkAvatar";
import PollutionNode from "./components/PollutionNode";
import RestorationMeter from "./components/RestorationMeter";
import ObjectiveList from "./components/ObjectiveList";
import GlitchOverlay from "./components/GlitchOverlay";
import FactCard from "./components/FactCard";

export default function App() {
  const [gameState, setGameState] = useState(null);
  const [message, setMessage] = useState("");
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
      setMessage(data.message);

      if (actionName === "remove_pollution") {
        setFactText("Removing pollution helps sharks and coral survive.");
      } else if (actionName === "plant_coral") {
        setFactText("Coral reefs provide shelter for many ocean species.");
      } else if (actionName === "save_fish") {
        setFactText("Healthy fish populations keep reef ecosystems balanced.");
      } else if (actionName === "fish_hit_by_trash") {
        setFactText("Trash can injure or kill fish and damage reef ecosystems.");
      } else if (actionName === "miss_trash") {
        setFactText("Even missed trash can spread pollution through the reef.");
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
      setMessage(data.message);
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
    {
      id: 4,
      text: "Protect fish from trash",
      completed: gameState.fish_lost === 0,
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

      <p><strong>{message}</strong></p>

      <p>Health: {gameState.health}</p>
      <p>Score: {gameState.score}</p>
      <p>Stage: {gameState.zone_stage}</p>
      <p>Pollution Removed: {gameState.pollution_removed}</p>
      <p>Coral Planted: {gameState.coral_planted}</p>
      <p>Fish Saved: {gameState.fish_saved}</p>
      <p>Fish Lost: {gameState.fish_lost}</p>

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

        <button onClick={() => doAction("fish_hit_by_trash")}>
          Fish Hit by Trash
        </button>

        <button onClick={() => doAction("miss_trash")}>
          Miss Trash
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