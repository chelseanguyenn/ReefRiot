import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UseGameLoop } from '../game/UseGameLoop';
import TrashParticle from './TrashParticle';
import FishEntity from './FishEntity';
import { useParticles, ParticleLayer } from './ParticleLayer';

// Coral background SVG (inline for perf)
const CORAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" fill="none">
  <path d="M16 38 Q15 28 16 20" stroke="#ff6b8a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M16 28 Q10 22 8 16" stroke="#ff6b8a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M16 24 Q22 18 24 12" stroke="#ff8b6a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M10 20 Q6 16 5 12" stroke="#ff6b8a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M21 16 Q26 14 28 10" stroke="#ff8b6a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <circle cx="16" cy="19" r="3" fill="#ff4d73" stroke="#ffaacc" stroke-width="0.8"/>
  <circle cx="8" cy="15" r="2.5" fill="#ff4d73" stroke="#ffaacc" stroke-width="0.8"/>
  <circle cx="24" cy="11" r="2.5" fill="#ff7a5a" stroke="#ffbbaa" stroke-width="0.8"/>
  <circle cx="5" cy="11" r="2" fill="#ff4d73" stroke="#ffaacc" stroke-width="0.7"/>
  <circle cx="28" cy="9" r="2" fill="#ff7a5a" stroke="#ffbbaa" stroke-width="0.7"/>
</svg>`;

const CORAL_POSITIONS = [
  { x: 60, y: '78%', scale: 1.1, flip: false },
  { x: 160, y: '82%', scale: 0.8, flip: true },
  { x: 320, y: '75%', scale: 1.3, flip: false },
  { x: 500, y: '80%', scale: 0.9, flip: true },
  { x: 680, y: '76%', scale: 1.0, flip: false },
  { x: 860, y: '83%', scale: 1.2, flip: true },
  { x: 1040, y: '78%', scale: 0.85, flip: false },
  { x: 1200, y: '81%', scale: 1.1, flip: true },
];

/**
 * GameCanvas — the full interactive reef scene.
 *
 * Props:
 *   objectives   { compactor: bool, ghostNet: bool, drill: bool }
 *   onStatsUpdate (stats) => void
 *   onHealthChange (health) => void
 *   onGameOver () => void
 *   running      bool
 */
export default function GameCanvas({
  objectives,
  onStatsUpdate,
  onHealthChange,
  onGameOver,
  running = true,
}) {
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 500 });
  const [trash, setTrash] = useState([]);
  const [health, setHealthState] = useState(100);
  const [stats, setStatsState] = useState({ pollutionRemoved: 0, coralPlanted: 0, fishSaved: 0 });
  const [threat, setThreat] = useState(false);
  const [fishPos, setFishPos] = useState({ x: 700, y: 250 });
  const [facingLeft, setFacingLeft] = useState(false);
  const fishPosRef = useRef({ x: 700, y: 250 });
  const keysRef = useRef({});
  const { particles, spawnParticles } = useParticles();

  // Sync stats + health to parent
  const setHealth = useCallback((h) => {
    setHealthState(h);
    onHealthChange?.(h);
  }, [onHealthChange]);

  const setStats = useCallback((updater) => {
    setStatsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      onStatsUpdate?.(next);
      return next;
    });
  }, [onStatsUpdate]);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setCanvasSize({ width, height });
    });
    ro.observe(el);
    setCanvasSize({ width: el.offsetWidth, height: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // Keyboard input
  useEffect(() => {
    const down = (e) => { keysRef.current[e.key] = true; };
    const up = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Fish movement RAF (separate from game loop for responsiveness)
  useEffect(() => {
    if (!running) return;
    let raf;
    const SPEED = 3.5;

    const moveFish = () => {
      const k = keysRef.current;
      let { x, y } = fishPosRef.current;
      let moved = false;
      let newFacingLeft = facingLeft;

      if (k['ArrowLeft'] || k['a'] || k['A']) {
        x = Math.max(20, x - SPEED);
        newFacingLeft = true;
        moved = true;
      }
      if (k['ArrowRight'] || k['d'] || k['D']) {
        x = Math.min(canvasSize.width - 20, x + SPEED);
        newFacingLeft = false;
        moved = true;
      }
      if (k['ArrowUp'] || k['w'] || k['W']) {
        y = Math.max(20, y - SPEED);
        moved = true;
      }
      if (k['ArrowDown'] || k['s'] || k['S']) {
        y = Math.min(canvasSize.height - 20, y + SPEED);
        moved = true;
      }

      if (moved) {
        fishPosRef.current = { x, y };
        setFishPos({ x, y });
        if (newFacingLeft !== facingLeft) setFacingLeft(newFacingLeft);
      }

      raf = requestAnimationFrame(moveFish);
    };
    raf = requestAnimationFrame(moveFish);
    return () => cancelAnimationFrame(raf);
  }, [running, canvasSize, facingLeft]);

  // Touch/mouse drag support
  const handlePointerMove = useCallback((e) => {
    if (!running) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(Math.max((e.clientX || e.touches?.[0]?.clientX) - rect.left, 20), canvasSize.width - 20);
    const y = Math.min(Math.max((e.clientY || e.touches?.[0]?.clientY) - rect.top, 20), canvasSize.height - 20);
    setFacingLeft(x < fishPosRef.current.x);
    fishPosRef.current = { x, y };
    setFishPos({ x, y });
  }, [running, canvasSize]);

  // Wire game loop
  const { reset } = UseGameLoop({
    running,
    canvasSize,
    fishPosRef,
    objectives,
    setTrash,
    setHealth,
    setStats,
    setThreat,
    onGameOver,
  });

  // Bubble count by type for HUD
  const trashCounts = trash.reduce((acc, t) => {
    if (!t.collecting) acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: running ? 'crosshair' : 'default',
        background: 'transparent',
        userSelect: 'none',
      }}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
    >
      {/* Coral decorations */}
      {CORAL_POSITIONS.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c.x,
            top: c.y,
            width: 32,
            height: 40,
            transform: `scale(${c.scale}) scaleX(${c.flip ? -1 : 1})`,
            transformOrigin: 'bottom center',
            pointerEvents: 'none',
            opacity: 0.7,
            zIndex: 1,
          }}
          dangerouslySetInnerHTML={{ __html: CORAL_SVG }}
        />
      ))}

      {/* Trash layer */}
      {trash.map(t => (
        <TrashParticle key={t.id} trash={t} />
      ))}

      {/* Fish */}
      <FishEntity
        x={fishPos.x}
        y={fishPos.y}
        threat={threat}
        facingLeft={facingLeft}
      />

      {/* Particle effects */}
      <ParticleLayer particles={particles} />

      {/* Trash counter HUD (top right of canvas) */}
      <div style={{
        position: 'absolute',
        top: 8,
        right: 12,
        display: 'flex',
        gap: 8,
        pointerEvents: 'none',
        zIndex: 30,
      }}>
        {[
          { type: 'bottle', label: 'BOTTLES', color: '#00ffcc' },
          { type: 'bag', label: 'BAGS', color: '#a080ff' },
          { type: 'straw', label: 'STRAWS', color: '#ff8844' },
          { type: 'net', label: 'NETS', color: '#55aaff' },
        ].map(({ type, label, color }) => (
          <div key={type} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(0,10,20,0.6)',
            border: `1px solid ${color}44`,
            borderRadius: 4,
            padding: '3px 8px',
            minWidth: 52,
          }}>
            <span style={{ fontSize: 9, color: `${color}99`, letterSpacing: '0.08em', fontFamily: 'monospace' }}>
              {label}
            </span>
            <span style={{ fontSize: 15, color, fontFamily: 'monospace', fontWeight: 700 }}>
              {trashCounts[type] || 0}
            </span>
          </div>
        ))}
      </div>

      {/* Controls hint */}
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 10,
        color: 'rgba(0,255,200,0.3)',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
        pointerEvents: 'none',
        zIndex: 30,
      }}>
        WASD / ARROW KEYS — or move mouse to guide fish
      </div>

      <style>{`
        @keyframes fishAuraPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes particleFloat {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -150%) scale(1.4); }
        }
      `}</style>
    </div>
  );
}