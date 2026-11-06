/* Roda antes de pintar a página, para não piscar o tema errado. */
(function () {
  var salvo = null;
  try { salvo = localStorage.getItem('ceu-de-bolso:tema'); } catch (e) { /* armazenamento bloqueado */ }
  var escuro = false;
  try { escuro = matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { /* navegador antigo */ }
  document.documentElement.dataset.tema = salvo === 'escuro' || salvo === 'claro' ? salvo : (escuro ? 'escuro' : 'claro');
})();
