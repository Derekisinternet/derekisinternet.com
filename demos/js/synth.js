var context;

function init(){
  context = new window.AudioContext();
  start = document.createElement("input");
  start.type="button";
  start.value = "start";
  start.onclick = function() {oscillatorFactory(context, "osc1");}
  document.getElementById("patchPanel").appendChild(start);
  console.log("all ready");
}

// takes an audioContext and name, spits out an oscillator
function oscillatorFactory(con, name) {
  console.log('creating new oscillator');
  // create oscillator and vol
  o = con.createOscillator();
  o.start(); // can only call start once, from then on, gotta dis/re-connect to toggle
  g = con.createGain();
  o.connect(g);
  // create ui elements to control osc
  var m = moduleFactory(name);
  var powerBtn = document.createElement("input");
  powerBtn.type = "button";
  powerBtn.value = "on";
  powerBtn.onclick = function() {powerSwitch(g, con, powerBtn);}

  var volKnob = document.createElement("input");
  volKnob.type = "range";
  volKnob.min = "0.0";
  volKnob.max = '1.0';
  volKnob.step = '0.1';
  volKnob.oninput = function() {gainAdjust(g, volKnob.value); console.log("setting val to " + volKnob.value)}

  m.appendChild(volKnob);
  m.appendChild(powerBtn);

  document.getElementById('patchPanel').appendChild(m);
}

// method for buttons to toggle audio
// inp - input to control
// ctx - audiocontext
// btn - the button that calls this method
function powerSwitch(inp, ctx, btn) {
  ctx.resume();
  if (btn.value == "on") {
    console.log("turning on");
    inp.connect(ctx.destination);
    btn.value = "off";
  } else {
    console.log("turning off");
    inp.disconnect(ctx.destination);
    btn.value = "on";
  }
}

// adjust the output of a gain node
function gainAdjust(node, val) {
  node.gain.value = val;
}

// low-level helper that constructs a ui element
function moduleFactory(name) {
  var m = document.createElement("div");
  m.id = name;
  return m;
}