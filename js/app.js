/* A interface: rotas por hash, roda, favorito, tema e ligação com o cartão.
   Todo texto variável entra por nó de texto (textContent ou append), nunca como HTML. */
(function () {
  var D = window.CeuDados;
  var L = window.CeuLogica;
  var A = window.CeuArte;
  var C = window.CeuCartao;
  var raiz = document.documentElement;
  var main = document.getElementById('conteudo');
  var menu = document.getElementById('menu');
  var botaoTema = document.getElementById('botao-tema');
  var metaDescricao = document.querySelector('meta[name="description"]');
  var metaCor = document.querySelector('meta[name="theme-color"]');
  var DESCRICAO_PADRAO = metaDescricao.content;
  var CHAVE_FAVORITO = 'ceu-de-bolso:favorito';
  var CHAVE_TEMA = 'ceu-de-bolso:tema';
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var ANO_DIAS = 366;

  /* Guarda no aparelho. Se o navegador bloquear, a escolha vale até fechar a aba. */
  var memoria = {};
  function ler(chave) {
    if (chave in memoria) return memoria[chave];
    try { return localStorage.getItem(chave); } catch (e) { return null; }
  }
  function gravar(chave, valor) {
    memoria[chave] = valor;
    try {
      if (valor === null) localStorage.removeItem(chave);
      else localStorage.setItem(chave, valor);
    } catch (e) { /* segue só com a memória da aba */ }
  }

  function el(tag, atributos) {
    var n = document.createElement(tag);
    Object.keys(atributos || {}).forEach(function (k) { n.setAttribute(k, atributos[k]); });
    for (var i = 2; i < arguments.length; i++) {
      if (arguments[i] !== null && arguments[i] !== undefined) n.append(arguments[i]);
    }
    return n;
  }
  function svgEl(tag, atributos) {
    var n = document.createElementNS(A.NS, tag);
    Object.keys(atributos || {}).forEach(function (k) { n.setAttribute(k, atributos[k]); });
    return n;
  }

  function dois(n) { return String(n).padStart(2, '0'); }
  function faixa(s) {
    return dois(s.inicio[1]) + '/' + dois(s.inicio[0]) + ' a ' + dois(s.fim[1]) + '/' + dois(s.fim[0]);
  }
  function dataPorExtenso(iso) {
    var p = iso.split('-').map(Number);
    return p[2] + ' de ' + MESES[p[1] - 1] + ' de ' + p[0];
  }
  function diaPorExtenso(mes, dia) { return dia + ' de ' + MESES[mes - 1]; }
  function favorito() { return L.signoPorId(ler(CHAVE_FAVORITO)); }
  function linkSigno(id) { return '#/signo/' + id; }
  function maiuscula(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

  function pintarPapel(elemento) {
    if (elemento) raiz.dataset.elemento = elemento;
    else delete raiz.dataset.elemento;
    requestAnimationFrame(function () {
      metaCor.content = getComputedStyle(raiz).getPropertyValue('--papel').trim() || '#F6D04D';
    });
  }

  /* ---------- Tema ---------- */
  function rotularTema() {
    botaoTema.textContent = raiz.dataset.tema === 'escuro' ? 'Tema claro' : 'Tema escuro';
  }
  botaoTema.addEventListener('click', function () {
    raiz.dataset.tema = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro';
    gravar(CHAVE_TEMA, raiz.dataset.tema);
    rotularTema();
    pintarPapel(raiz.dataset.elemento);
  });

  /* ---------- Menu ---------- */
  function montarMenu(rota) {
    var fav = favorito();
    var itens = [];
    if (fav) itens.push([linkSigno(fav.id), 'Meu signo: ' + fav.nome]);
    itens.push(['#/signos', 'Signos'], ['#/compatibilidade', 'Compatibilidade'], ['#/como-funciona', 'Como isto funciona']);
    menu.replaceChildren();
    itens.forEach(function (i) {
      var a = el('a', { href: i[0] }, i[1]);
      if (rota && (i[0] === '#/' + rota || i[0] === '#/' + rota.split('/')[0])) a.setAttribute('aria-current', 'page');
      menu.append(a);
    });
  }

  /* ---------- Roda do ano ---------- */
  function ponto(raio, graus) {
    var r = (graus - 90) * Math.PI / 180;
    return (200 + raio * Math.cos(r)).toFixed(2) + ' ' + (200 + raio * Math.sin(r)).toFixed(2);
  }
  function cunha(r1, r2, a1, a2) {
    var grande = a2 - a1 > 180 ? 1 : 0;
    return 'M' + ponto(r2, a1) + 'A' + r2 + ' ' + r2 + ' 0 ' + grande + ' 1 ' + ponto(r2, a2) +
      'L' + ponto(r1, a2) + 'A' + r1 + ' ' + r1 + ' 0 ' + grande + ' 0 ' + ponto(r1, a1) + 'Z';
  }

  function criarRoda() {
    var rot = 0;
    var svg = svgEl('svg', { viewBox: '0 0 400 400', class: 'roda', role: 'group', 'aria-label': 'Roda do ano com os doze signos' });
    var gira = svgEl('g', { class: 'roda-gira' });
    gira.append(svgEl('circle', { cx: 200, cy: 200, r: 197, class: 'roda-borda' }));

    /* Anel dos meses, com marca no primeiro dia de cada um. */
    var marcas = svgEl('g', { 'aria-hidden': 'true' });
    MESES_CURTOS.forEach(function (nome, m) {
      var ini = L.indiceDoDia(m + 1, 1);
      var meio = (ini + L.DIAS_NO_MES[m] / 2) / ANO_DIAS * 360;
      var a = ini / ANO_DIAS * 360;
      marcas.append(svgEl('path', { d: 'M' + ponto(167, a) + 'L' + ponto(195, a), class: 'roda-marca' }));
      var t = svgEl('text', { x: 200, y: 29, 'text-anchor': 'middle', class: 'roda-mes', transform: 'rotate(' + meio.toFixed(2) + ' 200 200)' });
      t.textContent = nome;
      marcas.append(t);
    });
    gira.append(marcas);

    /* Fatias dos signos, cada uma com o tamanho real em dias. */
    D.signos.forEach(function (s) {
      var i1 = L.indiceDoDia(s.inicio[0], s.inicio[1]);
      var i2 = L.indiceDoDia(s.fim[0], s.fim[1]) + 1;
      if (i2 <= i1) i2 += ANO_DIAS;
      var a1 = i1 / ANO_DIAS * 360;
      var a2 = i2 / ANO_DIAS * 360;
      var meio = (a1 + a2) / 2;
      var link = svgEl('a', { href: linkSigno(s.id), 'aria-label': s.nome + ', de ' + faixa(s), class: 'roda-fatia elemento-' + s.elemento, 'data-signo': s.id });
      link.append(svgEl('path', { d: cunha(96, 166, a1, a2), class: 'roda-cunha' }));
      var g = A.grupoEmblema(s.id, false);
      var r = (meio - 90) * Math.PI / 180;
      g.setAttribute('transform', 'translate(' + (200 + 131 * Math.cos(r)).toFixed(2) + ' ' + (200 + 131 * Math.sin(r)).toFixed(2) + ') rotate(' + meio.toFixed(2) + ') scale(.46) translate(-50 -50)');
      link.append(g);
      gira.append(link);
    });
    svg.append(gira);

    svg.append(svgEl('circle', { cx: 200, cy: 200, r: 95, class: 'roda-miolo' }));
    var linha1 = svgEl('text', { x: 200, y: 182, 'text-anchor': 'middle', class: 'roda-miolo-dia', 'aria-hidden': 'true' });
    var linha2 = svgEl('text', { x: 200, y: 216, 'text-anchor': 'middle', class: 'roda-miolo-nome', 'aria-hidden': 'true' });
    svg.append(linha1, linha2);
    svg.append(svgEl('path', { d: 'M184 0L216 0L200 40Z', class: 'roda-ponteiro' }));

    function alvo(indice) { return -((indice + 0.5) / ANO_DIAS) * 360; }
    function posicionar(indice) {
      var delta = ((alvo(indice) - rot) % 360 + 540) % 360 - 180;
      rot += delta;
      gira.style.transform = 'rotate(' + rot.toFixed(2) + 'deg)';
    }
    return {
      no: svg,
      girar: function (indice, topo, nome) {
        posicionar(indice);
        linha1.textContent = topo;
        linha2.textContent = nome;
      },
      /* Primeira volta: parte de um ângulo deslocado até o dia certo. */
      abrir: function (indice, topo, nome) {
        rot = alvo(indice) - 70;
        gira.classList.add('sem-giro');
        gira.style.transform = 'rotate(' + rot + 'deg)';
        linha1.textContent = topo;
        linha2.textContent = nome;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            gira.classList.remove('sem-giro');
            posicionar(indice);
          });
        });
      }
    };
  }

  function meioDoSigno(s) {
    var i1 = L.indiceDoDia(s.inicio[0], s.inicio[1]);
    var i2 = L.indiceDoDia(s.fim[0], s.fim[1]);
    if (i2 < i1) i2 += ANO_DIAS;
    return Math.floor((i1 + i2) / 2) % ANO_DIAS;
  }

  /* ---------- Blocos reutilizados ---------- */
  function blocoDoDia(s, titulo, nivel) {
    var hoje = L.dataDeHoje();
    var m = L.mensagemDoDia(s.id, hoje);
    var amostra = el('span', { class: 'amostra', 'aria-hidden': 'true' });
    amostra.style.backgroundColor = m.corHex;
    return el('section', { class: 'dia', 'data-mensagem': s.id },
      el(nivel || 'h2', { class: 'dia-titulo' }, titulo),
      el('p', { class: 'dia-data' }, dataPorExtenso(hoje)),
      el('p', { class: 'dia-abertura' }, m.abertura),
      el('p', { class: 'dia-elemento' }, m.elemento),
      el('p', { class: 'dia-missao' }, el('strong', null, 'Pequena missão: '), m.missao),
      el('dl', { class: 'dia-extras' },
        el('div', null, el('dt', null, 'Palavra do dia'), el('dd', null, m.palavra)),
        el('div', null, el('dt', null, 'Cor do dia'), el('dd', null, amostra, maiuscula(m.cor)))),
      el('p', { class: 'dia-nota' }, 'Mensagem nova todo dia, à meia-noite do seu aparelho. Serve só para divertir.'));
  }

  function botaoFavorito(s, aoMudar) {
    var b = el('button', { type: 'button', class: 'botao botao-contorno', 'data-acao': 'favorito' });
    function rotular() {
      var e = (favorito() || {}).id === s.id;
      b.textContent = e ? 'Esquecer meu signo' : 'Lembrar como meu signo';
      b.setAttribute('aria-pressed', e ? 'true' : 'false');
    }
    rotular();
    b.addEventListener('click', function () {
      gravar(CHAVE_FAVORITO, (favorito() || {}).id === s.id ? null : s.id);
      rotular();
      montarMenu(rotaAtual);
      if (aoMudar) aoMudar();
    });
    return b;
  }

  function blocoCartao(s) {
    var hoje = L.dataDeHoje();
    var m = L.mensagemDoDia(s.id, hoje);
    var canvas = el('canvas', { width: 1080, height: 1350, class: 'cartao', role: 'img', 'aria-label': 'Cartão de ' + s.nome + ' com a mensagem de hoje' });
    var aviso = el('p', { class: 'cartao-aviso', role: 'status' });
    function pintar() { C.desenhar(canvas, s, dataPorExtenso(hoje), m); }
    pintar();
    C.fontesProntas().then(pintar);
    var textoReserva = s.nome + ', ' + dataPorExtenso(hoje) + ': ' + m.abertura + ' ' + m.elemento + ' Pequena missão: ' + m.missao + ' (Céu de Bolso, só entretenimento)';
    var copiar = el('button', { type: 'button', class: 'botao', 'data-acao': 'copiar' }, 'Copiar imagem');
    var baixar = el('button', { type: 'button', class: 'botao botao-contorno', 'data-acao': 'baixar' }, 'Baixar imagem');
    copiar.addEventListener('click', function () {
      C.copiar(canvas, textoReserva).then(function (r) {
        aviso.textContent = r === 'imagem' ? 'Imagem copiada. Cole onde quiser.'
          : r === 'texto' ? 'Este navegador não copia imagem, então copiamos o texto da mensagem.'
            : 'Este navegador não permite copiar daqui. Use Baixar imagem.';
      });
    });
    baixar.addEventListener('click', function () {
      C.baixar(canvas, 'ceu-de-bolso-' + s.id + '-' + hoje + '.png').then(function () {
        aviso.textContent = 'Imagem baixada: confira a pasta de downloads.';
      }, function () {
        aviso.textContent = 'Não deu para gerar a imagem neste navegador. Tente Copiar imagem.';
      });
    });
    return el('section', { class: 'cartao-bloco' },
      el('h2', null, 'Cartão de hoje'),
      canvas,
      el('div', { class: 'acoes' }, copiar, baixar),
      aviso);
  }

  /* ---------- Páginas ---------- */
  function paginaInicio() {
    definirPagina('Céu de Bolso: descubra seu signo e a mensagem do dia', DESCRICAO_PADRAO);
    var agora = new Date();
    var fav = favorito();
    var roda = criarRoda();
    var selMes = el('select', { id: 'campo-mes', name: 'mes' }, el('option', { value: '' }, 'Escolha'));
    MESES.forEach(function (nome, i) { selMes.append(el('option', { value: i + 1 }, maiuscula(nome))); });
    var selDia = el('select', { id: 'campo-dia', name: 'dia' });
    var status = el('p', { class: 'status', id: 'status-data', role: 'status' }, 'Escolha dia e mês. O ano não importa, e nada sai do seu aparelho.');
    var acaoStatus = el('p', { class: 'status-acao' });
    var resultado = el('div', { id: 'resultado', class: 'resultado' });

    function encherDias(maximo, atual) {
      selDia.replaceChildren(el('option', { value: '' }, 'Escolha'));
      for (var d = 1; d <= maximo; d++) selDia.append(el('option', { value: d }, String(d)));
      if (atual && atual <= maximo) selDia.value = String(atual);
    }
    encherDias(31);

    function mostrarSigno(s, titulo) {
      acaoStatus.replaceChildren(el('a', { class: 'botao', href: linkSigno(s.id), 'data-acao': 'abrir' }, 'Abrir folheto de ' + s.nome));
      resultado.replaceChildren(
        blocoDoDia(s, titulo, 'h2'),
        el('div', { class: 'acoes' }, botaoFavorito(s)));
      pintarPapel(s.elemento);
    }

    function atualizar() {
      var mes = Number(selMes.value);
      var diaAntes = Number(selDia.value);
      if (mes) {
        var maximo = L.DIAS_NO_MES[mes - 1];
        if (selDia.options.length - 1 !== maximo) {
          encherDias(maximo, diaAntes);
          if (diaAntes > maximo) {
            status.textContent = maiuscula(MESES[mes - 1]) + ' vai até o dia ' + maximo + '. Escolha o dia de novo.';
            return;
          }
        }
      }
      var dia = Number(selDia.value);
      if (!mes || !dia) return;
      var s = L.signoPorData(mes, dia);
      status.textContent = diaPorExtenso(mes, dia) + ' é ' + s.nome + '.';
      roda.girar(L.indiceDoDia(mes, dia), dia + ' de ' + MESES_CURTOS[mes - 1], s.nome);
      mostrarSigno(s, 'O dia de ' + s.nome);
    }
    selMes.addEventListener('change', atualizar);
    selDia.addEventListener('change', atualizar);

    var form = el('form', { class: 'form-data', autocomplete: 'off' },
      el('div', { class: 'campo' }, el('label', { for: 'campo-dia' }, 'Dia'), selDia),
      el('div', { class: 'campo' }, el('label', { for: 'campo-mes' }, 'Mês de nascimento'), selMes));
    form.addEventListener('submit', function (e) { e.preventDefault(); });

    main.replaceChildren(
      el('section', { class: 'abertura' },
        el('div', { class: 'abertura-texto' },
          el('h1', { class: 'titulo-site' }, 'Céu de Bolso'),
          el('p', { class: 'chamada' }, 'Um almanaque de papel que cabe no celular. Diga quando nasceu, a roda gira até o seu signo e, todo dia, tem uma mensagem nova. É tudo de brincadeira.'),
          form, status, acaoStatus),
        el('div', { class: 'abertura-roda' }, roda.no)),
      resultado,
      el('section', { class: 'atalhos' },
        el('h2', null, 'Já sabe o seu?'),
        gradeSignos()));

    var hojeMes = agora.getMonth() + 1;
    var hojeDia = agora.getDate();
    if (fav) {
      roda.abrir(meioDoSigno(fav), 'seu signo', fav.nome);
      mostrarSigno(fav, 'Seu dia, ' + fav.nome);
    } else {
      pintarPapel(null);
      roda.abrir(L.indiceDoDia(hojeMes, hojeDia), 'hoje, ' + hojeDia + ' de ' + MESES_CURTOS[hojeMes - 1], L.signoPorData(hojeMes, hojeDia).nome);
    }
  }

  function gradeSignos() {
    var lista = el('ul', { class: 'grade' });
    D.signos.forEach(function (s) {
      lista.append(el('li', { class: 'elemento-' + s.elemento },
        el('a', { href: linkSigno(s.id), 'data-signo': s.id },
          A.svgEmblema(s.id, { sombra: true }),
          el('span', { class: 'grade-nome' }, s.nome),
          el('span', { class: 'grade-datas' }, faixa(s)))));
    });
    return lista;
  }

  function paginaSignos() {
    definirPagina('Os 12 signos e suas datas | Céu de Bolso', 'As datas, o elemento e o regente dos doze signos, com uma página e uma mensagem do dia para cada um. Conteúdo de entretenimento.');
    pintarPapel(null);
    main.replaceChildren(el('section', { class: 'pagina' },
      el('h1', null, 'Os doze signos'),
      el('p', { class: 'chamada' }, 'Da largada de Áries ao mergulho de Peixes. As cores mostram o elemento: fogo, terra, ar e água.'),
      gradeSignos(),
      el('p', { class: 'nota' }, 'As datas exatas mudam um pouco de ano para ano. Este site usa uma tabela fixa, a mesma para todo mundo.')));
  }

  function paginaSigno(s) {
    definirPagina(s.nome + ': datas, perfil e mensagem do dia | Céu de Bolso', s.nome + ', de ' + faixa(s) + ': ' + s.lema + ' Perfil de brincadeira, mensagem do dia e cartão para baixar. Conteúdo de entretenimento.');
    pintarPapel(s.elemento);
    var i = D.signos.indexOf(s);
    var ant = D.signos[(i + 11) % 12];
    var prox = D.signos[(i + 1) % 12];
    var fav = favorito();
    var parceiro = fav && fav.id !== s.id ? fav : D.signos[(i + 4) % 12];
    main.replaceChildren(
      el('section', { class: 'folheto' },
        el('div', { class: 'folheto-arte' }, A.svgEmblema(s.id, { raios: true, sombra: true })),
        el('div', { class: 'folheto-texto' },
          el('h1', { class: 'folheto-nome' }, s.nome),
          el('p', { class: 'folheto-lema' }, s.lema),
          el('p', null, s.texto),
          el('dl', { class: 'fatos' },
            el('div', null, el('dt', null, 'Datas'), el('dd', null, faixa(s))),
            el('div', null, el('dt', null, 'Elemento'), el('dd', null, maiuscula(s.elemento))),
            el('div', null, el('dt', null, 'Regente'), el('dd', null, s.regente)),
            el('div', null, el('dt', null, 'Modo'), el('dd', null, maiuscula(s.modo))),
            el('div', null, el('dt', null, 'Ponto forte'), el('dd', null, s.forca)),
            el('div', null, el('dt', null, 'Tropeço típico'), el('dd', null, s.tropeco))),
          el('div', { class: 'acoes' },
            botaoFavorito(s),
            el('a', { class: 'botao botao-contorno', href: '#/compatibilidade/' + s.id + '/' + parceiro.id }, 'Combinar com outro signo')))),
      el('div', { class: 'folheto-dia' }, blocoDoDia(s, 'Mensagem de hoje', 'h2'), blocoCartao(s)),
      el('nav', { class: 'vizinhos', 'aria-label': 'Signos vizinhos' },
        el('a', { href: linkSigno(ant.id), rel: 'prev' }, 'Anterior: ' + ant.nome),
        el('a', { href: linkSigno(prox.id), rel: 'next' }, 'Próximo: ' + prox.nome)));
  }

  function paginaCompatibilidade(idA, idB) {
    var fav = favorito();
    var a = L.signoPorId(idA) || fav || D.signos[0];
    var b = L.signoPorId(idB) || D.signos[6];
    definirPagina('Compatibilidade entre signos | Céu de Bolso', 'Combine dois signos e leia, de brincadeira, como essa dupla funciona pelo elemento e pelo modo de cada um. Conteúdo de entretenimento.');
    pintarPapel(null);

    function seletor(id, rotulo, atual) {
      var s = el('select', { id: id });
      D.signos.forEach(function (x) { s.append(el('option', { value: x.id }, x.nome)); });
      s.value = atual.id;
      return { no: s, campo: el('div', { class: 'campo' }, el('label', { for: id }, rotulo), s) };
    }
    var sa = seletor('signo-a', 'Primeiro signo', a);
    var sb = seletor('signo-b', 'Segundo signo', b);
    var saida = el('div', { class: 'par', id: 'par', role: 'status' });

    function mostrar() {
      var x = L.signoPorId(sa.no.value);
      var y = L.signoPorId(sb.no.value);
      var r = L.compatibilidade(x.id, y.id);
      saida.replaceChildren(
        el('div', { class: 'par-emblemas' },
          el('span', { class: 'elemento-' + x.elemento }, A.svgEmblema(x.id, { sombra: true })),
          el('span', { class: 'elemento-' + y.elemento }, A.svgEmblema(y.id, { sombra: true }))),
        el('div', { class: 'par-texto' },
          el('p', { class: 'par-tipo' }, x.nome + ' com ' + y.nome + ': ' + r.tipo.toLowerCase()),
          el('h2', null, r.titulo),
          el('p', null, r.texto),
          el('p', null, r.modo),
          r.extra ? el('p', null, r.extra) : null));
      history.replaceState(null, '', '#/compatibilidade/' + x.id + '/' + y.id);
    }
    sa.no.addEventListener('change', mostrar);
    sb.no.addEventListener('change', mostrar);
    main.replaceChildren(el('section', { class: 'pagina' },
      el('h1', null, 'Compatibilidade'),
      el('p', { class: 'chamada' }, 'Escolha dois signos. O texto olha o elemento e o modo de cada um. É uma brincadeira: não serve para decidir nada de verdade.'),
      el('form', { class: 'form-data', autocomplete: 'off' }, sa.campo, sb.campo),
      saida));
    mostrar();
  }

  var LINHAS_COMO = [
    ['Descobrir o signo pela data', 'Uma tabela guarda o início e o fim de cada signo. O site confere em qual faixa o dia cai, sem enviar nada para lugar nenhum.', 'Calcular prazo de entrega, faixa de preço ou modelo ideal a partir do que a pessoa informa.'],
    ['Uma página para cada signo', 'O trecho do endereço depois do # diz qual conteúdo mostrar. Cada signo ganha um link próprio, que dá para mandar a alguém, sem existir um arquivo por página.', 'Catálogo de produtos ou serviços com link direto para cada item.'],
    ['Mensagem do dia', 'A data e o signo viram um número por uma conta matemática, e esse número escolhe as frases em listas escritas à mão. Quem é do mesmo signo vê a mesma mensagem no mesmo dia, sem servidor.', 'Prato do dia, dica da semana ou destaque que troca sozinho no calendário.'],
    ['Compatibilidade', 'Regras simples: cada signo tem um elemento e um modo, e cada combinação aponta para um texto. A ordem dos dois não muda o resultado.', 'Mostrar qual peça combina com qual, que acessório serve em qual modelo ou que plano atende cada perfil.'],
    ['Meu signo lembrado', 'O navegador guarda a escolha no próprio aparelho (localStorage). Não existe conta, e o dado não sai dali. Se o navegador bloquear, o site continua funcionando e só esquece ao fechar.', 'Lembrar a unidade mais próxima ou o idioma preferido, sem obrigar ninguém a se cadastrar.'],
    ['Cartão para copiar ou baixar', 'O navegador desenha a imagem na hora (canvas), com o signo, a data e a mensagem. O arquivo nasce no aparelho de quem usa.', 'Cupom, convite, certificado ou post pronto com a marca do cliente, para a pessoa compartilhar.'],
    ['Tema claro e escuro', 'A página segue o ajuste do aparelho e deixa trocar por um botão. As cores ficam num só lugar (variáveis CSS).', 'Trocar a paleta pela da marca sem redesenhar cada tela.'],
    ['Abre sem internet', 'Na primeira visita, um pequeno programa (service worker) guarda os arquivos do site. Depois ele entrega essa cópia na hora e atualiza por trás quando há conexão.', 'Cardápio, catálogo ou programação de evento que abre mesmo com sinal ruim.']
  ];

  function paginaComo() {
    definirPagina('Como isto funciona | Céu de Bolso', 'Como este site funciona em termos simples, sem servidor e sem cadastro, e o que dá para adaptar ao seu negócio.');
    pintarPapel(null);
    var linhas = el('div', { class: 'como' });
    LINHAS_COMO.forEach(function (l) {
      linhas.append(el('article', { class: 'como-linha' },
        el('h2', null, l[0]),
        el('div', null, el('h3', null, 'Como funciona'), el('p', null, l[1])),
        el('div', null, el('h3', null, 'No seu negócio'), el('p', null, l[2]))));
    });
    main.replaceChildren(el('section', { class: 'pagina pagina-texto' },
      el('h1', null, 'Como isto funciona'),
      el('p', { class: 'chamada' }, 'O site inteiro são arquivos simples, sem servidor, sem cadastro e sem banco de dados. Tudo roda no navegador de quem abre, por isso carrega rápido e continua abrindo sem internet. A astrologia é só o tema: por baixo estão peças que servem para muitos negócios.'),
      linhas,
      el('h2', { class: 'como-sub' }, 'O que este modelo não faz'),
      el('p', null, 'Ele não recebe pedido, não cobra e não guarda nada em nome de ninguém. Formulário com envio, pagamento, estoque e área do cliente pedem servidor e banco de dados, e isso muda o orçamento e o prazo.'),
      el('h2', { class: 'como-sub' }, 'Sobre o conteúdo'),
      el('p', null, 'Os textos foram escritos para esta demonstração e são entretenimento. As frases saem de uma conta com a data, não de uma previsão, e não servem de orientação médica, financeira ou jurídica.'),
      el('p', { class: 'acoes' }, el('a', { class: 'botao', href: 'https://mileumalinhas.com.br', rel: 'noopener' }, 'Conhecer a Mil e Uma Linhas!'))));
  }

  function paginaNaoEncontrada() {
    definirPagina('Página não encontrada | Céu de Bolso', DESCRICAO_PADRAO);
    pintarPapel(null);
    main.replaceChildren(el('section', { class: 'pagina' },
      el('h1', null, 'Esta página não existe'),
      el('p', { class: 'chamada' }, 'O endereço não bate com nenhum signo nem com nenhuma seção do site. A lista completa está logo abaixo.'),
      el('p', { class: 'acoes' }, el('a', { class: 'botao', href: '#/signos' }, 'Ver os doze signos'))));
  }

  function definirPagina(titulo, descricao) {
    document.title = titulo;
    metaDescricao.content = descricao;
  }

  /* ---------- Rotas ---------- */
  var rotaAtual = '';
  var dataDaTela = L.dataDeHoje();
  var primeira = true;

  function rotear() {
    var partes = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var r = partes[0] || '';
    rotaAtual = partes.join('/');
    dataDaTela = L.dataDeHoje();
    if (r === '') paginaInicio();
    else if (r === 'signos' && partes.length === 1) paginaSignos();
    else if (r === 'signo' && partes.length === 2 && L.signoPorId(partes[1])) paginaSigno(L.signoPorId(partes[1]));
    else if (r === 'compatibilidade' && partes.length <= 3) paginaCompatibilidade(partes[1], partes[2]);
    else if (r === 'como-funciona' && partes.length === 1) paginaComo();
    else paginaNaoEncontrada();
    montarMenu(partes[0] === 'signo' ? '' : partes[0] || '');
    if (!primeira) {
      window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
    }
    primeira = false;
  }

  document.getElementById('pular').addEventListener('click', function (e) {
    e.preventDefault();
    main.focus();
  });
  window.addEventListener('hashchange', rotear);
  /* Quem deixa a aba aberta de um dia para o outro recebe a mensagem nova ao voltar. */
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && L.dataDeHoje() !== dataDaTela) rotear();
  });

  rotularTema();
  rotear();

  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* o site segue normal, só não abre sem internet */ });
    });
  }
})();
