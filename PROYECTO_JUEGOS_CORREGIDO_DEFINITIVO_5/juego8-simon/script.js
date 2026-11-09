const SAB = [['fresa','#f9a8d4'],['chocolate','#92400e'],['vainilla','#fef3c7'],['menta','#86efac'],['mora','#a78bfa'],['mango','#fdba74']];
const TOP = ['🍒','🌈','⭐','🍓','🍫','🍪'];
const CL = ['🐻','🐰','🐶','🐱','🐼','🦁','🐵'];
let bolas = 0, topE = null, serv = 0, ocupado = false;
const hel = document.getElementById('hel'), cli = document.getElementById('cli');

SAB.forEach((s, i) => {
  const b = document.createElement('button'); b.className = 'sab'; b.style.setProperty('--c', s[1]);
  b.onclick = e => bola(i, e); document.getElementById('sab').appendChild(b);
});

TOP.forEach(t => {
  const b = document.createElement('button'); b.className = 'tp'; b.textContent = t;
  b.onclick = e => poner(t, e); document.getElementById('tops').appendChild(b);
});

function colocar() { if (topE) topE.style.bottom = (120 + bolas * 60 + 34) + 'px'; }

function bola(i, e) {
  if (ocupado) return;
  if (bolas >= 4) { if (window.decir) window.decir('¡El helado ya está gigante! Toca servir.'); return; }
  const d = document.createElement('div'); d.className = 'bola'; d.style.setProperty('--c', SAB[i][1]); d.style.bottom = (112 + bolas * 60) + 'px';
  hel.appendChild(d); bolas++; colocar();
  if (window.decir) window.decir(SAB[i][0]); createBurst(e.clientX, e.clientY, 10);
}

function poner(t, e) {
  if (ocupado || !bolas) { if (!bolas && window.decir) window.decir('Primero coloca las bolas de helado'); return; }
  if (topE) topE.remove();
  topE = document.createElement('div'); topE.className = 'top'; topE.textContent = t;
  hel.appendChild(topE); colocar(); createBurst(e.clientX, e.clientY, 12);
  const msgs = { '🍒': '¡Una deliciosa cereza arriba!', '🌈': '¡Chispitas de arcoíris!', '⭐': '¡Chispitas de estrellas!', '🍓': '¡Fresa fresca!', '🍫': '¡Trozo de chocolate!', '🍪': '¡Galleta crujiente!' };
  if (window.decir) window.decir(msgs[t] || '¡Qué topping tan rico!');
}

function servir() {
  if (ocupado) return;
  if (!bolas) { if (window.decir) window.decir('Elige tus sabores primero'); return; }
  ocupado = true; hel.classList.add('vuela');
  setTimeout(() => {
    cli.classList.add('feliz'); cli.textContent = '😋';
    if (window.decir) window.decir('¡Mmm, qué helado tan delicioso! ¡Muchas gracias!');
    serv++; document.getElementById('cnt').textContent = '🍦 ' + serv;
    createBurst(innerWidth * .8, innerHeight * .45, 70);
  }, 650);
  setTimeout(() => {
    hel.querySelectorAll('.bola,.top').forEach(x => x.remove()); topE = null; bolas = 0; hel.classList.remove('vuela'); cli.classList.remove('feliz');
    cli.textContent = CL[Math.random() * CL.length | 0]; ocupado = false;
    if (window.decir) window.decir('¿Quién quiere otro helado?');
  }, 3200);
}