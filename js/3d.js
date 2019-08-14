var vertexShaderText = 
[
  'precision mediump float;',
  '',
  'attribute vec2 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  'uniform mat4 matrix worldMat',
  'uniform mat4 viewMat',
  'uniform mat4 matrix ProjectorMat',
  '',
  'void main()',
  '{',
  '  fragColor = vertColor;',
  '  gl_Position = vec4(vertPosition, 0.0, 1.0);',
  '}'
].join('\n');

var fragmentShaderText = 
[
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  'void main()',
  '{',
  'gl_FragColor = vec4(fragColor, 1.0);',
  '}'
].join('\n');

var InitDemo = function () {
  console.log('This thing on?')
  var canvas = document.getElementById("can");
  var gl = canvas.getContext('webgl');

  if (!gl) {
    console.log("WebGL not supported, falling back to experimental")
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
  alert("Your browser does not support webgl >:(");
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(vertexShader));
    return;
  }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program', gl.getProgramInfoLog(program));
    return;
  }
  // validates program, instructor not exactly sure what
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR validating program', gl.getProgram(program));
    return;
  }

  // create buffer
  var triangelVertices = 
  [// x, y         R, G, B
    0.0, 0.5,     1.0, 0.9, 0.0,
    -0.5, -0.5,   0.7, 0.0, 1.0,
    0.5, -0.5,     0.1, 1.0, 0.6
  ];

  var triangleVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangelVertices), gl.STATIC_DRAW);

  var positionAttrribLocation = gl.getAttribLocation(program, 'vertPosition');
  var colorAttrribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    positionAttrribLocation, // atribue location
    2, // number of elements per attribute
    gl.FLOAT, // type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    0 // offset from the beginning of a single vertext to this attribute
  );
  gl.vertexAttribPointer(
    colorAttrribLocation,
    3, // number of elements per attribute
    gl.FLOAT, // type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT// offset from the beginning of a single vertext to this attribute
  );

  gl.enableVertexAttribArray(positionAttrribLocation);
  gl.enableVertexAttribArray(colorAttrribLocation);

  // main render loop
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
