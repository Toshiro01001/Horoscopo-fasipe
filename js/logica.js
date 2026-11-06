/* Regras do site: funções puras, sem tocar na página. Os testes chamam estas funções direto. */
(function () {
  var D = window.CeuDados;
  var DIAS_NO_MES = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  /* Posição do dia num ano com 29 de fevereiro: 1º de janeiro é 0 e 31 de dezembro é 365. */
  function indiceDoDia(mes, dia) {
    var total = dia - 1;
    for (var m = 0; m < mes - 1; m++) total += DIAS_NO_MES[m];
    return total;
  }

  function dataValida(mes, dia) {
    return Number.isInteger(mes) && Number.isInteger(dia) && mes >= 1 && mes <= 12 && dia >= 1 && dia <= DIAS_NO_MES[mes - 1];
  }

  function signoPorData(mes, dia) {
    if (!dataValida(mes, dia)) return null;
    var hoje = indiceDoDia(mes, dia);
    return D.signos.find(function (s) {
      var ini = indiceDoDia(s.inicio[0], s.inicio[1]);
      var fim = indiceDoDia(s.fim[0], s.fim[1]);
      return ini <= fim ? hoje >= ini && hoje <= fim : hoje >= ini || hoje <= fim;
    }) || null;
  }

  function signoPorId(id) {
    return D.signos.find(function (s) { return s.id === id; }) || null;
  }

  /* FNV-1a com mistura final: transforma um texto num número. O mesmo texto sempre dá o mesmo número.
     A mistura é necessária porque os últimos bits do FNV sozinho variam pouco, e o resto da divisão usa esses bits. */
  function resumo(texto) {
    var h = 2166136261;
    for (var i = 0; i < texto.length; i++) {
      h ^= texto.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h >>> 0;
  }

  function escolher(lista, semente) {
    return lista[resumo(semente) % lista.length];
  }

  /* Data local do aparelho, no formato AAAA-MM-DD. */
  function dataDeHoje(agora) {
    var d = agora || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function mensagemDoDia(idSigno, data) {
    var s = signoPorId(idSigno);
    if (!s) return null;
    var base = data + '|' + s.id + '|';
    var cor = escolher(D.cores, base + 'cor');
    return {
      abertura: escolher(D.aberturas, base + 'abertura'),
      elemento: escolher(D.porElemento[s.elemento], base + 'elemento'),
      missao: escolher(D.missoes, base + 'missao'),
      palavra: escolher(D.palavras, base + 'palavra'),
      cor: cor[0],
      corHex: cor[1]
    };
  }

  function chave(a, b) {
    return [a, b].sort().join('+');
  }

  function compatibilidade(idA, idB) {
    var a = signoPorId(idA);
    var b = signoPorId(idB);
    if (!a || !b) return null;
    var par = D.pares[chave(a.elemento, b.elemento)];
    var classicos = ['ar+fogo', 'terra+água'];
    var tipo = a.elemento === b.elemento ? 'igual' : classicos.indexOf(chave(a.elemento, b.elemento)) >= 0 ? 'classico' : 'desafio';
    var distancia = Math.abs(D.signos.indexOf(a) - D.signos.indexOf(b));
    var extra = '';
    if (a === b) extra = 'Dois de ' + a.nome + ' na mesma casa: é como conversar com o espelho, com tudo de bom e de cômico que isso traz.';
    else if (distancia === 6) extra = a.nome + ' e ' + b.nome + ' ficam frente a frente na roda: cada um tem o que falta ao outro.';
    return {
      titulo: par[0],
      texto: par[1],
      tipo: D.tiposDePar[tipo],
      modo: D.modos[chave(a.modo, b.modo)],
      extra: extra
    };
  }

  window.CeuLogica = {
    DIAS_NO_MES: DIAS_NO_MES,
    indiceDoDia: indiceDoDia,
    dataValida: dataValida,
    signoPorData: signoPorData,
    signoPorId: signoPorId,
    resumo: resumo,
    dataDeHoje: dataDeHoje,
    mensagemDoDia: mensagemDoDia,
    compatibilidade: compatibilidade
  };
})();
