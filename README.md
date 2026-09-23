# Trans Triangle — C# WebAssembly

Este é o exemplo `2.1.hello_triangle` convertido para rodar no navegador. A aplicação é escrita e compilada em C#; o navegador executa o resultado como WebAssembly. O desenho usa WebGL 2, pois é a API gráfica que os navegadores oferecem.

A cena usa azul-claro, rosa e branco da bandeira trans nos vértices. O shader de vértice aplica rotação e pulsação contínuas para deixar o exemplo visualmente vivo sem esconder os conceitos de VBO, VAO, shaders e `drawArrays`.

## Por que esta estrutura

O `main.cpp` de referência cria uma janela GLFW, prepara shaders, envia os vértices à GPU e entra no loop de renderização. No navegador não existe uma janela GLFW. O elemento equivalente é um `<canvas>`, e o WebGL 2 fornece as chamadas de GPU.

| No exemplo C++ | Nesta versão C# web |
| --- | --- |
| `main()` | [src/Program.cs](src/Program.cs) inicializa o Blazor WebAssembly. |
| Janela GLFW | `<canvas>` em [wwwroot/index.html](wwwroot/index.html). |
| Loop e estado da aplicação | Componente C# [Triangle.razor](src/Components/Triangle.razor). |
| OpenGL/GLAD | [wwwroot/triangle.js](wwwroot/triangle.js), uma ponte pequena para a API WebGL do navegador. |
| Vertex e fragment shader | Os mesmos shaders, adaptados de OpenGL 3.3 para WebGL 2 (`#version 300 es`). |

`Triangle.razor` cria o canvas e, depois que a tela é renderizada, chama `draw` por interoperabilidade JavaScript. O arquivo `triangle.js` cria os shaders, monta o VBO/VAO com os três vértices, limpa o canvas e chama `drawArrays` para renderizar o triângulo nas cores azul-claro, rosa e branco.

O arquivo JavaScript é necessário porque WebGL é uma API nativa do navegador. A aplicação, a tela e a inicialização continuam em C#; o JavaScript apenas acessa a API gráfica exposta pelo browser.

## Guia completo: publicar projetos web no itch.io

Este fluxo serve para qualquer site, jogo ou experiência interativa que rode somente no navegador com HTML, CSS, JavaScript ou WebAssembly. O itch.io espera uma página inicial chamada `index.html`; arquivos adicionais precisam estar no mesmo pacote e ser referenciados por caminhos relativos.

### Antes de enviar

1. Gere uma build de produção. Cada ferramenta tem seu comando: `dotnet publish`, `npm run build`, `vite build`, `unity -buildTarget WebGL`, entre outros.
2. Encontre a pasta final da build. Ela deve conter `index.html` diretamente, além de todos os arquivos de JavaScript, CSS, imagens, áudio, fontes e arquivos `.wasm` necessários.
3. Abra a build em um servidor HTTP local e teste. Não abra o `index.html` pelo explorador de arquivos: vários runtimes WebAssembly exigem HTTP.
4. Use caminhos relativos. Um endereço como `/assets/logo.png` procura um arquivo na raiz do domínio e falha no CDN do itch.io. Prefira `assets/logo.png` ou `./assets/logo.png`. Neste projeto, por exemplo, o `base href` é `./` para que os arquivos do Blazor carreguem dentro do iframe do itch.io.

O itch.io aceita um arquivo HTML único ou um ZIP. Para projetos com mais de um arquivo, use ZIP. Dentro dele, `index.html` deve ficar na raiz do ZIP, e não dentro de uma pasta intermediária.

```text
correto.zip
├── index.html
├── assets/
└── _framework/

incorreto.zip
└── minha-build/
    ├── index.html
    └── assets/
```

Em macOS e Linux, entre na pasta da build antes de compactar:

```bash
cd pasta-da-build
zip -r ../meu-projeto-itch.zip .
```

No Windows, abra a pasta da build, selecione seu conteúdo e use **Enviar para → Pasta compactada**. Confirme abrindo o ZIP: o primeiro nível deve mostrar `index.html`.

O serviço limita um ZIP HTML5 a 1.000 arquivos, 500 MB extraídos e 200 MB por arquivo. Evite também nomes de arquivos com mais de 240 caracteres. Consulte a [documentação de HTML5 do itch.io](https://itch.io/docs/creators/html5) se a build ultrapassar esses limites.

### Publicação pela interface web

1. Crie uma página em [itch.io/game/new](https://itch.io/game/new), ou abra **Edit project** em uma página existente.
2. Escolha **HTML** como tipo do projeto e preencha título, URL e descrição.
3. Envie o ZIP da build como arquivo de upload.
4. Marque **This file will be played in the browser** e escolha **Embed in page**.
5. Defina largura e altura iniciais do frame. `800 × 600` é um bom ponto de partida; prefira um layout responsivo na aplicação.
6. Se a experiência funcionar em celular, marque **Mobile friendly**. Ative **Automatically start on page load** e **Fullscreen button** quando fizer sentido.
7. Salve como rascunho, abra a página pública de teste e confirme que todos os recursos carregam. O primeiro processamento do ZIP pode levar alguns instantes.
8. Quando estiver correto, altere a visibilidade para **Public** e salve.

### Publicação pelo Butler

O [Butler](https://itch.io/docs/butler/) é a ferramenta oficial de linha de comando do itch.io. Ele envia uma pasta de build diretamente, não exige o seletor de arquivos do navegador e transfere apenas as diferenças nas atualizações seguintes. O Butler não cria a página do projeto: crie-a uma vez pela interface web antes do primeiro envio.

Nesta publicação, a interface do itch.io foi usada para configurar título, descrição, frame e visibilidade; o Butler enviou a pasta `publish/wwwroot` para o canal `html5`.

1. Instale o Butler usando a [documentação oficial](https://itch.io/docs/butler/installing.html) e confirme a instalação:

   ```bash
   butler version
   ```

2. Autentique uma vez. O comando abre o navegador e guarda a credencial localmente:

   ```bash
   butler login
   ```

3. Gere a build e confirme que a pasta indicada contém `index.html`:

   ```bash
   dotnet publish -c Release -o publish
   ```

4. Envie a pasta da build para o canal escolhido. Substitua os valores entre `< >`:

   ```bash
   butler push <pasta-da-build> <usuario>/<slug-do-projeto>:html5 --userversion 1.0.0
   ```

   Exemplo deste projeto:

   ```bash
   butler push publish/wwwroot lucasdoreac/trans-triangle:html5 --userversion 1.0.1
   ```

5. Para publicar uma nova versão, gere outra build e repita o comando com uma versão maior, por exemplo `1.0.2`. Abra a página do itch.io para verificar a atualização.

Se o caminho tiver espaços, coloque-o entre aspas. Para mais de uma plataforma, envie cada pasta a um canal claro, como `:windows`, `:linux`, `:osx` ou `:html5`.

### Diagnóstico rápido

| Sintoma | Causa provável | Correção |
| --- | --- | --- |
| Página fica em branco ou só mostra carregamento | `index.html` não está na raiz do ZIP, ou faltam arquivos da build | Confira o conteúdo do ZIP e envie novamente. |
| CSS, imagens, JavaScript ou WebAssembly retornam 404/403 | Caminhos absolutos começando com `/` | Troque por caminhos relativos e gere uma nova build. |
| O arquivo abre localmente, mas falha ao clicar duas vezes | O navegador bloqueia requisições de `file://` | Teste com um servidor HTTP local. |
| Butler não encontra a build | A pasta passada não contém `index.html` ou possui espaços sem aspas | Revise o caminho e use aspas quando necessário. |
| O upload pelo Butler falha antes de começar | Não há login ou ainda não existe página no itch.io | Rode `butler login` e crie a página pela interface. |

## Versão publicada

O exemplo pode ser aberto em [lucasdoreac.itch.io/trans-triangle](https://lucasdoreac.itch.io/trans-triangle).

## Arquivos principais

- `LearnSilkNET.csproj`: configura um projeto Blazor WebAssembly para .NET 10.
- `src/Program.cs`: ponto de entrada C# executado no browser.
- `src/Components/Triangle.razor`: componente C# do exemplo.
- `wwwroot/index.html`: página que carrega o runtime do Blazor.
- `wwwroot/triangle.js`: chamadas WebGL e shaders.
- `wwwroot/app.css`: layout e estilo da página.

## Como executar localmente

É necessário ter o .NET 10 SDK instalado. Dentro desta pasta:

```bash
dotnet publish -c Release -o publish
python3 -m http.server 5080 --directory publish/wwwroot
```

Abra [http://localhost:5080](http://localhost:5080) em um navegador com WebGL 2. Não abra o `index.html` diretamente pelo explorador de arquivos, porque o WebAssembly precisa ser servido por HTTP.

## Como enviar ao Stoat

Envie o ZIP entregue com este projeto. Ele contém apenas o código-fonte necessário, sem as pastas temporárias `bin` e `obj`. O serviço poderá restaurar o pacote NuGet, executar `dotnet publish` e publicar a pasta `publish/wwwroot` como conteúdo estático.
