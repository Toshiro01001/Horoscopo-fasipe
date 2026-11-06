# Céu de Bolso

Site estático interativo de horóscopo, só de entretenimento, que começou como um trabalho de faculdade e hoje é demonstração da Mil e Uma Linhas!. Sem build e sem servidor: `index.html`, `style.css`, `sw.js` e as pastas `js/`, `fonts/`, `imagens/` e `tests/`. Veja o `README.md`.

## Regras de trabalho

- Responda em português do Brasil, sem travessões, e chame o dono de Rodrigo Jr.
- Altere só o que foi pedido. Publicar ou fazer merge no `main` depende de pedido dele.
- Toda função criada ou alterada precisa funcionar também no celular. Teste a versão mobile, não só a de computador.
- Ao criar ou alterar o site, explique como ele funciona.
- Ao terminar uma alteração, entregue a mensagem de commit em dois blocos rotulados: "Título" (até 50 caracteres) e "Descrição" (estendida, com exatamente o que foi feito).
- Entregue arquivos soltos, nunca em `.zip`.
- O repositório é público: não coloque senhas, chaves secretas nem dados pessoais em arquivos versionados.
- Rode `NODE_PATH=$(npm root -g) node tests/site.test.js` antes de entregar. Ao mudar a lista de arquivos em `sw.js`, troque `VERSAO`.
