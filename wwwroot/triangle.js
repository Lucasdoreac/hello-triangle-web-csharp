export function draw(canvas) {
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    return 'Seu navegador não oferece suporte a WebGL 2.';
  }

  const vertexSource = `#version 300 es
    layout(location = 0) in vec3 aPos;
    layout(location = 1) in vec3 aColor;
    uniform float uTime;
    out vec3 vertexColor;

    void main() {
      float angle = uTime * 0.45;
      mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      float pulse = 0.88 + sin(uTime * 2.0) * 0.06;
      gl_Position = vec4(rotation * aPos.xy * pulse, aPos.z, 1.0);
      vertexColor = aColor;
    }`;

  const fragmentSource = `#version 300 es
    precision mediump float;
    in vec3 vertexColor;
    out vec4 FragColor;
    void main() {
      FragColor = vec4(vertexColor, 1.0);
    }`;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  try {
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }

    const vertices = new Float32Array([
      // posição             // cor: azul, rosa e branco da bandeira trans
      -0.5, -0.5, 0.0,        0.357, 0.808, 0.980,
       0.5, -0.5, 0.0,        0.961, 0.663, 0.722,
       0.0,  0.5, 0.0,        1.000, 1.000, 1.000
    ]);

    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const stride = 6 * Float32Array.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(1);

    gl.viewport(0, 0, canvas.width, canvas.height);
    const time = gl.getUniformLocation(program, 'uTime');

    function render(milliseconds) {
      gl.clearColor(0.055, 0.075, 0.12, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(time, milliseconds * 0.001);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    return null;
  } catch (exception) {
    return `Não foi possível renderizar o triângulo: ${exception.message}`;
  }
}
