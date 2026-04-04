const styles = `
  .movable-shark {
    position: absolute;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    transform-origin: center;
    z-index: 30;
  }
  .movable-shark .shark-bubble {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #0a2a3a, #041218);
    border: 1.5px solid #00ffe022;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
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
  .movable-shark[data-state="disrupting"] .shark-ring { border-color: #ff2dff; animation: sharkRingPulse 0.5s ease-in-out infinite; }
  .movable-shark[data-state="disrupting"] .shark-bubble { border-color: #ff2dff44; }
  .movable-shark[data-state="restored"] .shark-ring { border-color: #39ff14; opacity: 0.5; }
  .movable-shark[data-state="moving"] .shark-svg { animation: sharkSwim 0.4s ease-in-out infinite alternate; }
  .movable-shark[data-state="disrupting"] .shark-svg { animation: sharkCharge 0.2s ease-in-out infinite alternate; filter: drop-shadow(0 0 8px #ff2dffaa); }
  .movable-shark[data-state="restored"] .shark-svg { animation: sharkCelebrate 0.8s ease-in-out infinite alternate; filter: drop-shadow(0 0 10px #39ff14cc); }
  @keyframes sharkSwim { from { transform: translateY(-2px) rotate(-3deg); } to { transform: translateY(2px) rotate(3deg); } }
  @keyframes sharkCharge { from { transform: translateX(-3px) rotate(-6deg); } to { transform: translateX(3px) rotate(6deg); } }
  @keyframes sharkCelebrate { from { transform: translateY(0) rotate(-5deg); } to { transform: translateY(-6px) rotate(5deg); } }
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
    animation: promptBounce 0.6s ease-in-out infinite alternate;
  }
  @keyframes promptBounce {
    from { transform: translateX(-50%) translateY(0); }
    to   { transform: translateX(-50%) translateY(-3px); }
  }
`;

export default function MovableShark({ x, y, facing, state, nearNodeId }) {
  return (
    <>
      <style>{styles}</style>
      <div
        className="movable-shark"
        data-state={state}
        style={{
          left: x - 40,
          top:  y - 40,
          transform: `scaleX(${facing})`,
        }}
      >
        {nearNodeId && <div className="interact-prompt">E — DISRUPT</div>}
        <div className="shark-ring" />
        <div className="shark-bubble">
          <svg className="shark-svg" width="48" height="48" viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="36" rx="22" ry="13" fill="#0d4a5c"/>
            <ellipse cx="32" cy="40" rx="14" ry="7" fill="#e8f4f0" opacity="0.14"/>
            <path d="M28 24 L32 10 L38 24 Z" fill="#0d4a5c"/>
            <path d="M14 36 Q32 30 50 36" stroke="#00ffe0" strokeWidth="1.5" opacity="0.65" fill="none"/>
            <path d="M54 36 L62 28 L62 44 Z" fill="#0a3a4a"/>
            <path d="M20 38 L10 48 L28 42 Z" fill="#0a3a4a"/>
            <circle cx="20" cy="33" r="3" fill="#00ffe0"/>
            <circle cx="20" cy="33" r="1.5" fill="#041218"/>
            <circle cx="19" cy="32" r="0.7" fill="#ffffff" opacity="0.8"/>
            <path d="M14 37 Q17 40 22 38" stroke="#00ffe0" strokeWidth="1" fill="none" opacity="0.6"/>
          </svg>
        </div>
      </div>
    </>
  );
}