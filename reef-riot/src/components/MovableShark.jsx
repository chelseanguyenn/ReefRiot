import { useEffect, useRef } from "react";
import sharkIcon from "../assets/shark_icon.svg";

const styles = `
  .movable-shark {
    position: absolute;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 30;
    transition: filter 0.2s;
  }

  .shark-trail-canvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 20;
  }

  .shark-img {
    width: 68px;
    height: 68px;
    object-fit: contain;
    transition: filter 0.2s;
    filter: drop-shadow(0 0 6px #00ffe066);
  }

  .movable-shark[data-state="disrupting"] .shark-img {
    filter: drop-shadow(0 0 12px #ff2dffcc) hue-rotate(200deg);
    animation: sharkCharge 0.2s ease-in-out infinite alternate;
  }

  .movable-shark[data-state="restored"] .shark-img {
    filter: drop-shadow(0 0 14px #39ff14cc);
    animation: sharkCelebrate 0.8s ease-in-out infinite alternate;
  }

  .movable-shark[data-state="moving"] .shark-img {
    animation: sharkSwim 0.4s ease-in-out infinite alternate;
  }

  .movable-shark .shark-ring {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1.5px solid #00ffe0;
    opacity: 0.2;
    animation: sharkRingPulse 2s ease-in-out infinite;
  }

  @keyframes sharkRingPulse {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.06); }
  }

  .movable-shark[data-state="disrupting"] .shark-ring {
    border-color: #ff2dff;
    animation: sharkRingPulse 0.5s ease-in-out infinite;
  }

  .movable-shark[data-state="restored"] .shark-ring {
    border-color: #39ff14;
    opacity: 0.5;
  }

  @keyframes sharkSwim {
    from { transform: translateY(-2px) rotate(-3deg); }
    to   { transform: translateY(2px) rotate(3deg); }
  }
  @keyframes sharkCharge {
    from { transform: translateX(-3px) rotate(-6deg); }
    to   { transform: translateX(3px) rotate(6deg); }
  }
  @keyframes sharkCelebrate {
    from { transform: translateY(0) rotate(-5deg); }
    to   { transform: translateY(-6px) rotate(5deg); }
  }

  .interact-prompt {
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    letter-spacing: 0.16em;
    color: #ff2dff;
    background: #ff2dff11;
    border: 1px solid #ff2dff44;
    padding: 2px 8px;
    border-radius: 2px;
    white-space: nowrap;
    font-family: 'Share Tech Mono', monospace;
    animation: promptBounce 0.6s ease-in-out infinite alternate;
  }

  @keyframes promptBounce {
    from { transform: translateX(-50%) translateY(0); }
    to   { transform: translateX(-50%) translateY(-3px); }
  }

  .shark-damage-flash {
    animation: damageFlash 0.3s ease-out !important;
  }

  @keyframes damageFlash {
    0%   { filter: drop-shadow(0 0 20px #ff000099) brightness(2); }
    100% { filter: drop-shadow(0 0 6px #00ffe066); }
  }
`;

const TRAIL_LENGTH = 28;

export default function MovableShark({ x, y, facing, state, nearNodeId, damaged }) {
  const canvasRef = useRef(null);
  const trailRef  = useRef([]);

  // Draw glowing trail on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = x;
    const cy = y;

    trailRef.current.push({ x: cx, y: cy });
    if (trailRef.current.length > TRAIL_LENGTH) trailRef.current.shift();

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const trail = trailRef.current;
    for (let i = 1; i < trail.length; i++) {
      const t = i / trail.length;
      const color = state === "disrupting" ? `rgba(255,45,255,${t * 0.55})`
                  : state === "restored"   ? `rgba(57,255,20,${t * 0.55})`
                  : `rgba(0,255,224,${t * 0.45})`;
      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x, trail[i].y);
      ctx.strokeStyle = color;
      ctx.lineWidth = t * 7;
      ctx.lineCap = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }
  }, [x, y, state]);

  return (
    <>
      <style>{styles}</style>
      <canvas ref={canvasRef} className="shark-trail-canvas" />
      <div
        className={`movable-shark${damaged ? " shark-damage-flash" : ""}`}
        data-state={state}
        style={{
          left: x - 40,
          top:  y - 40,
          transform: `scaleX(${facing})`,
        }}
      >
        {nearNodeId && <div className="interact-prompt">E — DISRUPT</div>}
        <div className="shark-ring" />
        <img src={sharkIcon} alt="shark" className="shark-img" />
      </div>
    </>
  );
}