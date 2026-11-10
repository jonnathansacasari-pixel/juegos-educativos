(function(){
  // --- 1. SINTETIZADOR DE VOZ GLOBAL (HABILITADO PARA LOS JUEGOS) ---
  var ss = window.speechSynthesis;
  window.mudo = false;
  var voice = null;
  if (ss) {
    var orig = ss.speak.bind(ss);
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
      try {
        if (ss.paused) ss.resume();
        ss.cancel();
        var u = new SpeechSynthesisUtterance(txt);
        u.lang = voice ? voice.lang : 'es-MX';
        if (voice) u.voice = voice;
        u.rate = 0.95;
        u.pitch = 1.1;
        u.volume = 1;
        orig(u);
      } catch(e){}
    };
  } else {
    window.decir = function(){};
  }

  // --- 2. BOTÓN DE AUDIO DISCRETO ---
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

  // --- 3. EFECTO DE PARTÍCULAS INTERACTIVAS ---
  window.createBurst = function(x, y, n){
    n = n || 8;
    var s = ['⭐','✨','🌟'], c = ['#38bdf8','#818cf8','#a78bfa','#34d399'];
    for (var i = 0; i < n; i++){
      var p = document.createElement('div');
      p.className = 'particle';
      if (Math.random() > 0.5){
        p.textContent = s[Math.floor(Math.random() * s.length)];
        p.style.fontSize = (Math.random() * 12 + 16) + 'px';
      } else {
        p.style.width = p.style.height = (Math.random() * 8 + 6) + 'px';
        p.style.background = c[Math.floor(Math.random() * c.length)];
      }
      var a = Math.random() * 6.283, v = Math.random() * 100 + 30;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.setProperty('--dx', Math.cos(a) * v + 'px');
      p.style.setProperty('--dy', Math.sin(a) * v + 'px');
      document.body.appendChild(p);
      setTimeout(function(q){ q.remove(); }, 600, p);
    }
  };

  document.addEventListener('pointerdown', function(e){
    if (e.target.closest && e.target.closest('button,.character,.balloon,.card')){
      createBurst(e.clientX, e.clientY, 6);
    }
  });

  // --- 4. BASE DE DATOS CURRICULAR ---
  var JUEGOS_INFO = {
    'juego1-avatar': {
      id: 1,
      titulo: "Mi Carita Feliz Mágica",
      ambito: "Identidad y Autonomía",
      icono: "😊",
      color: "#0284c7",
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
      color: "#0369a1",
      objetivo: "Incrementar la atención sustained, la autorregulación y la interacción lúdica siguiendo dinámicas musicales y reglas sencillas de participación.",
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
      color: "#6d28d9",
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
      color: "#15803d",
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
      color: "#c2410c",
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
      color: "#b45309",
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
      color: "#be185d",
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
      color: "#1d4ed8",
      objetivo: "Desarrollar la coordinación viso-motriz fina, la precisión digital y el seguimiento de secuencias lógicas en tareas de apilamiento.",
      destrezas: [
        "Ejecutar movimientos de pinza digital y toque preciso sobre la pantalla táctil para arrastrar y colocar elementos.",
        "Coordinar la alineación viso-motriz manteniendo el equilibrio y orden secuencial al apilar las bolas de helado.",
        "Seguir instrucciones secuenciales de pedidos respetando patrones visuales y espaciales."
      ]
    }
  };

  window.JUEGOS_INFO = JUEGOS_INFO;

  var path = window.location.pathname;
  var currentGameKey = null;
  for (var key in JUEGOS_INFO) {
    if (path.indexOf(key) !== -1) {
      currentGameKey = key;
      break;
    }
  }

  // --- 5. FICHA PEDAGÓGICA FORMAL ---
  var modalOverlay = document.createElement('div');
  modalOverlay.className = 'pedagogia-modal-overlay';
  modalOverlay.id = 'pedagogiaModal';
  modalOverlay.innerHTML = '<div class="pedagogia-modal-content">' +
    '<button class="pedagogia-modal-close" onclick="cerrarPedagogiaModal()" title="Cerrar Ficha">✕</button>' +
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
    
    var html = '' +
      '<div class="ficha-formal-header">' +
        '<div class="ficha-badge-institution">🎓 EDUCACIÓN INICIAL • ALINEACIÓN CURRICULAR</div>' +
        '<h2 class="ficha-formal-title">' + info.icono + ' ' + info.titulo + '</h2>' +
        '<div class="ficha-ambito-pill" style="background-color:' + info.color + ';">' +
          '<span>Ámbitos de Desarrollo:</span> ' + info.ambito +
        '</div>' +
      '</div>' +

      '<div class="ficha-formal-body">' +
        '<div class="ficha-section-card objective-card">' +
          '<div class="section-label"><span class="icon">🎯</span> OBJETIVO GENERAL DE APRENDIZAJE</div>' +
          '<p class="objective-text">' + info.objetivo + '</p>' +
        '</div>' +

        '<div class="ficha-section-card destrezas-card">' +
          '<div class="section-label"><span class="icon">📌</span> MATRIZ DE DESTREZAS A DESARROLLAR (3 COMPETENCIAS)</div>' +
          '<div class="destrezas-grid">';
          
    info.destrezas.forEach(function(d, index){
      html += '' +
        '<div class="destreza-item">' +
          '<div class="destreza-badge">0' + (index + 1) + '</div>' +
          '<div class="destreza-desc">' + d + '</div>' +
        '</div>';
    });

    html += '' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="ficha-formal-footer">' +
        '<button class="btn-secondary-formal" onclick="mostrarMatrizCompleta()">📋 Ver Matriz General (8 Juegos)</button>' +
        '<button class="btn-primary-formal" onclick="cerrarPedagogiaModal()">✓ Entendido</button>' +
      '</div>';

    body.innerHTML = html;
    document.getElementById('pedagogiaModal').classList.add('active');
  };

  window.mostrarMatrizCompleta = function() {
    var body = document.getElementById('pedagogiaModalBody');
    var html = '' +
      '<div class="ficha-formal-header">' +
        '<div class="ficha-badge-institution">🎓 GUÍA INSTITUCIONAL • EDUCACIÓN INICIAL</div>' +
        '<h2 class="ficha-formal-title">Matriz Curricular de Aprendizaje</h2>' +
        '<p class="ficha-subtitle">Mapeo pedagógico oficial de los 8 juegos interactivos</p>' +
      '</div>' +
      '<div class="matriz-scroll-container">';

    for (var k in JUEGOS_INFO) {
      var item = JUEGOS_INFO[k];
      html += '' +
        '<div class="matriz-card-executive" style="border-left-color: ' + item.color + ';" onclick="abrirPedagogiaModal(\'' + k + '\')">' +
          '<div class="matriz-card-top">' +
            '<span class="matriz-icon-badge">' + item.icono + '</span>' +
            '<div class="matriz-meta">' +
              '<h4>Juego ' + item.id + ': ' + item.titulo + '</h4>' +
              '<span class="matriz-tag" style="background:' + item.color + ';">' + item.ambito + '</span>' +
            '</div>' +
          '</div>' +
          '<p class="matriz-obj-snippet"><strong>Objetivo:</strong> ' + item.objetivo + '</p>' +
        '</div>';
    }

    html += '' +
      '</div>' +
      '<div class="ficha-formal-footer">' +
        '<button class="btn-primary-formal" onclick="cerrarPedagogiaModal()">Cerrar Ficha</button>' +
      '</div>';

    body.innerHTML = html;
    document.getElementById('pedagogiaModal').classList.add('active');
  };

  window.cerrarPedagogiaModal = function() {
    document.getElementById('pedagogiaModal').classList.remove('active');
  };

  // --- 6. INTEGRACIÓN UNIFICADA ---
  document.addEventListener('DOMContentLoaded', function() {
    if (currentGameKey) {
      var topNav = document.querySelector('.top-nav, .game-header, nav.top-nav');
      if (topNav) {
        var oldBtns = topNav.querySelectorAll('.btn-pedagogia-formal-nav, .btn-pedagogia-float, .btn-pedagogia-topnav');
        oldBtns.forEach(function(b){ b.remove(); });

        var btnNav = document.createElement('button');
        btnNav.className = 'btn-pedagogia-topnav';
        btnNav.innerHTML = '📜 <span class="btn-ped-text">Ficha Pedagógica</span>';
        btnNav.onclick = function() { abrirPedagogiaModal(currentGameKey); };
        topNav.appendChild(btnNav);
      }
    } else {
      var header = document.querySelector('header, .header');
      if (header) {
        var btnMenu = document.createElement('button');
        btnMenu.className = 'btn-matriz-formal-menu';
        btnMenu.innerHTML = '🎓 Ver Matriz Pedagógica Completa';
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
              infoBtn.className = 'card-info-btn-formal';
              infoBtn.innerHTML = '📋 Ficha Curricular';
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
