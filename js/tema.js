/* Roda antes de pintar a página, para não piscar o tema errado. */
(function () {
  var salvo = null;
  try { salvo = localStorage.getItem('ceu-de-bolso:tema'); } catch (e) { /* armazenamento bloqueado */ }
  /* Desde 17/11/2026 o site abre no Céu noturno. O tema claro (o almanaque de papel) fica para quem escolher no botão. */
  document.documentElement.dataset.tema = salvo === 'claro' ? 'claro' : 'escuro';
})();
