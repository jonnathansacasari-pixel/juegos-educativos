// ==========================================================
// GAME ENGINE - LA GRANJA INTERACTIVA (100% OFFLINE)
// ==========================================================

const ANIMALES = {
  'perro':   { nombre: 'el Perro',   sonido: '¡Guau guau!',   emoji: '🐶' },
  'gato':    { nombre: 'el Gato',    sonido: '¡Miau miau!',   emoji: '🐱' },
  'vaca':    { nombre: 'la Vaca',    sonido: '¡Muuuuu!',      emoji: '🐮' },
  'oveja':   { nombre: 'la Oveja',   sonido: '¡Baaaaa!',      emoji: '🐑' },
  'cerdo':   { nombre: 'el Cerdo',   sonido: '¡Oink oink!',   emoji: '🐷' },
  'gallo':   { nombre: 'el Gallo',   sonido: '¡Kikirikí!',   emoji: '🐓' },
  'pato':    { nombre: 'el Pato',    sonido: '¡Cua cua!',     emoji: '🦆' },
  'caballo': { nombre: 'el Caballo', sonido: '¡Hiiiiii!',     emoji: '🐴' }
};

let basketCount = 0;
let gameMode = 'libre'; // 'libre' o 'adivina'
let targetAnimal = null;

// Reproduce el audio mp3 desde ./sonidos/
function playAnimal(animalKey, e) {
  if (e && window.createBurst) {
    window.createBurst(e.clientX, e.clientY, 12);
  }

  const data = ANIMALES[animalKey];
  if (!data) return;

  // 1. Intentar reproducir el archivo .mp3 local de /sonidos/
  const audioLocal = new Audio(`./sonidos/${animalKey}.mp3`);
  
  const playPromise = audioLocal.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Respaldo de Lumi si el mp3 no se encuentra o el navegador bloquea audio
      if (window.decir) window.decir(data.sonido);
    });
  }

  // 2. Lógica según el modo de juego
  if (gameMode === 'libre') {
    setLumiText(`¡Escuchaste a ${data.nombre}! ${data.emoji}`);
    if (window.decir) window.decir(`Es ${data.nombre}`);
  } else if (gameMode === 'adivina') {
    if (animalKey === targetAnimal) {
      basketCount += 5;
      updateBasket();
      setLumiText(`🎉 ¡Correcto! Es ${data.nombre} ${data.emoji}`);
      if (window.decir) window.decir(`¡Excelente! Encontraste a ${data.nombre}`);
      setTimeout(nextRiddle, 2000);
    } else {
      setLumiText(`❌ ¡Ups! Ese es ${data.nombre}. ¡Sigue buscando!`);
      if (window.decir) window.decir(`Ese es ${data.nombre}. Intenta otra vez.`);
    }
  }
}

// Cosecha de Manzanas
function harvestApple(e) {
  if (e && window.createBurst) window.createBurst(e.clientX, e.clientY, 15);
  basketCount += 1;
  updateBasket();
  setLumiText('🍎 ¡Cosechaste una manzana fresca!');
  if (window.decir) window.decir('¡Cosechaste una manzana!');
}

// Cosecha de Huerta (Zanahoria / Maíz)
function harvestCrop(elem, cropName, e) {
  if (e && window.createBurst) window.createBurst(e.clientX, e.clientY, 15);
  basketCount += 1;
  updateBasket();
  setLumiText(`✨ ¡Cosechaste ${cropName}!`);
  if (window.decir) window.decir(`Cosechaste ${cropName}`);
  
  elem.style.transform = 'scale(0)';
  setTimeout(() => { elem.style.transform = 'scale(1)'; }, 3000);
}

// Tractor
function playTractor(e) {
  if (e && window.createBurst) window.createBurst(e.clientX, e.clientY, 15);
  setLumiText('🚜 ¡Ruuuuum! El tractor trabaja en la granja.');
  if (window.decir) window.decir('¡Rrum rrum! El tractor de la granja.');
}

// Cambiar entre Modo Libre y Modo Adivinanza
function toggleGameMode() {
  const btn = document.getElementById('modeBtn');
  if (gameMode === 'libre') {
    gameMode = 'adivina';
    btn.textContent = '🌿 Modo Libre';
    btn.style.background = '#3b82f6';
    nextRiddle();
  } else {
    gameMode = 'libre';
    btn.textContent = '🎯 ¡Adivina el Sonido!';
    btn.style.background = '#f59e0b';
    setLumiText('¡Toca los animales para escucharlos o cosecha frutas en la granja!');
    if (window.decir) window.decir('Modo libre activado. Explora la granja.');
  }
}

// Genera adivinanza
function nextRiddle() {
  const keys = Object.keys(ANIMALES);
  targetAnimal = keys[Math.floor(Math.random() * keys.length)];
  const info = ANIMALES[targetAnimal];

  setLumiText(`❓ ¿Dónde está el animal que hace: "${info.sonido}"?`);
  
  // Hacer sonar la pista localmente
  const audioLocal = new Audio(`./sonidos/${targetAnimal}.mp3`);
  audioLocal.play().catch(() => {
    if (window.decir) window.decir(`¿Quién hace ${info.sonido}?`);
  });
}

function updateBasket() {
  document.getElementById('basketCount').textContent = basketCount;
}

function setLumiText(txt) {
  document.getElementById('lumiText').textContent = txt;
}

// Inicio
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (window.decir) window.decir("¡Bienvenido a La Granja Mágica! Toca los animales para escucharlos.");
  }, 600);
});