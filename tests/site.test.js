/* Percorre o site em Chromium, em 3 tamanhos de tela, na raiz e em subcaminho.
   Como rodar:  NODE_PATH=$(npm root -g) node tests/site.test.js
   Com capturas: CAPTURAS=/caminho/da/pasta NODE_PATH=$(npm root -g) node tests/site.test.js */
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { servir } = require('./servidor');

const RAIZ = path.resolve(__dirname, '..');
const CAPTURAS = process.env.CAPTURAS || '';
const AGORA = new Date('2026-11-06T12:00:00');

const { defaultBrowserType: _ignorado, ...iphone13 } = devices['iPhone 13'];
const TELAS = {
  computador: { viewport: { width: 1366, height: 800 }, deviceScaleFactor: 2 },
  celular: { ...iphone13, deviceScaleFactor: 2 },
  'celular-320': { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
};

/* Tabela escrita de novo aqui, de propósito: confere o site contra uma fonte independente. */
const TABELA = [
  ['aries', 'Áries', 3, 21, 4, 19], ['touro', 'Touro', 4, 20, 5, 20], ['gemeos', 'Gêmeos', 5, 21, 6, 20],
  ['cancer', 'Câncer', 6, 21, 7, 22], ['leao', 'Leão', 7, 23, 8, 22], ['virgem', 'Virgem', 8, 23, 9, 22],
  ['libra', 'Libra', 9, 23, 10, 22], ['escorpiao', 'Escorpião', 10, 23, 11, 21], ['sagitario', 'Sagitário', 11, 22, 12, 21],
  ['capricornio', 'Capricórnio', 12, 22, 1, 19], ['aquario', 'Aquário', 1, 20, 2, 18], ['peixes', 'Peixes', 2, 19, 3, 20]
];
const DIAS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function esperado(m, d) {
  const v = m * 100 + d;
  return TABELA.find((t) => {
    const i = t[2] * 100 + t[3];
    const f = t[4] * 100 + t[5];
    return i <= f ? v >= i && v <= f : v >= i || v <= f;
  });
}

const falhas = [];
let verificacoes = 0;
function ok(nome, condicao, detalhe) {
  verificacoes++;
  if (!condicao) {
    falhas.push(nome + (detalhe !== undefined ? ' => ' + JSON.stringify(detalhe) : ''));
    console.log('FALHOU', falhas[falhas.length - 1]);
  }
}

async function contexto(navegador, tela, extra = {}) {
  const ctx = await navegador.newContext({ ...TELAS[tela], locale: 'pt-BR', acceptDownloads: true, ...extra });
  await ctx.clock.setFixedTime(AGORA);
  ctx.problemas = [];
  ctx.on('page', (p) => {
    p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') ctx.problemas.push(`console ${m.type()}: ${m.text()}`); });
    p.on('pageerror', (e) => ctx.problemas.push('erro de página: ' + e.message));
  });
  ctx.on('request', (r) => {
    const u = new URL(r.url());
    if (!['localhost', '127.0.0.1'].includes(u.hostname) && !['blob:', 'data:'].includes(u.protocol)) ctx.problemas.push('terceiro: ' + r.url());
  });
  ctx.on('response', (r) => { if (r.status() >= 400) ctx.problemas.push(`HTTP ${r.status()}: ${r.url()}`); });
  return ctx;
}

async function semRolagemLateral(p, nome) {
  const m = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth, b: document.body.scrollWidth }));
  ok(`sem rolagem lateral: ${nome}`, m.s <= m.c && m.b <= m.c, m);
}

async function foto(p, tela, nome, inteira = true) {
  if (!CAPTURAS) return;
  await p.evaluate(() => { document.activeElement.blur(); return document.fonts.ready; });
  await p.waitForTimeout(1250);
  await p.screenshot({ path: path.join(CAPTURAS, `${tela}-${nome}.png`), fullPage: inteira });
}

async function escolherData(p, m, d) {
  await p.selectOption('#campo-mes', String(m));
  await p.selectOption('#campo-dia', String(d));
}

/* Dentro da fatia, logo abaixo da ponta do ponteiro, qual signo está? */
async function signoNoPonteiro(p) {
  return p.evaluate(() => {
    const svg = document.querySelector('svg.roda');
    svg.scrollIntoView({ block: 'center' });
    const r = svg.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + (46 / 400) * r.height;
    const e = document.elementFromPoint(x, y);
    const a = e && e.closest('a');
    return a ? a.dataset.signo : (e && e.tagName);
  });
}

async function fluxos(navegador, base, tela, comFotos) {
  const tag = `[${tela} ${new URL(base).pathname}]`;
  const ctx = await contexto(navegador, tela, tela === 'computador' ? { permissions: ['clipboard-read', 'clipboard-write'] } : {});
  const p = await ctx.newPage();
  await p.goto(base);
  await p.waitForSelector('svg.roda');

  /* Início e rodapé */
  ok(`${tag} título`, (await p.title()).includes('Céu de Bolso'));
  const assinatura = await p.locator('.assinatura').innerText();
  ok(`${tag} rodapé exato`, assinatura.trim() === 'Demonstração feita por Mil e Uma Linhas!', assinatura);
  ok(`${tag} link do rodapé`, (await p.locator('.assinatura a').getAttribute('href')) === 'https://mileumalinhas.com.br');
  ok(`${tag} aviso de entretenimento`, (await p.locator('.aviso').innerText()).includes('entretenimento'));
  await semRolagemLateral(p, `${tag} início`);
  if (comFotos) await foto(p, tela, '01-inicio', false);
  if (comFotos && tela === 'computador') await foto(p, tela, '01-inicio-inteiro');

  /* Limites de data pela interface: último dia de um signo e primeiro do seguinte. */
  for (const t of TABELA) {
    for (const [m, d, id] of [[t[2], t[3], t[1]], [t[4], t[5], t[1]]]) {
      await escolherData(p, m, d);
      const status = await p.locator('#status-data').innerText();
      ok(`${tag} data ${d}/${m} é ${id}`, status.endsWith(`é ${id}.`), status);
    }
  }
  await escolherData(p, 2, 29);
  ok(`${tag} 29/02 é Peixes`, (await p.locator('#status-data').innerText()).endsWith('é Peixes.'));
  await p.selectOption('#campo-dia', '');
  await p.selectOption('#campo-mes', '1');
  await p.selectOption('#campo-dia', '31');
  await p.selectOption('#campo-mes', '2');
  ok(`${tag} 31 em fevereiro pede novo dia`, (await p.locator('#status-data').innerText()).includes('vai até o dia 29'));
  ok(`${tag} fevereiro tem 29 opções`, (await p.locator('#campo-dia option').count()) === 30);

  /* O ponteiro da roda cai no signo certo depois do giro. */
  const amostra = tela === 'computador' ? TABELA : TABELA.slice(0, 3);
  for (const t of amostra) {
    await escolherData(p, t[2], t[3] + 1);
    await p.waitForTimeout(1250);
    const s = await signoNoPonteiro(p);
    ok(`${tag} ponteiro em ${t[0]}`, s === t[0], s);
  }

  await escolherData(p, 7, 23);
  await p.waitForSelector('[data-mensagem="leao"]');
  ok(`${tag} papel muda com o elemento`, (await p.evaluate(() => document.documentElement.dataset.elemento)) === 'fogo');
  await semRolagemLateral(p, `${tag} início com resultado`);
  if (comFotos) await foto(p, tela, '02-inicio-resultado');

  /* Mensagem do dia determinística */
  await p.click('[data-acao="abrir"]');
  await p.waitForSelector('.folheto-nome');
  ok(`${tag} abre folheto`, (await p.locator('h1').innerText()) === 'Leão');
  const m1 = await p.locator('.dia').innerText();
  await p.reload();
  await p.waitForSelector('.folheto-nome');
  ok(`${tag} mesma mensagem ao recarregar`, (await p.locator('.dia').innerText()) === m1);
  const ctx2 = await contexto(navegador, tela);
  await ctx2.clock.setFixedTime(new Date('2026-11-07T12:00:00'));
  const p2 = await ctx2.newPage();
  await p2.goto(base + '#/signo/leao');
  await p2.waitForSelector('.folheto-nome');
  const m2 = await p2.locator('.dia').innerText();
  ok(`${tag} mensagem muda no dia seguinte`, m2 !== m1);
  await ctx2.close();
  ok(`${tag} nota de entretenimento no bloco`, m1.includes('Serve só para divertir'));

  /* Rotas dos 12 signos */
  for (const t of TABELA) {
    await p.goto(base + '#/signo/' + t[0]);
    await p.waitForFunction((n) => document.querySelector('h1') && document.querySelector('h1').textContent === n, t[1]);
    ok(`${tag} título da aba de ${t[1]}`, (await p.title()).startsWith(t[1]));
    await semRolagemLateral(p, `${tag} signo ${t[1]}`);
  }
  await p.goto(base + '#/signo/leao');
  await p.waitForSelector('.folheto-nome');
  await p.locator('.vizinhos a[rel="next"]').click();
  await p.waitForFunction(() => document.querySelector('h1').textContent === 'Virgem');
  await p.goBack();
  await p.waitForFunction(() => document.querySelector('h1').textContent === 'Leão');
  await p.goto(base + '#/signo/nao-existe');
  await p.waitForFunction(() => document.querySelector('h1').textContent === 'Esta página não existe');
  await semRolagemLateral(p, `${tag} não encontrada`);
  await p.goto(base + '#/signos');
  await p.waitForSelector('.grade');
  ok(`${tag} 12 signos na lista`, (await p.locator('.grade li').count()) === 12);
  await semRolagemLateral(p, `${tag} lista`);
  if (comFotos) await foto(p, tela, '04-signos');

  /* Favorito */
  await p.goto(base + '#/signo/leao');
  await p.waitForSelector('[data-acao="favorito"]');
  await p.click('[data-acao="favorito"]');
  ok(`${tag} botão indica favorito`, (await p.getAttribute('[data-acao="favorito"]', 'aria-pressed')) === 'true');
  await p.reload();
  await p.waitForSelector('[data-acao="favorito"]');
  ok(`${tag} favorito lembrado`, (await p.locator('#menu').innerText()).includes('Meu signo: Leão'));
  await p.goto(base + '#/');
  await p.waitForSelector('[data-mensagem="leao"]');
  ok(`${tag} início mostra o favorito`, (await p.locator('.dia-titulo').innerText()) === 'Seu dia, Leão');
  await p.click('[data-acao="favorito"]');
  ok(`${tag} favorito esquecido`, !(await p.locator('#menu').innerText()).includes('Meu signo'));

  /* Compatibilidade */
  await p.goto(base + '#/compatibilidade/leao/aquario');
  await p.waitForSelector('#par h2');
  const par = await p.locator('#par h2').innerText();
  ok(`${tag} link direto de compatibilidade`, par === 'O vento e a chama', par);
  ok(`${tag} opostos avisados`, (await p.locator('#par').innerText()).includes('frente a frente'));
  await p.focus('#signo-a');
  await p.selectOption('#signo-a', 'peixes');
  ok(`${tag} endereço acompanha a escolha`, (await p.evaluate(() => location.hash)) === '#/compatibilidade/peixes/aquario');
  ok(`${tag} foco fica no campo`, (await p.evaluate(() => document.activeElement.id)) === 'signo-a');
  await p.selectOption('#signo-a', 'leao');
  await p.waitForFunction(() => document.querySelector('#par h2').textContent === 'O vento e a chama');
  await semRolagemLateral(p, `${tag} compatibilidade`);
  if (comFotos) await foto(p, tela, '05-compatibilidade');

  /* Como isto funciona */
  await p.goto(base + '#/como-funciona');
  await p.waitForSelector('.como');
  ok(`${tag} oito peças explicadas`, (await p.locator('.como-linha').count()) === 8);
  await semRolagemLateral(p, `${tag} como funciona`);
  if (comFotos) await foto(p, tela, '06-como-funciona');

  /* Cartão: baixar */
  await p.goto(base + '#/signo/capricornio');
  await p.waitForSelector('canvas.cartao');
  await p.evaluate(() => document.fonts.ready);
  const [download] = await Promise.all([p.waitForEvent('download'), p.click('[data-acao="baixar"]')]);
  const nomeArquivo = download.suggestedFilename();
  ok(`${tag} nome do arquivo`, nomeArquivo === 'ceu-de-bolso-capricornio-2026-11-06.png', nomeArquivo);
  const png = fs.readFileSync(await download.path());
  ok(`${tag} é PNG 1080x1350`, png.toString('latin1', 1, 4) === 'PNG' && png.readUInt32BE(16) === 1080 && png.readUInt32BE(20) === 1350);
  const cores = await p.evaluate(() => {
    const c = document.querySelector('canvas.cartao');
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    const s = new Set();
    for (let i = 0; i < d.length; i += 4 * 97) s.add(d[i] + ',' + d[i + 1] + ',' + d[i + 2]);
    return s.size;
  });
  ok(`${tag} cartão não está em branco`, cores > 20, cores);

  /* Cartão: copiar, com e sem suporte */
  if (tela === 'computador') {
    await p.click('[data-acao="copiar"]');
    await p.waitForFunction(() => document.querySelector('.cartao-aviso').textContent.startsWith('Imagem copiada'));
    const tipos = await p.evaluate(async () => (await navigator.clipboard.read())[0].types);
    ok(`${tag} área de transferência tem PNG`, tipos.includes('image/png'), tipos);
  }
  await p.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true }); });
  await p.click('[data-acao="copiar"]');
  await p.waitForFunction(() => document.querySelector('.cartao-aviso').textContent.includes('Use Baixar imagem'));
  await semRolagemLateral(p, `${tag} cartão`);

  /* Tema */
  await p.goto(base + '#/signo/leao');
  await p.waitForSelector('.folheto-nome');
  const antes = await p.evaluate(() => document.documentElement.dataset.tema);
  if (comFotos) await foto(p, tela, '03-signo');
  await p.click('#botao-tema');
  const depois = await p.evaluate(() => document.documentElement.dataset.tema);
  ok(`${tag} tema troca`, antes !== depois);
  await p.reload();
  await p.waitForSelector('.folheto-nome');
  ok(`${tag} tema lembrado`, (await p.evaluate(() => document.documentElement.dataset.tema)) === depois);
  await semRolagemLateral(p, `${tag} tema escuro`);
  if (comFotos) await foto(p, tela, '07-signo-escuro');
  await p.goto(base + '#/');
  await p.waitForSelector('svg.roda');
  if (comFotos) await foto(p, tela, '08-inicio-escuro', false);
  await p.click('#botao-tema');

  /* Áreas de toque no celular */
  if (tela !== 'computador') {
    for (const rota of ['#/', '#/signo/leao', '#/compatibilidade']) {
      await p.goto(base + rota);
      await p.waitForSelector('main section');
      const pequenos = await p.evaluate(() => [...document.querySelectorAll('.botao, select, #menu a, .botao-tema, .marca, .vizinhos a, .rodape a')]
        .filter((e) => { const r = e.getBoundingClientRect(); return r.height < 44 || r.width < 40; })
        .map((e) => (e.textContent || '').slice(0, 30)));
      ok(`${tag} áreas de toque em ${rota}`, pequenos.length === 0, pequenos);
    }
  }

  /* Sem internet: depois da primeira visita, tudo abre da cópia guardada */
  const escopo = await p.evaluate(async () => {
    const r = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise((ok) => navigator.serviceWorker.addEventListener('controllerchange', ok, { once: true }));
    return r.scope;
  });
  ok(`${tag} service worker no escopo certo`, escopo === base, escopo);
  /* Abrir outro arquivo do site não pode trocar a página principal guardada. */
  await p.goto(base + 'fonts/OFL-literata.txt');
  ok(`${tag} outro arquivo abre normal com service worker`, (await p.locator('body').innerText()).includes('Open Font License'));
  await p.waitForTimeout(300);
  await p.goto(base);
  await p.waitForSelector('svg.roda');

  await ctx.setOffline(true);
  await p.goto(base + '#/signo/peixes');
  await p.reload();
  await p.waitForSelector('.folheto-nome');
  ok(`${tag} abre signo sem internet`, (await p.locator('h1').innerText()) === 'Peixes');
  const fontes = await p.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family); });
  ok(`${tag} fontes carregam sem internet`, fontes.join().includes('Alfa Slab') && fontes.join().includes('Literata'), fontes);
  await p.goto(base);
  await p.reload();
  await p.waitForSelector('svg.roda');
  ok(`${tag} início abre sem internet`, (await p.locator('h1').innerText()) === 'Céu de Bolso');
  await ctx.setOffline(false);

  /* Em modo sem internet o navegador registra falhas de rede esperadas da atualização por trás. */
  const problemas = ctx.problemas.filter((t) => !t.includes('ERR_INTERNET_DISCONNECTED'));
  ok(`${tag} sem erros no console nem pedidos a terceiros`, problemas.length === 0, problemas);
  await ctx.close();
}

async function armazenamentoBloqueado(navegador, base) {
  const ctx = await contexto(navegador, 'celular');
  await ctx.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('armazenamento bloqueado'); } });
  });
  const p = await ctx.newPage();
  await p.goto(base + '#/signo/libra');
  await p.waitForSelector('[data-acao="favorito"]');
  await p.click('[data-acao="favorito"]');
  ok('bloqueado: favorito vale na sessão', (await p.locator('#menu').innerText()).includes('Meu signo: Libra'));
  await p.click('#botao-tema');
  ok('bloqueado: tema troca', ['claro', 'escuro'].includes(await p.evaluate(() => document.documentElement.dataset.tema)));
  await p.reload();
  await p.waitForSelector('[data-acao="favorito"]');
  ok('bloqueado: página abre de novo, sem favorito', !(await p.locator('#menu').innerText()).includes('Meu signo'));
  ok('bloqueado: sem erros', ctx.problemas.length === 0, ctx.problemas);
  await ctx.close();
}

async function regras(navegador, base) {
  const ctx = await contexto(navegador, 'computador');
  const p = await ctx.newPage();
  await p.goto(base);
  await p.waitForSelector('svg.roda');

  /* Os 366 dias, contra a tabela independente */
  const porDia = await p.evaluate((dias) => {
    const r = {};
    dias.forEach((n, i) => { for (let d = 1; d <= n; d++) r[`${i + 1}/${d}`] = window.CeuLogica.signoPorData(i + 1, d).id; });
    return r;
  }, DIAS);
  let conta = 0;
  DIAS.forEach((n, i) => {
    for (let d = 1; d <= n; d++) {
      conta++;
      const e = esperado(i + 1, d);
      ok(`dia ${d}/${i + 1}`, porDia[`${i + 1}/${d}`] === e[0], [porDia[`${i + 1}/${d}`], e[0]]);
    }
  });
  ok('366 dias conferidos', conta === 366);
  const invalidas = await p.evaluate(() => [[2, 30], [13, 1], [0, 5], [4, 31]].map(([m, d]) => window.CeuLogica.signoPorData(m, d)));
  ok('datas inválidas dão vazio', invalidas.every((x) => x === null));

  /* Compatibilidade: 144 combinações, sem depender da ordem */
  const compat = await p.evaluate(() => {
    const ids = window.CeuDados.signos.map((s) => s.id);
    const erros = [];
    ids.forEach((a) => ids.forEach((b) => {
      const x = window.CeuLogica.compatibilidade(a, b);
      const y = window.CeuLogica.compatibilidade(b, a);
      if (!x || !x.titulo || !x.texto || !x.tipo || !x.modo) erros.push('vazio ' + a + b);
      if (x.titulo !== y.titulo || x.texto !== y.texto || x.tipo !== y.tipo || x.modo !== y.modo) erros.push('ordem ' + a + b);
    }));
    return erros;
  });
  ok('compatibilidade completa e simétrica', compat.length === 0, compat);

  /* Mensagens: mesma entrada, mesma saída; variam entre dias e signos */
  const msg = await p.evaluate(() => {
    const L = window.CeuLogica;
    const unicas = new Set();
    let instavel = 0;
    let iguaisVizinhos = 0;
    let ant = null;
    for (let i = 0; i < 365; i++) {
      const d = L.dataDeHoje(new Date(2026, 0, 1 + i));
      const a = JSON.stringify(L.mensagemDoDia('leao', d));
      if (a !== JSON.stringify(L.mensagemDoDia('leao', d))) instavel++;
      if (a === ant) iguaisVizinhos++;
      ant = a;
      unicas.add(a);
    }
    const hoje = new Set(window.CeuDados.signos.map((s) => JSON.stringify(L.mensagemDoDia(s.id, '2026-11-06'))));
    return { unicas: unicas.size, instavel, iguaisVizinhos, signosHoje: hoje.size };
  });
  ok('mensagem estável', msg.instavel === 0);
  ok('mensagens variam no ano', msg.unicas > 350 && msg.iguaisVizinhos === 0, msg);
  ok('signos diferentes, mensagens diferentes', msg.signosHoje === 12, msg);

  /* Nada de conselho médico, financeiro ou jurídico nos textos */
  const textos = await p.evaluate(() => JSON.stringify(window.CeuDados));
  const proibidas = /\b(médic\w*|remédio\w*|doença\w*|saúde|tratamento\w*|dieta\w*|dinheiro|invest\w*|empréstimo\w*|dívida\w*|aposta\w*|loteria\w*|advogad\w*|processo judicial|contrato\w*|diagnóstic\w*)\b/i;
  ok('textos sem assunto sensível', !proibidas.test(textos), (textos.match(proibidas) || [])[0]);
  await ctx.close();

  /* Sem JavaScript, a tabela continua lá */
  const semJs = await navegador.newContext({ javaScriptEnabled: false });
  const q = await semJs.newPage();
  await q.goto(base);
  ok('sem JavaScript mostra a tabela', (await q.locator('.sem-js tbody tr').count()) === 12);
  await semJs.close();

  /* Contraste em todos os papéis e nos dois temas */
  const ctx3 = await contexto(navegador, 'computador');
  const c = await ctx3.newPage();
  await c.goto(base);
  await c.waitForSelector('svg.roda');
  const contrastes = await c.evaluate(() => {
    const lum = (h) => {
      const v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
      return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    };
    const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    const raiz = document.documentElement;
    const saida = [];
    for (const tema of ['claro', 'escuro']) {
      raiz.dataset.tema = tema;
      for (const el of [null, 'fogo', 'terra', 'ar', 'água']) {
        if (el) raiz.dataset.elemento = el; else delete raiz.dataset.elemento;
        const s = getComputedStyle(raiz);
        const g = (n) => s.getPropertyValue(n).trim();
        for (const fundo of ['--papel', '--papel-claro']) {
          saida.push([tema, el, fundo, 'tinta', razao(g('--tinta'), g(fundo))]);
          saida.push([tema, el, fundo, 'sobre', razao(g('--sobre'), g(fundo))]);
        }
        for (const cf of ['--c-fogo', '--c-terra', '--c-ar', '--c-agua']) saida.push([tema, el, cf, 'tinta', razao(g('--tinta'), g(cf))]);
      }
    }
    return saida;
  });
  const baixos = contrastes.filter((x) => x[4] < 4.5);
  ok('contraste mínimo 4,5:1', baixos.length === 0, baixos);
  await ctx3.close();
}

function arquivos(pasta, lista = []) {
  for (const n of fs.readdirSync(pasta)) {
    if (n === '.git') continue;
    const f = path.join(pasta, n);
    if (fs.statSync(f).isDirectory()) arquivos(f, lista); else lista.push(f);
  }
  return lista;
}

function varredura() {
  const texto = arquivos(RAIZ).filter((f) => /\.(html|css|js|md)$/.test(f));
  for (const f of texto) {
    const c = fs.readFileSync(f, 'utf8');
    const r = path.relative(RAIZ, f);
    /* Monta os caracteres por código para este arquivo não se acusar. */
    ok(`sem travessão em ${r}`, !c.includes(String.fromCharCode(0x2014)) && !c.includes(String.fromCharCode(0x2013)));
    if (r.startsWith('js') || r === 'sw.js') ok(`sem HTML dinâmico em ${r}`, !/innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(/.test(c));
    ok(`sem imagem antiga em ${r}`, r.startsWith('tests') || !c.includes('horos.jpg'));
  }
  const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
  ok('CSP em meta', /http-equiv="Content-Security-Policy"/.test(html) && html.includes("default-src 'none'"));
  ok('sem caminhos absolutos no index', !/(src|href)="\//.test(html));
  ok('imagem antiga removida', !fs.existsSync(path.join(RAIZ, 'imagens', 'horos.jpg')));
  const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
  for (const a of sw.match(/'(?:js|fonts|imagens)\/[^']+'|'style\.css'|'index\.html'/g)) ok(`arquivo do service worker existe: ${a}`, fs.existsSync(path.join(RAIZ, a.replace(/'/g, ''))));
  const leia = fs.readFileSync(path.join(RAIZ, 'README.md'), 'utf8').trimEnd().split('\n');
  ok('README termina com a linha exata', leia[leia.length - 1] === 'Desenvolvi este projeto e usei o Claude, da Anthropic, como ferramenta durante o desenvolvimento.');
  ok('LICENSE e CLAUDE.md mantidos', fs.existsSync(path.join(RAIZ, 'LICENSE')) && fs.existsSync(path.join(RAIZ, 'CLAUDE.md')));
}

(async () => {
  assert(fs.existsSync(path.join(RAIZ, 'index.html')));
  if (CAPTURAS) fs.mkdirSync(CAPTURAS, { recursive: true });
  const naRaiz = await servir(RAIZ, '/');
  const noSub = await servir(RAIZ, '/Horoscopo-fasipe/');
  const navegador = await chromium.launch();
  try {
    varredura();
    await regras(navegador, noSub.url);
    await armazenamentoBloqueado(navegador, noSub.url);
    for (const tela of Object.keys(TELAS)) {
      await fluxos(navegador, noSub.url, tela, true);
      await fluxos(navegador, naRaiz.url, tela, false);
    }
  } finally {
    await navegador.close();
    naRaiz.servidor.close();
    noSub.servidor.close();
  }
  console.log(`\n${verificacoes} verificações, ${falhas.length} falhas`);
  if (falhas.length) { falhas.forEach((f) => console.log(' - ' + f)); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(2); });
