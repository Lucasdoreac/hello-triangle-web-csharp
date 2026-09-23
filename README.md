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

`Triangle.razor` cria o canvas e, depois que a tela é renderizada, chama `draw` por interoperabilidade JavaScript. O arquivo `triangle.js` cria os shaders, monta o VBO/VAO com os três vértices, limpa o canvas com a mesma cor do exemplo e chama `drawArrays` para renderizar o triângulo laranja.

O arquivo JavaScript é necessário porque WebGL é uma API nativa do navegador. A aplicação, a tela e a inicialização continuam em C#; o JavaScript apenas acessa a API gráfica exposta pelo browser.

## Como publicar no itch.io

1. Rode `dotnet publish -c Release -o publish`.
2. Entre na pasta `publish/wwwroot`.
3. Compacte **os arquivos dentro dessa pasta**, incluindo `_framework`, em um ZIP.
4. Crie um projeto do tipo **HTML** no itch.io e envie esse ZIP como build.
5. Na página de edição do itch.io, marque **This file will be played in the browser** e deixe o projeto público.

O itch.io entrega o conteúdo por HTTP, que é necessário para o runtime WebAssembly carregar corretamente.

### Publicação pela interface web

Na tela **Edit project**, escolha `HTML` como tipo do projeto, envie o ZIP e selecione **Embed in page**. Use o tamanho `800 × 600`, marque **Mobile friendly**, **Automatically start on page load** e **Fullscreen button**. Salve como rascunho para testar; depois altere a visibilidade para **Public**.

### Publicação pelo Butler

O [Butler](https://itch.io/docs/butler/) é a ferramenta oficial de linha de comando do itch.io. Ela é útil para atualizar a build sem abrir o seletor de arquivos no navegador e envia somente os arquivos que mudaram em versões futuras.

1. Baixe o Butler para seu sistema seguindo a [documentação oficial](https://itch.io/docs/butler/installing.html).
2. Faça login uma vez:

   ```bash
   butler login
   ```

3. Gere a versão web:

   ```bash
   dotnet publish -c Release -o publish
   ```

4. Envie a pasta que contém `index.html` para um canal HTML5:

   ```bash
   butler push publish/wwwroot lucasdoreac/trans-triangle:html5 --userversion 1.0.0
   ```

O formato é `butler push <pasta-da-build> <usuário>/<projeto>:<canal>`. Para uma atualização futura, aumente a versão, por exemplo para `1.0.1`. O Butler gera patches e reduz o tamanho de uploads repetidos.

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
