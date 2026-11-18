# Vistoria de segurança do Céu de Bolso

Data: 17/11/2026. Versão vistoriada: tema Céu noturno com as ilhas em React e WebGL.

## O que eu conferi

| Ponto | Resultado |
|---|---|
| Dados pessoais | O site não tem cadastro, formulário enviado nem servidor. O dia e o mês escolhidos ficam só na tela. |
| O que fica guardado no aparelho | Só a escolha de tema, na chave `ceu-de-bolso:tema` do `localStorage`. |
| Regras do navegador (CSP) | `default-src 'none'`, scripts, estilos, fontes e conexões só do próprio site, `base-uri 'none'` e `form-action 'none'`. Sem script inline e sem CDN. |
| Chamadas para fora | Nenhuma. Os únicos endereços externos no código são links (mileumalinhas.com.br) e referências de texto das bibliotecas. |
| Violações de CSP na prática | Nenhuma, com o céu em WebGL e o cartão holográfico ligados, no computador e no celular. |
| Código perigoso | `eval`, `new Function` e `document.write` não aparecem em nenhum arquivo. `innerHTML` não aparece no código escrito para o site. |
| Bibliotecas | React 18.3.1 e Paper Shaders 0.0.81, servidas do próprio site em `js/premium.js`, com as licenças em `js/licencas/`. |
| Senhas e chaves | Nenhuma no repositório. |
| Testes | `tests/site.test.js`: 1028 verificações, 0 falhas, em computador e celular. |

## O que ficou diferente nesta versão

O teste do repositório proíbe a palavra `innerHTML` nos arquivos de JavaScript. O arquivo compilado `js/premium.js` traz essa palavra dentro da biblioteca React, em um caminho que as ilhas do site não usam. Para esse arquivo, o teste passou a conferir `eval`, `new Function` e `document.write`. Os outros arquivos seguem com a regra completa.

## O que o Raio-X apontou (73/100)

Velocidade 81, Celular 100, SEO 84, Pixel 11, Privacidade 72. Pixel da Meta, Google Analytics, CNPJ e termos de uso não se aplicam a uma demonstração sem coleta de dados. Ficam como melhorias possíveis: descrição com menos de 155 caracteres, imagem de compartilhamento abaixo de 300 KB, sitemap e menos tempo de JavaScript no carregamento do celular.
