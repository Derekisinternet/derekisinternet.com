var context, oscCount, racks;

function init(){
  racks = {}; // memory to hold units
  context = new window.AudioContext();

  // init button to create modules
  start = document.createElement("input");
  start.type="button";
  start.value = "start";
  start.onclick = function() {
    context.resume();
    mod = oscillatorFactory(context, "osc-" + Object.keys(racks).length);
    racks[mod.name] = mod;
  }
  document.getElementById("patchPanel").appendChild(start);
}

// takes an audioContext and name, adds an oscillator to the ui
function oscillatorFactory(ctx, name) {
  // MODEL
  oscillator = new OscMod(ctx, name);
  console.log(oscillator);
  parentDiv = document.getElementById('patchPanel');
  // VIEW/CONTROLLER
  ui = new OscUI(oscillator, parentDiv, oscillator.name);
  return oscillator;
}

// takes an AudioContext and name
function OscMod(ctx, name) {
  this.name = name;
  this.ctx = ctx;
  this.osc = ctx.createOscillator();
  this.gain = ctx.createGain();
  this.gain.connect(ctx.destination);
  this.osc.connect(this.gain);
  this.osc.start();

  // volume num has to be 0.0 >= n >= 1.0
  this.setVolume = function(f) {
    gain = racks[this.name].gain.gain;
    console.log("gain:");
    console.log(gain);
    gain.setValueAtTime(f, this.ctx.currentTime);
  }

  this.setWave = function(type) {
    osc = racks[this.name].osc;
    osc.type = type;
  }
}

// takes an OscMod object, a div to live in, and a unique identifier
function OscUI(osc, div, name) {
  this.oscMod = osc;
  this.name = name;
  // VIEW
  this.parentDiv = div;

  powerBtn = document.createElement("input");
  powerBtn.id = this.name+'-pwr';
  powerBtn.type = "button";
  powerBtn.value = "on";
  
  volKnob = document.createElement("input");
  volKnob.id = this.name+'-vol';
  volKnob.type = "range";
  volKnob.min = "0.0";
  volKnob.max = '1.0';
  volKnob.step = '0.1';
  
  waveShaper = document.createElement("select");
  waveShaper.id = this.name+'-wve';
  w = ["sine","square","sawtooth","triangle"];
  w.forEach( item => {
    e = document.createElement("option");
    e.value = item;
    e.innerHTML = item;
    waveShaper.appendChild(e);
  });
  // add to main view
  parentDiv.appendChild(waveShaper);
  parentDiv.appendChild(volKnob);
  parentDiv.appendChild(powerBtn);

  // CONTROLLERs
  powerBtn.onclick = function() {
    btn = document.getElementById(powerBtn.id);
    index = btn.id.slice(0, -4);
    unit = racks[index];
    console.log('button '+btn.id+' click');
    console.log(unit);

    if (btn.value == "on") {
      unit.setVolume(0);
      btn.value = "off";
    } else {
      vol = document.getElementById(volKnob.id);
      unit.setVolume(vol.value);
      powerBtn.value = "on";
    }
  }

  waveShaper.onchange = function() {
    wave = document.getElementById(waveShaper.id);
    index = wave.id.slice(0, -4);
    mod = racks[index];
    mod.setWave(waveShaper.value);
  }

  volKnob.oninput = function() {
    vol = document.getElementById(volKnob.id);
    index = vol.id.slice(0,-4);
    mod = racks[index];
    mod.setVolume(vol.value);
  }
}

// low-level helper that constructs a ui element
function moduleFactory(name) {
  var m = document.createElement("div");
  m.id = name;
  return m;
}