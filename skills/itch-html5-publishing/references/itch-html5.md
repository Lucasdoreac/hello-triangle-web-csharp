# Referência de publicação HTML5 no itch.io

## Requisitos do pacote

- Para uma aplicação com vários arquivos, envie um ZIP com `index.html` na raiz e todos os recursos necessários.
- Uma página autocontida pode ser enviada como arquivo HTML único.
- Nomes de arquivos são sensíveis a maiúsculas/minúsculas.
- Use caminhos relativos, como `assets/app.js`, `./styles.css` e `./_framework/…`; evite caminhos iniciados por `/`.
- O limite padrão é 1.000 arquivos, 500 MB extraídos e 200 MB por arquivo. Veja a [documentação oficial](https://itch.io/docs/creators/html5).

Para criar o ZIP em macOS ou Linux:

```bash
cd pasta-da-build
zip -r ../meu-projeto-itch.zip .
```

Abra o ZIP para conferir que `index.html` aparece no primeiro nível.

## Interface web

1. Em uma página nova ou existente, selecione o tipo **HTML**.
2. Envie a build e marque que o arquivo será executado no navegador.
3. Escolha **Embed in page** e defina a largura e a altura iniciais do frame.
4. Ative **Mobile friendly**, inicialização automática e tela cheia somente quando o projeto oferecer suporte a isso.
5. Salve, teste a página e então publique quando autorizado.

## Butler

Butler é a ferramenta oficial do itch.io para enviar builds. É útil quando o seletor de arquivos do navegador não está disponível ou para atualizações repetidas, porque transmite diferenças entre builds.

A página do projeto deve existir antes do primeiro `push`. Instale e confirme a ferramenta conforme a [documentação oficial](https://itch.io/docs/butler/installing.html), depois autentique:

```bash
butler version
butler login
```

Envie a pasta que contém `index.html`:

```bash
butler push <pasta-da-build> <usuario>/<slug-do-projeto>:html5 --userversion 1.0.0
```

Use uma versão maior a cada atualização. Ponha o caminho entre aspas se ele tiver espaços. Para builds nativas, use canais por plataforma, como `:windows`, `:linux` e `:osx`; para conteúdo de navegador, use normalmente `:html5`.

Butler cuida do upload. A interface web continua sendo o lugar adequado para configurar página, metadados, descrição, frame e visibilidade.

## Diagnóstico

| Sintoma | Verificação |
| --- | --- |
| Tela em branco ou carregamento infinito | `index.html` está na raiz do ZIP e os recursos da build foram incluídos? |
| Recursos retornam 404 ou 403 | Há caminhos absolutos começando com `/`? |
| Funciona em arquivo local, mas não na hospedagem | A aplicação foi testada por HTTP local? |
| Butler não localiza arquivos | A pasta passada contém `index.html`? Há espaços sem aspas? |
| Butler pede login ou falha antes de enviar | Rode `butler login` e confirme que a página do projeto já existe. |
