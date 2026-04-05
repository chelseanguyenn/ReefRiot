import React from 'react';
import { TRASH_TYPES } from '../game/TrashTypes';

// Inline SVG data for each trash type (avoids file loading issues in dev)
const TRASH_SVGS = {
  bottle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <rect x="10" y="12" width="12" height="16" rx="3" fill="#4dd9ac" fill-opacity="0.7" stroke="#00ffcc" stroke-width="1"/>
    <rect x="13" y="7" width="6" height="6" rx="1.5" fill="#4dd9ac" fill-opacity="0.6" stroke="#00ffcc" stroke-width="1"/>
    <rect x="12" y="5" width="8" height="3" rx="1" fill="#ff4466" stroke="#ff6688" stroke-width="0.5"/>
    <rect x="11" y="16" width="10" height="6" rx="1" fill="#ffffff" fill-opacity="0.15"/>
    <path d="M10 22 Q16 20 22 22" stroke="#00ffcc" stroke-width="0.8" stroke-opacity="0.5" fill="none"/>
  </svg>`,

  bag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <path d="M8 14 Q7 26 16 27 Q25 26 24 14 Z" fill="#c8b4ff" fill-opacity="0.5" stroke="#a080ff" stroke-width="1"/>
    <path d="M12 14 Q11 8 14 7 Q16 6.5 16 9" stroke="#a080ff" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M20 14 Q21 8 18 7 Q16 6.5 16 9" stroke="#a080ff" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M10 18 Q16 16 22 18" stroke="#c8b4ff" stroke-width="0.6" fill="none" stroke-opacity="0.6"/>
    <path d="M9 22 Q16 20 23 22" stroke="#c8b4ff" stroke-width="0.6" fill="none" stroke-opacity="0.6"/>
    <circle cx="16" cy="20" r="3" fill="#ffffff" fill-opacity="0.1" stroke="#c8b4ff" stroke-width="0.5"/>
  </svg>`,

  straw: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <rect x="14" y="3" width="5" height="26" rx="2.5" transform="rotate(12 16 16)" fill="#ff8844" fill-opacity="0.7" stroke="#ffaa66" stroke-width="1"/>
    <rect x="14" y="3" width="5" height="4" rx="2" transform="rotate(12 16 16)" fill="#ffffff" fill-opacity="0.25"/>
    <rect x="14" y="11" width="5" height="4" transform="rotate(12 16 16)" fill="#ffffff" fill-opacity="0.25"/>
    <rect x="14" y="19" width="5" height="4" transform="rotate(12 16 16)" fill="#ffffff" fill-opacity="0.25"/>
    <rect x="15.5" y="3" width="1.5" height="26" rx="0.75" transform="rotate(12 16 16)" fill="#ffffff" fill-opacity="0.2"/>
  </svg>`,

  net: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="22" rx="14" ry="10" fill="#55aaff" fill-opacity="0.15" stroke="#55aaff" stroke-width="1"/>
    <path d="M6 18 Q20 16 34 18" stroke="#55aaff" stroke-width="0.7" fill="none" stroke-opacity="0.7"/>
    <path d="M6 22 Q20 20 34 22" stroke="#55aaff" stroke-width="0.7" fill="none" stroke-opacity="0.7"/>
    <path d="M8 26 Q20 24 32 26" stroke="#55aaff" stroke-width="0.7" fill="none" stroke-opacity="0.6"/>
    <path d="M16 12 Q15 22 17 32" stroke="#55aaff" stroke-width="0.7" fill="none" stroke-opacity="0.7"/>
    <path d="M20 12 Q20 22 20 32" stroke="#55aaff" stroke-width="0.8" fill="none" stroke-opacity="0.7"/>
    <path d="M24 12 Q25 22 23 32" stroke="#55aaff" stroke-width="0.7" fill="none" stroke-opacity="0.7"/>
    <path d="M8 14 Q20 10 32 14" stroke="#aaddff" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="8" cy="14" r="2.5" fill="#ff4444" stroke="#ff6666" stroke-width="0.5"/>
    <circle cx="14" cy="11.5" r="2.5" fill="#ff4444" stroke="#ff6666" stroke-width="0.5"/>
    <circle cx="20" cy="10" r="2.5" fill="#ff4444" stroke="#ff6666" stroke-width="0.5"/>
    <circle cx="26" cy="11.5" r="2.5" fill="#ff4444" stroke="#ff6666" stroke-width="0.5"/>
    <circle cx="32" cy="14" r="2.5" fill="#ff4444" stroke="#ff6666" stroke-width="0.5"/>
  </svg>`,
};

/**
 * TrashParticle — renders a single piece of drifting trash.
 *
 * Props:
 *   trash: { id, type, x, y, rotation, scale, opacity }
 */
export default function TrashParticle({ trash }) {
  const cfg = TRASH_TYPES[trash.type];
  const svgString = TRASH_SVGS[trash.type];

  const style = {
    position: 'absolute',
    left: trash.x - cfg.width / 2,
    top: trash.y - cfg.height / 2,
    width: cfg.width,
    height: cfg.height,
    transform: `rotate(${trash.rotation}deg) scale(${trash.scale})`,
    opacity: trash.opacity,
    transformOrigin: 'center center',
    pointerEvents: 'none',
    willChange: 'transform, opacity',
    // Glowing edge effect based on type
    filter: trash.type === 'net'
      ? 'drop-shadow(0 0 4px #55aaff88)'
      : trash.type === 'bag'
        ? 'drop-shadow(0 0 3px #a080ff88)'
        : 'drop-shadow(0 0 3px #ffffff44)',
  };

  return (
    <div
      style={style}
      dangerouslySetInnerHTML={{ __html: svgString }}
      data-trash-id={trash.id}
      data-trash-type={trash.type}
    />
  );
}