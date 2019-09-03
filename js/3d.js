var vertexShaderText =
[
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  'uniform mat4 worldMat;',
  'uniform mat4 viewMat;',
  'uniform mat4 projectorMat;',
  '',
  'void main()',
  '{',
  '  fragColor = vertColor;',
  '  gl_Position = projectorMat * viewMat * worldMat * vec4(vertPosition, 1.0);',
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

// for keybindings
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

// for spin state
var xAxisSpeed = 0.0;
var yAxisSpeed = 0.0;
var zAxisSpeed = 0.0;

// some matrices
var xRotationMatrix = new Float32Array(16);
var yRotationMatrix = new Float32Array(16);

// translates key names into input numbers
var keyCodeTranslator = {
  left: 37, up: 38, right: 39, down: 40
}

var InitDemo = function () {
  var canvas = document.getElementById("can");
  if (canvas.width > window.innerWidth) {canvas.width = window.innerWidth;}

  var gl = canvas.getContext('webgl');

  if (!gl) {
    console.log("WebGL not supported, falling back to experimental")
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
  alert("Your browser does not support webgl >:(");
  }

  gl.clearColor(0.90, 0.90, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //dont draw pixel if it's behind something already drawn
  gl.enable(gl.DEPTH_TEST);
  //enable back face culling
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

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
  var boxVertices =
  [// x, y, z         R, G, B
   // Top
   -1.0, 1.0, -1.0,   0.0,1.0,0.15,
   -1.0, 1.0, 1.0,    0.0,1.0,0.15,
   1.0, 1.0, 1.0,     0.0,1.0,0.15,
   1.0, 1.0, -1.0,    0.0,1.0,0.15,

   // Left
   -1.0, 1.0, 1.0,   0.25, 0.75, 0.5,
   -1.0, -1.0, 1.0,   0.25, 0.75, 0.5,
   -1.0, -1.0, -1.0,   0.25, 0.75, 0.5,
   -1.0, 1.0, -1.0,   0.25, 0.75, 0.5,


  // Right //////
  1.0, 1.0, 1.0,     1.0, 0.0, 0.15,
  1.0, -1.0, 1.0,     1.0, 0.0, 0.15,
  1.0, -1.0, -1.0,     1.0, 0.0, 0.15,
  1.0, 1.0, -1.0,     1.0, 0.0, 0.15,

  // Front
  1.0,1.0,1.0,       0.75, 0.25, 0.25,
  1.0,-1.0,1.0,       0.75, 0.25, 0.25,
  -1.0,-1.0,1.0,       0.75, 0.25, 0.25,
  -1.0,1.0,1.0,       0.75, 0.25, 0.25,

  // Back
  1.0,1.0,-1.0,       0.25,0.25,0.75,
  1.0,-1.0,-1.0,       0.25,0.25,0.75,
  -1.0,-1.0,-1.0,       0.25,0.25,0.75,
  -1.0,1.0,-1.0,       0.25,0.25,0.75,

  // Bottom
  -1.0,-1.0,-1.0,       0.30,0.35,0.55,
  -1.0,-1.0,1.0,       0.30,0.35,0.55,
  1.0,-1.0,1.0,       0.30,0.35,0.55,
  1.0,-1.0,-1.0,       0.30,0.35,0.55,
  ];

  boxIndices = [
    // Top
    0,1,2,
    0,2,3,

    //Left
    5,4,6,
    6,4,7,

    // Right
    8,9,10,
    8,10,11,

    // Front
    13,12,14,
    15,14,12,

    // Back
    16,17,18,
    16,18,19,

    // Bottom
    21,20,22,
    22,20,23
  ];

  var boxVertxexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertxexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

  var boxIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

  var positionAttrribLocation = gl.getAttribLocation(program, 'vertPosition');
  var colorAttrribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    positionAttrribLocation, // atribue location
    3, // number of elements per attribute
    gl.FLOAT, // type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    0 // offset from the beginning of a single vertext to this attribute
  );
  gl.vertexAttribPointer(
    colorAttrribLocation,
    3, // number of elements per attribute
    gl.FLOAT, // type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    3 * Float32Array.BYTES_PER_ELEMENT// offset from the beginning of a single vertext to this attribute
  );

  gl.enableVertexAttribArray(positionAttrribLocation);
  gl.enableVertexAttribArray(colorAttrribLocation);

  // tell gl state machine which program to use
  gl.useProgram(program);

  // matrix locations in GPU
  var matWorldUniformLocation = gl.getUniformLocation(program, 'worldMat');
  var matViewUniformLocation = gl.getUniformLocation(program, 'viewMat');
  var matProjectorUniformLocation = gl.getUniformLocation(program, 'projectorMat');

  // matrices constructed in CPU/ RAM
  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);


  glMatrix.mat4.identity(worldMatrix);
  // set camera
  glMatrix.mat4.lookAt(viewMatrix, [0,0,-10], [0,0,0], [0,1,0]);
  glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.clientHeight, 0.1, 1000.0);

  // send matrices to shader
  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjectorUniformLocation, gl.FALSE, projMatrix);

  // set up keyboard inputs
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);

  // main render loop
  var identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);

  // expects two Float32Array(16) and a canvas
  function ApplySpin(iMatrix, wMatrix, canvas) {
    var spr = 6; // seconds per revolution
    var angle = 0;
    var gl = canvas.getContext("webgl");
    // one rotation every 6 seconds
    angle = performance.now() / 1000 / spr * 2 * Math.PI;
    glMatrix.mat4.rotate(yRotationMatrix, iMatrix, angle, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotationMatrix, iMatrix, angle/2, [1, 0, 0]);
    glMatrix.mat4.mul(wMatrix, xRotationMatrix, yRotationMatrix);
    // update world matrix
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, wMatrix);
  }
  
  var loop = function () {
    calcSpeed();
    ApplySpin(identityMatrix, worldMatrix, canvas);
    //clean up the previous frame
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

};

function calcSpeed() {
  var delta = 0.4;
  if(rightPressed) {
    yAxisSpeed += delta;
  }
  if (leftPressed) {
    yAxisSpeed -= delta;
  }
  if (upPressed) {
    xAxisSpeed += delta;
  }
  if (downPressed) {
    xAxisSpeed -= delta;
  }
  // apply friction
  var friction = 0.2;
  if (xAxisSpeed > 0) {
    xAxisSpeed -= friction;
  } else {
    xAxisSpeed += friction;
  }
  if (yAxisSpeed > 0) {
    yAxisSpeed -= friction;    
  } else {
    yAxisSpeed += friction;
  }

  console.log(`x = ${xAxisSpeed}`);
  console.log(`y = ${yAxisSpeed}`);
}



function keyDownHandler(event) {
  if(event.keyCode == 39) {
    rightPressed = true;
  }
  else if(event.keyCode == 37) {
    leftPressed = true;
  }
  if(event.keyCode == 40) {
    downPressed = true;
  }
  else if(event.keyCode == 38) {
    upPressed = true;
  }
};

function keyUpHandler(event) {
  if(event.keyCode == keyCodeTranslator.right) {
    rightPressed = false;
  }
  else if(event.keyCode == keyCodeTranslator.left) {
    leftPressed = false;
  }
  if(event.keyCode == keyCodeTranslator.down) {
    downPressed = false;
  }
  else if(event.keyCode == keyCodeTranslator.up) {
    upPressed = false;
  }
};