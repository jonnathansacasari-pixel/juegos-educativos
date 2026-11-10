const S = [
  { bg: 'linear-gradient(#fdba74,#fde68a 55%,#86efac)', t: 'Cuento 1: El Despertar del Osito. ¡Tócalo para despertarlo!', it: [['☀️', 72, 4, 7], ['🌳', 3, 36, 9], ['😴', 40, 32, 10, '¡Buenos días! ¡Tengo mucha hambre!', '🐻']] },
  { bg: 'linear-gradient(#bae6fd,#bbf7d0)', t: 'Cuento 2: El Amigo Conejito. Tócalo para que te guíe a las frutas.', it: [['🌲', 4, 32, 9], ['🐻', 20, 48, 8], ['🐰', 58, 46, 8, '¡Hay deliciosas manzanas cruzando el arroyo!', '🐰']] },
  { bg: 'linear-gradient(#7dd3fc,#0ea5e9)', t: 'Cuento 3: Cruzando el Río. Salta sobre los tres pececitos.', it: [['🐻', 5, 22, 8], ['🐟', 26, 60, 6, '¡Uno!'], ['🐟', 46, 60, 6, '¡Dos!'], ['🐟', 66, 60, 6, '¡Tres!']] },
  { bg: 'linear-gradient(#fef9c3,#fde68a)', t: 'Cuento 4: El Tesoro de Miel. Toca las abejitas amigables.', it: [['🌳', 38, 18, 11], ['🐝', 20, 25, 6, '¡Bzzz! ¡Pasa, osito amigable!'], ['🐝', 70, 25, 6, '¡Bzzz! ¡Aquí está la miel!']] },
  { bg: 'linear-gradient(#c4b5fd,#fde68a)', t: 'Cuento 5: El Picnic en el Bosque. Toca el tarro de miel.', it: [['🐻', 14, 36, 9], ['🐰', 70, 40, 7], ['🍯', 42, 40, 9, '¡Mmm, qué rica miel compartida!']] },
  { bg: 'linear-gradient(#fca5a5,#fef08a)', t: 'Cuento 6: El Regalo del Granjero. Toca la manzana gigante.', it: [['🧺', 65, 45, 8], ['🍎', 35, 40, 9, '¡Una manzana dulce y jugosa para el osito!']] },
  { bg: 'linear-gradient(#fed7aa,#fdba74)', t: 'Cuento 7: Jugando con la Mariposa. Tócala para verla volar.', it: [['🐻', 20, 40, 9], ['🦋', 60, 30, 8, '¡A volar alto por los cielos!']] },
  { bg: 'linear-gradient(#bae6fd,#e0f2fe)', t: 'Cuento 8: Chapuzón en el Lago. Toca el patito de goma.', it: [['🐻', 15, 35, 9], ['🦆', 60, 45, 8, '¡Cuac cuac! ¡El agua está fresquita!']] },
  { bg: 'linear-gradient(#e9d5ff,#c084fc)', t: 'Cuento 9: Mirando las Estrellas. Toca la estrella fugaz.', it: [['🌙', 75, 10, 8], ['⭐', 35, 20, 9, '¡Pide un deseo mágico, osito!']] },
  { bg: 'linear-gradient(#312e81,#4338ca)', t: 'Cuento 10: La Hora de Dormir. Toca la mantita para abrigar al osito.', it: [['🐻', 40, 35, 10], ['🛏️', 38, 55, 9, '¡Hasta mañana! Que tengas hermosos sueños. Fin.']] }
];

let i = 0, hechos = 0;
const $ = id => document.getElementById(id);

function mostrar() {
  const p = S[i]; hechos = 0; const meta = p.it.filter(x => x[4]).length;
  $('escena').style.background = p.bg; $('escena').innerHTML = ''; $('sig').classList.remove('listo');
  p.it.forEach((x, k) => {
    const d = document.createElement('div'); d.className = 'it' + (x[4] ? ' ac' : ''); d.textContent = x[0];
    d.style.cssText = `left:${x[1]}%;top:${x[2]}%;font-size:${x[3]}rem;animation-delay:${-k*.7}s`;
    if (x[4]) d.onclick = e => {
      if (d.dataset.h) return; d.dataset.h = 1; d.classList.remove('ac'); if (x[5]) d.textContent = x[5];
      if (window.decir) window.decir(x[4]); createBurst(e.clientX, e.clientY, 20);
      if (++hechos >= meta) { $('sig').classList.add('listo'); setTimeout(() => createBurst(innerWidth / 2, innerHeight / 3, 40), 500); }
    };
    $('escena').appendChild(d);
  });
  $('texto').textContent = p.t; $('pg').textContent = (i + 1) + '/10'; leer();
}

function leer() { if (window.decir) window.decir(S[i].t); }
function ir(d) { i = (i + d + S.length) % S.length; mostrar(); }
mostrar();