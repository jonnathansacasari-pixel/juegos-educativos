let score = 0;
let quizMode = false;
let currentTargetAnimal = null;

// Audios directos MP3/OGG de alta calidad para niños
const animalAudioFiles = {
  vaca: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Cow_moo.ogg',
  caballo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Horse_neigh.ogg',
  oveja: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Sheep_bleat.ogg',
  cerdo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Pig_grunt.ogg',
  gallina: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Rooster_crowing.ogg',
  perro: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Barking_dog_sound.ogg',
  gato: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat_meow.ogg',
  pato: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Duck_quack.ogg'
};

const animalsList = [
  { id: 'vaca', name: 'La Vaca', soundName: '¡Muuuu!' },
  { id: 'caballo', name: 'El Caballo', soundName: '¡Hiiii!' },
  { id: 'oveja', name: 'La Oveja', soundName: '¡Beeee!' },
  { id: 'cerdo', name: 'El Cerdo', soundName: '¡Oink oink!' },
  { id: 'gallina', name: 'La Gallina', soundName: '¡Cocorocó!' },
  { id: 'perro', name: 'El Perro', soundName: '¡Guau guau!' },
  { id: 'gato', name: 'El Gato', soundName: '¡Miauuu!' },
  { id: 'pato', name: 'El Pato', soundName: '¡Cua cua!' }
];

let currentAudio = null;

// Reproductor del sonido del animal
function playRealisticAnimalSound(type) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const url = animalAudioFiles[type];
  if (url) {
    currentAudio = new Audio(url);
    currentAudio.volume = 0.85;
    currentAudio.play().catch(() => {
      // Si el navegador bloquea el audio automático, recurre a la voz
      const item = animalsList.find(a => a.id === type);
      if (item && window.decir) window.decir(item.soundName);
    });
  }
}

function playAnimal(animalId, event) {
  playRealisticAnimalSound(animalId);

  if (quizMode) {
    if (animalId === currentTargetAnimal.id) {
      score += 10;
      document.getElementById('basketCount').textContent = score;
      if (window.createBurst && event) createBurst(event.clientX, event.clientY, 25);
      setLumiText('¡Excelente! ¡Encontraste ' + currentTargetAnimal.name + '! 🎉');
      
      setTimeout(() => {
        if (window.decir) window.decir('¡Muy bien! Acertaste.');
      }, 1000);

      setTimeout(nextQuizQuestion, 2500);
    } else {
      setLumiText('¡Sigue intentando! Ese no es ' + currentTargetAnimal.name);
      setTimeout(() => {
        if (window.decir) window.decir('Intenta de nuevo.');
      }, 1000);
    }
  } else {
    const item = animalsList.find(a => a.id === animalId);
    if (item) {
      setLumiText('¡Escuchas a ' + item.name + '! ' + item.soundName);
      if (window.createBurst && event) createBurst(event.clientX, event.clientY, 10);
    }
  }
}

function harvestApple(event) {
  const target = event.target;
  if (target.classList.contains('apple')) {
    target.style.opacity = '0';
    target.style.pointerEvents = 'none';
    score += 5;
    document.getElementById('basketCount').textContent = score;
    setLumiText('¡Cosechaste una deliciosa Manzana! 🍎 (Crece en los árboles)');
    if (window.decir) window.decir('¡Manzana cosechada!');
    if (window.createBurst) createBurst(event.clientX, event.clientY, 15);
    setTimeout(() => { target.style.opacity = '1'; target.style.pointerEvents = 'auto'; }, 6000);
  }
}

function harvestCrop(element, cropName) {
  element.style.transform = 'scale(0.2) rotate(180deg)';
  element.style.opacity = '0.3';
  score += 5;
  document.getElementById('basketCount').textContent = score;
  setLumiText('¡Cosechaste ' + cropName + ' de la tierra! 🧺');
  if (window.decir) window.decir(cropName + ' cosechado');
  setTimeout(() => { element.style.transform = 'none'; element.style.opacity = '1'; }, 5000);
}

function playTractor(event) {
  if (window.decir) window.decir('¡Brum brum! El tractor trabaja en el campo.');
  setLumiText('¡Brum brum! El tractor está trabajando la tierra 🚜');
  if (window.createBurst && event) createBurst(event.clientX, event.clientY, 15);
}

function toggleGameMode() {
  quizMode = !quizMode;
  const btn = document.getElementById('modeBtn');
  if (quizMode) {
    btn.textContent = '🌿 Modo Libre';
    btn.style.background = '#eab308';
    nextQuizQuestion();
  } else {
    btn.textContent = '🎯 ¡Adivina el Sonido!';
    btn.style.background = '#a855f7';
    setLumiText('¡Modo libre! Toca los animales o cosecha frutas.');
  }
}

function nextQuizQuestion() {
  if (!quizMode) return;
  const randomIdx = Math.floor(Math.random() * animalsList.length);
  currentTargetAnimal = animalsList[randomIdx];
  setLumiText('🎯 ¿Quién hace este sonido? ¡Escucha con atención!');
  setTimeout(() => { playRealisticAnimalSound(currentTargetAnimal.id); }, 600);
}

function setLumiText(txt) {
  const el = document.getElementById('lumiText');
  if (el) el.textContent = txt;
}