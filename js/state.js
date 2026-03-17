// ══════════════════════════════════════════════════════════
// APPLICATION STATE
// ══════════════════════════════════════════════════════════

export const state = {
  canvas: null,
  ctx: null,
  dpr: 1,
  W: 0,
  H: 0,

  particles: [],
  textTargets: [],
  grid: {},

  mouse: { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false },

  warpStreaks: [],

  booted: false,
  phase: 'doxa',
  scattered: false,   // doxa → episteme (transitions after boot)

  interaction: {
    mouseDist: 0,
    clicks: 0,
    lastMove: 0,
    revealed: new Set(),
    keyBuf: '',
  },
};
