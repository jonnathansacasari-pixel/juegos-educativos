(function(){
  // --- 1. SINTETIZADOR DE VOZ (LECTURA EN ESPAÑOL NATIVA) ---
  var ss = window.speechSynthesis;
  window.mudo = false;
  if (ss) {
    var orig = ss.speak.bind(ss), voice = null;
    var pref = /(Dalia|Sabina|Paulina|Helena|Salome|Elena|Camila|Natural|Online|Google)/i;
    var male = /(Raul|Pablo|Jorge|Alvaro|Álvaro|Diego|Male)/i;
    var pick = function(){
      var l = ss.getVoices().filter(function(v){ return /^es/i.test(v.lang) && !male.test(v.name); });
      voice = l.find(function(v){ return /es[-_](MX|US|419|CO|AR)/i.test(v.lang) && pref.test(v.name); }) ||
              l.find(function(v){ return pref.test(v.name); }) ||
              l.find(function(v){ return /es[-_](MX|US|419)/i.test(v.lang); }) ||
              l[0] || null;
    };
    pick();
    if (ss.onvoiceschanged !== undefined) ss.onvoiceschanged = pick;

    window.decir = function(txt){
      if (window.mudo || !ss) return;
      ss.cancel();
      var u = new SpeechSynthesisUtterance(txt);
      u.lang = voice ? voice.lang : 'es-MX';
      if (voice) u.voice = voice;
      u.rate = 0.95;
      u.pitch = 1.1;
      u.volume = 1;
      orig(u);
    };
  } else {
    window.decir = function(){};
  }

  // --- 2. BOTÓN FLOTANTE DE SILENCIAR AUDIO ---
  var mb = document.createElement('button');
  mb.textContent = '🔊';
  mb.title = 'Activar/Desactivar Voz y Sonidos';
  mb.className = 'btn-audio-float';
  mb.onclick = function(){
    window.mudo = !window.mudo;
    mb.textContent = window.mudo ? '🔇' : '🔊';
    if (ss) ss.cancel();
  };
  document.body.appendChild(mb);

  // --- 3. EFECTO VISUAL DE PARTÍCULAS AL TOCAR BOTONES ---
  window.createBurst = function(x, y, n){
    n = n || 12;
    var s = ['⭐','✨','🌟','💖','🎈'], c = ['#ef4444','#3b82f6','#22c55e','#eab308','#a855f7','#ec4899'];
    for (var i = 0; i < n; i++){
      var p = document.createElement('div');
      p.className = 'particle';
      if (Math.random() > 0.4){
        p.textContent = s[Math.floor(Math.random() * s.length)];
        p.style.fontSize = (Math.random() * 18 + 22) + 'px';
      } else {
        p.style.width = p.style.height = (Math.random() * 14 + 10) + 'px';
        p.style.background = c[Math.floor(Math.random() * c.length)];
      }
      var a = Math.random() * 6.283, v = Math.random() * 160 + 60;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.setProperty('--dx', Math.cos(a) * v + 'px');
      p.style.setProperty('--dy', Math.sin(a) * v + 'px');
      document.body.appendChild(p);
      setTimeout(function(q){ q.remove(); }, 800, p);
    }
  };

  document.addEventListener('pointerdown', function(e){
    if (e.target.closest && e.target.closest('button,.character,.balloon,.card')){
      createBurst(e.clientX, e.clientY, 10);
    }
  });

  // --- 4. BASE DE DATOS ALINEADA (OBJETIVO Y EXACTAMENTE 3 DESTREZAS POR JUEGO) ---
  var JUEGOS_INFO = {
    'juego1-avatar': {
      id: 1,
      titulo: "Mi Carita Feliz Mágica",
      ambito: "Identidad y Autonomía",
      icono: "😊",
      color: "#ff477e",
      objetivo: "Desarrollar la identidad y autoimagen mediante el reconocimiento de las características físicas y la exploración de manifestaciones emocionales en un soporte digital interactivo.",
      destrezas: [
        "Elegir libremente tonos, peinados y accesorios para caracterizar su avatar expresando sus gustos y preferencias personales.",
        "Identificar e interpretar emociones básicas (felicidad, sorpresa, enojo, amor) a través del modelado de gestos faciales.",
        "Reconocer y valorar sus propias características físicas y emociones diferenciándolas de las de los demás."
      ]
    },
    'juego2-mosaico': {
      id: 2,
      titulo: "Atrapa Burbujas Musical",
      ambito: "Convivencia",
      icono: "🫧",
      color: "#0ea5e9",
      objetivo: "Incrementar la atención sostenida, la autorregulación y la interacción lúdica siguiendo dinámicas musicales y reglas sencillas de participación.",
      destrezas: [
        "Integrarse y participar activamente en dinámicas de juego interactivo con reglas sencillas y metas claras.",
        "Desarrollar la concentración visual y auditiva reaccionando al ritmo de melodías y notas musicales.",
        "Respetar los tiempos de respuesta y normas del juego promoviendo la autorregulación de impulsos."
      ]
    },
    'juego3-valores': {
      id: 3,
      titulo: "Palabras Mágicas",
      ambito: "Cívica y Acompañamiento Integral",
      icono: "🤗",
      color: "#a855f7",
      objetivo: "Promover valores de convivencia armónica, buen trato, cortesía y seguridad afectiva mediante la práctica de expresiones cotidianas de respeto.",
      destrezas: [
        "Practicar expresiones verbales de cortesía y cordialidad (Hola, Gracias, Por favor, Buenas noches) en contextos cotidianos.",
        "Identificar acciones e interacciones que favorecen la empatía, el buen trato y la convivencia escolar armónica.",
        "Reconocer situaciones de seguridad personal sabiendo comunicar afecto o pedir ayuda a adultos de confianza cuando sea necesario."
      ]
    },
    'juego4-granja': {
      id: 4,
      titulo: "La Granja Interactiva",
      ambito: "Relaciones con el Medio Natural y Cultural",
      icono: "🐶",
      color: "#16a34a",
      objetivo: "Descubrir y explorar el entorno natural reconociendo las características, sonidos y hábitats de los animales de la granja.",
      destrezas: [
        "Identificar características físicas y discriminar los sonidos onomatopéyicos característicos de los animales de la granja.",
        "Participar en adivinanzas auditivas y dinámicas de exploración identificando elementos propios de la naturaleza.",
        "Desarrollar actitudes de respeto, empatía y cuidado ambiental hacia los animales y seres vivos de su entorno."
      ]
    },
    'juego5-globos': {
      id: 5,
      titulo: "Alimenta al Monstruo (Cuenta Globos)",
      ambito: "Relaciones Lógico-Matemáticas",
      icono: "🔢",
      color: "#ea580c",
      objetivo: "Comprender la noción de cantidad, conteo y correspondencia uno a uno asociando el número con conjuntos de objetos en problemas cotidianos.",
      destrezas: [
        "Contar objetos en secuencia numérica del 1 al 10 en situaciones lúdicas de conteo y alimentación.",
        "Clasificar y asociar la cantidad solicitada con la colección exacta de objetos visuales.",
        "Reconocer la relación entre el número hablado/escrito y la cantidad real de elementos presentados."
      ]
    },
    'juego6-cuentos': {
      id: 6,
      titulo: "Los 10 Cuentos del Osito",
      ambito: "Comprensión y Expresión del Lenguaje",
      icono: "🐻",
      color: "#ca8a04",
      objetivo: "Incrementar la capacidad comunicativa y la comprensión lectora inicial mediante la interpretación de pictogramas e historias interactivas.",
      destrezas: [
        "Incrementar el vocabulario e interpretar pictogramas e imágenes siguiendo la secuencia lógica de un relato.",
        "Responder a preguntas e interactuar con los personajes principales para comprender el sentido global de la historia.",
        "Articular palabras y expresiones verbales acompañando la lectura guiada por voz e historias animadas."
      ]
    },
    'juego7-arte': {
      id: 7,
      titulo: "Colorea y Dibujo Libre",
      ambito: "Expresión Artística",
      icono: "🖍️",
      color: "#db2777",
      objetivo: "Desarrollar la sensibilidad estético-creativa y la imaginación mediante el uso de herramientas de pintura digital y combinación de formas.",
      destrezas: [
        "Experimentar con diversas técnicas y herramientas digitales (trazos, pinceles, borrador y paleta de colores).",
        "Expresar vivencias, emociones e ideas libremente a través del dibujo y el coloreado de ilustraciones.",
        "Explorar la combinación de colores, texturas visuales y formas geométricas en creaciones artísticas propias."
      ]
    },
    'juego8-simon': {
      id: 8,
      titulo: "La Heladería Mágica",
      ambito: "Expresión Corporal y Motricidad",
      icono: "🍦",
      color: "#2563eb",
      objetivo: "Desarrollar la coordinación viso-motriz fina, la precisión digital y el seguimiento de secuencias lógicas en tareas de apilamiento.",
      destrezas: [
        "Ejecutar movimientos de pinza digital y toque preciso sobre la pantalla táctil para arrastrar y colocar elementos.",
        "Coordinar la alineación viso-motriz manteniendo el equilibrio y orden secuencial al apilar las bolas de helado.",
        "Seguir instrucciones secuenciales de pedidos respetando patrones visuales y espaciales."
      ]
    }
  };

  window.JUEGOS_INFO = JUEGOS_INFO;

  // Detectar juego o menú actual
  var path = window.location.pathname;
  var currentGameKey = null;
  for (var key in JUEGOS_INFO) {
    if (path.indexOf(key) !== -1) {
      currentGameKey = key;
      break;
    }
  }

  // --- 5. CREACIÓN DINÁMICA DE LA VENTANA FLOTANTE (MODAL PEDAGÓGICO) ---
  var modalOverlay = document.createElement('div');
  modalOverlay.className = 'pedagogia-modal-overlay';
  modalOverlay.id = 'pedagogiaModal';
  modalOverlay.innerHTML = '<div class="pedagogia-modal-content">' +
    '<button class="pedagogia-modal-close" onclick="cerrarPedagogiaModal()">✖</button>' +
    '<div id="pedagogiaModalBody"></div>' +
    '</div>';
  document.body.appendChild(modalOverlay);

  modalOverlay.onclick = function(e){
    if (e.target === modalOverlay) cerrarPedagogiaModal();
  };

  window.abrirPedagogiaModal = function(key) {
    var k = key || currentGameKey;
    if (k === 'todos' || !JUEGOS_INFO[k]) {
      mostrarMatrizCompleta();
      return;
    }
    var info = JUEGOS_INFO[k];
    var body = document.getElementById('pedagogiaModalBody');
    var html = '<div class="modal-header-badge" style="background:'+info.color+'">' + info.icono + ' ' + info.ambito + '</div>' +
      '<h2 class="modal-title">' + info.titulo + '</h2>' +
      '<div class="modal-section">' +
        '<h3>🎯 Objetivo de Aprendizaje</h3>' +
        '<p class="modal-objetivo">' + info.objetivo + '</p>' +
      '</div>' +
      '<div class="modal-section">' +
        '<h3>⭐ Destrezas a Desarrollar (3 Destrezas)</h3>' +
        '<ul class="modal-destrezas">';
    info.destrezas.forEach(function(d, index){
      html += '<li><span>' + (index + 1) + '.</span> ' + d + '</li>';
    });
    html += '</ul></div>' +
      '<div class="modal-actions">' +
        '<button class="btn-modal-speech" onclick="decirModalText(\''+k+'\')">🔊 Escuchar Objetivo y Destrezas</button>' +
        '<button class="btn-modal-close-main" onclick="cerrarPedagogiaModal()">👍 ¡Entendido!</button>' +
      '</div>';

    body.innerHTML = html;
    document.getElementById('pedagogiaModal').classList.add('active');
    if (window.decir) window.decir(info.titulo + ". " + info.ambito + ". Objetivo: " + info.objetivo);
  };

  window.mostrarMatrizCompleta = function() {
    var body = document.getElementById('pedagogiaModalBody');
    var html = '<div class="modal-header-badge" style="background:#475569">🎓 Matriz Curricular • Educación Inicial</div>' +
      '<h2 class="modal-title">Objetivos y 3 Destrezas por Juego</h2>' +
      '<div class="modal-matriz-list">';
    for (var k in JUEGOS_INFO) {
      var item = JUEGOS_INFO[k];
      html += '<div class="matriz-card" style="border-left: 6px solid '+item.color+'" onclick="abrirPedagogiaModal(\''+k+'\')">' +
        '<div class="matriz-card-header">' +
          '<span class="matriz-icon">'+item.icono+'</span>' +
          '<strong>Juego '+item.id+': '+item.titulo+'</strong>' +
          '<span class="matriz-badge" style="background:'+item.color+'">'+item.ambito+'</span>' +
        '</div>' +
        '<p class="matriz-obj"><strong>🎯 Objetivo:</strong> '+item.objetivo+'</p>' +
        '<ul class="matriz-dest-preview" style="margin-top:6px; padding-left:18px; font-size:0.85rem; color:#475569;">' +
          '<li><strong>1:</strong> '+item.destrezas[0]+'</li>' +
          '<li><strong>2:</strong> '+item.destrezas[1]+'</li>' +
          '<li><strong>3:</strong> '+item.destrezas[2]+'</li>' +
        '</ul>' +
      '</div>';
    }
    html += '</div>' +
      '<div class="modal-actions">' +
        '<button class="btn-modal-close-main" onclick="cerrarPedagogiaModal()">❌ Cerrar</button>' +
      '</div>';
    body.innerHTML = html;
    document.getElementById('pedagogiaModal').classList.add('active');
  };

  window.decirModalText = function(key) {
    var k = key || currentGameKey;
    var info = JUEGOS_INFO[k];
    if (info && window.decir) {
      var text = info.titulo + ". Objetivo: " + info.objetivo + ". Destreza 1: " + info.destrezas[0] + ". Destreza 2: " + info.destrezas[1] + ". Destreza 3: " + info.destrezas[2];
      window.decir(text);
    }
  };

  window.cerrarPedagogiaModal = function() {
    document.getElementById('pedagogiaModal').classList.remove('active');
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // --- 6. INCORPORACIÓN AUTOMÁTICA DE BOTONES EN JUEGOS Y MENÚ ---
  document.addEventListener('DOMContentLoaded', function() {
    if (currentGameKey) {
      var btnFloat = document.createElement('button');
      btnFloat.className = 'btn-pedagogia-float';
      btnFloat.innerHTML = '🎯 <span class="btn-text-ped">Objetivo y 3 Destrezas</span>';
      btnFloat.title = 'Ver Objetivo Pedagógico y 3 Destrezas';
      btnFloat.onclick = function() { abrirPedagogiaModal(currentGameKey); };
      document.body.appendChild(btnFloat);

      var topNav = document.querySelector('.top-nav, .game-header, nav.top-nav');
      if (topNav) {
        var btnNav = document.createElement('button');
        btnNav.className = 'btn-act btn-pedagogia-nav';
        btnNav.innerHTML = '🎯 Objetivo y Destrezas';
        btnNav.onclick = function() { abrirPedagogiaModal(currentGameKey); };
        topNav.appendChild(btnNav);
      }
    } else {
      var header = document.querySelector('header, .header');
      if (header) {
        var btnMenu = document.createElement('button');
        btnMenu.className = 'btn-matriz-menu';
        btnMenu.innerHTML = '📋 Ver Objetivos y 3 Destrezas Pedagógicas';
        btnMenu.onclick = function() { mostrarMatrizCompleta(); };
        header.appendChild(btnMenu);
      }

      var cards = document.querySelectorAll('.card');
      cards.forEach(function(card){
        var link = card.getAttribute('href') || '';
        for (var k in JUEGOS_INFO) {
          if (link.indexOf(k) !== -1) {
            (function(gameKey){
              var infoBtn = document.createElement('button');
              infoBtn.className = 'card-info-btn';
              infoBtn.innerHTML = '🎯 Objetivo y 3 Destrezas';
              infoBtn.onclick = function(e){
                e.preventDefault();
                e.stopPropagation();
                abrirPedagogiaModal(gameKey);
              };
              card.appendChild(infoBtn);
            })(k);
          }
        }
      });
    }
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') cerrarPedagogiaModal();
  });
})();