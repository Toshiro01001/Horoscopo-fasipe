/* Guarda os arquivos do site na primeira visita e os entrega mesmo sem internet.
   Mostra a cópia guardada na hora e atualiza por trás quando há conexão.
   Ao mudar a lista de arquivos, troque o número da versão. */
var VERSAO = 'ceu-de-bolso-v1';
var ARQUIVOS = [
  './',
  'index.html',
  'style.css',
  'js/tema.js',
  'js/dados.js',
  'js/logica.js',
  'js/arte.js',
  'js/cartao.js',
  'js/app.js',
  'fonts/alfa-slab-one.woff2',
  'fonts/literata.woff2',
  'imagens/favicon.svg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSAO).then(function (c) { return c.addAll(ARQUIVOS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (nomes) {
    return Promise.all(nomes.filter(function (n) { return n !== VERSAO; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  var url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  /* Só a página principal é tratada como página: abrir outro arquivo do site não pode sobrescrevê-la. */
  var base = new URL('./', self.location).pathname;
  var ePrincipal = req.mode === 'navigate' && (url.pathname === base || url.pathname === base + 'index.html');
  var chave = ePrincipal ? './' : req;
  e.respondWith(caches.open(VERSAO).then(function (cache) {
    return cache.match(chave, { ignoreSearch: true }).then(function (guardado) {
      /* O que não está na lista segue direto para a rede. */
      if (!guardado) return fetch(req);
      e.waitUntil(fetch(req).then(function (r) {
        if (r.ok) return cache.put(chave, r);
      }).catch(function () {}));
      return guardado;
    });
  }));
});
