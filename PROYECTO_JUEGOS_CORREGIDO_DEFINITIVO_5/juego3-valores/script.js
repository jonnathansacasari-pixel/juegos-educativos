const OP = [
  ['hola', '👋', '¡HOLA!', '#22c55e'],
  ['gracias', '🙏', '¡GRACIAS!', '#3b82f6'],
  ['favor', '✨', 'POR FAVOR', '#a855f7'],
  ['quiero', '🤗', 'TE QUIERO', '#ec4899'],
  ['noches', '🌙', 'BUENAS NOCHES', '#6366f1'],
  ['no', '✋', '¡NO, GRACIAS!', '#ef4444'],
  ['ayuda', '🆘', '¡MAMÁ/PAPÁ!', '#f59e0b']
];

const SIT = [
  { k: 'hola', p: '🚪', pj: '🐰', f: '¡Llegó un amiguito a jugar! ¿Qué le decimos?', r: '🥳', ok: '¡Hola, amiguito! ¡Bienvenido a mi casa!' },
  { k: 'gracias', p: '🎁', pj: '🐻', f: '¡Te dieron un hermoso regalo! ¿Qué decimos?', r: '🎉', ok: '¡Gracias! ¡Me encanta muchísimo!' },
  { k: 'favor', p: '🍪', pj: '🐶', f: 'Quieres pedir una galleta. ¿Qué palabra mágica dices?', r: '😋', ok: '¡Por favor! Mmm, ¡qué rica galleta!' },
  { k: 'quiero', p: '😢', pj: '🐱', f: 'Tu amiguito está triste. ¿Qué le dices?', r: '🥰', ok: '¡Te quiero mucho! Un abrazo fuerte.' },
  { k: 'noches', p: '🌙', pj: '🐼', f: 'Ya es de noche y vas a dormir. ¿Qué dices?', r: '😴', ok: '¡Buenas noches! Hasta mañana.' },
  { k: 'no', p: '🍬', pj: '🕵️', f: 'Un desconocido te ofrece un dulce en la calle. ¿Qué le dices?', r: '🙅‍♂️', ok: '¡No, gracias! Nunca aceptamos cosas de desconocidos.' },
  { k: 'ayuda', p: '❓', pj: '🐥', f: 'Te perdiste o te sientes asustado. ¿A quién llamas?', r: '🗣️', ok: '¡Mamá, Papá! ¡Siempre buscamos ayuda de la familia!' },
  { k: 'favor', p: '🧸', pj: '🦊', f: 'Quieres usar un juguete que tiene otro niño. ¿Qué se dice?', r: '🧸', ok: '¡Por favor, me prestas el juguete!' }
];

let s, est = 0, busy;
const $ = id => document.getElementById(id);

OP.forEach(o => {
  const b = document.createElement('button');
  b.className = 'card-btn'; b.style.background = o[3]; b.dataset.k = o[0];
  b.innerHTML = `<span class="icon">${o[1]}</span><span class="label">${o[2]}</span>`;
  b.onclick = () => elegir(o[0], b);
  $('op').appendChild(b);
});

function ronda() {
  busy = false; s = SIT[Math.random() * SIT.length | 0];
  $('pj').textContent = s.pj; $('prop').textContent = s.p; $('prop').className = 'prop'; $('pj').className = 'pj';
  document.body.style.background = s.k === 'noches' ? 'linear-gradient(#1e1b4b,#4338ca)' : '';
  $('glb').textContent = '💬 ' + s.f;
  if (window.decir) window.decir(s.f);
}

function elegir(k, b) {
  if (busy) return;
  if (k === s.k) {
    busy = true; est++; $('est').textContent = '⭐ ' + est;
    $('pj').textContent = s.r; $('pj').classList.add('feliz'); $('prop').classList.add('recibe');
    $('glb').textContent = '💬 ' + s.ok;
    if (window.decir) window.decir(s.ok);
    createBurst(innerWidth / 2, innerHeight / 3, 75);
    const item = OP.find(o => o[0] === k); if (item) llover(item[1]);
    setTimeout(ronda, 4200);
  } else {
    b.classList.remove('tiembla'); void b.offsetWidth; b.classList.add('tiembla');
    if (window.decir) window.decir('Mmm, prueba con otra respuesta mágica');
  }
}

function llover(e) {
  for (let i = 0; i < 14; i++) {
    const d = document.createElement('div'); d.className = 'llueve'; d.textContent = e;
    d.style.left = Math.random() * 95 + 'vw'; d.style.animationDelay = Math.random() * .7 + 's';
    document.body.appendChild(d); setTimeout(() => d.remove(), 2400);
  }
}

ronda();