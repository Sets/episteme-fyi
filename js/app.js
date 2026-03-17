// ══════════════════════════════════════════════════════════
// EPISTEME.FYI — Entry Point
// ══════════════════════════════════════════════════════════

import { state } from './state.js';
import { setupCanvas } from './canvas.js';
import { generateTextTargets, initParticles, updateParticles } from './particles.js';
import { render } from './renderer.js';
import { setupInput, startHintTimer, setupTaglineHover } from './interaction.js';
import { bootSequence } from './boot.js';
import { initStars } from './stars.js';

// ═══ RESIZE ═══

let resizeTimer;
function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    state.W   = window.innerWidth;
    state.H   = window.innerHeight;
    state.dpr = window.devicePixelRatio || 1;
    state.canvas.width  = state.W * state.dpr;
    state.canvas.height = state.H * state.dpr;
    state.canvas.style.width  = state.W + 'px';
    state.canvas.style.height = state.H + 'px';
    state.ctx.setTransform(1,0,0,1,0,0);
    state.ctx.scale(state.dpr, state.dpr);

    state.textTargets = generateTextTargets('ε');
    for (let i = 0; i < state.particles.length; i++) {
      state.particles[i].target = i < state.textTargets.length ? state.textTargets[i] : null;
    }
  }, 250);
}

// ═══ ANIMATION LOOP ═══

function animate(time) {
  const { mouse } = state;
  mouse.sx += (mouse.x - mouse.sx) * 0.12;
  mouse.sy += (mouse.y - mouse.sy) * 0.12;
  updateParticles(time);
  render(time);
  requestAnimationFrame(animate);
}

// ═══ INIT ═══

async function init() {
  setupCanvas();
  await document.fonts.ready;
  state.textTargets = generateTextTargets('ε');
  initStars();
  initParticles();
  setupInput();
  window.addEventListener('resize', handleResize);

  state.ctx.fillStyle = '#07060A';
  state.ctx.fillRect(0, 0, state.W, state.H);

  requestAnimationFrame(animate);
  await bootSequence();
  startHintTimer();
  setupTaglineHover();   // after boot: tagline is revealed, pointer-events active
}

init();
