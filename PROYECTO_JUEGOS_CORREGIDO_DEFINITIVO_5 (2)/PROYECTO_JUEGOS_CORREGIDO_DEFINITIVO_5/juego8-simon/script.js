const SAB = [
  ['fresa', '#f43f5e'],
  ['chocolate', '#78350f'],
  ['vainilla', '#fef08a'],
  ['menta', '#4ade80'],
  ['mora', '#c084fc'],
  ['mango', '#fb923c']
];

const TOP = [
  { id: '🍒', name: 'Cereza Real' },
  { id: '🌈', name: 'Chispitas de Colores' },
  { id: '⭐', name: 'Estrellas de Azúcar' },
  { id: '🍓', name: 'Fresa Mágica' },
  { id: '🍫', name: 'Barra de Chocolate' },
  { id: '🍪', name: 'Galleta OREO' }
];

const CL = ['🐻', '🐰', '🐶', '🐱', '🐼', '🦁', '🐵'];

let bolas = 0, topE = null, serv = 0, ocupado = false;
let tipoBase = 'cono';

const hel = document.getElementById('hel'), cli = document.getElementById('cli');

function setBase(base) {
  if (ocupado) return;
  tipoBase = base;
  document.getElementById('btn-cono').classList.toggle('active', base === 'cono');
  document.getElementById('btn-copa').classList.toggle('active', base === 'copa');
  document.getElementById('svg-cono').classList.toggle('active', base === 'cono');
  document.getElementById('svg-copa').classList.toggle('active', base === 'copa');
  recalcularPosiciones();
  if (window.decir) window.decir(base === 'cono' ? 'Cono de Rombos seleccionado' : 'Copa Cristal seleccionada');
}

SAB.forEach((s, i) => {
  const b = document.createElement('button');
  b.className = 'sab';
  b.style.setProperty('--c', s[1]);
  b.onclick = e => bola(i, e);
  document.getElementById('sab').appendChild(b);
});

TOP.forEach(t => {
  const b = document.createElement('button');
  b.className = 'tp';
  b.textContent = t.id;
  b.onclick = e => poner(t.id, e);
  document.getElementById('tops').appendChild(b);
});

function recalcularPosiciones() {
  const baseOffset = tipoBase === 'cono' ? 120 : 55;
  const espaciado = 45;

  const listaBolas = hel.querySelectorAll('.bola');
  listaBolas.forEach((b, idx) => {
    b.style.bottom = (baseOffset + idx * espaciado) + 'px';
    b.style.zIndex = 3 + idx;
  });

  if (topE) {
    topE.style.bottom = (baseOffset + (bolas - 1) * espaciado + 45) + 'px';
  }
}

function bola(i, e) {
  if (ocupado) return;
  if (bolas >= 4) {
    if (window.decir) window.decir('¡El helado ya está gigante! Toca servir.');
    return;
  }

  const d = document.createElement('div');
  d.className = 'bola';
  d.style.setProperty('--c', SAB[i][1]);
  hel.appendChild(d);
  bolas++;

  recalcularPosiciones();

  if (window.decir) window.decir(SAB[i][0]);
  if (typeof createBurst === 'function') createBurst(e.clientX, e.clientY, 10);
}

function poner(t, e) {
  if (ocupado || !bolas) {
    if (!bolas && window.decir) window.decir('Primero coloca las bolas de helado');
    return;
  }
  if (topE) topE.remove();

  if (t === '🌈') {
    topE = document.createElement('div');
    topE.className = 'top-grageas-cont';
    let grageasHTML = '';
    const colors = ['#ef4444', '#3b82f6', '#facc15', '#22c55e', '#ec4899', '#a855f7'];
    
    // Grageas en cascada desde la bola superior hacia abajo
    const cantidadGrageas = 10 + (bolas * 5);
    for (let g = 0; g < cantidadGrageas; g++) {
      const left = Math.random() * 110 + 10;
      const top = Math.random() * (bolas * 35) - 20; // Comienzan desde bien arriba
      const rot = Math.random() * 360;
      grageasHTML += `<div class="gragea" style="left:${left}px; top:${top}px; background:${colors[g % colors.length]}; transform:rotate(${rot}deg);"></div>`;
    }
    topE.innerHTML = grageasHTML;
  } else if (t === '⭐') {
    topE = document.createElement('div');
    topE.className = 'top-estrellas-cont';
    let estrellasHTML = '';
    
    // 16 estrellitas desde la punta
    for (let s = 0; s < 16; s++) {
      const left = Math.random() * 110 + 10;
      const top = Math.random() * (bolas * 35) - 20; // Comienzan arriba
      estrellasHTML += `<div class="estrella-item" style="left:${left}px; top:${top}px;">★</div>`;
    }
    topE.innerHTML = estrellasHTML;
  } else if (t === '🍒' || t === '🍓') {
    // Fresa y Cereza colocadas directo en la punta
    topE = document.createElement('div');
    topE.className = 'top-punta';
    if (t === '🍒') topE.innerHTML = '<div class="top-cereza"></div>';
    else if (t === '🍓') topE.innerHTML = '<div class="top-fresa"></div>';
  } else {
    // Chocolate y Galleta colocados detrás para simular estar introducidos
    topE = document.createElement('div');
    topE.className = 'top-atras';
    if (t === '🍫') topE.innerHTML = '<div class="top-chocolate"></div>';
    else if (t === '🍪') topE.innerHTML = '<div class="top-galleta"></div>';
  }

  hel.appendChild(topE);
  recalcularPosiciones();

  if (typeof createBurst === 'function') createBurst(e.clientX, e.clientY, 12);
  const item = TOP.find(x => x.id === t);
  if (window.decir) window.decir(item ? item.name : '¡Decoración lista!');
}

function servir() {
  if (ocupado) return;
  if (!bolas) {
    if (window.decir) window.decir('Elige tus sabores primero');
    return;
  }
  ocupado = true;
  hel.classList.add('vuela');

  setTimeout(() => {
    cli.classList.add('feliz');
    cli.textContent = '😋';
    if (window.decir) window.decir('¡Mmm, qué helado tan delicioso! ¡Muchas gracias!');
    serv++;
    document.getElementById('cnt').textContent = '🍦 ' + serv;
    if (typeof createBurst === 'function') createBurst(window.innerWidth * 0.7, window.innerHeight * 0.45, 60);
  }, 650);

  setTimeout(() => {
    hel.querySelectorAll('.bola, .top-atras, .top-punta, .top-grageas-cont, .top-estrellas-cont').forEach(x => x.remove());
    topE = null;
    bolas = 0;
    hel.classList.remove('vuela');
    cli.classList.remove('feliz');
    cli.textContent = CL[Math.floor(Math.random() * CL.length)];
    ocupado = false;
    if (window.decir) window.decir('¿Quién quiere otro helado?');
  }, 3200);
}