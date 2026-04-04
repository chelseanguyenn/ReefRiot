// import React from "react";

// export default function GlitchOverlay({ active }) {
//   if (!active) return null;

//   return <div className="glitch-overlay">⚠ Reef unstable...</div>;
// }

import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  .glitch-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 100;
    overflow: hidden;
    font-family: 'Share Tech Mono', monospace;
  }

  /* Scanlines */
  .glitch-scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 3px,
      rgba(0, 0, 0, 0.08) 3px,
      rgba(0, 0, 0, 0.08) 4px
    );
    animation: scanlineScroll 8s linear infinite;
    opacity: 0.5;
  }

  @keyframes scanlineScroll {
    from { background-position: 0 0; }
    to   { background-position: 0 100px; }
  }

  /* Intensity-based vignette */
  .glitch-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(255, 45, 255, 0.12) 100%);
    transition: opacity 0.4s ease;
  }

  /* Horizontal glitch bars */
  .glitch-bar {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #ff2dff;
    opacity: 0;
    mix-blend-mode: screen;
    animation: glitchBar var(--dur, 3s) ease-in-out infinite var(--delay, 0s);
  }

  @keyframes glitchBar {
    0%, 88%, 100% { opacity: 0; transform: scaleX(0); }
    90%  { opacity: 0.7; transform: scaleX(1); }
    93%  { opacity: 0.3; transform: scaleX(0.6) translateX(10%); }
    96%  { opacity: 0.8; transform: scaleX(0.9) translateX(-5%); }
    98%  { opacity: 0; }
  }

  /* Chromatic aberration tear */
  .glitch-tear {
    position: absolute;
    left: 0;
    right: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.05s;
  }

  .glitch-tear.active {
    opacity: 1;
  }

  .glitch-tear::before,
  .glitch-tear::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 1px;
  }

  .glitch-tear::before { background: #00ffe0; transform: translateX(-6px); }
  .glitch-tear::after  { background: #ff2dff; transform: translateX(6px); top: 2px; }

  /* Corner corruption brackets */
  .glitch-corner {
    position: absolute;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }
  .glitch-corner.tl { top: 12px; left: 12px; border-top: 1.5px solid #00ffe0; border-left: 1.5px solid #00ffe0; }
  .glitch-corner.tr { top: 12px; right: 12px; border-top: 1.5px solid #00ffe0; border-right: 1.5px solid #00ffe0; }
  .glitch-corner.bl { bottom: 12px; left: 12px; border-bottom: 1.5px solid #00ffe0; border-left: 1.5px solid #00ffe0; }
  .glitch-corner.br { bottom: 12px; right: 12px; border-bottom: 1.5px solid #00ffe0; border-right: 1.5px solid #00ffe0; }

  /* Noise text fragments */
  .glitch-noise-text {
    position: absolute;
    font-size: 9px;
    letter-spacing: 0.1em;
    color: #ff2dff;
    opacity: 0;
    animation: noiseFlicker var(--dur, 4s) step-end infinite var(--delay, 0s);
    white-space: nowrap;
  }

  @keyframes noiseFlicker {
    0%, 80%, 100% { opacity: 0; }
    82% { opacity: 0.6; }
    85% { opacity: 0.2; }
    87% { opacity: 0.5; }
    90% { opacity: 0; }
  }

  /* Intensity modifiers */
  .glitch-overlay[data-intensity="low"]  .glitch-scanlines { opacity: 0.3; }
  .glitch-overlay[data-intensity="low"]  .glitch-vignette  { opacity: 0.4; }
  .glitch-overlay[data-intensity="low"]  .glitch-bar       { --dur: 5s; }

  .glitch-overlay[data-intensity="high"] .glitch-scanlines { opacity: 0.7; }
  .glitch-overlay[data-intensity="high"] .glitch-vignette  { opacity: 1; background: radial-gradient(ellipse at center, transparent 20%, rgba(255,45,255,0.22) 100%); }
  .glitch-overlay[data-intensity="high"] .glitch-bar       { --dur: 1.2s; }
  .glitch-overlay[data-intensity="high"] .glitch-corner    { opacity: 0.9; animation: cornerPulse 0.8s step-end infinite; }

  .glitch-overlay[data-intensity="none"] .glitch-scanlines,
  .glitch-overlay[data-intensity="none"] .glitch-vignette,
  .glitch-overlay[data-intensity="none"] .glitch-bar,
  .glitch-overlay[data-intensity="none"] .glitch-noise-text,
  .glitch-overlay[data-intensity="none"] .glitch-tear { opacity: 0; }

  @keyframes cornerPulse {
    0%, 60%, 100% { opacity: 0.9; }
    70% { opacity: 0.2; }
  }
`;

const NOISE_FRAGMENTS = [
  "ERR_NODE_CORRUPT", "SYS::OVERRIDE", "REEF_SCAN//FAIL",
  "POLLUTION_LVLMAX", "0x4E4F4445", "MACHINE_ACTIVE",
  "CORAL_DEAD", "INJECT//TOXIN", "DATA_CORRUPT",
];

const BARS = [
  { top: "18%", dur: "3.1s", delay: "0s" },
  { top: "42%", dur: "4.4s", delay: "1.2s" },
  { top: "67%", dur: "2.8s", delay: "2.1s" },
  { top: "83%", dur: "5.0s", delay: "0.7s" },
];

const NOISE_POSITIONS = [
  { top: "8%",  left: "5%",  dur: "4.2s", delay: "0s" },
  { top: "22%", left: "70%", dur: "3.5s", delay: "1.5s" },
  { top: "55%", left: "12%", dur: "5.1s", delay: "0.3s" },
  { top: "78%", left: "60%", dur: "3.8s", delay: "2.2s" },
  { top: "91%", left: "30%", dur: "4.6s", delay: "1.0s" },
];

export default function GlitchOverlay({ intensity = "medium", active = true }) {
  const [tears, setTears] = useState([]);
  const [noiseTexts, setNoiseTexts] = useState(() =>
    NOISE_POSITIONS.map((p, i) => ({
      ...p,
      text: NOISE_FRAGMENTS[i % NOISE_FRAGMENTS.length],
    }))
  );
  const tearTimer = useRef(null);

  useEffect(() => {
    if (!active || intensity === "none") {
      setTears([]);
      return;
    }

    const interval = intensity === "high" ? 900 : intensity === "medium" ? 1800 : 3500;

    tearTimer.current = setInterval(() => {
      const top = `${Math.floor(Math.random() * 80) + 10}%`;
      const id = Date.now();
      setTears(prev => [...prev, { top, id }]);
      setTimeout(() => setTears(prev => prev.filter(t => t.id !== id)), 150);

      // Randomly cycle one noise text
      setNoiseTexts(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          text: NOISE_FRAGMENTS[Math.floor(Math.random() * NOISE_FRAGMENTS.length)],
        };
        return updated;
      });
    }, interval);

    return () => clearInterval(tearTimer.current);
  }, [active, intensity]);

  const level = active ? intensity : "none";

  return (
    <>
      <style>{styles}</style>
      <div className="glitch-overlay" data-intensity={level}>
        <div className="glitch-scanlines" />
        <div className="glitch-vignette" />

        {BARS.map((b, i) => (
          <div
            key={i}
            className="glitch-bar"
            style={{ top: b.top, "--dur": b.dur, "--delay": b.delay }}
          />
        ))}

        {tears.map(t => (
          <div
            key={t.id}
            className="glitch-tear active"
            style={{ top: t.top }}
          />
        ))}

        {noiseTexts.map((n, i) => (
          <div
            key={i}
            className="glitch-noise-text"
            style={{ top: n.top, left: n.left, "--dur": n.dur, "--delay": n.delay }}
          >
            {n.text}
          </div>
        ))}

        <div className="glitch-corner tl" />
        <div className="glitch-corner tr" />
        <div className="glitch-corner bl" />
        <div className="glitch-corner br" />
      </div>
    </>
  );
}