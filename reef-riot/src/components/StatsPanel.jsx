const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  .stats-panel {
    position: absolute;
    right: 24px;
    bottom: 24px;
    font-family: 'Share Tech Mono', monospace;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 170px;
    z-index: 30;
  }

  .stats-header { font-size: 9px; letter-spacing: 0.22em; color: #00ffe044; margin-bottom: 2px; }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    border-radius: 3px;
    background: #00ffe005;
    border: 1px solid #00ffe010;
  }

  .stat-label { font-size: 9px; letter-spacing: 0.1em; color: #00ffe055; }
  .stat-value { font-size: 11px; letter-spacing: 0.08em; color: #00ffe0; transition: color 0.4s; }
  .stat-value.danger  { color: #ef4444; }
  .stat-value.warning { color: #ff6b35; }
  .stat-value.good    { color: #39ff14; }

  .stage-badge { font-size: 8px; letter-spacing: 0.16em; padding: 2px 8px; border-radius: 2px; text-transform: uppercase; }
  .stage-corrupted { color: #ff2dff; background: #ff2dff11; border: 1px solid #ff2dff33; }
  .stage-healing   { color: #ff6b35; background: #ff6b3511; border: 1px solid #ff6b3533; }
  .stage-restored  { color: #39ff14; background: #39ff1411; border: 1px solid #39ff1433; }

  .health-bar-track { height: 4px; background: #00ffe009; border-radius: 2px; overflow: hidden; margin-top: 2px; }
  .health-bar-fill  { height: 100%; border-radius: 2px; transition: width 0.5s ease, background 0.5s ease; }

  .stats-divider { height: 1px; background: #00ffe011; margin: 2px 0; }

  .reset-btn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; letter-spacing: 0.2em;
    padding: 5px 0; width: 100%;
    background: transparent;
    border: 1px solid #00ffe022;
    border-radius: 3px;
    color: #00ffe044;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 2px;
  }
  .reset-btn:hover { border-color: #00ffe066; color: #00ffe0; background: #00ffe008; }
  .reset-btn:active { transform: scale(0.97); }
`;
function healthColor(hp) {
  if (hp > 60) return "good";
  if (hp > 30) return "warning";
  return "danger";
}

export default function StatsPanel({ state, reset }) {
  const {
    health = 100,
    stage = "corrupted",
    encounters = {},
  } = state || {};

  const {
    net = 0,
    straw = 0,
    bottle = 0,
    bag = 0,
  } = encounters;

  const barColor =
    health > 60 ? "#63ff1e" : health > 30 ? "#ff9a3d" : "#ff5f6d";

  return (
    <>
      <style>{styles}</style>

      <div className="stats-panel">
        <div className="stats-header">STATUS</div>
        <div className="stat-dot" />

        <div className="stat-row health-card">
          <div className="health-top">
            <span className="stat-label">Health</span>
            <span className={`stat-value ${healthColor(health)}`}>
              {Math.round(health)}
            </span>
          </div>

          <div className="health-bar-track">
            <div
              className="health-bar-fill"
              style={{
                width: `${Math.max(0, Math.min(health, 100))}%`,
                background: barColor,
              }}
            />
          </div>
        </div>

        <div className="stat-row">
          <span className="stat-label">Stage</span>
          <span className={`stage-badge stage-${stage}`}>{stage}</span>
        </div>

        <div className="stats-divider" />

        <div className="stat-row">
          <span className="stat-label">Fishing nets</span>
          <span className="stat-value">{net}</span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Straws</span>
          <span className="stat-value">{straw}</span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Bottles</span>
          <span className="stat-value">{bottle}</span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Plastic bags</span>
          <span className="stat-value">{bag}</span>
        </div>

        <div className="stats-divider" />

        <button className="reset-btn" onClick={reset}>
          RESET
        </button>
      </div>
    </>
  );
}