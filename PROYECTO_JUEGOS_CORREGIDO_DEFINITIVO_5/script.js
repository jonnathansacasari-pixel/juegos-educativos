document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playPopSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.12);
  }

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = card.getAttribute('href');
      playPopSound();
      const rect = card.getBoundingClientRect();
      const x = e.clientX || (rect.left + rect.width / 2);
      const y = e.clientY || (rect.top + rect.height / 2);
      if (window.createBurst) window.createBurst(x, y, 15);
      setTimeout(() => { window.location.href = targetUrl; }, 200);
    });
  });
});