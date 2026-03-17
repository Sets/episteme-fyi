// ══════════════════════════════════════════════════════════
// CANVAS SETUP
// ══════════════════════════════════════════════════════════

import { state } from './state.js';

export function setupCanvas() {
  state.canvas = document.getElementById('canvas');
  state.ctx    = state.canvas.getContext('2d');
  state.dpr    = window.devicePixelRatio || 1;
  state.W      = window.innerWidth;
  state.H      = window.innerHeight;
  state.canvas.width  = state.W * state.dpr;
  state.canvas.height = state.H * state.dpr;
  state.canvas.style.width  = state.W + 'px';
  state.canvas.style.height = state.H + 'px';
  state.ctx.scale(state.dpr, state.dpr);
}
