var context, oscCount, racks;

notes = {
  A: {},
  As: {0: 29.14},
  B: {0: 30.87},
  C: {1: 32.7},
  D:{},
  E:{},
  F:{},
  G:{},
  Gs: {},
}

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
  initOscUI(oscillator.name, parentDiv);
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
  this.gain.gain.setValueAtTime(0, context.currentTime);
  this.osc.connect(this.gain);
  this.osc.start();

  // volume num has to be 0.0 >= n >= 1.0
  this.setVolume = function(f) {
    if (1.0 < f) {f= 1.0;}
    gain = racks[this.name].gain.gain;
    gain.setValueAtTime(f, context.currentTime);
  }

  this.setFreq = function(numHz) {
    this.osc.frequency.setValueAtTime(numHz, context.currentTime);
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

// takes an OscMod name to pair with, and a div to live in
function initOscUI(name, parentDiv) {
  // VIEW
  var powerBtn = document.createElement("input");
  powerBtn.id = name+'-pwr';
  powerBtn.type = "button";
  powerBtn.value = "play";
  
  var volInput = document.createElement("input");
  volInput.id = name+'-vol';
  volInput.classList.add('tooltip');
  volInput.type = "range";
  volInput.min = "0.0";
  volInput.max = '1.0';
  volInput.step = '0.1';
  
  var waveShaper = document.createElement("select");
  waveShaper.id = name+'-wve';
  var w = ["sine","square","sawtooth","triangle"];
  w.forEach( item => {
    e = document.createElement("option");
    e.value = item;
    e.innerHTML = item;
    waveShaper.appendChild(e);
  });

  var freqInput = document.createElement("input")
  freqInput.id = name+'-frq';
  freqInput.classList.add('tooltip');
  freqInput.type = 'range';
  freqInput.min = 100.7;
  freqInput.max = 1975.53;
  
  var freqRange = document.createElement("select");
  freqRange.id = name+'-frg';
  var r = ['L', 'M', 'H'];
  r.forEach( i => {
    e = document.createElement("option");
    e.value = i;
    e.innerHTML = i;
    freqRange.appendChild(e);
  });
  freqRange.children[1].selected = 'selected';

  // CONTROLLERS
  powerBtn.onclick = function() {
    console.log(this);
    var index = this.id.slice(0, -4);
    var unit = racks[index];
  
    console.log('found element: '+this.id+' click. found rack unit:');
    console.log(unit);

    if (this.value == "stop") {
      unit.toggleOutput(false);
      this.value = "play";
    } else {
      var vol = document.getElementById(volInput.id);
      unit.toggleOutput(true);
      this.value = "stop";
    }
  }

  waveShaper.onchange = function() {
    console.log("event: "+waveShaper.id);
    var index = this.id.slice(0, -4);
    var mod = racks[index];
    mod.setWave(waveShaper.value);
  }

  volInput.oninput = function() {
    console.log("event: "+volInput.id);
    var index = this.id.slice(0,-4);
    var mod = racks[index];
    mod.setVolume(this.value);
  }

  freqInput.oninput = function() {
    console.log("event: "+this.id+", value: "+this.value);
    var index = this.id.slice(0, -4);
    var mod = racks[index];
    mod.setFreq(this.value);
  }

  freqRange.onchange = function() {
    console.log("event: "+freqRange.id);
    var id = this.id.slice(0, -4);
    var slider = document.getElementById(id+'-frq');
    position = (slider.value - slider.min) / (slider.max - slider.val );
    switch (this.value) {
      case 'L':
        slider.min = 50.0/60;
        slider.max = 30.87;
        break;
      case 'H':
        slider.min = 1046.50; // C6
        slider.max = 13512.0;
        break;
      default: // M
        slider.min = 100.7; // C1
        slider.max = 1975.53; // B6
        break;
    }
    //update slider and oscillator with new values
    slider.value = slider.max * position;
    console.log('frequency slider value: '+slider.value);
    var mod = racks[id];
    mod.setFreq(slider.value);
  }

  // add views to main view
  parentDiv.appendChild(waveShaper);
  parentDiv.appendChild(volInput);
  parentDiv.appendChild(powerBtn);
  parentDiv.appendChild(freqInput);
  parentDiv.appendChild(freqRange);

  // set viz to get input value
  setTooltip(freqInput.id);
}

// low-level helper that constructs a ui element
function moduleFactory(name) {
  var m = document.createElement("div");
  m.id = name;
  return m;
}

// low-level helper to set up stat displays
// requires elemId's element to have class = 'tooltip'
function setTooltip(elemId) {
  console.log('setting tooltip for '+elemId);
  var elem = document.getElementById(elemId);
  var toolTip = document.createElement("span");
  toolTip.id = elemId+'-spn';
  toolTip.classList.add('tooltiptext');
  elem.appendChild(toolTip);

  elem.onmouseover = function() {
    // console.log('mouseover '+this.id);
    var msg = this.value;
    var window = document.getElementById(this.id+'-spn');
    window.innerHTML = msg;
    window.style.visibility = 'visible'; 
    window.style.opacity = 1;
  }
}