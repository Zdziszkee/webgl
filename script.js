let gl;
let program;
let colorLocation;

function setup() {
    // Pobranie elementu canvas
    const canvas = document.getElementById('canvas');
    gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    // Shader vertex
    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
        }
    `;

    // Shader fragment
    const fragmentShaderSource = `
        precision mediump float;
        uniform vec4 u_color;
        void main() {
            gl_FragColor = u_color;
        }
    `;

    // Tworzenie shadera vertex
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling vertex shader:', gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return;
    }

    // Tworzenie shadera fragment
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling fragment shader:', gl.getShaderInfoLog(fragmentShader));
        gl.deleteShader(fragmentShader);
        return;
    }

    // Tworzenie programu shader
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return;
    }

    // Używanie programu shader
    gl.useProgram(program);

    // Pobieranie lokalizacji uniform dla koloru
    colorLocation = gl.getUniformLocation(program, 'u_color');

    // Definiowanie sześciokąta (1 środkowy wierzchołek + 6 wierzchołków na obwodzie)
    const hexagonVertices = new Float32Array([
        0.0,  0.0,  // środek
        0.5,  0.0,  // prawy
        0.25, 0.433, // prawy górny
        -0.25, 0.433, // lewy górny
        -0.5,  0.0,  // lewy
        -0.25, -0.433, // lewy dolny
        0.25, -0.433, // prawy dolny
        0.5,  0.0  // prawy (ponownie zamknięcie)
    ]);

    // Tworzenie bufora
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, hexagonVertices, gl.STATIC_DRAW);

    // Pobieranie atrybutu 'a_position' z programu shader
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Czyszczenie canvas
    gl.clearColor(0, 0, 0, 1);  // czarne tło
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Początkowy kolor figury (zielony)
    gl.uniform4f(colorLocation, 0, 1, 0, 1);

    // Rysowanie sześciokąta
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);

    // Dodanie obsługi kliknięcia przycisku
    document.getElementById('colorButton').addEventListener('click', changeColor);
}

function changeColor() {
    // Losowy kolor
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();

    // Czyszczenie canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Ustawianie nowego koloru figury
    gl.uniform4f(colorLocation, r, g, b, 1);

    // Rysowanie sześciokąta z nowym kolorem
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);
}
