const canvas = document.getElementById('happyCanvas');
const ctx = canvas.getContext('2d');
const card = document.getElementById('canvas-card');

// Estado del Personaje
let currentEmotion = 'happy';
let skinColor = '#fde047';
let strokeColor = '#eab308';
let accessories = {
  glasses: false,
  crown: false,
  partyHat: false,
  mustache: false,
  bow: false,
  pirate: false
};

let hair = 'none';
let hairColor = '#1e293b';
let ears = 'none';

let blink = false;
let breathAngle = 0;
let mx = 0, my = 0;

// Parpadeo automático
setInterval(() => {
  blink = true;
  setTimeout(() => blink = false, 180);
}, 3200);

// Mouse tracking
document.addEventListener('mousemove', (e) => {
  const r = canvas.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2);
  const dy = e.clientY - (r.top + r.height / 2);
  const d = Math.hypot(dx, dy) || 1;
  const k = Math.min(1, d / 250);
  mx = (dx / d) * k;
  my = (dy / d) * k;
});

// VOZ FEMENINA E INFANTIL
function speak(texto) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(texto);
  msg.lang = 'es-ES';
  msg.pitch = 1.5; // Tono agudo e infantil
  msg.rate = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const femVoice = voices.find(v => 
    v.lang.startsWith('es') && 
    (v.name.toLowerCase().includes('female') || 
     v.name.toLowerCase().includes('sabina') || 
     v.name.toLowerCase().includes('monica') || 
     v.name.toLowerCase().includes('paulina') ||
     v.name.toLowerCase().includes('google'))
  ) || voices.find(v => v.lang.startsWith('es'));

  if (femVoice) msg.voice = femVoice;
  window.speechSynthesis.speak(msg);
}

function setEmotion(emo) {
  currentEmotion = emo;
  triggerSquish();
  const voices = {
    happy: '¡Estoy muy feliz!',
    surprised: '¡Oh! ¡Qué sorpresa!',
    silly: '¡Blublublú! ¡Qué divertido!',
    wink: '¡Guiño guiño!',
    love: '¡Me encanta!',
    scared: '¡Uy, qué susto!',
    cool: '¡Soy genial!',
    sleepy: 'Tengo un poco de sueño...'
  };
  if (voices[emo]) speak(voices[emo]);
}

function setSkin(bg, border) {
  skinColor = bg;
  strokeColor = border;
  triggerSquish();
}

// FRASES DE VOZ PARA ACCESORIOS MÁGICOS
const accVoices = {
  glasses: '¡Qué gafas tan geniales!',
  crown: '¡Una corona de rey o reina!',
  partyHat: '¡A festejar con el gorrito!',
  mustache: '¡Qué bigote tan gracioso!',
  bow: '¡Un moño muy elegante!',
  pirate: '¡Ahrr! ¡Un parche de pirata!'
};

function toggleAcc(acc) {
  accessories[acc] = !accessories[acc];
  triggerSquish();

  if (accessories[acc] && accVoices[acc]) {
    speak(accVoices[acc]);
  } else if (!accessories[acc]) {
    speak('Accesorio quitado');
  }
}

function setHair(h) {
  hair = h;
  triggerSquish();
  speak(h === 'none' ? '¡Sin pelito!' : '¡Qué peinado tan bonito!');
}

function setHairColor(c) {
  hairColor = c;
  if (hair === 'none') hair = 'curly';
  triggerSquish();
}

function setEars(e) {
  ears = e;
  triggerSquish();
  speak(e === 'none' ? 'Sin orejitas' : '¡Qué orejitas tan lindas!');
}

function resetAll() {
  currentEmotion = 'happy';
  accessories = { glasses: false, crown: false, partyHat: false, mustache: false, bow: false, pirate: false };
  hair = 'none';
  ears = 'none';
  triggerSquish();
  speak('¡Limpiamos todo! Empezamos de nuevo.');
}

function triggerSquish() {
  card.classList.remove('anim-squish');
  void card.offsetWidth;
  card.classList.add('anim-squish');
  
  if (typeof createBurst === 'function') {
    const rect = card.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
  }
}

function startDance() {
  card.classList.add('anim-dance-loop');
  speak('¡A bailar! ¡Qué ritmo!');
  if (typeof createBurst === 'function') {
    const rect = card.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
  }
  setTimeout(() => card.classList.remove('anim-dance-loop'), 2600);
}

// Cosquillas
canvas.addEventListener('pointerdown', (e) => {
  const r = canvas.getBoundingClientRect();
  const k = canvas.width / r.width;
  const px = (e.clientX - r.left) * k - 240;
  const py = (e.clientY - r.top) * k - 240;

  if (Math.abs(px) < 34 && Math.abs(py - 10) < 34) {
    speak('¡Achú!');
    if (typeof createBurst === 'function') createBurst(e.clientX, e.clientY, 35);
  } else {
    speak('¡Jajaja, qué cosquillas!');
    triggerSquish();
  }
});

// DIBUJO VECTORIAL EN CANVAS
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  breathAngle += 0.04;
  const offsetY = Math.sin(breathAngle) * 5;

  ctx.save();
  ctx.translate(240, 240 + offsetY);

  drawEars();

  // Rostro Base
  ctx.beginPath();
  ctx.arc(0, 0, 160, 0, Math.PI * 2);
  ctx.fillStyle = skinColor;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();

  // Mejillas
  ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
  ctx.beginPath();
  ctx.arc(-95, 30, 24, 0, Math.PI * 2);
  ctx.arc(95, 30, 24, 0, Math.PI * 2);
  ctx.fill();

  // Nariz
  ctx.beginPath();
  ctx.arc(0, 10, 12, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fill();

  drawEyes();
  drawCartoonMouth();
  drawHair();
  drawAccessories();

  ctx.restore();

  requestAnimationFrame(render);
}

function drawCartoonEye(x, y) {
  const ox = (mx || 0) * 13;
  const oy = (my || 0) * 13;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#1e293b';
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(x + ox, y + oy, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + ox - 6, y + oy - 6, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawEyes() {
  if (blink) {
    ctx.lineWidth = 7; ctx.strokeStyle = '#1e293b'; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-65, -35, 20, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(65, -35, 20, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  } else if (currentEmotion === 'wink') {
    drawCartoonEye(-65, -35);
    ctx.lineWidth = 7; ctx.strokeStyle = '#1e293b'; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(65, -35, 22, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  } else if (currentEmotion === 'love') {
    [-65, 65].forEach(x => {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(x, -25);
      ctx.bezierCurveTo(x, -45, x - 30, -45, x - 30, -25);
      ctx.bezierCurveTo(x - 30, -5, x, 10, x, 15);
      ctx.bezierCurveTo(x, 10, x + 30, -5, x + 30, -25);
      ctx.bezierCurveTo(x + 30, -45, x, -45, x, -25);
      ctx.fill();
    });
  } else if (currentEmotion === 'sleepy') {
    ctx.lineWidth = 7; ctx.strokeStyle = '#1e293b'; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-65, -30, 22, 0.8 * Math.PI, 0.2 * Math.PI, true); ctx.stroke();
    ctx.beginPath(); ctx.arc(65, -30, 22, 0.8 * Math.PI, 0.2 * Math.PI, true); ctx.stroke();
  } else {
    drawCartoonEye(-65, -35);
    drawCartoonEye(65, -35);
  }
}

function drawCartoonMouth() {
  ctx.save();
  if (currentEmotion === 'happy' || currentEmotion === 'wink' || currentEmotion === 'love' || currentEmotion === 'cool') {
    ctx.beginPath(); ctx.arc(0, 35, 55, 0, Math.PI); ctx.fillStyle = '#b91c1c'; ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = '#1e293b'; ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.rect(-25, 35, 50, 14); ctx.fill();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath(); ctx.arc(0, 75, 22, Math.PI, 0); ctx.fill();
  } else if (currentEmotion === 'surprised') {
    ctx.beginPath(); ctx.ellipse(0, 60, 28, 40, 0, 0, Math.PI * 2); ctx.fillStyle = '#831843'; ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = '#1e293b'; ctx.stroke();
  } else if (currentEmotion === 'silly') {
    ctx.beginPath(); ctx.arc(0, 40, 45, 0, Math.PI); ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(15, 75, 18, 26, 0, 0, Math.PI * 2); ctx.fillStyle = '#f43f5e'; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = '#9f1239'; ctx.stroke();
  } else if (currentEmotion === 'scared') {
    ctx.beginPath(); ctx.moveTo(-40, 60); ctx.quadraticCurveTo(-20, 45, 0, 60); ctx.quadraticCurveTo(20, 75, 40, 60);
    ctx.lineWidth = 7; ctx.strokeStyle = '#1e293b'; ctx.lineCap = 'round'; ctx.stroke();
  } else if (currentEmotion === 'sleepy') {
    ctx.beginPath(); ctx.arc(0, 55, 15, 0, Math.PI * 2); ctx.fillStyle = '#1e293b'; ctx.fill();
  }
  ctx.restore();
}

function drawEars() {
  ctx.lineWidth = 7; ctx.strokeStyle = strokeColor;
  if (ears === 'cat') {
    [-1, 1].forEach(s => {
      ctx.fillStyle = skinColor;
      ctx.beginPath(); ctx.moveTo(s * 130, -95); ctx.lineTo(s * 95, -205); ctx.lineTo(s * 35, -140); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fda4af';
      ctx.beginPath(); ctx.moveTo(s * 115, -120); ctx.lineTo(s * 98, -175); ctx.lineTo(s * 65, -140); ctx.closePath(); ctx.fill();
    });
  } else if (ears === 'bunny') {
    [-1, 1].forEach(s => {
      ctx.fillStyle = skinColor;
      ctx.beginPath(); ctx.ellipse(s * 65, -215, 28, 75, s * 0.18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fda4af';
      ctx.beginPath(); ctx.ellipse(s * 65, -212, 13, 55, s * 0.18, 0, Math.PI * 2); ctx.fill();
    });
  } else if (ears === 'bear') {
    [-1, 1].forEach(s => {
      ctx.fillStyle = skinColor;
      ctx.beginPath(); ctx.arc(s * 118, -122, 38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fda4af';
      ctx.beginPath(); ctx.arc(s * 118, -122, 19, 0, Math.PI * 2); ctx.fill();
    });
  }
}

function drawHair() {
  if (hair === 'none') return;
  ctx.fillStyle = hairColor;

  if (hair === 'long' || hair === 'pigtails') {
    [-1, 1].forEach(s => {
      ctx.beginPath();
      if (hair === 'long') ctx.roundRect(s > 0 ? 135 : -185, -80, 50, 230, 25);
      else ctx.arc(s * 172, 10, 44, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  if (hair === 'curly') {
    for (let a = 190; a <= 350; a += 16) {
      const r = (a * Math.PI) / 180;
      ctx.beginPath(); ctx.arc(Math.cos(r) * 148, Math.sin(r) * 148, 34, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (hair === 'spiky') {
    ctx.beginPath();
    for (let a = 195, k = 0; a <= 345; a += 15, k++) {
      const r = (a * Math.PI) / 180;
      const R = k % 2 ? 150 : 215;
      ctx.lineTo(Math.cos(r) * R, Math.sin(r) * R);
    }
    ctx.closePath(); ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(0, 0, 168, Math.PI * 1.04, Math.PI * 1.96);
  ctx.arc(0, -72, 128, Math.PI * 1.96, Math.PI * 1.04, true);
  ctx.closePath(); ctx.fill();

  if (hair === 'pigtails') {
    ctx.fillStyle = '#ec4899';
    [-1, 1].forEach(s => {
      ctx.beginPath(); ctx.arc(s * 150, -60, 14, 0, Math.PI * 2); ctx.fill();
    });
  }
}

function drawAccessories() {
  if (accessories.glasses || currentEmotion === 'cool') {
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.roundRect(-100, -58, 80, 50, 12); ctx.roundRect(20, -58, 80, 50, 12); ctx.fill();
    ctx.lineWidth = 8; ctx.strokeStyle = '#0f172a';
    ctx.beginPath(); ctx.moveTo(-20, -35); ctx.lineTo(20, -35); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.moveTo(-85, -50); ctx.lineTo(-40, -50); ctx.lineTo(-60, -20); ctx.fill();
    ctx.beginPath(); ctx.moveTo(35, -50); ctx.lineTo(80, -50); ctx.lineTo(60, -20); ctx.fill();
  }

  if (accessories.pirate) {
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(65, -35, 34, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = '#0f172a';
    ctx.beginPath(); ctx.moveTo(-160, -80); ctx.lineTo(160, 10); ctx.stroke();
  }

  if (accessories.crown) {
    ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-70, -150); ctx.lineTo(-70, -200); ctx.lineTo(-35, -170); ctx.lineTo(0, -220); ctx.lineTo(35, -170); ctx.lineTo(70, -200); ctx.lineTo(70, -150);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-70, -195, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(0, -215, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(70, -195, 7, 0, Math.PI * 2); ctx.fill();
  }

  if (accessories.partyHat) {
    ctx.fillStyle = '#a855f7';
    ctx.beginPath(); ctx.moveTo(-50, -150); ctx.lineTo(0, -240); ctx.lineTo(50, -150); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(0, -245, 14, 0, Math.PI * 2); ctx.fill();
  }

  if (accessories.mustache) {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(-25, 20, 25, 0.8 * Math.PI, 1.9 * Math.PI); ctx.arc(25, 20, 25, 1.1 * Math.PI, 0.2 * Math.PI); ctx.fill();
  }

  if (accessories.bow) {
    ctx.fillStyle = '#ec4899';
    ctx.beginPath(); ctx.moveTo(0, 140); ctx.lineTo(-45, 120); ctx.lineTo(-45, 160); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, 140); ctx.lineTo(45, 120); ctx.lineTo(45, 160); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 140, 12, 0, Math.PI * 2); ctx.fill();
  }
}

function takeSnapshot() {
  const data = canvas.toDataURL('image/png');
  document.getElementById('photo-result').src = data;
  document.getElementById('photo-modal').style.display = 'flex';
  speak('¡Sonríe! ¡Foto tomada!');
  if (typeof createBurst === 'function') {
    createBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
  }
}

function closeModal() {
  document.getElementById('photo-modal').style.display = 'none';
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

render();