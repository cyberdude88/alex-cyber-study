/**
 * Shared drag-and-drop matching game engine for all domain pages.
 *
 * Usage: call initMatchGame(attackPairs, totalCount) from each domain page.
 *   - attackPairs: object { "Term": "Scenario description", ... }
 *   - totalCount: number of pairs (Object.keys(attackPairs).length)
 */

let draggedElement = null;
let gameScore = 0;
let gameTotal = 0;

function initMatchGame(pairs, total) {
  gameTotal = total || Object.keys(pairs).length;
  const termsContainer = document.getElementById('termsContainer');
  const scenariosContainer = document.getElementById('scenariosContainer');

  termsContainer.innerHTML = '';
  scenariosContainer.innerHTML = '';
  gameScore = 0;
  updateGameScore();
  document.getElementById('completionMessage').style.display = 'none';

  // Shuffle terms
  const terms = Object.keys(pairs);
  const shuffledTerms = [...terms].sort(() => Math.random() - 0.5);

  shuffledTerms.forEach(term => {
    const box = document.createElement('div');
    box.className = 'term-box';
    box.draggable = true;
    box.textContent = term;
    box.dataset.term = term;

    // Drag events
    box.addEventListener('dragstart', e => {
      draggedElement = e.target;
      e.target.classList.add('dragging');
    });
    box.addEventListener('dragend', e => {
      e.target.classList.remove('dragging');
    });

    // Touch support
    box.addEventListener('touchstart', handleTouchStart, { passive: false });
    box.addEventListener('touchmove', handleTouchMove, { passive: false });
    box.addEventListener('touchend', handleTouchEnd, { passive: false });

    termsContainer.appendChild(box);
  });

  // Shuffle scenarios
  const entries = Object.entries(pairs);
  const shuffledScenarios = [...entries].sort(() => Math.random() - 0.5);

  shuffledScenarios.forEach(([term, scenario]) => {
    const box = document.createElement('div');
    box.className = 'scenario-box';
    box.dataset.correctTerm = term;

    const text = document.createElement('div');
    text.className = 'scenario-text';
    text.textContent = scenario;
    box.appendChild(text);

    box.addEventListener('dragover', e => {
      e.preventDefault();
      e.currentTarget.classList.add('drag-over');
    });
    box.addEventListener('dragleave', e => {
      e.currentTarget.classList.remove('drag-over');
    });
    box.addEventListener('drop', e => {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over');
      handleDropOnZone(e.currentTarget);
    });

    scenariosContainer.appendChild(box);
  });
}

function handleDropOnZone(dropZone) {
  if (!draggedElement) return;
  const correctTerm = dropZone.dataset.correctTerm;
  const droppedTerm = draggedElement.dataset.term;

  // If zone already has a term, return it
  const existing = dropZone.querySelector('.term-box');
  if (existing) {
    document.getElementById('termsContainer').appendChild(existing);
    if (dropZone.classList.contains('correct')) {
      dropZone.classList.remove('correct');
      gameScore--;
      updateGameScore();
    }
  }

  if (droppedTerm === correctTerm) {
    dropZone.appendChild(draggedElement);
    dropZone.classList.add('correct');
    draggedElement.draggable = false;
    gameScore++;
    updateGameScore();
    if (gameScore === gameTotal) {
      document.getElementById('completionMessage').style.display = 'block';
      launchConfetti();
    }
  } else {
    draggedElement.classList.add('incorrect');
    setTimeout(() => {
      draggedElement.classList.remove('incorrect');
    }, 500);
  }
}

function updateGameScore() {
  document.getElementById('score').textContent = gameScore;
  document.getElementById('total').textContent = gameTotal;
}

/* ── Simple confetti burst ── */
function launchConfetti() {
  const colors = ['#4ade80','#f472b6','#60a5fa','#facc15','#a78bfa','#fb923c'];
  for (let i = 0; i < 80; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed; width:8px; height:8px; border-radius:50%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${50 + (Math.random()-0.5)*30}%;
      top:-10px; z-index:9999;
      pointer-events:none;
    `;
    document.body.appendChild(dot);
    const xEnd = (Math.random()-0.5) * 600;
    const yEnd = window.innerHeight + 50;
    const dur = 1200 + Math.random()*800;
    dot.animate([
      { transform:'translate(0,0) scale(1)', opacity:1 },
      { transform:`translate(${xEnd}px,${yEnd}px) scale(0.3)`, opacity:0 }
    ], { duration: dur, easing:'cubic-bezier(.25,.46,.45,.94)' });
    setTimeout(() => dot.remove(), dur);
  }
}

/* ── Touch support for mobile ── */
let touchClone = null;
let touchStartEl = null;

function handleTouchStart(e) {
  e.preventDefault();
  touchStartEl = e.target.closest('.term-box');
  if (!touchStartEl || !touchStartEl.draggable) return;
  draggedElement = touchStartEl;
  touchStartEl.classList.add('dragging');

  // Create a visual clone
  touchClone = touchStartEl.cloneNode(true);
  touchClone.style.cssText = `
    position:fixed; z-index:10000; pointer-events:none;
    opacity:0.85; width:${touchStartEl.offsetWidth}px;
  `;
  document.body.appendChild(touchClone);
  moveTouchClone(e.touches[0]);
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!touchClone) return;
  moveTouchClone(e.touches[0]);

  // Highlight drop zone under finger
  const el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  document.querySelectorAll('.scenario-box').forEach(s => s.classList.remove('drag-over'));
  if (el) {
    const zone = el.closest('.scenario-box');
    if (zone) zone.classList.add('drag-over');
  }
}

function handleTouchEnd(e) {
  if (!touchClone) return;
  touchClone.remove();
  touchClone = null;
  if (touchStartEl) touchStartEl.classList.remove('dragging');

  const touch = e.changedTouches[0];
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  document.querySelectorAll('.scenario-box').forEach(s => s.classList.remove('drag-over'));

  if (el) {
    const zone = el.closest('.scenario-box');
    if (zone) handleDropOnZone(zone);
  }
  touchStartEl = null;
}

function moveTouchClone(touch) {
  if (!touchClone) return;
  touchClone.style.left = (touch.clientX - touchClone.offsetWidth / 2) + 'px';
  touchClone.style.top = (touch.clientY - 30) + 'px';
}
