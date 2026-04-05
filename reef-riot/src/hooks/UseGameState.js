import { useState, useEffect, useRef, useCallback } from "react";
import OCEAN_FACTS from "./OceanFacts";
import { SpawnSystem, updateTrash } from "../game/SpawnSystem";
import { runCollisions, isThreatNearby } from "../game/Collisions";

const ARENA_WIDTH          = window.innerWidth;
const ARENA_HEIGHT         = window.innerHeight;
const SHARK_SIZE           = 80;
const SHARK_RADIUS         = 32;
const MAX_SPEED            = 4.5;
const ACCELERATION         = 0.55;
const FRICTION             = 0.84;
const NODE_INTERACT_RADIUS = 90;

const ENEMY_COUNT      = 5;
const ENEMY_RADIUS     = 18;
const ENEMY_SPEED      = 1.1;
const ENEMY_DAMAGE     = 8;
const ENEMY_RESPAWN_MS = 4000;
const DAMAGE_COOLDOWN  = 800;

function pickRandomFact() {
  return OCEAN_FACTS[Math.floor(Math.random() * OCEAN_FACTS.length)];
}

function randomEdgePos() {
  const side = Math.floor(Math.random() * 4);
  if (side === 0) return { x: Math.random() * ARENA_WIDTH, y: -30 };
  if (side === 1) return { x: ARENA_WIDTH + 30, y: Math.random() * ARENA_HEIGHT };
  if (side === 2) return { x: Math.random() * ARENA_WIDTH, y: ARENA_HEIGHT + 30 };
  return { x: -30, y: Math.random() * ARENA_HEIGHT };
}

function makeEnemy(id) {
  const pos   = randomEdgePos();
  const angle = Math.random() * Math.PI * 2;
  return {
    id,
    x: pos.x, y: pos.y,
    vx: Math.cos(angle) * ENEMY_SPEED * (0.5 + Math.random()),
    vy: Math.sin(angle) * ENEMY_SPEED * (0.5 + Math.random()),
    type: ["toxicblob", "debris", "plasticchunk"][Math.floor(Math.random() * 3)],
    alive: true,
    respawnAt: null,
  };
}

const INITIAL_ENEMIES = Array.from({ length: ENEMY_COUNT }, (_, i) => makeEnemy(i));

const INITIAL_STATE = {
  sharkX: ARENA_WIDTH / 2,
  sharkY: ARENA_HEIGHT / 2,
  sharkVx: 0,
  sharkVy: 0,
  sharkFacing: 1,
  sharkState: "idle",
  sharkAngle: 0,
  health: 100,
  stage: "corrupted",
  pollutionRemoved: 0,
  coralPlanted: 0,
  fishSaved: 0,
  nodes: [
    { id: "compactor", type: "compactor", done: false, x: ARENA_WIDTH * 0.2,  y: ARENA_HEIGHT * 0.4 },
    { id: "ghostnet",  type: "ghostnet",  done: false, x: ARENA_WIDTH * 0.5,  y: ARENA_HEIGHT * 0.35 },
    { id: "drill",     type: "drill",     done: false, x: ARENA_WIDTH * 0.78, y: ARENA_HEIGHT * 0.4 },
  ],
  objectives: [
    { id: 1, name: "Plastic Compactor", active: true,  done: false },
    { id: 2, name: "Ghost Net",         active: false, done: false },
    { id: 3, name: "Extraction Drill",  active: false, done: false },
  ],
  nodesComplete: 0,
  nearNodeId: null,
  enemies: INITIAL_ENEMIES,
  damagedAt: null,
  currentFact: null,
  showFact: false,
  // ── Trash system ──
  trash: [],
  threat: false,
  collisionEvents: [],
};

const STAT_REWARDS = {
  compactor: { pollutionRemoved: 4, coralPlanted: 0, fishSaved: 0 },
  ghostnet:  { pollutionRemoved: 0, coralPlanted: 2, fishSaved: 5 },
  drill:     { pollutionRemoved: 6, coralPlanted: 4, fishSaved: 3 },
};

export default function UseGameState() {
  const [state, setState]    = useState(INITIAL_STATE);
  const keysRef              = useRef({});
  const rafRef               = useRef(null);
  const lastDamageRef        = useRef(0);

  // ── Trash refs (live values accessible inside RAF without stale closure) ──
  const trashRef             = useRef([]);
  const frameRef             = useRef(0);
  const spawnSystem          = useRef(new SpawnSystem());
  const sharkPosRef          = useRef({ x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2 });
  const nodesRef             = useRef(INITIAL_STATE.nodes);

  const handleInteract = useCallback(() => {
    setState(prev => {
      const { nearNodeId, nodes, objectives, nodesComplete } = prev;
      if (!nearNodeId) return prev;
      const nodeIdx = nodes.findIndex(n => n.id === nearNodeId);
      if (nodeIdx === -1 || nodes[nodeIdx].done) return prev;
      const rewards  = STAT_REWARDS[nodes[nodeIdx].type] ?? {};
      const newCount = nodesComplete + 1;
      const allDone  = newCount === 3;
      const newNodes = nodes.map((n, i) => i === nodeIdx ? { ...n, done: true } : n);
      nodesRef.current = newNodes;
      return {
        ...prev,
        nodes: newNodes,
        objectives: objectives.map((o, i) => ({
          ...o,
          done:   i === nodeIdx     ? true  : o.done,
          active: i === nodeIdx + 1 ? true  : i === nodeIdx ? false : o.active,
        })),
        nodesComplete: newCount,
        nearNodeId: null,
        stage: allDone ? "restored" : newCount >= 1 ? "healing" : "corrupted",
        pollutionRemoved: prev.pollutionRemoved + (rewards.pollutionRemoved ?? 0),
        coralPlanted:     prev.coralPlanted     + (rewards.coralPlanted     ?? 0),
        fishSaved:        prev.fishSaved        + (rewards.fishSaved        ?? 0),
        currentFact: allDone ? pickRandomFact() : prev.currentFact,
        showFact: allDone,
      };
    });
  }, []);

  useEffect(() => {
    const controlled = ["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","e"];
    const onDown = e => {
      const key = e.key.toLowerCase();
      if (controlled.includes(key)) e.preventDefault();
      keysRef.current[key] = true;
      if (key === "e") handleInteract();
    };
    const onUp = e => {
      const key = e.key.toLowerCase();
      if (controlled.includes(key)) e.preventDefault();
      keysRef.current[key] = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, [handleInteract]);

  useEffect(() => {
    const tick = () => {
      const now  = Date.now();
      const keys = keysRef.current;

      const inputX = (keys["a"] || keys["arrowleft"]  ? -1 : 0) + (keys["d"] || keys["arrowright"] ? 1 : 0);
      const inputY = (keys["w"] || keys["arrowup"]    ? -1 : 0) + (keys["s"] || keys["arrowdown"]  ? 1 : 0);
      const ilen   = Math.sqrt(inputX * inputX + inputY * inputY) || 1;
      const hasInput = inputX !== 0 || inputY !== 0;
      const ax = hasInput ? (inputX / ilen) * ACCELERATION : 0;
      const ay = hasInput ? (inputY / ilen) * ACCELERATION : 0;

      frameRef.current += 1;
      const frame = frameRef.current;

      setState(prev => {
        // ── Shark momentum (unchanged) ──
        let nvx = (prev.sharkVx + ax) * FRICTION;
        let nvy = (prev.sharkVy + ay) * FRICTION;
        const spd = Math.sqrt(nvx * nvx + nvy * nvy);
        if (spd > MAX_SPEED) { nvx = (nvx / spd) * MAX_SPEED; nvy = (nvy / spd) * MAX_SPEED; }

        const nx = Math.max(SHARK_SIZE / 2, Math.min(ARENA_WIDTH  - SHARK_SIZE / 2, prev.sharkX + nvx));
        const ny = Math.max(SHARK_SIZE / 2, Math.min(ARENA_HEIGHT - SHARK_SIZE / 2, prev.sharkY + nvy));
        const moving = spd > 0.15;
        const angle  = moving ? Math.atan2(nvy, nvx) * (180 / Math.PI) : prev.sharkAngle;

        // Keep shark pos ref current for trash collisions
        sharkPosRef.current = { x: nx, y: ny };

        // ── Near node (unchanged) ──
        let nearNodeId = null, nearDist = Infinity;
        for (const node of prev.nodes) {
          if (node.done) continue;
          const d = Math.hypot(nx - node.x, ny - node.y);
          if (d < NODE_INTERACT_RADIUS && d < nearDist) { nearDist = d; nearNodeId = node.id; }
        }

        // ── Enemies (unchanged) ──
        let health    = prev.health;
        let damagedAt = prev.damagedAt;

        const updatedEnemies = prev.enemies.map(enemy => {
          if (!enemy.alive) {
            if (enemy.respawnAt && now >= enemy.respawnAt) return makeEnemy(enemy.id);
            return enemy;
          }
          const toSharkX = nx - enemy.x;
          const toSharkY = ny - enemy.y;
          const tLen = Math.hypot(toSharkX, toSharkY) || 1;
          let evx = enemy.vx + (toSharkX / tLen) * 0.018;
          let evy = enemy.vy + (toSharkY / tLen) * 0.018;
          const espd = Math.sqrt(evx * evx + evy * evy);
          if (espd > ENEMY_SPEED * 1.5) { evx = (evx / espd) * ENEMY_SPEED * 1.5; evy = (evy / espd) * ENEMY_SPEED * 1.5; }
          let ex = enemy.x + evx;
          let ey = enemy.y + evy;
          if (ex < 0 || ex > ARENA_WIDTH)  evx = -evx;
          if (ey < 0 || ey > ARENA_HEIGHT) evy = -evy;
          const distToShark = Math.hypot(ex - nx, ey - ny);
          if (distToShark < SHARK_RADIUS + ENEMY_RADIUS) {
            if (now - lastDamageRef.current > DAMAGE_COOLDOWN) {
              health = Math.max(0, health - ENEMY_DAMAGE);
              damagedAt = now;
              lastDamageRef.current = now;
            }
            return { ...enemy, alive: false, respawnAt: now + ENEMY_RESPAWN_MS };
          }
          return { ...enemy, x: ex, y: ey, vx: evx, vy: evy };
        });

        // ── Trash system ──
        const compactorDone = prev.nodes.find(n => n.id === "compactor")?.done ?? false;
        const ghostnetDone  = prev.nodes.find(n => n.id === "ghostnet")?.done  ?? false;
        const drillDone     = prev.nodes.find(n => n.id === "drill")?.done     ?? false;

        // Spawn new trash (drill not cleared = double rate)
        const newPiece = spawnSystem.current.tick(
          ARENA_WIDTH,
          ARENA_HEIGHT,
          !drillDone,                          // drill active = faster spawns
          ghostnetDone ? ["net"] : []          // ghost net blocks nets
        );

        // Move existing trash
        let currentTrash = trashRef.current;
        if (newPiece) currentTrash = [...currentTrash, newPiece];
        currentTrash = updateTrash(currentTrash, frame);

        // Collisions against shark position
        const {
          updatedTrash,
          healthDelta,
          pollutionDelta,
          fishSavedDelta,
          collisionEvents,
        } = runCollisions(currentTrash, nx, ny, SHARK_RADIUS, {
          compactor: compactorDone,
          ghostNet:  ghostnetDone,
          drill:     !drillDone,
        });

        // Apply trash damage on top of enemy damage (respects same cooldown)
        if (healthDelta < 0 && now - lastDamageRef.current > DAMAGE_COOLDOWN) {
          health = Math.max(0, health + healthDelta);
          damagedAt = now;
          lastDamageRef.current = now;
        }

        // Write back to ref so next frame reads updated array
        trashRef.current = updatedTrash;

        const threat = isThreatNearby(updatedTrash, nx, ny);

        return {
          ...prev,
          sharkX: nx, sharkY: ny,
          sharkVx: nvx, sharkVy: nvy,
          sharkFacing: nvx > 0.1 ? 1 : nvx < -0.1 ? -1 : prev.sharkFacing,
          sharkState: prev.nodesComplete === 3 ? "restored" : nearNodeId ? "disrupting" : moving ? "moving" : "idle",
          sharkAngle: angle,
          nearNodeId,
          enemies: updatedEnemies,
          health,
          damagedAt,
          // Trash state exposed to App.jsx
          trash: updatedTrash,
          threat,
          collisionEvents,
          // Accumulate trash stats
          pollutionRemoved: prev.pollutionRemoved + pollutionDelta,
          fishSaved:        prev.fishSaved        + fishSavedDelta,
        };
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleNodeClick = useCallback((nodeId) => {
    setState(prev => {
      const nodeIdx = prev.nodes.findIndex(n => n.id === nodeId);
      if (nodeIdx === -1 || prev.nodes[nodeIdx].done) return prev;
      const rewards  = STAT_REWARDS[prev.nodes[nodeIdx].type] ?? {};
      const newCount = prev.nodesComplete + 1;
      const allDone  = newCount === 3;
      const newNodes = prev.nodes.map((n, i) => i === nodeIdx ? { ...n, done: true } : n);
      nodesRef.current = newNodes;
      return {
        ...prev,
        nodes: newNodes,
        objectives: prev.objectives.map((o, i) => ({
          ...o,
          done:   i === nodeIdx     ? true  : o.done,
          active: i === nodeIdx + 1 ? true  : i === nodeIdx ? false : o.active,
        })),
        nodesComplete: newCount,
        stage: allDone ? "restored" : newCount >= 1 ? "healing" : "corrupted",
        pollutionRemoved: prev.pollutionRemoved + (rewards.pollutionRemoved ?? 0),
        coralPlanted:     prev.coralPlanted     + (rewards.coralPlanted     ?? 0),
        fishSaved:        prev.fishSaved        + (rewards.fishSaved        ?? 0),
        currentFact: allDone ? pickRandomFact() : prev.currentFact,
        showFact: allDone,
      };
    });
  }, []);
  
  const reset = useCallback(() => {
  const freshState = {
    ...INITIAL_STATE,
    enemies: Array.from({ length: ENEMY_COUNT }, (_, i) => makeEnemy(i)),
    nodes: INITIAL_STATE.nodes.map((n) => ({ ...n, done: false })),
    objectives: INITIAL_STATE.objectives.map((o) => ({ ...o })),
    trash: [],
    threat: false,
    collisionEvents: [],
    currentFact: null,
    showFact: false,
    damagedAt: null,
  };

  trashRef.current = [];
  frameRef.current = 0;
  spawnSystem.current = new SpawnSystem();
  nodesRef.current = freshState.nodes;
  setState(freshState);
}, []);

  // const reset = useCallback(() => {
  //   trashRef.current = [];
  //   frameRef.current = 0;
  //   spawnSystem.current.reset();
  //   nodesRef.current = INITIAL_STATE.nodes;
  //   setState(INITIAL_STATE);
  // }, []);

  const dismissFact = useCallback(() => setState(p => ({ ...p, showFact: false })), []);

  return { state, handleNodeClick, handleInteract, reset, dismissFact };
}