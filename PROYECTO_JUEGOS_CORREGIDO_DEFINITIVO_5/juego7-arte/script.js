const R=(x,y,w,h,rx)=>`<rect class="z" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx||0}"/>`,Ci=(x,y,r)=>`<circle class="z" cx="${x}" cy="${y}" r="${r}"/>`,E=(x,y,a,b,rot)=>`<ellipse class="z" cx="${x}" cy="${y}" rx="${a}" ry="${b}" transform="rotate(${rot||0} ${x} ${y})"/>`,Po=p=>`<polygon class="z" points="${p}"/>`;
const D=[
['🏠 Casa',R(0,0,400,165)+R(0,165,400,95)+Ci(340,46,30)+E(85,52,48,20)+R(322,165,16,48)+Ci(330,135,42)+R(120,112,140,102)+Po('105,117 190,55 275,117')+R(175,152,30,62)+R(218,132,30,30)],
['🐠 Pez',R(0,0,400,210)+R(0,210,400,50)+Po('285,130 365,75 365,185')+Po('150,75 190,28 232,78')+E(190,130,105,65)+Ci(132,115,14)+Ci(335,45,14)+Ci(308,85,10)+Ci(60,60,10)],
['🦋 Mariposa',R(0,0,400,260)+E(125,100,78,55,-20)+E(275,100,78,55,20)+E(140,185,55,42,20)+E(260,185,55,42,-20)+E(200,140,15,72)+Ci(200,62,17)+Ci(125,100,20)+Ci(275,100,20)],
['🌸 Flor',R(0,0,400,185)+R(0,185,400,75)+R(192,150,16,110)+Po('192,225 135,190 150,238')+Ci(256,100,32)+Ci(228,149,32)+Ci(172,149,32)+Ci(144,100,32)+Ci(172,51,32)+Ci(228,51,32)+Ci(200,100,30)],
['🚗 Carro',R(0,0,400,172)+R(0,172,400,88)+Ci(345,45,28)+R(65,112,270,62,22)+`<path class="z" d="M130 112 L160 66 H250 L288 112 Z"/>`+Po('150,108 168,76 196,76 196,108')+Po('206,108 206,76 244,76 264,108')+Ci(125,176,27)+Ci(278,176,27)]];

const C=['#ef4444','#f97316','#facc15','#22c55e','#38bdf8','#3b82f6','#a855f7','#ec4899','#92400e','#1e293b','#ffffff'];
let col=C[0],n=0,hechas=new Set(),Z=[];
const P=document.getElementById('paleta'),V=document.getElementById('dib');

C.forEach((c,i)=>{const b=document.createElement('button');b.className='col'+(i?'':' sel');b.style.background=c;b.onclick=()=>{col=c;esBorrador=false;document.querySelectorAll('.col').forEach(x=>x.classList.remove('sel'));b.classList.add('sel')};P.appendChild(b)});

function cargar(){hechas.clear();V.innerHTML=D[n][1];document.getElementById('nom').textContent=D[n][0];Z=[...V.querySelectorAll('.z')];
  Z.forEach((z,i)=>z.onclick=e=>{z.style.fill=col;hechas.add(i);if(window.createBurst)createBurst(e.clientX,e.clientY,12);
    if(hechas.size===Z.length){if(window.decir)window.decir('¡Qué hermoso dibujo! ¡Lo lograste!');for(let k=0;k<6;k++)setTimeout(()=>createBurst(Math.random()*innerWidth,Math.random()*innerHeight*.7+60,40),k*250);setTimeout(()=>cambiar(1),4500)}})}

function cambiar(d){n=(n+d+D.length)%D.length;cargar()}
function reiniciar(){if(modoLibre)limpiarCanvasLibre();else cargar()}

let modoLibre = false, dibujando = false, grosorActual = 10, esBorrador = false;
const canvas = document.getElementById('paintCanvas'), ctx = canvas.getContext('2d');

function toggleModoLibre() {
  modoLibre = !modoLibre;
  const btn = document.getElementById('btnModo'), secSel = document.getElementById('secSelector'), contCanvas = document.getElementById('contenedorCanvas');
  if (modoLibre) {
    btn.textContent = '🖼️ Dibujos Pre-hechos'; V.style.display = 'none'; secSel.style.display = 'none'; contCanvas.style.display = 'block';
    limpiarCanvasLibre(); if(window.decir)window.decir("¡Modo dibujo libre! Dibuja lo que quieras.");
  } else {
    btn.textContent = '🎨 Dibujo Libre'; V.style.display = 'block'; secSel.style.display = 'flex'; contCanvas.style.display = 'none';
    if(window.decir)window.decir("¡Elegiste colorear figuras!");
  }
}

function setGrosor(g) { grosorActual = g; esBorrador = false; }
function usarBorrador() { esBorrador = true; if(window.decir)window.decir("Borrador listo"); }
function limpiarCanvasLibre() { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }

function pos(e) {
  const r = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: (clientX - r.left) * (canvas.width / r.width), y: (clientY - r.top) * (canvas.height / r.height) };
}

canvas.addEventListener('mousedown', e => { dibujando = true; ctx.beginPath(); const p = pos(e); ctx.moveTo(p.x, p.y); });
canvas.addEventListener('mousemove', e => {
  if (!dibujando) return; const p = pos(e); ctx.lineTo(p.x, p.y);
  ctx.strokeStyle = esBorrador ? '#ffffff' : col; ctx.lineWidth = grosorActual; ctx.lineCap = 'round'; ctx.stroke();
});
canvas.addEventListener('mouseup', () => dibujando = false);
canvas.addEventListener('mouseleave', () => dibujando = false);

canvas.addEventListener('touchstart', e => { dibujando = true; ctx.beginPath(); const p = pos(e); ctx.moveTo(p.x, p.y); });
canvas.addEventListener('touchmove', e => {
  if (!dibujando) return; const p = pos(e); ctx.lineTo(p.x, p.y);
  ctx.strokeStyle = esBorrador ? '#ffffff' : col; ctx.lineWidth = grosorActual; ctx.lineCap = 'round'; ctx.stroke();
});
canvas.addEventListener('touchend', () => dibujando = false);

cargar();