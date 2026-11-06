/* Servidor estático mínimo, para testar na raiz e em subcaminho (como no GitHub Pages). */
const http = require('http');
const fs = require('fs');
const path = require('path');

const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };

function servir(raiz, prefixo) {
  const servidor = http.createServer((req, res) => {
    let caminho = decodeURIComponent(req.url.split('?')[0]);
    if (!caminho.startsWith(prefixo)) { res.writeHead(404); res.end('fora do subcaminho'); return; }
    caminho = caminho.slice(prefixo.length);
    if (caminho === '' || caminho.endsWith('/')) caminho += 'index.html';
    const arquivo = path.join(raiz, caminho);
    if (!arquivo.startsWith(raiz) || !fs.existsSync(arquivo) || fs.statSync(arquivo).isDirectory()) { res.writeHead(404); res.end('nao encontrado'); return; }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
    fs.createReadStream(arquivo).pipe(res);
  });
  return new Promise((ok) => servidor.listen(0, '127.0.0.1', () => ok({ servidor, url: `http://localhost:${servidor.address().port}${prefixo}` })));
}

module.exports = { servir };
