import { useState, useEffect, useRef, useCallback } from "react";

const ARENA_WIDTH = window.innerWidth;
const ARENA_HEIGHT = window.innerHeight;
const SHARK_SIZE = 80;
const MOVE_SPEED = 3.5;
const NODE_INTERACT_RADIUS = 90;

const INITIAL_STATE = {
  // Shark position (center of arena to start)
  sharkX: ARENA_WIDTH / 2,
  sharkY: ARENA_HEIGHT / 2,
  sharkFacing: 1, // 1 = right, -1 = left
  sharkState: "idle", // idle | moving | disrupting | restored

  // Stats
  health: 100,
  stage: "corrupted", // corrupted | healing | restored
  pollutionRemoved: 0,
  coralPlanted: 0,
  fishSaved: 0,

  // Nodes
  nodes: [
    { id: "compactor", type: "compactor", done: false, x: ARENA_WIDTH * 0.2,  y: ARENA_HEIGHT * 0.4 },
    { id: "ghostnet",  type: "ghostnet",  done: false, x: ARENA_WIDTH * 0.5,  y: ARENA_HEIGHT * 0.35 },
    { id: "drill",     type: "drill",     done: false, x: ARENA_WIDTH * 0.78, y: ARENA_HEIGHT * 0.4 },
  ],

  // Objectives
  objectives: [
    { id: 1, name: "Plastic Compactor", active: true,  done: false },
    { id: 2, name: "Ghost Net",         active: false, done: false },
    { id: 3, name: "Extraction Drill",  active: false, done: false },
  ],

  nodesComplete: 0,
  nearNodeId: null,
  factNode: "compactor",
  showFact: true,
};

const STAT_REWARDS = {
  compactor: { pollutionRemoved: 4, coralPlanted: 0, fishSaved: 0 },
  ghostnet:  { pollutionRemoved: 0, coralPlanted: 2, fishSaved: 5 },
  drill:     { pollutionRemoved: 6, coralPlanted: 4, fishSaved: 3 },
};

export default function useGameState() {
  const [state, setState] = useState(INITIAL_STATE);
  const keysRef = useRef({});
  const rafRef  = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // ── WASD key tracking ────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
      // E key = interact with nearby node
      if (e.key.toLowerCase() === "e") handleInteract();
    };
    const onUp = (e) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup",   onUp);
    };
  }, []);

  // ── Game loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const keys = keysRef.current;
      const dx = (keys["a"] || keys["arrowleft"]  ? -1 : 0)
               + (keys["d"] || keys["arrowright"] ?  1 : 0);
      const dy = (keys["w"] || keys["arrowup"]    ? -1 : 0)
               + (keys["s"] || keys["arrowdown"]  ?  1 : 0);

      const moving = dx !== 0 || dy !== 0;

      // Normalise diagonal speed
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const vx = (dx / len) * MOVE_SPEED;
      const vy = (dy / len) * MOVE_SPEED;

      setState(prev => {
        const s = prev;

        // Clamp to arena bounds
        const nx = Math.max(SHARK_SIZE / 2, Math.min(ARENA_WIDTH  - SHARK_SIZE / 2, s.sharkX + vx));
        const ny = Math.max(SHARK_SIZE / 2, Math.min(ARENA_HEIGHT - SHARK_SIZE / 2, s.sharkY + vy));

        // Find nearest node within interact radius
        let nearNodeId = null;
        let nearDist = Infinity;
        for (const node of s.nodes) {
          if (node.done) continue;
          const dist = Math.hypot(nx - node.x, ny - node.y);
          if (dist < NODE_INTERACT_RADIUS && dist < nearDist) {
            nearDist = dist;
            nearNodeId = node.id;
          }
        }

        const newSharkState = s.nodesComplete === 3 ? "restored"
          : nearNodeId ? "disrupting"
          : moving ? "moving"
          : "idle";

        return {
          ...s,
          sharkX: moving ? nx : s.sharkX,
          sharkY: moving ? ny : s.sharkY,
          sharkFacing: dx > 0 ? 1 : dx < 0 ? -1 : s.sharkFacing,
          sharkState: newSharkState,
          nearNodeId,
        };
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Node interaction ─────────────────────────────────────────────────────
  const handleInteract = useCallback(() => {
    setState(prev => {
      const { nearNodeId, nodes, objectives, nodesComplete } = prev;
      if (!nearNodeId) return prev;

      const nodeIdx = nodes.findIndex(n => n.id === nearNodeId);
      if (nodeIdx === -1 || nodes[nodeIdx].done) return prev;

      const nodeType = nodes[nodeIdx].type;
      const rewards  = STAT_REWARDS[nodeType] ?? {};
      const newCount = nodesComplete + 1;

      const newStage = newCount === 3 ? "restored"
        : newCount >= 1 ? "healing"
        : "corrupted";

      return {
        ...prev,
        nodes: nodes.map((n, i) => i === nodeIdx ? { ...n, done: true } : n),
        objectives: objectives.map((o, i) => ({
          ...o,
          done:   i === nodeIdx     ? true  : o.done,
          active: i === nodeIdx + 1 ? true  : i === nodeIdx ? false : o.active,
        })),
        nodesComplete: newCount,
        nearNodeId: null,
        stage: newStage,
        pollutionRemoved: prev.pollutionRemoved + (rewards.pollutionRemoved ?? 0),
        coralPlanted:     prev.coralPlanted     + (rewards.coralPlanted     ?? 0),
        fishSaved:        prev.fishSaved        + (rewards.fishSaved        ?? 0),
        factNode: nodes[nodeIdx + 1]?.type ?? prev.factNode,
        showFact: nodeIdx + 1 < nodes.length,
      };
    });
  }, []);

  // ── Click-to-interact on node (fallback for mouse users) ─────────────────
  const handleNodeClick = useCallback((nodeId) => {
    setState(prev => {
      const nodeIdx = prev.nodes.findIndex(n => n.id === nodeId);
      if (nodeIdx === -1 || prev.nodes[nodeIdx].done) return prev;
      // Temporarily set nearNodeId then call interact logic inline
      const nodeType = prev.nodes[nodeIdx].type;
      const rewards  = STAT_REWARDS[nodeType] ?? {};
      const newCount = prev.nodesComplete + 1;
      return {
        ...prev,
        nodes: prev.nodes.map((n, i) => i === nodeIdx ? { ...n, done: true } : n),
        objectives: prev.objectives.map((o, i) => ({
          ...o,
          done:   i === nodeIdx     ? true  : o.done,
          active: i === nodeIdx + 1 ? true  : i === nodeIdx ? false : o.active,
        })),
        nodesComplete: newCount,
        stage: newCount === 3 ? "restored" : newCount >= 1 ? "healing" : "corrupted",
        pollutionRemoved: prev.pollutionRemoved + (rewards.pollutionRemoved ?? 0),
        coralPlanted:     prev.coralPlanted     + (rewards.coralPlanted     ?? 0),
        fishSaved:        prev.fishSaved        + (rewards.fishSaved        ?? 0),
        factNode: prev.nodes[nodeIdx + 1]?.type ?? prev.factNode,
        showFact: nodeIdx + 1 < prev.nodes.length,
      };
    });
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);
  const dismissFact = useCallback(() => setState(p => ({ ...p, showFact: false })), []);

  return { state, handleNodeClick, handleInteract, reset, dismissFact };
}

useEffect(() => {
  const controlledKeys = [
    "w", "a", "s", "d",
    "arrowup", "arrowdown", "arrowleft", "arrowright",
    "e"
  ];

  const onDown = (e) => {
    const key = e.key.toLowerCase();
    if (controlledKeys.includes(key)) e.preventDefault();
    keysRef.current[key] = true;
    if (key === "e") handleInteract();
  };

  const onUp = (e) => {
    const key = e.key.toLowerCase();
    if (controlledKeys.includes(key)) e.preventDefault();
    keysRef.current[key] = false;
  };

  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);

  return () => {
    window.removeEventListener("keydown", onDown);
    window.removeEventListener("keyup", onUp);
  };
}, [handleInteract]);