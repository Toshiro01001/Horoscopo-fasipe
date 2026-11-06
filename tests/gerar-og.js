/* Gera imagens/og.png (prévia em redes sociais) a partir da própria página.
   Como rodar: NODE_PATH=$(npm root -g) node tests/gerar-og.js */
const { chromium } = require('playwright');
const path = require('path');
const { servir } = require('./servidor');

(async () => {
  const raiz = path.resolve(__dirname, '..');
  const s = await servir(raiz, '/');
  const n = await chromium.launch();
  const p = await n.newPage({ viewport: { width: 1200, height: 630 }, colorScheme: 'light' });
  await p.goto(s.url);
  await p.waitForSelector('svg.roda');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1300);
  await p.screenshot({ path: path.join(raiz, 'imagens', 'og.png') });
  await n.close();
  s.servidor.close();
})();
