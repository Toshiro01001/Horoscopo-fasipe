/* Arte original em SVG: doze emblemas em estilo de xilogravura, desenhados em caixa 100x100.
   O mesmo desenho alimenta o SVG da página e o canvas do cartão.
   Cada traço é [tipo, caminho, espessura]: f = preenchido, s = linha, c = recorte (cor do papel). */
(function () {
  function circ(x, y, r) { return 'M' + (x - r) + ' ' + y + 'a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0a' + r + ' ' + r + ' 0 1 0 ' + -2 * r + ' 0Z'; }
  function oval(x, y, rx, ry) { return 'M' + (x - rx) + ' ' + y + 'a' + rx + ' ' + ry + ' 0 1 0 ' + 2 * rx + ' 0a' + rx + ' ' + ry + ' 0 1 0 ' + -2 * rx + ' 0Z'; }
  function estrela(cx, cy, R, r, n) {
    var d = '';
    for (var i = 0; i < n * 2; i++) {
      var a = Math.PI * i / n - Math.PI / 2;
      var q = i % 2 ? r : R;
      d += (i ? 'L' : 'M') + (cx + q * Math.cos(a)).toFixed(2) + ' ' + (cy + q * Math.sin(a)).toFixed(2);
    }
    return d + 'Z';
  }
  function espiga() {
    var t = [['s', 'M50 96L50 18', 5]];
    for (var i = 0; i < 4; i++) {
      var y = 34 + i * 14;
      t.push(['f', 'M50 ' + y + 'Q34 ' + (y - 2) + ' 30 ' + (y - 16) + 'Q47 ' + (y - 14) + ' 50 ' + y + 'Z']);
      t.push(['f', 'M50 ' + y + 'Q66 ' + (y - 2) + ' 70 ' + (y - 16) + 'Q53 ' + (y - 14) + ' 50 ' + y + 'Z']);
    }
    t.push(['f', 'M50 24Q42 14 50 3Q58 14 50 24Z']);
    return t;
  }

  var EMBLEMAS = {
    aries: [
      ['s', 'M50 44C44 22 20 18 15 37C11 53 33 56 34 42C34 35 26 34 25 41', 7],
      ['s', 'M50 44C56 22 80 18 85 37C89 53 67 56 66 42C66 35 74 34 75 41', 7],
      ['f', 'M37 44L63 44L57 78Q50 92 43 78Z'],
      ['c', circ(44, 56, 3)], ['c', circ(56, 56, 3)], ['c', 'M46 78L54 78L50 83Z']
    ],
    touro: [
      ['s', 'M34 38C18 38 8 24 14 8', 8], ['s', 'M66 38C82 38 92 24 86 8', 8],
      ['f', 'M18 44Q26 38 32 44L30 52Q22 54 18 44Z'], ['f', 'M82 44Q74 38 68 44L70 52Q78 54 82 44Z'],
      ['f', 'M30 32Q50 24 70 32L66 66Q64 88 50 88Q36 88 34 66Z'],
      ['c', circ(41, 48, 3.5)], ['c', circ(59, 48, 3.5)], ['c', circ(44, 73, 2.6)], ['c', circ(56, 73, 2.6)],
      ['s', 'M44 84Q50 96 56 84', 3.5]
    ],
    gemeos: [
      ['f', circ(31, 24, 12)],
      ['f', 'M16 44Q31 34 46 44L44 92L18 92Z'],
      ['s', circ(69, 24, 10.5), 3.5],
      ['s', 'M55 45Q69 36 83 45L81 90L57 90Z', 3.5],
      ['s', 'M46 58L56 58', 5],
      ['c', circ(27, 23, 2)], ['c', circ(35, 23, 2)]
    ],
    cancer: [
      ['f', oval(50, 60, 26, 17)],
      ['s', 'M27 53C16 48 13 38 18 30', 6], ['s', 'M73 53C84 48 87 38 82 30', 6],
      ['f', 'M18 33L6 20L17 22L18 8L30 26Z'], ['f', 'M82 33L94 20L83 22L82 8L70 26Z'],
      ['s', 'M28 66L12 72', 5], ['s', 'M32 72L20 86', 5], ['s', 'M42 76L38 92', 5],
      ['s', 'M72 66L88 72', 5], ['s', 'M68 72L80 86', 5], ['s', 'M58 76L62 92', 5],
      ['s', 'M42 46L42 36', 4], ['s', 'M58 46L58 36', 4], ['f', circ(42, 34, 4)], ['f', circ(58, 34, 4)],
      ['c', 'M38 62Q50 70 62 62Q50 66 38 62Z']
    ],
    leao: [
      ['f', estrela(50, 50, 48, 32, 14)],
      ['c', circ(50, 52, 25)],
      ['f', circ(41, 47, 3.6)], ['f', circ(59, 47, 3.6)],
      ['f', 'M44 57L56 57L50 65Z'],
      ['s', 'M50 64L50 69M40 69Q45 75 50 69Q55 75 60 69', 3.2]
    ],
    virgem: espiga(),
    libra: [
      ['f', circ(50, 14, 6)],
      ['s', 'M50 14L50 84', 6], ['s', 'M14 26L86 26', 6], ['s', 'M28 90L72 90', 8],
      ['s', 'M16 26L4 56M16 26L28 56', 2.6], ['s', 'M84 26L72 56M84 26L96 56', 2.6],
      ['f', 'M0 56L32 56Q28 72 16 72Q4 72 0 56Z'], ['f', 'M68 56L100 56Q96 72 84 72Q72 72 68 56Z']
    ],
    escorpiao: [
      ['f', oval(40, 64, 20, 12)],
      ['s', 'M56 64C78 66 90 48 80 28C75 18 62 18 60 28', 7.5],
      ['f', 'M60 22L50 40L68 36Z'],
      ['s', 'M24 58C14 54 10 46 14 38', 5.5], ['s', 'M24 70C12 72 6 66 5 58', 5.5],
      ['f', 'M14 41L5 30L14 31L18 22L23 38Z'], ['f', 'M5 61L0 48L8 51L14 44L14 60Z'],
      ['s', 'M30 74L24 88', 4.5], ['s', 'M40 76L38 92', 4.5], ['s', 'M50 74L54 90', 4.5],
      ['c', circ(30, 62, 2.4)]
    ],
    sagitario: [
      ['s', 'M14 86L78 22', 6],
      ['f', 'M92 8L62 16L84 38Z'],
      ['s', 'M26 20C58 14 88 44 80 74', 7],
      ['s', 'M26 20L80 74', 2.4],
      ['s', 'M14 86L6 74M14 86L26 94', 5]
    ],
    capricornio: [
      ['s', 'M42 42C38 22 22 8 6 18C2 22 4 28 10 28', 7], ['s', 'M58 42C62 22 78 8 94 18C98 22 96 28 90 28', 7],
      ['f', 'M24 46Q30 38 38 44L36 52Q28 54 24 46Z'], ['f', 'M76 46Q70 38 62 44L64 52Q72 54 76 46Z'],
      ['f', 'M36 38L64 38L60 66L52 76L48 76L40 66Z'],
      ['f', 'M44 72L56 72L50 98Z'],
      ['c', 'M41 52L47 50L47 54Z'], ['c', 'M59 52L53 50L53 54Z']
    ],
    aquario: [
      ['f', 'M26 8L56 8L52 16Q70 28 58 48L26 48Q12 28 30 16Z'],
      ['s', 'M60 26L78 18', 7],
      ['s', 'M80 18C88 30 74 40 80 54', 5],
      ['c', 'M24 30L60 30L58 35L26 35Z'],
      ['s', 'M4 70Q14 58 24 70T44 70T64 70T84 70T96 66', 6.5],
      ['s', 'M4 88Q14 76 24 88T44 88T64 88T84 88T96 84', 6.5]
    ],
    peixes: [
      ['f', 'M6 30Q34 8 62 30L84 14L84 46L62 30Q34 52 6 30Z'],
      ['f', 'M94 70Q66 48 38 70L16 54L16 86L38 70Q66 92 94 70Z'],
      ['c', circ(20, 28, 3)], ['c', circ(80, 68, 3)],
      ['s', 'M46 46Q50 50 50 54', 4]
    ]
  };

  var NS = 'http://www.w3.org/2000/svg';

  function raios(n, r1, r2) {
    var d = '';
    for (var i = 0; i < n; i++) {
      var a = 2 * Math.PI * i / n;
      var l = Math.PI / n * 0.55;
      d += 'M' + (50 + r1 * Math.cos(a - l)).toFixed(2) + ' ' + (50 + r1 * Math.sin(a - l)).toFixed(2) +
        'L' + (50 + r2 * Math.cos(a)).toFixed(2) + ' ' + (50 + r2 * Math.sin(a)).toFixed(2) +
        'L' + (50 + r1 * Math.cos(a + l)).toFixed(2) + ' ' + (50 + r1 * Math.sin(a + l)).toFixed(2) + 'Z';
    }
    return d;
  }

  function criarTraco(t, soSombra) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', t[1]);
    if (t[0] === 's') {
      p.setAttribute('class', 'tr-linha');
      p.setAttribute('stroke-width', t[2]);
    } else {
      p.setAttribute('class', t[0] === 'c' && !soSombra ? 'tr-recorte' : 'tr-cheio');
    }
    return p;
  }

  /* Grupo SVG com o emblema. Com sombra = true, desenha antes a mesma forma deslocada em vermelho. */
  function grupoEmblema(id, sombra) {
    var g = document.createElementNS(NS, 'g');
    if (sombra) {
      var s = document.createElementNS(NS, 'g');
      s.setAttribute('class', 'sobreimpressao');
      s.setAttribute('transform', 'translate(2.4 2.4)');
      EMBLEMAS[id].forEach(function (t) { if (t[0] !== 'c') s.appendChild(criarTraco(t, true)); });
      g.appendChild(s);
    }
    EMBLEMAS[id].forEach(function (t) { g.appendChild(criarTraco(t)); });
    return g;
  }

  /* SVG solto, decorativo: o nome do signo sempre aparece em texto ao lado. */
  function svgEmblema(id, opcoes) {
    var o = opcoes || {};
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', o.raios ? '-24 -24 148 148' : '-4 -4 108 108');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'emblema ' + (o.classe || ''));
    if (o.raios) {
      var r = document.createElementNS(NS, 'path');
      r.setAttribute('d', raios(28, 58, 73));
      r.setAttribute('class', 'tr-cheio');
      svg.appendChild(r);
    }
    svg.appendChild(grupoEmblema(id, o.sombra));
    return svg;
  }

  /* Desenha o emblema no canvas do cartão, na mesma geometria do SVG. */
  function emblemaNoCanvas(ctx, id, x, y, tam, cores) {
    var pintar = function (cor, recorte, dx) {
      ctx.save();
      ctx.translate(x + dx, y + dx);
      ctx.scale(tam / 100, tam / 100);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      EMBLEMAS[id].forEach(function (t) {
        if (t[0] === 'c' && !recorte) return;
        var p = new Path2D(t[1]);
        if (t[0] === 's') { ctx.strokeStyle = cor; ctx.lineWidth = t[2]; ctx.stroke(p); }
        else { ctx.fillStyle = t[0] === 'c' ? cores.papel : cor; ctx.fill(p); }
      });
      ctx.restore();
    };
    pintar(cores.sobre, false, tam * 0.024);
    pintar(cores.tinta, true, 0);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(tam / 100, tam / 100);
    ctx.fillStyle = cores.tinta;
    ctx.fill(new Path2D(raios(28, 58, 73)));
    ctx.restore();
  }

  window.CeuArte = { NS: NS, grupoEmblema: grupoEmblema, svgEmblema: svgEmblema, emblemaNoCanvas: emblemaNoCanvas };
})();
