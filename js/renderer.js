// ══════════════════════════════════════════════════════════
// RENDERER
// ══════════════════════════════════════════════════════════

import { CONFIG, isMobile } from './config.js';
import { state } from './state.js';
import { lerpColor } from './utils.js';
import { drawConnections, updateWarpStreaks, drawWarpStreaks } from './effects.js';
import { drawStars } from './stars.js';

// ═══ CUSTOM CURSOR ═══

function drawCursor() {
  if (state.mouse.sx < 0 || !state.booted || isMobile) return;
  const { ctx } = state;
  const x=state.mouse.sx, y=state.mouse.sy;
  const sz=12;
  ctx.strokeStyle='rgba(212,168,83,0.4)';
  ctx.lineWidth=0.7;
  ctx.beginPath();
  ctx.moveTo(x-sz,y); ctx.lineTo(x-4,y);
  ctx.moveTo(x+4,y);  ctx.lineTo(x+sz,y);
  ctx.moveTo(x,y-sz); ctx.lineTo(x,y-4);
  ctx.moveTo(x,y+4);  ctx.lineTo(x,y+sz);
  ctx.stroke();
  ctx.fillStyle='rgba(200,184,232,0.75)';
  ctx.beginPath();
  ctx.arc(x,y,1.4,0,Math.PI*2);
  ctx.fill();
}

// ═══ MAIN RENDER ═══

export function render(time) {
  const { ctx, W, H, particles } = state;

  ctx.fillStyle=`rgba(7,6,10,${CONFIG.trailAlpha})`;
  ctx.fillRect(0,0,W,H);

  drawStars(time);
  drawConnections();
  updateWarpStreaks();
  drawWarpStreaks();

  for (const p of particles) {
    const c = lerpColor(p.colorT);
    const bright = p.target ? 0.82 : 0.60;

    if (p.target) {
      ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},0.10)`;
      ctx.fillRect(p.x-3,p.y-3,6,6);
    }
    const sz=p.size;
    ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},${bright})`;
    ctx.fillRect(p.x-sz/2,p.y-sz/2,sz,sz);
  }

  drawCursor();
}
