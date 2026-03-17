// ══════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════

import { WARM, COOL } from './config.js';

export function lerpColor(t) {
  t = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(WARM.r + (COOL.r - WARM.r) * t),
    g: Math.round(WARM.g + (COOL.g - WARM.g) * t),
    b: Math.round(WARM.b + (COOL.b - WARM.b) * t),
  };
}

export function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}
