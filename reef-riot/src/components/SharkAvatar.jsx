import React from "react";

export default function SharkAvatar({ health = 100, mood = "happy", stage = "clean" }) {
  const getSharkClass = () => {
    if (health > 70) return "shark healthy";
    if (health > 40) return "shark okay";
    return "shark weak";
  };

  return (
    <div className="shark-avatar">
      <div className={getSharkClass()}>
        <img
          src={`/assets/shark-${stage}.png`}
          alt="Shark Avatar"
          className="shark-image"
        />
      </div>
      <p className="shark-mood">Mood: {mood}</p>
    </div>
  );
}