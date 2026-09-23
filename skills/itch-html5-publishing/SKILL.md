---
name: itch-html5-publishing
description: Prepare, validate, and publish HTML5 or WebAssembly projects on itch.io through its web interface or Butler.
---

# Publicar HTML5 no itch.io

Use esta skill quando o usuário quer disponibilizar uma aplicação, site, jogo ou experiência WebAssembly que rode no navegador pelo itch.io. Ela cobre a preparação da build, a validação do pacote e o upload pela interface ou pelo Butler.

## Escolha do fluxo

- Use a interface web para criar ou editar a página, escolher título, descrição, tipo HTML, tamanho do frame, acessibilidade móvel e visibilidade.
- Use Butler quando o usuário quiser enviar ou atualizar a build sem o seletor de arquivos do navegador, ou quando atualizações repetidas fizerem sentido.
- A publicação externa é uma mutação: só altere visibilidade para pública ou envie uma build quando o usuário tiver pedido para publicar. Prepare e valide tudo o que puder antes desse passo.

## Preparar a build

1. Use o comando de produção do projeto e encontre a pasta de saída.
2. Confirme que ela contém `index.html` diretamente e todos os recursos usados pela página.
3. Teste a build por HTTP local. Runtimes WebAssembly não devem ser testados abrindo o arquivo por `file://`.
4. Revise os caminhos de recursos: devem ser relativos ao `index.html`. Caminhos que começam com `/` falham quando o itch.io hospeda o projeto em um subdiretório.
5. Para upload pela interface, gere um ZIP cujo primeiro nível contenha `index.html`, não uma pasta que o contém.

Leia [references/itch-html5.md](references/itch-html5.md) antes de publicar para os detalhes da interface, Butler, canais e correções dos erros comuns.

## Verificar o resultado

Depois de uma publicação, abra a URL pública ou de rascunho, espere o processamento inicial do itch.io e confirme visualmente que a página e os recursos carregaram. Quando houver falha, inspecione primeiro o local de `index.html`, os caminhos relativos e a pasta indicada no comando Butler.
