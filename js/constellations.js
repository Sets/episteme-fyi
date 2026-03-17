// ══════════════════════════════════════════════════════════
// CONSTELLATION OVERLAY — Interactive knowledge graphs
// ══════════════════════════════════════════════════════════

import { state } from './state.js';

// ═══ CONSTELLATION DEFINITIONS ═══

export const CONSTELLATIONS = [
  {
    id: 'daas',
    title: 'DATA-AS-A-SERVICE',
    nodes: [
      { label: ['data brokers', 'hide the source'],  angle: 0,    dist: 0.28 },
      { label: ['clickbait', 'datasets'],            angle: 52,   dist: 0.22 },
      { label: ['stale data,', 'fresh price tag'],   angle: 108,  dist: 0.26 },
      { label: ['opaque', 'pricing'],                angle: 165,  dist: 0.20 },
      { label: ['no', 'provenance'],                 angle: 220,  dist: 0.25 },
      { label: ['pay more,', 'get less'],            angle: 278,  dist: 0.22 },
      { label: ['coverage', 'gaps hidden'],          angle: 325,  dist: 0.24 },
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-COMMERCE',
    nodes: [
      { label: ['commission', 'is mandatory?'],      angle: 18,   dist: 0.27 },
      { label: ['your data,', 'their profit'],       angle: 72,   dist: 0.22 },
      { label: ['platform', 'lock-in'],              angle: 130,  dist: 0.25 },
      { label: ['fake', 'scarcity'],                 angle: 190,  dist: 0.20 },
      { label: ['hidden', 'fees'],                   angle: 248,  dist: 0.24 },
      { label: ['marketplace', 'bias'],              angle: 305,  dist: 0.22 },
    ],
  },
  {
    id: 'manifesto',
    title: 'EPISTEME',
    manifesto: true,   // special render mode
    nodes: [
      { label: ['truth over', 'narrative'],          angle: 0,    dist: 0.26 },
      { label: ['facts only,', 'no spin'],           angle: 45,   dist: 0.22 },
      { label: ['provenance', 'always visible'],     angle: 90,   dist: 0.25 },
      { label: ['no hidden', 'agendas'],             angle: 135,  dist: 0.22 },
      { label: ['data speaks', 'for itself'],        angle: 180,  dist: 0.26 },
      { label: ['manipulation', 'is the enemy'],     angle: 225,  dist: 0.22 },
      { label: ['radical', 'transparency'],          angle: 270,  dist: 0.25 },
      { label: ['knowledge,', 'unveiled'],           angle: 315,  dist: 0.22 },
    ],
  },
];

// ═══ BOX DIMENSIONS ═══
const BOX_W  = 108;
const BOX_H  = 38;
const MARGIN = 14;

// ═══ ACTIVE STATE ═══

export const constellationState = {
  active: null,
};

export function showConstellation(def, cx, cy) {
  if (constellationState.active?.def.id === def.id) return;
  constellationState.active = {
    def, starX: cx, starY: cy,
    progress: 0,
    fading: false,
    startTime: performance.now(),
  };
}

export function hideConstellation() {
  if (constellationState.active) {
    constellationState.active.fading    = true;
    constellationState.active.fadeStart = performance.now();
  }
}

// ═══ HELPERS ═══

function clampBox(cx, cy, angle, rawDist) {
  const { W, H } = state;
  const rad    = (angle * Math.PI) / 180;
  const spread = Math.min(W, H) * 0.78;
  let bx = cx + Math.cos(rad) * spread * rawDist;
  let by = cy + Math.sin(rad) * spread * rawDist;
  bx = Math.max(MARGIN + BOX_W/2, Math.min(W - MARGIN - BOX_W/2, bx));
  by = Math.max(MARGIN + BOX_H/2, Math.min(H - MARGIN - BOX_H/2, by));
  return { bx, by };
}

function boxEdgePoint(bx, by, fromX, fromY) {
  const hw = BOX_W/2, hh = BOX_H/2;
  const dx = fromX - bx, dy = fromY - by;
  const absDx = Math.abs(dx), absDy = Math.abs(dy);
  if (absDx === 0 && absDy === 0) return { ex: bx, ey: by };
  const t = absDx * hh > absDy * hw ? hw / absDx : hh / absDy;
  return { ex: bx + dx*t, ey: by + dy*t };
}

// ═══ SHARED BOX DRAW ═══

function drawBox(ctx, animBx, animBy, node, np, isManifesto) {
  const hw = BOX_W/2, hh = BOX_H/2, r = 4;
  const boxAlpha = Math.max(0, (np - 0.25) / 0.75);
  if (boxAlpha <= 0) return;

  // Background
  const bgColor = isManifesto
    ? `rgba(8,6,22,${0.88*boxAlpha})`
    : `rgba(10,8,18,${0.82*boxAlpha})`;
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(animBx-hw, animBy-hh, BOX_W, BOX_H, r);
  ctx.fill();

  // Gold border
  const borderColor = isManifesto
    ? `rgba(200,184,232,${0.35*boxAlpha})`
    : `rgba(212,168,83,${0.28*boxAlpha})`;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.roundRect(animBx-hw, animBy-hh, BOX_W, BOX_H, r);
  ctx.stroke();

  // Inner glow
  const glowColor = isManifesto
    ? `rgba(212,168,83,${0.10*boxAlpha})`
    : `rgba(200,184,232,${0.10*boxAlpha})`;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(animBx-hw+2, animBy-hh+2, BOX_W-4, BOX_H-4, r);
  ctx.stroke();

  // Corner accents
  const cSize = 3;
  const cornerColor = isManifesto
    ? `rgba(200,184,232,${0.5*boxAlpha})`
    : `rgba(212,168,83,${0.45*boxAlpha})`;
  ctx.fillStyle = cornerColor;
  [[animBx-hw,animBy-hh],[animBx+hw-cSize,animBy-hh],
   [animBx-hw,animBy+hh-cSize],[animBx+hw-cSize,animBy+hh-cSize]
  ].forEach(([x,y]) => ctx.fillRect(x,y,cSize,cSize));

  // Label text
  const lineH = 11;
  const totalH = node.label.length * lineH;
  const textColor = isManifesto
    ? `rgba(240,220,160,${0.9*boxAlpha})`
    : `rgba(200,184,232,${0.85*boxAlpha})`;
  ctx.fillStyle = textColor;
  ctx.font = `9px 'Space Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  node.label.forEach((line, li) => {
    const ty = animBy - totalH/2 + lineH*0.5 + li*lineH;
    ctx.fillText(line, animBx, ty);
  });
}

// ═══ DRAW MANIFESTO EMBLEM (larger, violet-accented) ═══

function drawManifestoEmblem(ctx, cx, cy, ep) {
  const er = 42 * ep;

  // Outer ring — violet
  ctx.strokeStyle = `rgba(200,184,232,${0.6*ep})`;
  ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.arc(cx, cy, er, 0, Math.PI*2); ctx.stroke();

  // Middle ring — gold
  ctx.strokeStyle = `rgba(212,168,83,${0.4*ep})`;
  ctx.lineWidth = 0.6;
  ctx.beginPath(); ctx.arc(cx, cy, er*0.65, 0, Math.PI*2); ctx.stroke();

  // Inner ring
  ctx.strokeStyle = `rgba(200,184,232,${0.25*ep})`;
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.arc(cx, cy, er*0.38, 0, Math.PI*2); ctx.stroke();

  // Diagonal ticks (45° rotated)
  ctx.strokeStyle = `rgba(200,184,232,${0.45*ep})`;
  ctx.lineWidth = 0.6;
  [0,45,90,135,180,225,270,315].forEach(deg => {
    const rad = deg*Math.PI/180;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(rad)*(er+2), cy + Math.sin(rad)*(er+2));
    ctx.lineTo(cx + Math.cos(rad)*(er+er*0.28), cy + Math.sin(rad)*(er+er*0.28));
    ctx.stroke();
  });

  // ε — gold, larger
  ctx.fillStyle = `rgba(212,168,83,${0.95*ep})`;
  ctx.font = `${Math.round(er*0.95)}px 'Space Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ε', cx, cy+1);
}

// ═══ MAIN DRAW ═══

export function drawConstellation(time) {
  const a = constellationState.active;
  if (!a) return;

  const { ctx, W, H } = state;
  const elapsed = time - a.startTime;

  if (!a.fading) a.progress = Math.min(1, elapsed / 1200);

  let alpha = 1;
  if (a.fading) {
    const fe = time - a.fadeStart;
    alpha = Math.max(0, 1 - fe / 600);
    if (alpha <= 0) { constellationState.active = null; return; }
  }

  const cx = a.starX, cy = a.starY;
  const isManifesto = !!a.def.manifesto;

  const nodes = a.def.nodes.map(n => {
    const { bx, by } = clampBox(cx, cy, n.angle, n.dist);
    return { bx, by, label: n.label, revealAt: n.angle / 360 };
  });

  ctx.save();
  ctx.globalAlpha = alpha;

  // ── Emblem ──
  const ep = Math.min(1, a.progress * 3);
  if (ep > 0) {
    if (isManifesto) {
      drawManifestoEmblem(ctx, cx, cy, ep);
    } else {
      const er = 34 * ep;
      ctx.strokeStyle=`rgba(212,168,83,${0.55*ep})`; ctx.lineWidth=0.8;
      ctx.beginPath(); ctx.arc(cx,cy,er,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle=`rgba(200,184,232,${0.3*ep})`; ctx.lineWidth=0.5;
      ctx.beginPath(); ctx.arc(cx,cy,er*0.55,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle=`rgba(212,168,83,${0.4*ep})`; ctx.lineWidth=0.6;
      [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dx,dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx+dx*(er+2),cy+dy*(er+2));
        ctx.lineTo(cx+dx*(er+er*0.35),cy+dy*(er+er*0.35));
        ctx.stroke();
      });
      ctx.fillStyle=`rgba(212,168,83,${0.9*ep})`;
      ctx.font=`${Math.round(er*0.9)}px 'Space Mono', monospace`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('ε', cx, cy+1);
    }
  }

  // ── Nodes ──
  nodes.forEach(node => {
    const np = Math.max(0, Math.min(1, (a.progress - node.revealAt*0.6) / 0.5));
    if (np <= 0) return;

    const animBx = cx + (node.bx - cx) * np;
    const animBy = cy + (node.by - cy) * np;
    const { ex, ey } = boxEdgePoint(animBx, animBy, cx, cy);

    // Line
    const lineColor = isManifesto
      ? `rgba(212,168,83,${0.20*np})`
      : `rgba(200,184,232,${0.22*np})`;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.7;
    ctx.setLineDash([3, 6]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.setLineDash([]);

    // Dot at edge
    const dotColor = isManifesto
      ? `rgba(200,184,232,${0.7*np})`
      : `rgba(212,168,83,${0.65*np})`;
    ctx.fillStyle = dotColor;
    ctx.beginPath(); ctx.arc(ex, ey, 2.2, 0, Math.PI*2); ctx.fill();

    drawBox(ctx, animBx, animBy, node, np, isManifesto);
  });

  // ── Title ──
  if (a.progress > 0.75) {
    const ta = (a.progress - 0.75) / 0.25;
    ctx.fillStyle = isManifesto
      ? `rgba(200,184,232,${0.35*ta})`
      : `rgba(212,168,83,${0.32*ta})`;
    ctx.font = `700 9px 'Space Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(a.def.title, cx, cy - 54);
  }

  ctx.restore();
}
