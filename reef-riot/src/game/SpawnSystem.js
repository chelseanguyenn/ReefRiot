import { TRASH_TYPES, pickRandomTrashType } from './TrashTypes';

// Base spawn interval in frames (60fps assumed)
const BASE_SPAWN_INTERVAL = 110;

/**
 * Creates a single trash entity ready to be added to the game state.
 * Spawns off the right edge, drifts left.
 */
export function createTrash(typeId, canvasWidth, canvasHeight) {
  const cfg = TRASH_TYPES[typeId];
  const id = `${typeId}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

  // Keep trash in the playable vertical band (avoid very top / very bottom HUD)
  const minY = 60;
  const maxY = canvasHeight - 60;

  return {
    id,
    type: typeId,
    x: canvasWidth + cfg.width + 10,
    y: minY + Math.random() * (maxY - minY),
    vx: -(cfg.speed + Math.random() * 0.15), // slight speed variance
    vy: (Math.random() - 0.5) * 0.15,
    rotation: Math.random() * 360,
    wobbleOffset: Math.random() * Math.PI * 2, // phase offset so they don't all bob together
    collected: false,
    opacity: 1,
    scale: 1,
    // For collection animation
    collecting: false,
    collectTimer: 0,
  };
}

/**
 * SpawnSystem class — tracks spawn timer and manages when to create new trash.
 * Instantiate once per game session.
 */
export class SpawnSystem {
  constructor() {
    this.timer = 0;
    this.interval = BASE_SPAWN_INTERVAL;
  }

  /**
   * Call once per frame. Returns a new trash entity when it's time to spawn,
   * or null if not yet time.
   *
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @param {boolean} drillActive - Extraction drill doubles spawn rate
   * @param {string[]} blockedTypes - types currently blocked (ghost net)
   * @returns {object|null} trash entity or null
   */
  tick(canvasWidth, canvasHeight, drillActive = false, blockedTypes = []) {
    const interval = drillActive
      ? Math.floor(BASE_SPAWN_INTERVAL * 0.5)
      : BASE_SPAWN_INTERVAL;

    this.timer++;
    if (this.timer >= interval) {
      this.timer = 0;

      let typeId = pickRandomTrashType();
      // Re-roll once if blocked (ghost net active)
      if (blockedTypes.includes(typeId)) {
        typeId = pickRandomTrashType();
        if (blockedTypes.includes(typeId)) return null; // blocked twice, skip
      }

      return createTrash(typeId, canvasWidth, canvasHeight);
    }
    return null;
  }

  reset() {
    this.timer = 0;
  }
}

/**
 * Updates all trash positions each frame.
 * Returns updated array with off-screen items removed.
 */
export function updateTrash(trashArray, frame) {
  return trashArray
    .map(t => {
      if (t.collecting) {
        // Collection animation: shrink + fade out
        return {
          ...t,
          collectTimer: t.collectTimer + 1,
          scale: Math.max(0, t.scale - 0.07),
          opacity: Math.max(0, t.opacity - 0.08),
        };
      }

      const cfg = TRASH_TYPES[t.type];
      const wobble = Math.sin(frame * cfg.wobbleFreq + t.wobbleOffset) * cfg.wobbleAmp;

      return {
        ...t,
        x: t.x + t.vx,
        y: t.y + wobble,
        rotation: t.rotation + cfg.rotateSpeed,
      };
    })
    .filter(t => {
      // Remove off-screen or fully faded out
      if (t.x < -80) return false;
      if (t.collecting && t.opacity <= 0) return false;
      return true;
    });
}