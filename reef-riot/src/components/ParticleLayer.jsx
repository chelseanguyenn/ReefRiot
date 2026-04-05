import React, { useState, useCallback } from 'react';

/**
 * useParticles — manages a list of short-lived particle effects.
 * Returns { particles, spawnParticles, ParticleLayer }
 */
export function useParticles() {
  const [particles, setParticles] = useState([]);

  const spawnParticles = useCallback((events) => {
    if (!events || events.length === 0) return;

    const newParticles = events.map(ev => ({
      id: `p-${Date.now()}-${Math.random()}`,
      x: ev.x,
      y: ev.y,
      kind: ev.kind,
      type: ev.type,
      born: Date.now(),
      ttl: ev.kind === 'fishHit' ? 700 : 500,
    }));

    setParticles(prev => [...prev, ...newParticles]);

    // Auto-clean after max ttl
    setTimeout(() => {
      const ids = new Set(newParticles.map(p => p.id));
      setParticles(prev => prev.filter(p => !ids.has(p.id)));
    }, 800);
  }, []);

  return { particles, spawnParticles };
}

/**
 * Renders all active particle effects.
 */
export function ParticleLayer({ particles }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
      {particles.map(p => (
        <Particle key={p.id} particle={p} />
      ))}
    </div>
  );
}

function Particle({ particle }) {
  const age = Date.now() - particle.born;
  const progress = Math.min(1, age / particle.ttl);

  const colors = {
    fishHit: '#ff4444',
    compacted: '#00ffcc',
    netCatch: '#55aaff',
  };

  const color = colors[particle.kind] || '#ffffff';
  const opacity = 1 - progress;
  const scale = particle.kind === 'fishHit' ? 1 + progress * 1.5 : 1 + progress * 0.8;

  const labels = {
    fishHit: '💥',
    compacted: '✓',
    netCatch: '⊘',
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: particle.x,
        top: particle.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        color,
        fontSize: particle.kind === 'fishHit' ? 22 : 18,
        fontFamily: 'monospace',
        fontWeight: 700,
        textShadow: `0 0 8px ${color}`,
        whiteSpace: 'nowrap',
        letterSpacing: '0.05em',
        animation: 'particleFloat 0.6s ease-out forwards',
      }}
    >
      {labels[particle.kind]}
      {particle.kind !== 'fishHit' && (
        <span style={{ fontSize: 11, marginLeft: 4, opacity: 0.8 }}>
          {particle.type}
        </span>
      )}
    </div>
  );
}