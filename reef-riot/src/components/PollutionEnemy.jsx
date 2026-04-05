const ENEMY_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  .pollution-enemy {
    position: absolute;
    pointer-events: none;
    z-index: 25;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
  }

  .enemy-body {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: enemyDrift 2s ease-in-out infinite alternate;
    position: relative;
  }

  .enemy-body::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    opacity: 0.3;
    animation: enemyPulse 1.5s ease-in-out infinite;
  }

  @keyframes enemyDrift {
    from { transform: scale(1) rotate(-8deg); }
    to   { transform: scale(1.08) rotate(8deg); }
  }

  @keyframes enemyPulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50%       { transform: scale(1.3); opacity: 0.0; }
  }

  .enemy-toxicblob {
    width: 36px; height: 36px;
    background: radial-gradient(circle at 40% 35%, #39ff1466, #1a4a1a);
    border: 1.5px solid #39ff1488;
    color: #39ff14;
    box-shadow: 0 0 12px #39ff1444;
  }

  .enemy-debris {
    width: 30px; height: 30px;
    background: radial-gradient(circle at 40% 35%, #ff6b3566, #3a1a0a);
    border: 1.5px solid #ff6b3588;
    color: #ff6b35;
    box-shadow: 0 0 12px #ff6b3544;
    border-radius: 4px !important;
  }

  .enemy-plasticchunk {
    width: 32px; height: 32px;
    background: radial-gradient(circle at 40% 35%, #00ffe033, #041218);
    border: 1.5px solid #00ffe055;
    color: #00ffe0;
    box-shadow: 0 0 10px #00ffe033;
    border-radius: 3px !important;
  }
`;

const ENEMY_ICONS = {
  toxicblob:    "☣",
  debris:       "⬡",
  plasticchunk: "▪",
};

export default function PollutionEnemy({ enemy }) {
  if (!enemy.alive) return null;
  return (
    <>
      <style>{ENEMY_STYLES}</style>
      <div
        className="pollution-enemy"
        style={{ left: enemy.x, top: enemy.y }}
      >
        <div className={`enemy-body enemy-${enemy.type}`}>
          <span style={{ fontSize: 14, lineHeight: 1 }}>{ENEMY_ICONS[enemy.type] ?? "●"}</span>
        </div>
      </div>
    </>
  );
}