// ══════════════════════════════════════════════════════════
// PARTICLE SYSTEM
// ══════════════════════════════════════════════════════════

import { CONFIG, GRID_SIZE } from './config.js';
import { noise } from './noise.js';
import { state } from './state.js';

// ═══ TEXT TARGET GENERATION ═══

export function generateTextTargets(text) {
  const { W, H } = state;
  const off = document.createElement('canvas');
  const oc = off.getContext('2d');
  off.width = W; off.height = H;

  const fontSize = Math.min(Math.max(W * 0.22, 90), 280);
  oc.fillStyle = '#fff';
  oc.font = `700 ${fontSize}px "Space Mono", monospace`;
  oc.textAlign = 'center';
  oc.textBaseline = 'middle';
  oc.fillText(text, W/2, H/2);

  const data = oc.getImageData(0,0,W,H).data;
  const positions = [];
  const step = Math.max(3, Math.round(fontSize/52));

  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y*W+x)*4+3] > 128) positions.push({x,y});
    }
  }
  for (let i = positions.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [positions[i],positions[j]] = [positions[j],positions[i]];
  }
  const count = Math.floor(CONFIG.particleCount * CONFIG.textParticleRatio);
  return positions.slice(0, count);
}

// ═══ PARTICLE CREATION ═══

function createParticle(idx, target) {
  const { W, H } = state;
  return {
    x: Math.random()*W, y: Math.random()*H,
    vx: (Math.random()-0.5)*1.8, vy: (Math.random()-0.5)*1.8,
    target: target || null,
    size: target ? 1.5 : (Math.random()<0.03 ? 2.0 : 1.0),
    colorT: target ? Math.random()*0.4+0.1 : Math.random(),
    idx,
  };
}

export function initParticles() {
  state.particles = [];
  for (let i = 0; i < CONFIG.particleCount; i++) {
    const target = i < state.textTargets.length ? state.textTargets[i] : null;
    state.particles.push(createParticle(i, target));
  }
}

// ═══ SPATIAL GRID ═══

export function updateGrid() {
  state.grid = {};
  for (const p of state.particles) {
    const key = ((p.x/GRID_SIZE)|0) + ':' + ((p.y/GRID_SIZE)|0);
    (state.grid[key]||(state.grid[key]=[])).push(p);
  }
}

// ═══ PHYSICS ═══

export function updateParticles(time) {
  const { W, H, particles, mouse } = state;
  const t = time * CONFIG.flowSpeed;
  const r2 = CONFIG.mouseRadius * CONFIG.mouseRadius;

  // doxa phase: particles resist forming — weaker text attraction
  const doxaFactor = state.phase === 'doxa' ? 0.28 : 1.0;

  for (const p of particles) {
    const nx = noise.noise3D(p.x*CONFIG.flowScale, p.y*CONFIG.flowScale, t);
    const ny = noise.noise3D(p.x*CONFIG.flowScale+100, p.y*CONFIG.flowScale+100, t);
    p.vx += nx * CONFIG.particleAccel;
    p.vy += ny * CONFIG.particleAccel;

    if (p.target) {
      const dx = p.target.x - p.x;
      const dy = p.target.y - p.y;
      p.vx += dx * CONFIG.textAttraction * doxaFactor;
      p.vy += dy * CONFIG.textAttraction * doxaFactor;
    }

    if (mouse.active) {
      const dx = p.x - mouse.sx;
      const dy = p.y - mouse.sy;
      const d2 = dx*dx + dy*dy;
      if (d2 < r2 && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const f = (1 - d/CONFIG.mouseRadius) * CONFIG.mouseForce;
        p.vx += (dx/d)*f;
        p.vy += (dy/d)*f;
      }
    }

    p.vx *= CONFIG.damping;
    p.vy *= CONFIG.damping;
    p.x  += p.vx;
    p.y  += p.vy;

    if (p.x < -10) p.x = W+10;
    if (p.x > W+10) p.x = -10;
    if (p.y < -10) p.y = H+10;
    if (p.y > H+10) p.y = -10;

    if (p.target) {
      p.colorT += (0.25 - p.colorT) * 0.003;
    }
  }

  updateGrid();
}
