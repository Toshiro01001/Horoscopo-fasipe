/* Todo o conteúdo do site. Textos originais, escritos para esta demonstração. */
window.CeuDados = {
  signos: [
    { id: 'aries', nome: 'Áries', inicio: [3, 21], fim: [4, 19], elemento: 'fogo', regente: 'Marte', modo: 'cardinal',
      lema: 'Começa antes de terminar de ler o manual.',
      texto: 'Áries abre a fila do ano e age como quem abriu mesmo. Gosta de ver a coisa andar, perde a paciência com reunião que podia ser um recado e costuma ser a primeira pessoa a levantar a mão.',
      forca: 'Coragem para dar o primeiro passo.', tropeco: 'Largar na frente e esquecer a mala.' },
    { id: 'touro', nome: 'Touro', inicio: [4, 20], fim: [5, 20], elemento: 'terra', regente: 'Vênus', modo: 'fixo',
      lema: 'Sem pressa, e com lanche.',
      texto: 'Touro escolhe bem onde pisa, onde senta e o que come. Demora a mudar de ideia, mas quando muda é para valer. Conforto, para esse signo, é assunto sério.',
      forca: 'Constância de quem termina o que começa.', tropeco: 'Confundir teimosia com princípio.' },
    { id: 'gemeos', nome: 'Gêmeos', inicio: [5, 21], fim: [6, 20], elemento: 'ar', regente: 'Mercúrio', modo: 'mutável',
      lema: 'Tem duas opiniões e quer ouvir a sua.',
      texto: 'Gêmeos puxa conversa em qualquer fila, abre vinte abas e lembra de uma curiosidade para cada ocasião. Aprende rápido e troca de assunto mais rápido ainda.',
      forca: 'Ligar pessoas e ideias que não se conheciam.', tropeco: 'Deixar a aba mais importante para depois.' },
    { id: 'cancer', nome: 'Câncer', inicio: [6, 21], fim: [7, 22], elemento: 'água', regente: 'Lua', modo: 'cardinal',
      lema: 'Guarda tudo, inclusive aquela mensagem.',
      texto: 'Câncer transforma qualquer canto em casa e lembra do prato preferido de cada um. Por fora, casca. Por dentro, um álbum de fotografias com legenda.',
      forca: 'Cuidar sem que ninguém precise pedir.', tropeco: 'Recolher as garras e esperar que adivinhem.' },
    { id: 'leao', nome: 'Leão', inicio: [7, 23], fim: [8, 22], elemento: 'fogo', regente: 'Sol', modo: 'fixo',
      lema: 'Entra na sala e a sala percebe.',
      texto: 'Leão gosta de palco, mas divide o microfone quando o assunto é torcer por quem ama. É generoso em elogio, em presente e em volume de voz.',
      forca: 'Esquentar qualquer ambiente.', tropeco: 'Ficar sentido quando ninguém bate palma.' },
    { id: 'virgem', nome: 'Virgem', inicio: [8, 23], fim: [9, 22], elemento: 'terra', regente: 'Mercúrio', modo: 'mutável',
      lema: 'Já reparou naquele errinho ali.',
      texto: 'Virgem tem lista para a lista e sabe onde está o carregador de todo mundo. Não é mania, é método: ajudar é o jeito de esse signo dizer que gosta de alguém.',
      forca: 'Ver o detalhe que salva o conjunto.', tropeco: 'Revisar até o que já estava pronto.' },
    { id: 'libra', nome: 'Libra', inicio: [9, 23], fim: [10, 22], elemento: 'ar', regente: 'Vênus', modo: 'cardinal',
      lema: 'Depende. Você prefere qual?',
      texto: 'Libra pesa os dois lados de tudo, da briga em família à escolha da sobremesa. Tem faro para o que fica bonito e horror a clima pesado na mesa.',
      forca: 'Achar o meio-termo em que todos cabem.', tropeco: 'Passar o almoço inteiro decidindo onde almoçar.' },
    { id: 'escorpiao', nome: 'Escorpião', inicio: [10, 23], fim: [11, 21], elemento: 'água', regente: 'Plutão', modo: 'fixo',
      lema: 'Não disse nada, mas notou.',
      texto: 'Escorpião olha por baixo da superfície e raramente se contenta com a primeira resposta. Fala pouco de si, guarda segredo como cofre e leva amizade até o fim.',
      forca: 'Ir até o fundo da questão.', tropeco: 'Transformar pequena desfeita em arquivo permanente.' },
    { id: 'sagitario', nome: 'Sagitário', inicio: [11, 22], fim: [12, 21], elemento: 'fogo', regente: 'Júpiter', modo: 'mutável',
      lema: 'Já está olhando o mapa.',
      texto: 'Sagitário faz pergunta grande, conta história longa e volta de qualquer viagem com um amigo novo. Prefere errar o caminho a ficar parado discutindo a rota.',
      forca: 'Uma animação que contagia.', tropeco: 'Prometer três viagens antes do café.' },
    { id: 'capricornio', nome: 'Capricórnio', inicio: [12, 22], fim: [1, 19], elemento: 'terra', regente: 'Saturno', modo: 'cardinal',
      lema: 'Tem um plano para daqui a dez anos.',
      texto: 'Capricórnio sobe a montanha um degrau por vez e não reclama da subida. Parece sério até soltar aquela piada seca que ninguém esperava.',
      forca: 'Paciência de quem enxerga longe.', tropeco: 'Marcar a folga e levar o trabalho junto.' },
    { id: 'aquario', nome: 'Aquário', inicio: [1, 20], fim: [2, 18], elemento: 'ar', regente: 'Urano', modo: 'fixo',
      lema: 'Discorda, mas com carinho.',
      texto: 'Aquário enxerga o grupo inteiro e sempre tem uma ideia esquisita que funciona. Faz amizade com todo mundo e continua precisando do próprio espaço.',
      forca: 'Pensar diferente sem pedir licença.', tropeco: 'Explicar o futuro para quem só queria o horário do ônibus.' },
    { id: 'peixes', nome: 'Peixes', inicio: [2, 19], fim: [3, 20], elemento: 'água', regente: 'Netuno', modo: 'mutável',
      lema: 'Estava aqui, agora está na lua.',
      texto: 'Peixes percebe o clima de um lugar antes de entrar nele e se emociona com comercial de margarina sem culpa nenhuma. Mistura sonho, música e uma memória de dar inveja.',
      forca: 'Sentir junto com o outro.', tropeco: 'Sair nadando quando a conversa aperta.' }
  ],

  aberturas: [
    'Hoje rende mais quem começa pelo menor item da lista.',
    'O dia tem cara de conversa boa em lugar inesperado.',
    'Uma coisa simples vai dar mais certo do que o plano complicado.',
    'Alguém por perto está precisando ouvir um elogio sincero.',
    'A tarde promete uma pequena surpresa, daquelas que viram história.',
    'Vale olhar de novo para aquilo que você já deu por encerrado.',
    'O céu de bolso sugere menos pressa e mais janela aberta.',
    'Hoje o caminho mais curto talvez não seja o mais divertido.',
    'Uma lembrança antiga pode aparecer e trazer uma boa ideia junto.',
    'É um bom dia para dizer a coisa em voz alta em vez de só pensar.',
    'Aquele assunto travado anda melhor se mudar de cenário.',
    'A graça do dia está num detalhe que quase passa batido.',
    'Hoje quem pergunta aprende mais do que quem já sabe.',
    'O dia favorece recomeços pequenos, sem anúncio e sem plateia.',
    'Uma risada fora de hora pode salvar o clima de um lugar inteiro.',
    'Tem gente torcendo por você sem ter avisado.',
    'Hoje as coisas pedem capricho, não perfeição.',
    'A segunda tentativa tende a sair mais leve que a primeira.',
    'Uma música vai grudar na cabeça, e ela vai ter razão.',
    'O dia está bom para trocar a resposta pronta por uma curiosidade.',
    'Um silêncio bem colocado vai falar melhor que um discurso.',
    'Vale dar atenção ao que fez você sorrir ontem.',
    'Hoje tudo fica mais fácil com alguém do lado para comentar.',
    'O melhor momento do dia pode vir disfarçado de intervalo.'
  ],

  porElemento: {
    fogo: [
      'Seu lado fogo quer sair na frente, então escolha bem a corrida.',
      'Tem faísca sobrando: use numa ideia, não numa discussão.',
      'A vontade de agir combina com uma tarefa parada há tempos.',
      'Sua animação pega em quem está por perto.',
      'Um convite de última hora tem tudo a ver com o seu humor.',
      'Deixe a chama no médio: o dia é longo e a conversa também.',
      'Você vai ter coragem para aquela pergunta que vem adiando.',
      'Sair um pouco do lugar clareia o que parecia enrolado.'
    ],
    terra: [
      'Seu lado terra pede chão firme: uma coisa de cada vez.',
      'Arrumar um cantinho vai organizar mais do que o cantinho.',
      'Hoje o concreto ganha do abstrato: faça, depois comente.',
      'Um hábito pequeno vai render mais do que um grande plano.',
      'Você vai notar o que ninguém notou, e isso vai ajudar alguém.',
      'Tempo bom para terminar algo que está quase pronto.',
      'Mexer com as mãos vai sossegar a cabeça.',
      'Sua calma vira ponto de apoio para quem está correndo.'
    ],
    ar: [
      'Seu lado ar está cheio de assunto: escolha com quem dividir.',
      'Uma ideia nova vem no meio de uma conversa à toa.',
      'Troque duas mensagens compridas por um áudio curto.',
      'Você vai ligar dois pontos que ninguém tinha ligado.',
      'Uma leitura rápida vai render conversa até a noite.',
      'Seu humor está afiado: use com gentileza.',
      'Anote o que passar pela cabeça, que passa rápido.',
      'Ouvir um ponto de vista oposto vai ser mais divertido que o esperado.'
    ],
    'água': [
      'Seu lado água percebe o clima antes de todo mundo.',
      'Uma intuição boba merece pelo menos uma segunda olhada.',
      'Alguém vai se abrir com você, e ouvir já basta.',
      'Uma música, um cheiro ou uma foto vai levar você longe.',
      'Guarde um tempo só seu, mesmo que seja o do café.',
      'O que parecia mágoa pode ser só saudade.',
      'Sua sensibilidade hoje está mais para radar do que para tempestade.',
      'Uma conversa mansa resolve mais que um texto longo.'
    ]
  },

  missoes: [
    'mandar um oi para alguém de quem você lembrou esta semana.',
    'tomar um café sem olhar para a tela.',
    'tirar uma foto de algo bonito e banal.',
    'escrever num papel uma coisa que deu certo hoje.',
    'voltar para casa por uma rua diferente.',
    'jogar fora uma caneta que não funciona mais.',
    'ouvir um disco inteiro, na ordem, do começo ao fim.',
    'elogiar com detalhes o trabalho de alguém.',
    'perguntar a uma pessoa mais velha como era o bairro antigamente.',
    'arrumar só uma gaveta, e só uma.',
    'aprender a dizer obrigado em outra língua.',
    'contar uma piada ruim e sustentar até o fim.',
    'olhar o céu por um minuto inteiro, sem motivo.',
    'dar o primeiro passo naquela tarefa, nem que seja abrir o arquivo.',
    'devolver algo emprestado, ou pelo menos lembrar quem emprestou.',
    'regar uma planta ou adotar uma.',
    'desenhar alguma coisa sem se preocupar se ficou bom.',
    'ler uma página de um livro que está parado.',
    'reparar em três sons que você costuma ignorar.',
    'caprichar no prato, mesmo que a comida seja simples.',
    'descobrir o nome daquela pessoa que você sempre cumprimenta.',
    'usar a roupa preferida, mesmo sem ocasião.',
    'fazer uma lista de cinco coisas que fazem você rir.',
    'recomendar um filme ou uma música a alguém.'
  ],

  palavras: ['Janela', 'Fôlego', 'Capricho', 'Ponte', 'Faísca', 'Varanda', 'Bússola', 'Cafuné', 'Retalho', 'Maré', 'Rascunho', 'Semente',
    'Eco', 'Lanterna', 'Mochila', 'Compasso', 'Novelo', 'Atalho', 'Sereno', 'Recado', 'Quintal', 'Vento', 'Dobradura', 'Cantiga'],

  cores: [
    ['amarelo-ipê', '#F2B705'], ['vermelho-urucum', '#C8321E'], ['verde-pantanal', '#2F7D4F'], ['azul-anil', '#27408B'],
    ['laranja-pequi', '#F08A24'], ['roxo-jabuticaba', '#4B1E4F'], ['branco-algodão', '#F4F1E8'], ['terra-batida', '#8A5A33'],
    ['azul-rio', '#3E8FB0'], ['vermelho-guaraná', '#B3262E'], ['rosa-ipê', '#D9568F'], ['dourado-cerrado', '#C79A2B'],
    ['cinza-chuva', '#7F8A93'], ['verde-buriti', '#5C8A2E'], ['lilás-de-fim-de-tarde', '#9C84C6'], ['preto-carvão', '#2B2B2B']
  ],

  /* Chave: os dois elementos em ordem alfabética, separados por "+". */
  pares: {
    'fogo+fogo': ['Duas fogueiras na mesma noite', 'Muita energia e pouca paciência dos dois lados. Rende aventura, rende discussão por causa do filme, e a reconciliação costuma ser rápida.'],
    'terra+terra': ['Alicerce em dobro', 'Os dois gostam de saber onde as coisas estão. Dupla ótima para construir rotina e uma ameaça real a qualquer imprevisto na agenda.'],
    'ar+ar': ['Conversa sem fim', 'Assunto não falta e o silêncio é raro. A dupla se diverte muito, só precisa lembrar que alguém tem de sair do grupo para fazer o que foi combinado.'],
    'água+água': ['Mesma maré', 'Um entende o outro quase sem falar. É bonito, mas ajuda abrir a janela de vez em quando para a emoção não virar enchente.'],
    'fogo+terra': ['Fogueira no quintal', 'Um acelera e o outro confere o freio. Quando dá certo, o fogo ganha direção e a terra ganha graça. Quando não dá, cada um acha o outro de outro planeta.'],
    'ar+fogo': ['O vento e a chama', 'Um sopra e o outro pega. Combinação animada, de muitos planos e muito riso, desde que alguém lembre de pôr o plano no chão.'],
    'fogo+água': ['Chaleira no fogo', 'Temperaturas opostas, e é daí que sai o vapor. Pede conversa com calma: o fogo aprende a ouvir e a água aprende a falar na hora.'],
    'ar+terra': ['Pipa com linha', 'Um tem os pés no chão e o outro tem a cabeça no vento. Dá um bom voo se ninguém largar a linha.'],
    'terra+água': ['Chão molhado dá broto', 'Um oferece firmeza e o outro oferece carinho. Dupla caseira e atenciosa, que só precisa sair de casa de vez em quando.'],
    'ar+água': ['Neblina de manhã', 'A lógica de um encontra o sentimento do outro. Pode confundir no começo, mas quando se entendem viram ótimos tradutores um do outro.']
  },

  /* Chave: os dois modos em ordem alfabética, separados por "+". */
  modos: {
    'cardinal+cardinal': 'Os dois são de modo cardinal: querem começar as coisas, então combinem quem dá a largada.',
    'fixo+fixo': 'Os dois são de modo fixo: ninguém larga o osso fácil, então vale decidir antes quem cede.',
    'mutável+mutável': 'Os dois são de modo mutável: mudam de ideia juntos, então anotem o combinado.',
    'cardinal+fixo': 'Um é cardinal e o outro é fixo: um começa e o outro sustenta, uma boa divisão de tarefas.',
    'cardinal+mutável': 'Um é cardinal e o outro é mutável: um dá a largada e o outro ajusta a rota no caminho.',
    'fixo+mutável': 'Um é fixo e o outro é mutável: um segura a posição e o outro improvisa em volta.'
  },

  tiposDePar: {
    igual: 'Mesma frequência',
    classico: 'Combinação clássica',
    desafio: 'Dá trabalho, dá história'
  }
};
