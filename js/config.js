// ══════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════

export const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

export const CONFIG = {
  particleCount:     isMobile ? 550 : 1300,
  textParticleRatio: 0.52,
  connectionDist:    isMobile ? 65 : 95,
  mouseRadius:       isMobile ? 110 : 190,
  flowScale:         0.0022,
  flowSpeed:         0.00022,
  particleAccel:     0.16,
  textAttraction:    0.042,
  mouseForce:        3.8,
  damping:           0.952,
  trailAlpha:        0.075,
  maxConnections:    isMobile ? 700 : 2000,
};

export const GRID_SIZE = CONFIG.connectionDist;
export const WARP_MAX  = isMobile ? 7 : 16;

// episteme palette: amber gold ↔ cold violet-white
export const WARM = { r: 212, g: 168, b: 83  };
export const COOL = { r: 200, g: 184, b: 232 };
