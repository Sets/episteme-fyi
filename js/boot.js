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
  const bootEl   = document.getElementById('boot-screen');
  const textEl   = document.getElementById('boot-text');
  const cursorEl = document.getElementById('boot-cursor');

  const lines = [
    '> episteme.sys v0.1',
    '> scanning consensus layer...',
    '> detecting doxa contamination... found',
    '> filtering opinion from signal...',
    '> ████████████████████ 100%',
    '> truth.layer = active',
  ];

  for (const text of lines) {
    const line = document.createElement('div');
    line.className = 'boot-line';
    textEl.appendChild(line);
    cursorEl.style.display = 'none';
    await typeText(line, text, 8);   // 16 → 8ms per char
    cursorEl.style.display = '';
    await delay(60);                 // 160 → 60ms between lines
  }

  await delay(300);                  // 700 → 300ms son bekleme
  cursorEl.style.display = 'none';
  bootEl.classList.add('fade-out');
  await delay(700);                  // 1200 → 700ms fade
  bootEl.style.display = 'none';
  state.booted = true;

  await delay(400);                  // 1000 → 400ms doxa→episteme
  state.phase = 'episteme';
}
