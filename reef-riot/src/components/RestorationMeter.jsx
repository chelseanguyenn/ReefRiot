import React from "react";

export default function RestorationMeter({ value = 0 }) {
  return (
    <div className="restoration-meter">
      <p>Reef Restoration: {value}%</p>
      <div className="meter-bar">
        <div
          className="meter-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}