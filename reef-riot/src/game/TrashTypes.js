// Trash entity configuration
// Each type has visual + gameplay properties

export const TRASH_TYPES = {
  bottle: {
    id: 'bottle',
    label: 'Bottle',
    svgPath: '/assets/svg/trash-bottle.svg',
    width: 24,
    height: 30,
    speed: 0.45,       // px per frame base drift
    damage: 5,         // health damage on fish collision
    pollutionValue: 1, // pollution removed when collected
    hitRadius: 18,
    spawnWeight: 3,    // higher = more common
    wobbleAmp: 0.4,    // vertical sine wobble amplitude
    wobbleFreq: 0.04,
    rotateSpeed: 0.3,  // degrees/frame tumble
  },
  bag: {
    id: 'bag',
    label: 'Bag',
    svgPath: '/assets/svg/trash-bag.svg',
    width: 28,
    height: 30,
    speed: 0.3,
    damage: 8,
    pollutionValue: 2,
    hitRadius: 20,
    spawnWeight: 2,
    wobbleAmp: 0.7,    // bags billow more
    wobbleFreq: 0.03,
    rotateSpeed: 0.15,
  },
  straw: {
    id: 'straw',
    label: 'Straw',
    svgPath: '/assets/svg/trash-straw.svg',
    width: 14,
    height: 28,
    speed: 0.7,        // fastest — small and sneaky
    damage: 3,
    pollutionValue: 1,
    hitRadius: 12,
    spawnWeight: 4,
    wobbleAmp: 0.2,
    wobbleFreq: 0.07,
    rotateSpeed: 0.6,
  },
  net: {
    id: 'net',
    label: 'Net',
    svgPath: '/assets/svg/trash-net.svg',
    width: 44,
    height: 36,
    speed: 0.2,        // slowest but biggest threat
    damage: 15,
    pollutionValue: 4,
    hitRadius: 30,
    spawnWeight: 1,    // rarest
    wobbleAmp: 0.3,
    wobbleFreq: 0.025,
    rotateSpeed: 0.05,
  },
};

// Weighted random pick from trash types
export function pickRandomTrashType() {
  const entries = Object.values(TRASH_TYPES);
  const totalWeight = entries.reduce((s, t) => s + t.spawnWeight, 0);
  let r = Math.random() * totalWeight;
  for (const t of entries) {
    r -= t.spawnWeight;
    if (r <= 0) return t.id;
  }
  return 'bottle';
}

// Which trash types the Plastic Compactor auto-collects
export const COMPACTOR_TYPES = new Set(['bottle', 'bag', 'straw']);
// Which trash types the Ghost Net blocks
export const GHOST_NET_BLOCKS = new Set(['net']);