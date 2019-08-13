function initDemo() {
  canvas = document.getElementById("can");
  gl = canvas.getContext('webgl');

  if (!gl) {
    console.log("WebGL not supported, falling back to experimental")
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
  alert("Your browser does not support webgl >:(");
  }
}