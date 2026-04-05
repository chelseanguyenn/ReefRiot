import { TRASH_TYPES, COMPACTOR_TYPES, GHOST_NET_BLOCKS } from './TrashTypes';

/**
 * Circle vs circle collision test.
 */
function circleOverlap(ax, ay, ar, bx, by, br) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy < (ar + br) * (ar + br);
}

/**
 * Main collision pass — runs once per frame.
 *
 * Returns:
 *   {
 *     updatedTrash,      // array with collected items flagged
 *     healthDelta,       // negative number = damage taken this frame
 *     pollutionDelta,    // how much pollution was removed
 *     fishSavedDelta,    // 1 if a net was intercepted by ghost net tool
 *     collisionEvents,   // [{type, x, y, kind}] for particle effects
 *   }
 */
export function runCollisions(
  trashArray,
  fishX,
  fishY,
  fishRadius = 20,
  objectives = { compactor: false, ghostNet: false, drill: false }
) {
  let healthDelta = 0;
  let pollutionDelta = 0;
  let fishSavedDelta = 0;
  const collisionEvents = [];
  const updatedTrash = [];

  for (const t of trashArray) {
    if (t.collecting || t.collected) {
      updatedTrash.push(t);
      continue;
    }

    const cfg = TRASH_TYPES[t.type];

    // --- Ghost Net interception ---
    // Nets that reach the center of the screen get caught by the Ghost Net tool
    const screenMidX = window.innerWidth * 0.5;
    if (
      objectives.ghostNet &&
      GHOST_NET_BLOCKS.has(t.type) &&
      t.x <= screenMidX + 40 &&
      t.x >= screenMidX - 40
    ) {
      collisionEvents.push({ kind: 'netCatch', x: t.x, y: t.y, type: t.type });
      pollutionDelta += cfg.pollutionValue;
      fishSavedDelta += 1;
      updatedTrash.push({ ...t, collecting: true, collectTimer: 0 });
      continue;
    }

    // --- Plastic Compactor interception ---
    // Bottles/bags/straws within the compactor zone (left third) get auto-removed
    const compactorZoneX = window.innerWidth * 0.22;
    if (
      objectives.compactor &&
      COMPACTOR_TYPES.has(t.type) &&
      t.x <= compactorZoneX + 30 &&
      t.x >= compactorZoneX - 60
    ) {
      collisionEvents.push({ kind: 'compacted', x: t.x, y: t.y, type: t.type });
      pollutionDelta += cfg.pollutionValue;
      updatedTrash.push({ ...t, collecting: true, collectTimer: 0 });
      continue;
    }

    // --- Fish collision ---
    if (circleOverlap(fishX, fishY, fishRadius, t.x, t.y, cfg.hitRadius)) {
      healthDelta -= cfg.damage;
      pollutionDelta += cfg.pollutionValue; // fish "absorbs" it
      collisionEvents.push({ kind: 'fishHit', x: t.x, y: t.y, type: t.type });
      updatedTrash.push({ ...t, collecting: true, collectTimer: 0 });
      continue;
    }

    updatedTrash.push(t);
  }

  return {
    updatedTrash,
    healthDelta,
    pollutionDelta,
    fishSavedDelta,
    collisionEvents,
  };
}

/**
 * Returns true if any trash is dangerously close to the fish (for threat indicator).
 */
export function isThreatNearby(trashArray, fishX, fishY, warnRadius = 90) {
  return trashArray.some(t => {
    if (t.collecting) return false;
    const dx = t.x - fishX;
    const dy = t.y - fishY;
    return dx * dx + dy * dy < warnRadius * warnRadius;
  });
}