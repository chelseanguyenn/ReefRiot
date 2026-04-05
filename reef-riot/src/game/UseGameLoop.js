import { useEffect, useRef, useCallback } from 'react';
import { SpawnSystem, updateTrash } from './SpawnSystem';
import { runCollisions, isThreatNearby } from './Collisions';

/**
 * useGameLoop — the main RAF-driven game loop.
 *
 * Manages:
 *  - Trash spawning
 *  - Trash movement/physics
 *  - Collision detection
 *  - Stats updates
 *  - Game over / win conditions
 *
 * @param {object} params
 * @param {boolean} params.running - pause/play
 * @param {object} params.canvasSize - { width, height }
 * @param {object} params.fishPos - ref to { x, y }
 * @param {object} params.objectives - { compactor, ghostNet, drill }
 * @param {function} params.setTrash
 * @param {function} params.setHealth
 * @param {function} params.setStats - (updater) => void, stats = { pollutionRemoved, coralPlanted, fishSaved }
 * @param {function} params.setThreat - boolean setter
 * @param {function} params.onGameOver
 */
export function UseGameLoop({
  running,
  canvasSize,
  fishPosRef,
  objectives,
  setTrash,
  setHealth,
  setStats,
  setThreat,
  onGameOver,
}) {
  const frameRef = useRef(0);
  const rafRef = useRef(null);
  const spawnSystem = useRef(new SpawnSystem());
  const trashRef = useRef([]);
  const healthRef = useRef(100);
  const gameOverRef = useRef(false);
  const objectivesRef = useRef(objectives);

  // Keep objectives ref current without restarting loop
  useEffect(() => {
    objectivesRef.current = objectives;
  }, [objectives]);

  const loop = useCallback(() => {
    if (!running || gameOverRef.current) return;

    frameRef.current += 1;
    const frame = frameRef.current;

    // Determine blocked types from active objectives
    const blockedTypes = objectivesRef.current.ghostNet ? ['net'] : [];
    const drillActive = objectivesRef.current.drill;

    // 1. Possibly spawn new trash
    const newTrash = spawnSystem.current.tick(
      canvasSize.width,
      canvasSize.height,
      drillActive,
      blockedTypes
    );

    // 2. Update trash movement
    let currentTrash = trashRef.current;
    if (newTrash) {
      currentTrash = [...currentTrash, newTrash];
    }
    currentTrash = updateTrash(currentTrash, frame);

    // 3. Run collisions
    const fish = fishPosRef.current;
    const {
      updatedTrash,
      healthDelta,
      pollutionDelta,
      fishSavedDelta,
      collisionEvents,
    } = runCollisions(currentTrash, fish.x, fish.y, 20, objectivesRef.current);

    trashRef.current = updatedTrash;

    // 4. Threat indicator
    const threat = isThreatNearby(updatedTrash, fish.x, fish.y);
    setThreat(threat);

    // 5. Apply health damage
    if (healthDelta < 0) {
      healthRef.current = Math.max(0, healthRef.current + healthDelta);
      setHealth(healthRef.current);
      if (healthRef.current <= 0 && !gameOverRef.current) {
        gameOverRef.current = true;
        onGameOver?.();
        return;
      }
    }

    // 6. Update stats
    if (pollutionDelta > 0 || fishSavedDelta > 0) {
      setStats(prev => ({
        ...prev,
        pollutionRemoved: prev.pollutionRemoved + pollutionDelta,
        fishSaved: prev.fishSaved + fishSavedDelta,
      }));
    }

    // 7. Flush trash to React state (batch update)
    setTrash([...updatedTrash]);

    rafRef.current = requestAnimationFrame(loop);
  }, [running, canvasSize, fishPosRef, setTrash, setHealth, setStats, setThreat, onGameOver]);

  useEffect(() => {
    if (running) {
      gameOverRef.current = false;
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, loop]);

  // Expose reset
  const reset = useCallback(() => {
    spawnSystem.current.reset();
    trashRef.current = [];
    healthRef.current = 100;
    gameOverRef.current = false;
    frameRef.current = 0;
    setTrash([]);
    setHealth(100);
  }, [setTrash, setHealth]);

  return { reset };
}