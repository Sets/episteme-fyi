// ══════════════════════════════════════════════════════════
// INPUT & INTERACTION
// ══════════════════════════════════════════════════════════

import { state } from './state.js';
import { checkStarHover } from './stars.js';

// ═══ REVEAL SYSTEM ═══

function reveal(id) {
  if (state.interaction.revealed.has(id)) return;
  state.interaction.revealed.add(id);
  const el = document.getElementById(id);
  if (el) { el.classList.remove('hidden'); el.classList.add('revealed'); }
}

function checkReveals() {
  const d = state.interaction.mouseDist;
  if (d > 300)  reveal('hud-tl');
  if (d > 420)  { reveal('hud-tr'); reveal('hud-bl'); reveal('hud-br'); }
  if (d > 600)  { reveal('tagline'); }
}

// ═══ OVERLAY MESSAGE ═══

let msgActive = false;

export function showMsg(text) {
  if (msgActive) return;
  msgActive = true;
  const msg = document.createElement('div');
  msg.className = 'overlay-msg';
  msg.textContent = text;
  document.getElementById('overlay').appendChild(msg);
  requestAnimationFrame(() => msg.classList.add('visible'));
  setTimeout(() => {
    msg.classList.remove('visible');
    setTimeout(() => { msg.remove(); msgActive = false; }, 1800);
  }, 3200);
}

// ═══ EASTER EGGS ═══

function triggerDoxa() {
  for (const p of state.particles) {
    p.vx += (Math.random()-0.5)*14;
    p.vy += (Math.random()-0.5)*14;
  }
  showMsg('δόξα — mere opinion');
}

// ═══ IDLE HINT ═══

let hintTimer = null;
let hintEl    = null;

export function startHintTimer() {
  hintEl = document.getElementById('hint');
  hintTimer = setTimeout(() => {
    hintEl.classList.remove('hidden');
    hintEl.classList.add('revealed');
    hintEl.style.animation = 'hintPulse 4s ease-in-out infinite';
  }, 7000);
}

function hideHint() {
  if (hintEl && hintEl.classList.contains('revealed')) {
    hintEl.classList.remove('hidden');
    hintEl.style.animation = '';
  }
  clearTimeout(hintTimer);
}

// ═══ INPUT HANDLERS ═══

export function setupInput() {
  const { mouse, interaction } = state;

  document.addEventListener('mousemove', (e) => {
    if (mouse.active) {
      const dx=e.clientX-mouse.x, dy=e.clientY-mouse.y;
      interaction.mouseDist += Math.hypot(dx,dy);
    }
    interaction.lastMove=Date.now();
    mouse.x=e.clientX; mouse.y=e.clientY; mouse.active=true;
    checkStarHover(e.clientX, e.clientY);
    hideHint();
    checkReveals();
  });

  document.addEventListener('click', () => {
    interaction.clicks++; checkReveals();
  });

  state.canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const t=e.touches[0];
    const dx=t.clientX-mouse.x, dy=t.clientY-mouse.y;
    interaction.mouseDist += Math.hypot(dx,dy);
    interaction.lastMove=Date.now();
    mouse.x=t.clientX; mouse.y=t.clientY; mouse.active=true;
    checkStarHover(t.clientX, t.clientY);
    hideHint(); checkReveals();
  }, { passive: false });

  state.canvas.addEventListener('touchstart', (e) => {
    const t=e.touches[0];
    mouse.x=t.clientX; mouse.y=t.clientY; mouse.active=true;
    checkStarHover(t.clientX, t.clientY);
    interaction.clicks++; checkReveals();
  });

  state.canvas.addEventListener('touchend', () => {
    mouse.x=-9999; mouse.y=-9999; mouse.sx=-9999; mouse.sy=-9999;
  });

  document.addEventListener('keydown', (e) => {
    interaction.keyBuf += e.key;
    if (interaction.keyBuf.length > 24) interaction.keyBuf=interaction.keyBuf.slice(-24);
    if (interaction.keyBuf.includes('doxa'))     { interaction.keyBuf=''; triggerDoxa(); }
    if (interaction.keyBuf.includes('aletheia')) { interaction.keyBuf=''; showMsg('ἀλήθεια — truth unveiled'); }
    if (interaction.keyBuf.includes('episteme')) { interaction.keyBuf=''; showMsg('ἐπιστήμη — true knowledge'); }
  });
}
