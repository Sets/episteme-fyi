// ══════════════════════════════════════════════════════════
// STARFIELD
// ══════════════════════════════════════════════════════════

import { isMobile } from './config.js';
import { state } from './state.js';

const STAR_COUNT = isMobile ? 130 : 300;
const stars = [];

export function initStars() {
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i++) {
    const roll = Math.random();
    const tier = roll < 0.70 ? 0 : roll < 0.92 ? 1 : roll < 0.98 ? 2 : 3;
    const size      = [0.4+Math.random()*0.5, 0.7+Math.random()*0.7, 1.1+Math.random()*0.9, 1.8+Math.random()*1.1][tier];
    const baseAlpha = [0.06+Math.random()*0.12, 0.16+Math.random()*0.18, 0.28+Math.random()*0.22, 0.45+Math.random()*0.28][tier];

    // Cooler, more violet star colors for episteme
    const cr = Math.random();
    let r, g, b;
    if (cr < 0.20) {
      r = 170+Math.floor(Math.random()*40);
      g = 180+Math.floor(Math.random()*40);
      b = 220+Math.floor(Math.random()*35);
    } else if (cr < 0.35) {
      r = 210+Math.floor(Math.random()*35);
      g = 185+Math.floor(Math.random()*35);
      b = 155+Math.floor(Math.random()*35);
    } else {
      r = 190+Math.floor(Math.random()*55);
      g = 185+Math.floor(Math.random()*50);
      b = 200+Math.floor(Math.random()*50);
    }

    stars.push({
      x: Math.random(), y: Math.random(),
      size, baseAlpha,
      twinkleSpeed: tier <= 1 ? 0.3+Math.random()*1.2 : 0.7+Math.random()*2.8,
      twinklePhase: Math.random()*Math.PI*2,
      twinkleDepth: 0.25+Math.random()*0.55,
      r, g, b, tier,
    });
  }
}

export function drawStars(time) {
  const { ctx, W, H } = state;
  const t = time * 0.001;
  for (const s of stars) {
    const wave  = Math.sin(t*s.twinkleSpeed+s.twinklePhase);
    const wave2 = Math.sin(t*s.twinkleSpeed*2.37+s.twinklePhase*1.7)*0.3;
    const alpha = s.baseAlpha * (1 + (wave+wave2)*0.5 * s.twinkleDepth);
    if (alpha < 0.01) continue;
    const px=s.x*W, py=s.y*H, sz=s.size;
    if (s.tier >= 2 && alpha > 0.25) {
      const gs=sz*3;
      ctx.fillStyle=`rgba(${s.r},${s.g},${s.b},${alpha*0.07})`;
      ctx.fillRect(px-gs/2,py-gs/2,gs,gs);
    }
    ctx.fillStyle=`rgba(${s.r},${s.g},${s.b},${Math.min(alpha,0.82)})`;
    ctx.fillRect(px-sz/2,py-sz/2,sz,sz);
  }
}
