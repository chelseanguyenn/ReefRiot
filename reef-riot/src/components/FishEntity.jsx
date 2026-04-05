import React, { useEffect, useRef } from 'react';

const FISH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" fill="none">
  <path d="M2 16 L10 8 L10 24 Z" fill="#00e5cc" fill-opacity="0.8" stroke="#00ffee" stroke-width="0.8"/>
  <ellipse cx="26" cy="16" rx="18" ry="10" fill="#00c4aa" fill-opacity="0.9" stroke="#00ffee" stroke-width="1"/>
  <ellipse cx="26" cy="19" rx="13" ry="5" fill="#ffffff" fill-opacity="0.12"/>
  <path d="M18 6 Q24 2 32 6 L30 8 Q24 5 18 8 Z" fill="#00e5cc" fill-opacity="0.85" stroke="#00ffee" stroke-width="0.7"/>
  <path d="M24 18 Q20 24 16 22 Q18 18 24 18 Z" fill="#00e5cc" fill-opacity="0.7" stroke="#00ffee" stroke-width="0.6"/>
  <path d="M20 10 Q22 12 20 14" stroke="#00ffee" stroke-width="0.6" fill="none" stroke-opacity="0.4"/>
  <path d="M26 9 Q28 12 26 15" stroke="#00ffee" stroke-width="0.6" fill="none" stroke-opacity="0.4"/>
  <path d="M32 10 Q34 13 32 16" stroke="#00ffee" stroke-width="0.6" fill="none" stroke-opacity="0.4"/>
  <circle cx="38" cy="13" r="4" fill="#001a33" stroke="#00ffee" stroke-width="1"/>
  <circle cx="39" cy="12" r="1.5" fill="#ffffff" fill-opacity="0.8"/>
  <circle cx="38" cy="13" r="1" fill="#00e5cc"/>
  <path d="M44 16 Q46 17 44 18" stroke="#00ffee" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M12 16 Q20 14 30 16 Q36 17 40 16" stroke="#00ffee" stroke-width="0.8" fill="none" stroke-opacity="0.6"/>
</svg>`;

/**
 * FishEntity — the player-controlled fish.
 *
 * Props:
 *   x, y          — current position (center)
 *   threat        — boolean, is trash nearby
 *   facingLeft    — flip direction based on movement
 */
export default function FishEntity({ x, y, threat, facingLeft = false }) {
  const pulseRef = useRef(null);

  // Pulse faster when under threat
  useEffect(() => {
    if (!pulseRef.current) return;
    pulseRef.current.style.animationDuration = threat ? '0.4s' : '1.8s';
  }, [threat]);

  const fishStyle = {
    position: 'absolute',
    left: x - 24,
    top: y - 16,
    width: 48,
    height: 32,
    transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
    transformOrigin: 'center center',
    pointerEvents: 'none',
    willChange: 'transform',
    transition: 'filter 0.15s ease',
    filter: threat
      ? 'drop-shadow(0 0 8px #ff3333cc) drop-shadow(0 0 16px #ff000066)'
      : 'drop-shadow(0 0 6px #00ffeeaa)',
    zIndex: 10,
  };

  const auraStyle = {
    position: 'absolute',
    left: x - 36,
    top: y - 28,
    width: 72,
    height: 56,
    borderRadius: '50%',
    background: threat
      ? 'radial-gradient(ellipse, rgba(255,50,50,0.18) 0%, transparent 70%)'
      : 'radial-gradient(ellipse, rgba(0,255,200,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
    transition: 'background 0.2s',
    animation: 'fishAuraPulse 1.8s ease-in-out infinite',
  };

  return (
    <>
      {/* Aura glow behind fish */}
      <div ref={pulseRef} style={auraStyle} />
      {/* Fish sprite */}
      <div
        style={fishStyle}
        dangerouslySetInnerHTML={{ __html: FISH_SVG }}
      />
    </>
  );
}