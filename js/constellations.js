// ══════════════════════════════════════════════════════════
// CONSTELLATION OVERLAY — Interactive knowledge graphs
// ══════════════════════════════════════════════════════════

import { state } from './state.js';

// ═══ CONSTELLATION DEFINITIONS ═══

export const CONSTELLATIONS = [
  {
    id: 'daas',
    title: 'DATAINT',
    subtitle: 'data-as-a-service',
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
    title: 'DISRUPTIVE COMMERCE',
    subtitle: 'e-commerce platform',
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
    id: 'alternet',
    title: 'ALTERNET',
    subtitle: 'agentic communications',
    nodes: [
      { label: ['ideas are nothing.', 'target · strategy · plan', 'execution — everything.'], angle: 0,   dist: 0.22, hero: true },
      { label: ['consensus kills', 'real inquiry'],               angle: 48,  dist: 0.26 },
      { label: ['first reply wins —', 'not debate'],              angle: 96,  dist: 0.22 },
      { label: ["aligned AI", "can't go there"],                 angle: 144, dist: 0.25 },
      { label: ['ego over', 'epistemics'],                        angle: 192, dist: 0.22 },
      { label: ['academia', 'gatekeeps truth'],                   angle: 240, dist: 0.26 },
      { label: ['3 layers:', 'thought → claim'],                  angle: 288, dist: 0.22 },
      { label: ['blind processing,', 'no hierarchy'],             angle: 336, dist: 0.24 },
    ],
  },
  {
    id: 'infra',
    title: 'DISRUPTIVE INFRASTRUCTURE',
    subtitle: 'intelligence-grade nomadic compute',
    nodes: [
      { label: ['if they can find it,', 'they can kill it.', 'nomadic compute — survive.'], angle: 0,   dist: 0.22, hero: true },
      { label: ['the cloud is', "someone else's cage"],  angle: 45,  dist: 0.26 },
      { label: ['public IPs are', 'painted targets'],     angle: 90,  dist: 0.22 },
      { label: ['user-space lies,', 'kernel dictates'],   angle: 135, dist: 0.25 },
      { label: ['compliance badges', 'hide the breaches'], angle: 180, dist: 0.22 },
      { label: ['static datacenters,', 'sitting ducks'],  angle: 225, dist: 0.26 },
      { label: ['standard protocols,', 'standard exploits'], angle: 270, dist: 0.22 },
      { label: ['assume breach.', 'cage the threat.'],    angle: 315, dist: 0.24 },
    ],
  },
  {
    id: 'manifesto',
    title: 'EPISTEME',
    manifesto: true,
    nodes: [
      { label: ['truth over', 'narrative'],          angle: 0,    dist: 0.26 },
      { label: ['facts only,', 'no spin'],           angle: 45,   dist: 0.22 },
      { label: ['provenance', 'always visible'],     angle: 90,   dist: 0.25 },
      { label: ['no hidden', 'agendas'],             angle: 135,  dist: 0.22 },
      { label: ['data speaks', 'for itself'],        angle: 180,  dist: 0.26 },
      { label: ['manipulation', 'is the enemy'],     angle: 225,  dist: 0.22 },
      { label: ['radical', 'transparency'],          angle: 270,  dist: 0.25 },
      { label: ['knowledge,', 'unveiled'],           angle: 315,  dist: 0.22 },
      { label: ['no marketing', 'bullshit'],         angle: 338,  dist: 0.23 },
    ],
  },
];

// ═══ BOX DIMENSIONS ═══
const BOX_W      = 108;
const BOX_H      = 38;
const HERO_BOX_W = 272;
const HERO_BOX_H = 76;
const MARGIN     = 14;
const BORDER_R   = 4;

// ═══ ACTIVE STATE ═══

export const constellationState = { active: null };

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

function clampBox(cx, cy, angle, rawDist, hero) {
  const { W, H } = state;
  const rad    = (angle * Math.PI) / 180;
  const spread = Math.min(W, H) * 0.78;
  const bw = hero ? HERO_BOX_W : BOX_W;
  const bh = hero ? HERO_BOX_H : BOX_H;
  let bx = cx + Math.cos(rad) * spread * rawDist;
  let by = cy + Math.sin(rad) * spread * rawDist;
  bx = Math.max(MARGIN + bw/2, Math.min(W - MARGIN - bw/2, bx));
  by = Math.max(MARGIN + bh/2, Math.min(H - MARGIN - bh/2, by));
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

// ═══ BORDER LIGHT SWEEP ═══
// Draws a comet-like light orb that travels around the box perimeter

function drawBorderLight(ctx, bx, by, t, isManifesto, boxAlpha, bw, bh) {
  bw = bw || BOX_W; bh = bh || BOX_H;
  const hw = bw/2, hh = bh/2;
  const perimeter = 2 * (bw + bh);

  // Each node gets a slightly different phase offset via bx+by
  const phase   = ((t * 0.55 + (bx + by) * 0.004) % 1 + 1) % 1;
  const pos     = phase * perimeter;

  // Perimeter path: top→right→bottom→left
  // Returns {x, y, tangentAngle} at distance d along the border
  function perimPoint(d) {
    d = ((d % perimeter) + perimeter) % perimeter;
    const top = bw, right = bh, bottom = bw, left = bh;
    let x, y, tx, ty;
    if (d < top) {
      x = bx - hw + d; y = by - hh; tx = 1; ty = 0;
    } else if (d < top + right) {
      x = bx + hw; y = by - hh + (d - top); tx = 0; ty = 1;
    } else if (d < top + right + bottom) {
      x = bx + hw - (d - top - right); y = by + hh; tx = -1; ty = 0;
    } else {
      x = bx - hw; y = by + hh - (d - top - right - bottom); tx = 0; ty = -1;
    }
    return { x, y, tx, ty };
  }

  // ── Comet trail ──
  const trailLen  = 60;
  const trailSegs = 18;
  for (let i = 0; i < trailSegs; i++) {
    const frac = i / trailSegs;
    const { x, y } = perimPoint(pos - frac * trailLen);
    const trailAlpha = (1 - frac) * (isManifesto ? 0.22 : 0.18) * boxAlpha;

    const r = isManifesto ? 200 : 212;
    const g = isManifesto ? 184 : 168;
    const b = isManifesto ? 232 : 83;

    ctx.fillStyle = `rgba(${r},${g},${b},${trailAlpha})`;
    const sz = (1 - frac) * 2.2;
    ctx.fillRect(x - sz/2, y - sz/2, sz, sz);
  }

  // ── Head orb ──
  const { x: hx, y: hy } = perimPoint(pos);
  const orbR = isManifesto ? 200 : 212;
  const orbG = isManifesto ? 184 : 168;
  const orbB = isManifesto ? 232 : 83;
  const orbAlpha = 0.85 * boxAlpha;

  // Outer glow
  const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 7);
  grad.addColorStop(0, `rgba(${orbR},${orbG},${orbB},${orbAlpha * 0.6})`);
  grad.addColorStop(1, `rgba(${orbR},${orbG},${orbB},0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(hx, hy, 7, 0, Math.PI*2);
  ctx.fill();

  // Core dot
  ctx.fillStyle = `rgba(${orbR},${orbG},${orbB},${orbAlpha})`;
  ctx.beginPath();
  ctx.arc(hx, hy, 1.8, 0, Math.PI*2);
  ctx.fill();
}

// ═══ SHARED BOX DRAW ═══

function drawMercuryBackground(ctx, animBx, animBy, hw, hh, r, t, boxAlpha, bw, bh) {
  // Mercury/liquid metal effect — animated shimmer gradient
  const speed    = t * 0.38;
  const waveX    = Math.sin(speed * 1.1 + animBx * 0.02) * 0.4 + 0.5;
  const waveY    = Math.cos(speed * 0.7 + animBy * 0.015) * 0.35 + 0.5;
  const waveX2   = Math.sin(speed * 0.5 + animBx * 0.03 + 1.4) * 0.3 + 0.5;

  // Base fill — very dark violet
  ctx.fillStyle = `rgba(6,4,18,${0.92*boxAlpha})`;
  ctx.beginPath();
  ctx.roundRect(animBx-hw, animBy-hh, bw, bh, r);
  ctx.fill();

  // Shimmer blob 1 — slow drift
  const g1 = ctx.createRadialGradient(
    animBx - hw + waveX * bw,  animBy - hh + waveY * bh,  0,
    animBx - hw + waveX * bw,  animBy - hh + waveY * bh,  bw * 0.55
  );
  g1.addColorStop(0,   `rgba(60,45,140,${0.42*boxAlpha})`);
  g1.addColorStop(0.5, `rgba(40,20,90,${0.18*boxAlpha})`);
  g1.addColorStop(1,   `rgba(0,0,0,0)`);
  ctx.fillStyle = g1;
  ctx.beginPath();
  ctx.roundRect(animBx-hw, animBy-hh, bw, bh, r);
  ctx.fill();

  // Shimmer blob 2 — faster, cooler
  const g2 = ctx.createRadialGradient(
    animBx - hw + waveX2 * bw, animBy + hh * 0.3, 0,
    animBx - hw + waveX2 * bw, animBy + hh * 0.3, bw * 0.45
  );
  g2.addColorStop(0,   `rgba(120,105,200,${0.26*boxAlpha})`);
  g2.addColorStop(0.6, `rgba(60,40,120,${0.10*boxAlpha})`);
  g2.addColorStop(1,   `rgba(0,0,0,0)`);
  ctx.fillStyle = g2;
  ctx.beginPath();
  ctx.roundRect(animBx-hw, animBy-hh, bw, bh, r);
  ctx.fill();

  // Surface sheen — thin bright line that slides across
  const sheenX = ((speed * 0.22) % 1.6) - 0.3;
  const sx1 = animBx - hw + sheenX * (bw + 20) - 10;
  const sx2 = sx1 + 18;
  const sheenGrad = ctx.createLinearGradient(sx1, animBy-hh, sx2, animBy+hh);
  sheenGrad.addColorStop(0,   `rgba(200,180,255,0)`);
  sheenGrad.addColorStop(0.4, `rgba(200,180,255,${0.12*boxAlpha})`);
  sheenGrad.addColorStop(0.6, `rgba(220,210,255,${0.18*boxAlpha})`);
  sheenGrad.addColorStop(1,   `rgba(200,180,255,0)`);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(animBx-hw, animBy-hh, bw, bh, r);
  ctx.clip();
  ctx.fillStyle = sheenGrad;
  ctx.fillRect(sx1, animBy-hh, sx2-sx1, bh);
  ctx.restore();
}

function drawBox(ctx, animBx, animBy, node, np, isManifesto, globalTime, hero) {
  const bw = hero ? HERO_BOX_W : BOX_W;
  const bh = hero ? HERO_BOX_H : BOX_H;
  const hw = bw/2, hh = bh/2, r = BORDER_R;
  const boxAlpha = Math.max(0, (np - 0.25) / 0.75);
  if (boxAlpha <= 0) return;

  const t = globalTime * 0.001;

  // Background — hero and manifesto get mercury, others solid dark
  if (isManifesto || hero) {
    drawMercuryBackground(ctx, animBx, animBy, hw, hh, r, t, boxAlpha, bw, bh);
  } else {
    ctx.fillStyle = `rgba(8,7,16,${0.85*boxAlpha})`;
    ctx.beginPath();
    ctx.roundRect(animBx-hw, animBy-hh, bw, bh, r);
    ctx.fill();
  }

  // Base border (dim)
  ctx.strokeStyle = isManifesto
    ? `rgba(200,192,235,${0.28*boxAlpha})`
    : `rgba(180,172,220,${0.22*boxAlpha})`;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.roundRect(animBx-hw, animBy-hh, bw, bh, r);
  ctx.stroke();

  // Inner glow
  ctx.strokeStyle = isManifesto
    ? `rgba(212,168,83,${0.08*boxAlpha})`
    : `rgba(200,184,232,${0.08*boxAlpha})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(animBx-hw+2, animBy-hh+2, bw-4, bh-4, r);
  ctx.stroke();

  // Corner accents
  const cSize = hero ? 4 : 3;
  ctx.fillStyle = `rgba(210,205,240,${0.45*boxAlpha})`;
  [[animBx-hw,animBy-hh],[animBx+hw-cSize,animBy-hh],
   [animBx-hw,animBy+hh-cSize],[animBx+hw-cSize,animBy+hh-cSize]
  ].forEach(([x,y]) => ctx.fillRect(x,y,cSize,cSize));

  // ── Border light sweep (only when fully visible) ──
  if (boxAlpha > 0.4) {
    drawBorderLight(ctx, animBx, animBy, t, isManifesto, boxAlpha, bw, bh);
  }

  // Label text
  const lineH = hero ? 13 : 11;
  const fontSize = hero ? '10px' : '9px';
  const totalH = node.label.length * lineH;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  node.label.forEach((line, li) => {
    const isFirstLine = li === 0 && hero;
    ctx.font = isFirstLine
      ? `700 11px 'Space Mono', monospace`
      : `${fontSize} 'Space Mono', monospace`;
    ctx.fillStyle = isFirstLine
      ? `rgba(244,242,255,${0.98*boxAlpha})`
      : isManifesto
        ? `rgba(232,228,244,${0.92*boxAlpha})`
        : `rgba(220,216,240,${0.90*boxAlpha})`;
    ctx.fillText(line, animBx, animBy - totalH/2 + lineH*0.5 + li*lineH);
  });

}

// ═══ MANIFESTO EMBLEM ═══

function drawManifestoEmblem(ctx, cx, cy, ep) {
  const er = 42*ep;
  ctx.strokeStyle=`rgba(210,205,240,${0.65*ep})`; ctx.lineWidth=0.9;
  ctx.beginPath(); ctx.arc(cx,cy,er,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle=`rgba(190,185,225,${0.35*ep})`; ctx.lineWidth=0.6;
  ctx.beginPath(); ctx.arc(cx,cy,er*0.65,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle=`rgba(210,205,240,${0.20*ep})`; ctx.lineWidth=0.5;
  ctx.beginPath(); ctx.arc(cx,cy,er*0.38,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle=`rgba(210,205,240,${0.40*ep})`; ctx.lineWidth=0.6;
  [0,45,90,135,180,225,270,315].forEach(deg => {
    const rad=deg*Math.PI/180;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(rad)*(er+2), cy+Math.sin(rad)*(er+2));
    ctx.lineTo(cx+Math.cos(rad)*(er+er*0.28), cy+Math.sin(rad)*(er+er*0.28));
    ctx.stroke();
  });
  ctx.fillStyle=`rgba(232,228,248,${0.95*ep})`;
  ctx.font=`${Math.round(er*0.95)}px 'Space Mono', monospace`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('ε',cx,cy+1);
}

function drawDefaultEmblem(ctx, cx, cy, ep) {
  const er=34*ep;
  ctx.strokeStyle=`rgba(210,205,240,${0.55*ep})`; ctx.lineWidth=0.8;
  ctx.beginPath(); ctx.arc(cx,cy,er,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle=`rgba(190,185,225,${0.3*ep})`; ctx.lineWidth=0.5;
  ctx.beginPath(); ctx.arc(cx,cy,er*0.55,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle=`rgba(210,205,240,${0.4*ep})`; ctx.lineWidth=0.6;
  [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dx,dy]) => {
    ctx.beginPath();
    ctx.moveTo(cx+dx*(er+2),cy+dy*(er+2));
    ctx.lineTo(cx+dx*(er+er*0.35),cy+dy*(er+er*0.35));
    ctx.stroke();
  });
  ctx.fillStyle=`rgba(232,228,248,${0.92*ep})`;
  ctx.font=`${Math.round(er*0.9)}px 'Space Mono', monospace`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('ε',cx,cy+1);
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
    const { bx, by } = clampBox(cx, cy, n.angle, n.dist, !!n.hero);
    return { bx, by, label: n.label, revealAt: n.angle / 360, hero: !!n.hero };
  });

  ctx.save();
  ctx.globalAlpha = alpha;

  // ── Emblem ──
  const ep = Math.min(1, a.progress * 3);
  if (ep > 0) {
    isManifesto
      ? drawManifestoEmblem(ctx, cx, cy, ep)
      : drawDefaultEmblem(ctx, cx, cy, ep);
  }

  // ── Nodes ──
  nodes.forEach(node => {
    const np = Math.max(0, Math.min(1, (a.progress - node.revealAt*0.6) / 0.5));
    if (np <= 0) return;

    const animBx = cx + (node.bx - cx) * np;
    const animBy = cy + (node.by - cy) * np;
    const { ex, ey } = boxEdgePoint(animBx, animBy, cx, cy);

    // Line
    ctx.strokeStyle = `rgba(190,185,225,${0.20*np})`;
    ctx.lineWidth = 0.7;
    ctx.setLineDash([3, 6]);
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(ex,ey); ctx.stroke();
    ctx.setLineDash([]);

    // Dot
    ctx.fillStyle = `rgba(220,215,245,${0.65*np})`;
    ctx.beginPath(); ctx.arc(ex,ey,2.2,0,Math.PI*2); ctx.fill();

    drawBox(ctx, animBx, animBy, node, np, isManifesto, time, node.hero);
  });

  // ── Title + subtitle ──
  if (a.progress > 0.75) {
    const ta = (a.progress - 0.75) / 0.25;
    ctx.textAlign = 'center';

    ctx.fillStyle = `rgba(200,196,228,${0.38*ta})`;
    ctx.font = `700 9px 'Space Mono', monospace`;
    ctx.textBaseline = 'bottom';
    ctx.fillText(a.def.title, cx, cy - 54);

    if (a.def.subtitle) {
      ctx.fillStyle = `rgba(180,174,220,${0.28*ta})`;
      ctx.font = `7px 'Space Mono', monospace`;
      ctx.fillText(a.def.subtitle.toUpperCase(), cx, cy - 42);
    }
  }

  ctx.restore();
}
