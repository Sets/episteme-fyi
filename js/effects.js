// ══════════════════════════════════════════════════════════
// VISUAL EFFECTS
// ══════════════════════════════════════════════════════════

import { CONFIG, GRID_SIZE, WARP_MAX } from './config.js';
import { state } from './state.js';
import { lerpColor } from './utils.js';
import { updateGrid } from './particles.js';

// ═══ WARP STREAKS ═══

function createWarpStreak() {
  const { W, H } = state;
  const dir = Math.random() > 0.5 ? 1 : -1;
  const bandH = H * 0.10;
  return {
    x:     dir>0 ? -(50+Math.random()*180) : W+50+Math.random()*180,
    y:     H/2+(Math.random()-0.5)*bandH,
    speed: (3+Math.random()*9)*dir,
    len:   35+Math.random()*140,
    alpha: 0.04+Math.random()*0.18,
    colorT: 0.5+Math.random()*0.5,   // lean violet
    width: 0.2+Math.random()*0.6,
  };
}

export function updateWarpStreaks() {
  const { W } = state;
  if (Math.random() < 0.09 && state.warpStreaks.length < WARP_MAX) {
    state.warpStreaks.push(createWarpStreak());
  }
  for (let i = state.warpStreaks.length-1; i >= 0; i--) {
    const s = state.warpStreaks[i];
    s.x += s.speed;
    if ((s.speed>0&&s.x>W+300)||(s.speed<0&&s.x<-300)) {
      state.warpStreaks.splice(i,1);
    }
  }
}

export function drawWarpStreaks() {
  const { ctx } = state;
  for (const s of state.warpStreaks) {
    const c = lerpColor(s.colorT);
    const tailX = s.x-s.len*Math.sign(s.speed);
    const grad = ctx.createLinearGradient(tailX,s.y,s.x,s.y);
    grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0)`);
    grad.addColorStop(0.7,`rgba(${c.r},${c.g},${c.b},${s.alpha*0.4})`);
    grad.addColorStop(1,  `rgba(${c.r},${c.g},${c.b},${s.alpha})`);
    ctx.strokeStyle=grad; ctx.lineWidth=s.width;
    ctx.beginPath(); ctx.moveTo(tailX,s.y); ctx.lineTo(s.x,s.y); ctx.stroke();
  }
}

// ═══ CONNECTIONS ═══

export function drawConnections() {
  const { ctx, particles, grid } = state;
  let count = 0;
  const dist2 = CONFIG.connectionDist * CONFIG.connectionDist;

  for (const p of particles) {
    if (count >= CONFIG.maxConnections) break;
    const gx=(p.x/GRID_SIZE)|0, gy=(p.y/GRID_SIZE)|0;
    for (let dx=-1; dx<=1; dx++) {
      for (let dy=-1; dy<=1; dy++) {
        const cell = grid[(gx+dx)+':'+(gy+dy)];
        if (!cell) continue;
        for (const q of cell) {
          if (q.idx <= p.idx) continue;
          const ex=p.x-q.x, ey=p.y-q.y;
          const d2=ex*ex+ey*ey;
          if (d2 < dist2) {
            const str = 1-Math.sqrt(d2)/CONFIG.connectionDist;
            const c = lerpColor((p.colorT+q.colorT)*0.5);
            ctx.strokeStyle=`rgba(${c.r},${c.g},${c.b},${str*0.12})`;
            ctx.lineWidth=0.5;
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
            count++;
          }
        }
      }
    }
  }
}
