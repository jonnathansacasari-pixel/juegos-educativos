const NUM = ['', 'una', 'dos', 'tres', 'cuatro', 'cinco'], FOODS = [['🍪', 'galleta'], ['🍎', 'manzana'], ['🍓', 'fresa'], ['🍩', 'dona'], ['🍇', 'uva'], ['🍕', 'pizza']];
const COL = ['#a78bfa', '#34d399', '#fb923c', '#38bdf8', '#f472b6', '#facc15'];
let N, c, food, est = 0, busy;
const $ = id => document.getElementById(id);

function ronda() {
  c = 0; busy = false; N = 1 + Math.random() * 5 | 0; food = FOODS[Math.random() * 6 | 0];
  $('mons').style.setProperty('--m', COL[Math.random() * 6 | 0]); $('mons').className = 'monstruo'; $('barriga').textContent = '';
  $('pedido').innerHTML = `<span class="pn">${N}</span><span class="pd">${'<i></i>'.repeat(N)}</span>`;
  $('plato').innerHTML = '';
  for (let i = 0; i < N + 2; i++) {
    const b = document.createElement('button'); b.className = 'comida'; b.textContent = food[0]; b.style.animationDelay = -i * .4 + 's';
    b.onclick = () => dar(b); $('plato').appendChild(b);
  }
  if (window.decir) window.decir(`¡Tengo hambre! Quiero ${NUM[N]} ${food[1]}${N > 1 ? 's' : ''}`);
}

function dar(b) {
  if (b.dataset.u || busy || c >= N) return;
  b.dataset.u = 1; c++;
  const r = b.getBoundingClientRect(), m = $('boca').getBoundingClientRect(), f = b.cloneNode(true);
  f.className = 'vuela'; f.style.cssText = `left:${r.left}px;top:${r.top}px`; document.body.appendChild(f); b.style.visibility = 'hidden';
  requestAnimationFrame(() => { f.style.transform = `translate(${m.left + m.width / 2 - r.left - 30}px,${m.top + m.height / 2 - r.top - 30}px) scale(.3)`; });
  setTimeout(() => {
    f.remove(); $('mons').classList.remove('come'); void $('mons').offsetWidth; $('mons').classList.add('come');
    const dots = $('pedido').querySelectorAll('i'); if (dots[c - 1]) dots[c - 1].classList.add('on');
    $('barriga').textContent = c; if (window.decir) window.decir(['', 'uno', 'dos', 'tres', 'cuatro', 'cinco'][c]);
    createBurst(m.left + m.width / 2, m.top + m.height / 2, 10);
    if (c === N) fin();
  }, 550);
}

function fin() {
  busy = true;
  setTimeout(() => {
    est++; $('stars').textContent = '⭐ ' + est; $('mons').classList.add('feliz');
    if (window.decir) window.decir(`¡Gracias! ¡Qué rico! Me comí ${['', 'una', 'dos', 'tres', 'cuatro', 'cinco'][N]}`);
    createBurst(innerWidth / 2, innerHeight / 2, 70);
  }, 700);
  setTimeout(ronda, 4500);
}

ronda();