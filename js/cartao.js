/* Desenha o cartão do dia num canvas de 1080x1350. A imagem nasce no aparelho de quem usa. */
(function () {
  var A = window.CeuArte;
  var PAPEIS = { fogo: '#F9B79A', terra: '#DDD27E', ar: '#B6D8EE', 'água': '#A9DFC0' };
  var TINTA = '#1A1F5C';
  var SOBRE = '#A30F1E';
  var TITULO = '"Alfa Slab One", Georgia, serif';
  var CORPO = '"Literata", Georgia, serif';

  function quebrar(ctx, texto, largura) {
    var linhas = [];
    var atual = '';
    texto.split(' ').forEach(function (p) {
      var tentativa = atual ? atual + ' ' + p : p;
      if (ctx.measureText(tentativa).width > largura && atual) { linhas.push(atual); atual = p; }
      else atual = tentativa;
    });
    if (atual) linhas.push(atual);
    return linhas;
  }

  function desenhar(canvas, signo, dataTexto, msg) {
    var ctx = canvas.getContext('2d');
    var L = canvas.width;
    var H = canvas.height;
    var papel = PAPEIS[signo.elemento];
    ctx.fillStyle = papel;
    ctx.fillRect(0, 0, L, H);
    ctx.strokeStyle = TINTA;
    ctx.lineWidth = 14;
    ctx.strokeRect(34, 34, L - 68, H - 68);
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = TINTA;
    ctx.textAlign = 'left';
    ctx.font = '42px ' + TITULO;
    ctx.fillText('Céu de Bolso', 84, 118);
    ctx.textAlign = 'right';
    ctx.font = '500 32px ' + CORPO;
    ctx.fillText(dataTexto, L - 84, 116);

    A.emblemaNoCanvas(ctx, signo.id, L / 2 - 130, 186, 260, { papel: papel, tinta: TINTA, sobre: SOBRE });

    ctx.textAlign = 'center';
    ctx.fillStyle = TINTA;
    var corpoNome = 128;
    do {
      ctx.font = corpoNome + 'px ' + TITULO;
      corpoNome -= 4;
    } while (ctx.measureText(signo.nome).width > L - 180);
    ctx.fillText(signo.nome, L / 2, 640);

    /* A mensagem encolhe até caber, qualquer que seja a combinação de frases. */
    var texto = msg.abertura + ' ' + msg.elemento;
    var missao = 'Pequena missão: ' + msg.missao;
    var corpo = 52;
    var linhas, linhasMissao, altura;
    do {
      ctx.font = corpo + 'px ' + CORPO;
      linhas = quebrar(ctx, texto, L - 190);
      linhasMissao = quebrar(ctx, missao, L - 190);
      altura = (linhas.length + linhasMissao.length) * corpo * 1.34 + 28;
      corpo -= 2;
    } while (altura > 500 && corpo > 28);
    corpo += 2;
    /* Centraliza a mensagem no espaço entre o nome e o rodapé. */
    var y = 680 + Math.max(0, (540 - altura) / 2) + corpo;
    ctx.textAlign = 'left';
    ctx.fillStyle = TINTA;
    ctx.font = corpo + 'px ' + CORPO;
    linhas.forEach(function (l) { ctx.fillText(l, 95, y); y += corpo * 1.34; });
    y += 28;
    ctx.fillStyle = SOBRE;
    ctx.font = '600 ' + corpo + 'px ' + CORPO;
    linhasMissao.forEach(function (l) { ctx.fillText(l, 95, y); y += corpo * 1.34; });

    ctx.fillStyle = TINTA;
    ctx.textAlign = 'center';
    ctx.font = '500 27px ' + CORPO;
    ctx.fillText('Isto é entretenimento. Demonstração de Mil e Uma Linhas!', L / 2, H - 76);
  }

  /* Espera as fontes carregarem; se falharem, o cartão sai com a fonte reserva. */
  function fontesProntas() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all([
      document.fonts.load('42px "Alfa Slab One"'),
      document.fonts.load('46px "Literata"'),
      document.fonts.load('600 46px "Literata"')
    ]).catch(function () {});
  }

  function paraPng(canvas) {
    return new Promise(function (ok, erro) {
      canvas.toBlob(function (b) { if (b) ok(b); else erro(new Error('Canvas sem imagem')); }, 'image/png');
    });
  }

  function baixar(canvas, nomeArquivo) {
    return paraPng(canvas).then(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
    });
  }

  /* Tenta copiar a imagem. Sem suporte, copia o texto. Sem isso também, avisa quem chamou. */
  function copiar(canvas, textoReserva) {
    var area = navigator.clipboard;
    if (area && window.ClipboardItem && area.write) {
      /* O Safari exige que a promessa entre no ClipboardItem ainda dentro do clique. */
      return area.write([new ClipboardItem({ 'image/png': paraPng(canvas) })])
        .then(function () { return 'imagem'; })
        .catch(function () { return copiarTexto(textoReserva); });
    }
    return copiarTexto(textoReserva);
  }

  function copiarTexto(texto) {
    var area = navigator.clipboard;
    if (!area || !area.writeText) return Promise.resolve('nada');
    return area.writeText(texto).then(function () { return 'texto'; }).catch(function () { return 'nada'; });
  }

  window.CeuCartao = { desenhar: desenhar, fontesProntas: fontesProntas, baixar: baixar, copiar: copiar };
})();
