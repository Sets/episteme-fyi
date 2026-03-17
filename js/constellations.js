// ══════════════════════════════════════════════════════════
// CONSTELLATION OVERLAY — Interactive knowledge graphs
// ══════════════════════════════════════════════════════════

import { state } from './state.js';

// ═══ CONSTELLATION DEFINITIONS ═══

export const CONSTELLATIONS = [
  {
    id: 'daas',
    nodes: [
      { label: 'data brokers\nhide the source',  angle: 0,    dist: 0.28 },
      { label: 'clickbait\ndatasets',             angle: 52,   dist: 0.22 },
      { label: 'stale data,\nfresh price tag',    angle: 108,  dist: 0.26 },
      { label: 'opaque\npricing',                 angle: 165,  dist: 0.20 },
      { label: 'no\nprovenance',                  angle: 220,  dist: 0.25 },
      { label: 'pay more,\nget less',             angle: 278,  dist: 0.22 },
      { label: 'coverage\ngaps hidden',           angle: 325,  dist: 0.24 },
    ],
  },
  {
    id: 'ecommerce',
    nodes: [
      { label: 'commission\nis mandatory?',       angle: 18,   dist: 0.27 },
      { label: 'your data,\ntheir profit',        angle: 72,   dist: 0.22 },
      { label: 'platform\nlock-in',               angle: 130,  dist: 0.25 },
      { label: 'fake\nscarcity',                  angle: 190,  dist: 0.20 },
      { label: 'hidden\nfees',                    angle: 248,  dist: 0.24 },
      { label: 'marketplace\nbias',               angle: 305,  dist: 0.22 },
    ],
  },
];

// ═══ ACTIVE CONSTELLATION STATE ═══

export const constellationState = {
  active: null,       // { def, starX, starY, progress, fading }
  hoverStar: null,
};

// ═══ SHOW / HIDE ═══

export function showConstellation(def, starX, starY) {
  if (constellationState.active?.def.id === def.id) return;
  constellationState.active = {
    def, starX, starY,
    progress: 0,
    fading: false,
    startTime: performance.now(),
  };
}

export function hideConstellation() {
  if (constellationState.active) {
    constellationState.active.fading = true;
    constellationState.active.fadeStart = performance.now();
  }
}

// ═══ DRAW ═══

export function drawConstellation(time) {
  const a = constellationState.active;
  if (!a) return;

  const { ctx, W, H } = state;
  const elapsed = time - a.startTime;

  // Progress animation (0 → 1 over 1200ms)
  if (!a.fading) {
    a.progress = Math.min(1, elapsed / 1200);
  }

  // Fade out
  let alpha = 1;
  if (a.fading) {
    const fadeElapsed = time - a.fadeStart;
    alpha = Math.max(0, 1 - fadeElapsed / 600);
    if (alpha <= 0) { constellationState.active = null; return; }
  }

  const cx = a.starX;
  const cy = a.starY;
  const radius = Math.min(W, H) * 0.32;

  // Compute node positions
  const nodes = a.def.nodes.map(n => {
    const rad = (n.angle * Math.PI) / 180;
    return {
      x: cx + Math.cos(rad) * radius * n.dist * 2.8,
      y: cy + Math.sin(rad) * radius * n.dist * 2.8,
      label: n.label,
      revealAt: n.angle / 360,  // stagger by angle
    };
  });

  ctx.save();
  ctx.globalAlpha = alpha;

  // ── Center emblem ──
  const emblemProgress = Math.min(1, a.progress * 3);
  if (emblemProgress > 0) {
    const er = 36 * emblemProgress;

    // Outer ring
    ctx.strokeStyle = `rgba(212,168,83,${0.55 * emblemProgress})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy, er, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.strokeStyle = `rgba(200,184,232,${0.3 * emblemProgress})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, er * 0.55, 0, Math.PI * 2);
    ctx.stroke();

    // Cross ticks
    ctx.strokeStyle = `rgba(212,168,83,${0.4 * emblemProgress})`;
    ctx.lineWidth = 0.6;
    const tickLen = er * 0.32;
    [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dx,dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + dx*(er+2), cy + dy*(er+2));
      ctx.lineTo(cx + dx*(er+tickLen), cy + dy*(er+tickLen));
      ctx.stroke();
    });

    // Epsilon ε
    ctx.fillStyle = `rgba(212,168,83,${0.9 * emblemProgress})`;
    ctx.font = `${Math.round(er * 0.9)}px 'Space Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ε', cx, cy + 1);
  }

  // ── Nodes + connections ──
  nodes.forEach((node, i) => {
    const nodeProgress = Math.max(0, Math.min(1,
      (a.progress - node.revealAt * 0.6) / 0.5
    ));
    if (nodeProgress <= 0) return;

    // Interpolate node position from center outward
    const nx = cx + (node.x - cx) * nodeProgress;
    const ny = cy + (node.y - cy) * nodeProgress;

    // Connection line
    ctx.strokeStyle = `rgba(200,184,232,${0.18 * nodeProgress})`;
    ctx.lineWidth = 0.6;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    ctx.setLineDash([]);

    // Node dot
    ctx.fillStyle = `rgba(212,168,83,${0.7 * nodeProgress})`;
    ctx.beginPath();
    ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Node glow
    ctx.fillStyle = `rgba(212,168,83,${0.08 * nodeProgress})`;
    ctx.beginPath();
    ctx.arc(nx, ny, 8, 0, Math.PI * 2);
    ctx.fill();

    // Label
    if (nodeProgress > 0.5) {
      const labelAlpha = (nodeProgress - 0.5) * 2;
      const lines = node.label.split('\n');
      ctx.fillStyle = `rgba(200,184,232,${0.75 * labelAlpha})`;
      ctx.font = `9px 'Space Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Position label away from center
      const angle = Math.atan2(node.y - cy, node.x - cx);
      const lx = nx + Math.cos(angle) * 28;
      const ly = ny + Math.sin(angle) * 18;

      lines.forEach((line, li) => {
        ctx.fillText(line, lx, ly + (li - (lines.length-1)*0.5) * 12);
      });
    }
  });

  // ── Constellation title ──
  if (a.progress > 0.7) {
    const titleAlpha = (a.progress - 0.7) / 0.3;
    ctx.fillStyle = `rgba(212,168,83,${0.35 * titleAlpha})`;
    ctx.font = `700 10px 'Space Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const title = a.def.id === 'daas' ? 'DATA-AS-A-SERVICE' : 'E-COMMERCE';
    ctx.letterSpacing = '4px';
    ctx.fillText(title, cx, cy - 70);
  }

  ctx.restore();
}
