// ══════════════════════════════════════════════════════════
// BOOT SEQUENCE
// ══════════════════════════════════════════════════════════

import { state } from './state.js';
import { delay } from './utils.js';

function typeText(el, text, charDelay) {
  return new Promise(resolve => {
    let i = 0;
    el.textContent = '';
    const iv = setInterval(() => {
      el.textContent += text[i]; i++;
      if (i >= text.length) { clearInterval(iv); resolve(); }
    }, charDelay);
  });
}

export async function bootSequence() {
  const bootEl  = document.getElementById('boot-screen');
  const textEl  = document.getElementById('boot-text');
  const cursorEl = document.getElementById('boot-cursor');

  const lines = [
    '> episteme.sys v0.1',
    '> scanning consensus layer...',
    '> detecting doxa contamination... found',
    '> filtering opinion from signal...',
    '> ████████████████████ 100%',
    '> extracting: knowledge · unveiled · real',
    '> truth.layer = active',
  ];

  for (const text of lines) {
    const line = document.createElement('div');
    line.className = 'boot-line';
    textEl.appendChild(line);
    cursorEl.style.display = 'none';
    await typeText(line, text, 16);
    cursorEl.style.display = '';
    await delay(160);
  }

  await delay(700);
  cursorEl.style.display = 'none';
  bootEl.classList.add('fade-out');
  await delay(1200);
  bootEl.style.display = 'none';
  state.booted = true;

  // Transition: doxa → episteme (particles snap into form)
  await delay(1000);
  state.phase = 'episteme';
}
