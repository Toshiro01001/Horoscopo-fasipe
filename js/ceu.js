/* O céu do tema noturno: estrelas desenhadas num canvas atrás da página.
   As posições saem de uma conta fixa (o céu é sempre o mesmo), algumas piscam devagar e todas
   escorregam um pouco com a rolagem. Com "menos movimento" o céu fica parado. No tema claro não existe.
   Nada vem de fora e nada é guardado. */
(function () {
  'use strict';
  var raiz = document.documentElement;
  var calmo = false;
  try { calmo = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* navegador antigo */ }
  var tela = document.createElement('canvas');
  tela.className = 'ceu';
  tela.setAttribute('aria-hidden', 'true');
  var ctx = tela.getContext && tela.getContext('2d');
  if (!ctx) return;
  document.body.insertBefore(tela, document.body.firstChild);

  var estrelas = [], L = 0, H = 0, dpr = 1, raf = 0, semente = 20261117;
  function prox() { semente = (semente * 9301 + 49297) % 233280; return semente / 233280; }
  function montar() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    L = window.innerWidth; H = window.innerHeight;
    tela.width = Math.round(L * dpr); tela.height = Math.round(H * dpr);
    semente = 20261117; estrelas = [];
    var n = Math.round(Math.min(420, Math.max(120, L * H / 5200))), i;
    for (i = 0; i < n; i++) {
      var grande = prox() < 0.07;
      estrelas.push({ x: prox(), y: prox(), r: grande ? 1.3 + prox() * 0.9 : 0.35 + prox() * 0.75, a: grande ? 0.75 + prox() * 0.25 : 0.2 + prox() * 0.5, f: 0.3 + prox() * 0.7, pisca: prox() < 0.22, fase: prox() * 6.2832, ouro: prox() < 0.08 });
    }
  }
  function noite() { return raiz.dataset.tema === 'escuro'; }
  function desenhar(t) {
    raf = 0;
    if (!noite() || document.hidden) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, L, H);
    var desliza = window.scrollY * 0.06, i, s;
    for (i = 0; i < estrelas.length; i++) {
      s = estrelas[i];
      var y = (s.y * (H + 120) - desliza * s.f) % (H + 120); if (y < 0) y += H + 120;
      var a = s.a * (s.pisca && !calmo ? 0.55 + 0.45 * Math.sin(t / 1400 * s.f + s.fase) : 1);
      ctx.globalAlpha = a;
      ctx.fillStyle = s.ouro ? '#F2B66D' : '#EFE8D2';
      ctx.beginPath(); ctx.arc(s.x * L, y - 60, s.r, 0, 6.2832); ctx.fill();
      if (s.r > 1.6) { ctx.globalAlpha = a * 0.09; ctx.beginPath(); ctx.arc(s.x * L, y - 60, s.r * 2.4, 0, 6.2832); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    if (!calmo) raf = requestAnimationFrame(desenhar);
  }
  function acordar() { if (!raf && noite()) raf = requestAnimationFrame(desenhar); }
  montar(); acordar();
  var espera = 0;
  window.addEventListener('resize', function () { clearTimeout(espera); espera = setTimeout(function () { montar(); acordar(); }, 150); });
  window.addEventListener('scroll', function () { if (calmo) acordar(); }, { passive: true });
  document.addEventListener('visibilitychange', acordar);
  if (window.MutationObserver) new MutationObserver(acordar).observe(raiz, { attributes: true, attributeFilter: ['data-tema'] });
})();

/* Os efeitos do Céu noturno (js/premium.js: céu em WebGL e cartão holográfico) só são buscados depois
   que a página carregou e o navegador ficou livre. Assim a primeira tela e o primeiro toque não esperam por eles. */
(function () {
  function buscar() {
    var s = document.createElement('script');
    s.src = 'js/premium.js';
    s.async = true;
    document.head.appendChild(s);
  }
  function quandoLivre() {
    if ('requestIdleCallback' in window) requestIdleCallback(buscar, { timeout: 4000 });
    else setTimeout(buscar, 1200);
  }
  if (document.readyState === 'complete') quandoLivre();
  else window.addEventListener('load', quandoLivre, { once: true });
})();
