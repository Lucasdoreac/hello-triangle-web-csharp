# Hello Triangle — C# WebAssembly

Este é o exemplo `2.1.hello_triangle` convertido para rodar no navegador. A aplicação é escrita e compilada em C#; o navegador executa o resultado como WebAssembly. O desenho usa WebGL 2, pois é a API gráfica que os navegadores oferecem.

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
