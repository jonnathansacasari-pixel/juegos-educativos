const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let score = 0, streak = 0, noteIndex = 0, escapedBubbles = 0;
const MAX_ESCAPED = 10;
let isGameOver = false;

let rainbowCount = 0, animalTracker = {};

// Escala musical afinada en Hz
const N = {
  G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Gs4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, Cs5: 554.37, D5: 587.33, Ds5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Gs5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77, C6: 1046.50
};

// TODAS LAS CANCIONES EXTENDIDAS Y COMPLETAS NOTA POR NOTA
const rawSongs = [
  {
    title: "🎹 Para Elisa - Beethoven",
    notes: [
      N.E5, N.Ds5, N.E5, N.Ds5, N.E5, N.B4, N.D5, N.C5, N.A4,
      N.C4, N.E4, N.A4, N.B4,
      N.E4, N.Gs4, N.B4, N.C5,
      N.E4, N.E5, N.Ds5, N.E5, N.Ds5, N.E5, N.B4, N.D5, N.C5, N.A4,
      N.C4, N.E4, N.A4, N.B4,
      N.E4, N.C5, N.B4, N.A4,
      N.B4, N.C5, N.D5, N.E5, N.G4, N.F5, N.E5, N.D5,
      N.F4, N.E5, N.D5, N.C5,
      N.E4, N.D5, N.C5, N.B4,
      N.E4, N.E5, N.E5, N.E5,
      N.E5, N.Ds5, N.E5, N.Ds5, N.E5, N.B4, N.D5, N.C5, N.A4,
      N.C4, N.E4, N.A4, N.B4,
      N.E4, N.Gs4, N.B4, N.C5,
      N.E4, N.C5, N.B4, N.A4
    ]
  },
  {
    title: "⭐ Estrellita Dónde Estás",
    notes: [
      N.C4, N.C4, N.G4, N.G4, N.A4, N.A4, N.G4,
      N.F4, N.F4, N.E4, N.E4, N.D4, N.D4, N.C4,
      N.G4, N.G4, N.F4, N.F4, N.E4, N.E4, N.D4,
      N.G4, N.G4, N.F4, N.F4, N.E4, N.E4, N.D4,
      N.C4, N.C4, N.G4, N.G4, N.A4, N.A4, N.G4,
      N.F4, N.F4, N.E4, N.E4, N.D4, N.D4, N.C4
    ]
  },
  {
    title: "🌅 Morning Mood - Edvard Grieg",
    notes: [
      N.E4, N.D4, N.C4, N.D4, N.E4, N.G4, N.E4, N.D4, N.C4, N.D4, N.E4, N.D4,
      N.E4, N.G4, N.E4, N.D4, N.C4, N.D4, N.E4, N.G4, N.A4, N.G4, N.E4, N.D4, N.C4,
      N.G4, N.E4, N.D4, N.C4, N.D4, N.E4, N.G4, N.E4, N.D4, N.C4, N.D4, N.E4, N.D4,
      N.E4, N.G4, N.A4, N.C5, N.B4, N.A4, N.G4, N.E4, N.D4, N.C4
    ]
  },
  {
    title: "🕊️ Oda a la Alegría - Beethoven",
    notes: [
      N.E4, N.E4, N.F4, N.G4, N.G4, N.F4, N.E4, N.D4,
      N.C4, N.C4, N.D4, N.E4, N.E4, N.D4, N.D4,
      N.E4, N.E4, N.F4, N.G4, N.G4, N.F4, N.E4, N.D4,
      N.C4, N.C4, N.D4, N.E4, N.D4, N.C4, N.C4,
      N.D4, N.D4, N.E4, N.C4, N.D4, N.E4, N.F4, N.E4, N.C4,
      N.D4, N.E4, N.F4, N.E4, N.D4, N.C4, N.D4, N.G3,
      N.E4, N.E4, N.F4, N.G4, N.G4, N.F4, N.E4, N.D4,
      N.C4, N.C4, N.D4, N.E4, N.D4, N.C4, N.C4
    ]
  },
  {
    title: "🧚 Hada de Azúcar - Tchaikovsky",
    notes: [
      N.E5, N.Ds5, N.E5, N.B4, N.D5, N.C5, N.A4,
      N.E4, N.Gs4, N.B4, N.C5,
      N.E5, N.Ds5, N.E5, N.B4, N.D5, N.C5, N.A4,
      N.F5, N.E5, N.D5, N.C5, N.B4, N.A4,
      N.Gs4, N.B4, N.E5, N.D5, N.C5, N.B4, N.A4,
      N.E4, N.A4, N.C5, N.E5, N.D5, N.B4, N.C5, N.A4
    ]
  },
  {
    title: "💃 Can Can - Offenbach",
    notes: [
      N.C4, N.C4, N.E4, N.G4, N.C5, N.C5, N.C5, N.B4, N.A4, N.G4, N.F4, N.E4, N.D4,
      N.G4, N.G4, N.G4, N.A4, N.B4, N.C5, N.D5, N.E5, N.D5, N.C5, N.B4, N.A4, N.G4,
      N.C4, N.C4, N.E4, N.G4, N.C5, N.C5, N.C5, N.B4, N.A4, N.G4, N.F4, N.E4, N.D4,
      N.G4, N.G4, N.G4, N.A4, N.B4, N.C5, N.E5, N.D5, N.C5
    ]
  }
];

let currentSongIndex = Math.floor(Math.random() * rawSongs.length);

function initSong() {
  noteIndex = 0;
  updateSongBadge();
}

function updateSongBadge() {
  const currentSong = rawSongs[currentSongIndex];
  const badge = document.getElementById('songBadge');
  if (badge) {
    badge.innerHTML = `🎵 <strong>${currentSong.title}</strong>`;
  }
}

// Seleccionar la siguiente canción al azar sin repetir inmediatamente la misma
function nextRandomSong() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * rawSongs.length);
  } while (newIndex === currentSongIndex && rawSongs.length > 1);
  
  currentSongIndex = newIndex;
  initSong();
}

function playNextNote() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const currentSong = rawSongs[currentSongIndex];
  const freq = currentSong.notes[noteIndex];
  noteIndex++;

  // Al completar la única reproducción de la canción actual
  if (noteIndex >= currentSong.notes.length) {
    showToast('🎉 ¡Melodía Completada! Siguiente canción...');
    if (window.decir) window.decir('¡Excelente! Siguiente melodía.');
    nextRandomSong();
  }

  // Sonido de piano triángulo
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.65);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.65);
}

function giveComboBonus(text, bonusPoints) {
  score += bonusPoints;
  showToast(text + ' +' + bonusPoints + ' Pts! ⭐');
  if (window.decir) window.decir('¡Super combo!');
}

function showToast(text) {
  const toast = document.createElement('div');
  toast.className = 'level-up-toast';
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1800);
}

function popParticles(x, y, isBig = false) {
  const count = isBig ? 24 : 14;
  const symbols = ['⭐', '✨', '🎈', '💖', '🌟', '🎶'];
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    if (Math.random() > 0.4) {
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.fontSize = (Math.random() * 16 + 20) + 'px';
    } else {
      p.style.width = (Math.random() * 14 + 10) + 'px';
      p.style.height = p.style.width;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = '50%';
    }
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 140 + (isBig ? 120 : 60);
    p.style.left = x + 'px'; p.style.top = y + 'px';
    p.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
}

const fruitAndAnimalEmojis = ['🍎', '🍌', '🍓', '🍊', '🍇', '🍉', '🐶', '🐱', '🐰', '🦁', '🐵', '🐼', '🐸', '🐥'];

function spawnBubble() {
  if (isGameOver) return;
  const container = document.getElementById('bubbleContainer');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  const isRainbow = Math.random() < 0.12;
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#06b6d4'];
  const bg = colors[Math.floor(Math.random() * colors.length)];
  const symbol = isRainbow ? '🌈' : fruitAndAnimalEmojis[Math.floor(Math.random() * fruitAndAnimalEmojis.length)];
  const size = isRainbow ? 140 : (Math.floor(Math.random() * 25) + 110);
  const posX = Math.floor(Math.random() * (container.clientWidth - size - 20)) + 10;
  const duration = (Math.random() * 1.0 + 3.8).toFixed(1); 

  bubble.style.width = size + 'px'; bubble.style.height = size + 'px';
  bubble.style.fontSize = isRainbow ? '4.2rem' : '3.8rem';
  bubble.style.left = posX + 'px'; bubble.style.pointerEvents = 'auto'; bubble.style.zIndex = '50';

  if (isRainbow) {
    bubble.style.background = 'linear-gradient(45deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7)';
    bubble.style.boxShadow = '0 0 25px rgba(250, 204, 21, 0.9)';
    bubble.classList.add('rainbow-bubble');
  } else {
    bubble.style.background = `radial-gradient(circle at 30% 30%, #ffffff, ${bg})`;
  }
  bubble.style.setProperty('--duration', duration + 's');
  bubble.textContent = symbol;

  const explodeBubble = (e) => {
    if (isGameOver || bubble.dataset.popped) return;
    e.preventDefault(); e.stopPropagation();
    bubble.dataset.popped = 'true';

    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    playNextNote();
    popParticles(clientX, clientY, isRainbow);

    if (isRainbow) {
      rainbowCount++;
      const allBubbles = Array.from(document.querySelectorAll('.bubble'));
      let poppedCount = 0;
      allBubbles.forEach(b => {
        if (b === bubble || b.dataset.popped) return;
        const rect = b.getBoundingClientRect();
        if (Math.hypot(rect.left + rect.width / 2 - clientX, rect.top + rect.height / 2 - clientY) < 300) {
          poppedCount++; b.dataset.popped = 'true';
          popParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, false);
          b.remove();
        }
      });
      score += poppedCount * 2; streak += poppedCount;
      if (rainbowCount >= 5) { rainbowCount = 0; giveComboBonus('🌈 ¡COMBO ARCOÍRIS!', 50); }
    } else {
      score += 1; streak += 1;
      animalTracker[symbol] = (animalTracker[symbol] || 0) + 1;
      if (animalTracker[symbol] >= 3) { animalTracker[symbol] = 0; giveComboBonus('¡3 ' + symbol + ' IGUALES!', 30); }
    }

    bubble.remove();
    const scoreEl = document.getElementById('scoreText');
    const streakEl = document.getElementById('streakText');
    if (scoreEl) scoreEl.textContent = score;
    if (streakEl) streakEl.textContent = streak;
  };

  bubble.addEventListener('pointerdown', explodeBubble);
  bubble.onanimationend = () => {
    if (!bubble.dataset.popped && !isGameOver) {
      escapedBubbles++; updateEscapedDisplay();
      if (escapedBubbles >= MAX_ESCAPED) triggerGameOver();
    }
    bubble.remove();
  };
  container.appendChild(bubble);
}

function updateEscapedDisplay() {
  const el = document.getElementById('escapedText');
  if (el) el.textContent = escapedBubbles + ' / ' + MAX_ESCAPED;
}

function triggerGameOver() {
  isGameOver = true;
  if (window.decir) window.decir('¡Oh no! Se escaparon muchas burbujas.');
  const overlay = document.createElement('div');
  overlay.className = 'game-over-overlay';
  overlay.innerHTML = `
    <div class="game-over-modal">
      <h2>¡Juego Terminado! 🎈</h2>
      <p>Se escaparon 10 burbujas 💨</p>
      <p>Puntuación Final: <strong style="color: #2563eb; font-size: 2rem;">${score}</strong></p>
      <button class="btn-restart-giant" onclick="restartGame()">
        <span>🔄</span> ¡JUGAR DE NUEVO!
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}

function restartGame() {
  score = 0; streak = 0; escapedBubbles = 0; rainbowCount = 0; animalTracker = {}; isGameOver = false;
  const scoreEl = document.getElementById('scoreText'), streakEl = document.getElementById('streakText');
  if (scoreEl) scoreEl.textContent = '0';
  if (streakEl) streakEl.textContent = '0';
  updateEscapedDisplay();
  const container = document.getElementById('bubbleContainer');
  if (container) container.innerHTML = '';
  const modal = document.querySelector('.game-over-overlay');
  if (modal) modal.remove();
  nextRandomSong();
}

document.addEventListener('DOMContentLoaded', () => {
  initSong(); updateEscapedDisplay(); setInterval(spawnBubble, 600);
});