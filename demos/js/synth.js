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
function oscillatorFactory(con, name, ) {
  console.log('creating new oscillator');
  // create oscillator and vol
  o = con.createOscillator();
  g = con.createGain();
  o.connect(g);
  g.connect(con.destination);
  // create ui elements to control osc
  var m = moduleFactory(name);
  var powerBtn = document.createElement("input");
  powerBtn.type = "button";
  powerBtn.value = "on";
  powerBtn.onclick = function() {powerSwitch(o, con, powerBtn);}

  var volKnob = document.createElement("input");
  volKnob.type = "range";
  volKnob.min = "0.0";
  volKnob.max = '1.0';
  volKnob.step = '0.1';
  m.appendChild(powerBtn);

  document.getElementById('patchPanel').appendChild(m);
}

// rudimentary oscillar function. Will Delete later, IDK
// osc - oscillator to control
// ctx - audiocontext
// btn - the button that calls this method
function powerSwitch(osc, ctx, btn) {
  ctx.resume();
  if (btn.value == "on") {
    console.log("turning on");
    //init audio
    osc.start();
    btn.value = "off";
  } else {
    console.log("turning on");
    osc.stop();
    btn.value = "on";
  }
}

// low-level helper that constructs a ui element
function moduleFactory(name) {
  var m = document.createElement("div");
  m.id = name;
  return m;
}