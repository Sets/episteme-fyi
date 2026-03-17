// ══════════════════════════════════════════════════════════
// STARFIELD + INTERACTIVE STARS
// ══════════════════════════════════════════════════════════

import { isMobile } from './config.js';
import { state } from './state.js';
import { CONSTELLATIONS, constellationState, showConstellation, hideConstellation } from './constellations.js';

const STAR_COUNT = isMobile ? 130 : 300;
export const stars = [];

// Two designated "interactive" stars — one per constellation
const INTERACTIVE = [
  {
    constellationId: 'daas',
    relX: 0.28, relY: 0.20,      // top-left-center
    starName: 'Sirius',
    starCoords: 'α CMa · −16.716°',
  },
  {
    constellationId: 'ecommerce',
    relX: 0.72, relY: 0.20,      // top-right-center
    starName: 'Algol',
    starCoords: 'β Per · +40.956°',
  },
  {
    constellationId: 'alternet',
    relX: 0.50, relY: 0.80,      // bottom-center
    starName: 'Antares',
    starCoords: 'α Sco · −26.432°',
    starSubtitle: 'agentic communications',
  },
];

export function initStars() {
  stars.length = 0;

  // Regular stars
  for (let i = 0; i < STAR_COUNT; i++) {
    const roll = Math.random();
    const tier = roll < 0.70 ? 0 : roll < 0.92 ? 1 : roll < 0.98 ? 2 : 3;
    const size      = [0.4+Math.random()*0.5, 0.7+Math.random()*0.7, 1.1+Math.random()*0.9, 1.8+Math.random()*1.1][tier];
    const baseAlpha = [0.06+Math.random()*0.12, 0.16+Math.random()*0.18, 0.28+Math.random()*0.22, 0.45+Math.random()*0.28][tier];
    const cr = Math.random();
    let r, g, b;
    if (cr < 0.20)      { r=170+Math.floor(Math.random()*40); g=180+Math.floor(Math.random()*40); b=220+Math.floor(Math.random()*35); }
    else if (cr < 0.35) { r=210+Math.floor(Math.random()*35); g=185+Math.floor(Math.random()*35); b=155+Math.floor(Math.random()*35); }
    else                { r=190+Math.floor(Math.random()*55); g=185+Math.floor(Math.random()*50); b=200+Math.floor(Math.random()*50); }
    stars.push({
      x: Math.random(), y: Math.random(),
      size, baseAlpha,
      twinkleSpeed: tier<=1 ? 0.3+Math.random()*1.2 : 0.7+Math.random()*2.8,
      twinklePhase: Math.random()*Math.PI*2,
      twinkleDepth: 0.25+Math.random()*0.55,
      r, g, b, tier,
      interactive: false,
    });
  }

  // Interactive constellation stars — always tier 3, prominent
  INTERACTIVE.forEach((interactiveDef) => {
    const { constellationId, relX, relY } = interactiveDef;
    const def = CONSTELLATIONS.find(c => c.id === constellationId);
    stars.push({
      x: relX, y: relY,
      size: 2.8,
      baseAlpha: 0.75,
      twinkleSpeed: 1.2,
      twinklePhase: Math.random()*Math.PI*2,
      twinkleDepth: 0.35,
      r: 240, g: 210, b: 130,   // warm gold
      tier: 3,
      interactive: true,
      constellationDef: def,
      hovered: false,
      pulsePhase: Math.random()*Math.PI*2,
      starName: interactiveDef.starName,
      starCoords: interactiveDef.starCoords,
      nameOffset: interactiveDef.nameOffset,
      starSubtitle: interactiveDef.starSubtitle || null,
    });
  });
}

export function drawStars(time) {
  const { ctx, W, H } = state;
  const t = time * 0.001;

  for (const s of stars) {
    const wave  = Math.sin(t*s.twinkleSpeed+s.twinklePhase);
    const wave2 = Math.sin(t*s.twinkleSpeed*2.37+s.twinklePhase*1.7)*0.3;
    let alpha = s.baseAlpha * (1 + (wave+wave2)*0.5 * s.twinkleDepth);

    const px = s.x*W, py = s.y*H;

    if (s.interactive) {
      // Pulsing halo for interactive stars
      const pulse = 0.5 + 0.5*Math.sin(t*2.2+s.pulsePhase);
      const haloR = (s.hovered ? 22 : 14) + pulse*5;
      const haloA = (s.hovered ? 0.18 : 0.07) + pulse*0.06;

      ctx.fillStyle=`rgba(200,195,240,${haloA})`;
      ctx.beginPath(); ctx.arc(px,py,haloR,0,Math.PI*2); ctx.fill();

      // Outer ring hint
      ctx.strokeStyle=`rgba(200,195,240,${haloA*0.6})`;
      ctx.lineWidth=0.6;
      ctx.beginPath(); ctx.arc(px,py,haloR*1.6,0,Math.PI*2); ctx.stroke();

      alpha = s.hovered ? 1.0 : alpha;
    } else {
      if (s.tier>=2 && alpha>0.25) {
        ctx.fillStyle=`rgba(${s.r},${s.g},${s.b},${alpha*0.07})`;
        ctx.fillRect(px-s.size*1.5,py-s.size*1.5,s.size*3,s.size*3);
      }
    }

    const sz = s.size;
    ctx.fillStyle=`rgba(${s.r},${s.g},${s.b},${Math.min(alpha,0.92)})`;
    ctx.fillRect(px-sz/2,py-sz/2,sz,sz);

    // Star name + coordinates — always visible, clear of halo
    if (s.starName) {
      const la = s.hovered ? 0.92 : 0.52;
      ctx.textAlign = 'center';

      // Name — serif italic, starlight white
      ctx.font = `italic 12px 'Cormorant Garamond', Georgia, serif`;
      ctx.textBaseline = 'top';
      ctx.fillStyle = `rgba(232,228,248,${la})`;
      ctx.fillText(s.starName, px, py + 22);   // pushed below halo

      // Coordinates — tiny mono, violet-dim
      ctx.font = `7px 'Space Mono', monospace`;
      ctx.fillStyle = `rgba(180,172,212,${la * 0.70})`;
      ctx.fillText(s.starCoords, px, py + 36);
    }
  }
}

// ═══ HOVER HIT TEST ═══

const HOVER_RADIUS = 28;

export function checkStarHover(mx, my) {
  const { W, H } = state;
  let found = null;

  for (const s of stars) {
    if (!s.interactive) continue;
    const px=s.x*W, py=s.y*H;
    const d2=(mx-px)**2+(my-py)**2;
    if (d2 < HOVER_RADIUS**2) { found=s; break; }
  }

  for (const s of stars) {
    if (!s.interactive) continue;
    const wasHovered = s.hovered;
    s.hovered = (s === found);
    if (wasHovered && !s.hovered) hideConstellation();
  }

  if (found && !constellationState.active) {
    const px=found.x*W, py=found.y*H;
    showConstellation(found.constellationDef, px, py);
  }
}
