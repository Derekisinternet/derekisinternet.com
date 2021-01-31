var context, oscCount, racks;

function init(){
  racks = {}; // memory to hold units
  context = new window.AudioContext();

  // init button to create modules
  start = document.createElement("input");
  start.type="button";
  start.value = "add oscillator";
  start.onclick = function() {
    context.resume();
    mod = oscillatorFactory("osc-" + Object.keys(racks).length);
    
  }
  document.getElementById("patchPanel").appendChild(start);
}

// takes an audioContext and name, adds an oscillator to the ui
function oscillatorFactory(name) {
  // MODEL
  var oscillator = new OscMod(name);
  racks[oscillator.name] = oscillator; // add to global reference
  var parentDiv = document.getElementById('patchPanel');
  // VIEW/CONTROLLER
  initOscUI(oscillator, parentDiv);
  // set oscillator volume to volume slider value
  var vol = document.getElementById(oscillator.name+'-vol').value;
  racks[name].setVolume(vol);
  return oscillator;
}

// takes an AudioContext and name
function OscMod(name) {
  this.name = name;
  this.osc = context.createOscillator();
  this.gain = context.createGain();
  // this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
  this.gain.gain.setValueAtTime(0, context.currentTime);
  this.osc.connect(this.gain);
  this.osc.start();

  // volume num has to be 0.0 >= n >= 1.0
  this.setVolume = function(f) {
    if (1.0 < f) {f= 1.0;}
    gain = racks[this.name].gain.gain;
    gain.setValueAtTime(f, context.currentTime);
  }

  this.setWave = function(type) {
    osc = racks[this.name].osc;
    osc.type = type;
  }

  this.toggleOutput = function(bool) {
    unit = racks[this.name];
    if (bool == true) {
      unit.gain.connect(context.destination);
    } else {
      unit.gain.disconnect(context.destination);
    }
  }
}

// takes an OscMod object, a div to live in, and a unique identifier
function initOscUI(osc, parentDiv) {
  var name = osc.name;
  // VIEW
  var powerBtn = document.createElement("input");
  powerBtn.id = name+'-pwr';
  powerBtn.type = "button";
  powerBtn.value = "play";
  
  var volKnob = document.createElement("input");
  volKnob.id = name+'-vol';
  volKnob.type = "range";
  volKnob.min = "0.0";
  volKnob.max = '1.0';
  volKnob.step = '0.1';
  
  var waveShaper = document.createElement("select");
  waveShaper.id = name+'-wve';
  var w = ["sine","square","sawtooth","triangle"];
  w.forEach( item => {
    e = document.createElement("option");
    e.value = item;
    e.innerHTML = item;
    waveShaper.appendChild(e);
  });
  

  // CONTROLLERS
  powerBtn.onclick = function() {
    console.log(this);
    var index = this.id.slice(0, -4);
    var unit = racks[index];
  
    console.log('found element: '+this.id+' click. found rack unit:');
    console.log(unit);

    if (this.value == "stop") {
      // unit.setVolume(0);
      unit.toggleOutput(false);
      this.value = "play";
    } else {
      var vol = document.getElementById(volKnob.id);
      // unit.setVolume(vol.value);
      unit.toggleOutput(true);
      this.value = "stop";
    }
  }

  waveShaper.onchange = function() {
    console.log("event: "+waveShaper.id);
    var wave = document.getElementById(waveShaper.id);
    var index = wave.id.slice(0, -4);
    var mod = racks[index];
    mod.setWave(waveShaper.value);
  }

  volKnob.oninput = function() {
    console.log("event: "+volKnob.id);
    var vol = document.getElementById(volKnob.id);
    var index = vol.id.slice(0,-4);
    var mod = racks[index];
    mod.setVolume(vol.value);
  }

  // add views to main view
  parentDiv.appendChild(waveShaper);
  parentDiv.appendChild(volKnob);
  parentDiv.appendChild(powerBtn);
}

// low-level helper that constructs a ui element
function moduleFactory(name) {
  var m = document.createElement("div");
  m.id = name;
  return m;
}