var context, racks;

function init(){
  racks = {}; // memory to hold units
  context = new window.AudioContext();
  initAudioUI();

  // init form to create modules
  var start = elemFactory('add-module', 'select');
  var l = ['oscillator', 'amplifier'];
  l.forEach(i => {
    e = elemFactory(i, 'option');
    e.value = i.slice(0, 3);
    e.innerHTML = i;
    start.appendChild(e);
  })

  start.onchange = function() {
    context.resume();
    console.log('selected new module: '+start.value);
    switch (start.value) {
      case 'osc':
        oscillatorFactory('osc-' + Object.keys(racks).length);
        break;
      case 'amp':
        attenuatorFactory('amp-'+Object.keys(racks).length);
        break;
      default:
        console.log("unspecified value for module start");
        break;
    }
    
    
  }
  document.getElementById("controlPanel").appendChild(start);
}

// creates the main audio interface control board
function initAudioUI() {
  var parentNode = document.getElementById("audioPanel");
  var panel = elemFactory('audio-panel', 'div');

}

// creates a model, view, and controller for a VCO
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

// a code-ified VCO
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
    var gain = racks[this.name].gain.gain;
    gain.setValueAtTime(f, context.currentTime);
  }

  this.setFreq = function(numHz) {
    this.osc.frequency.setValueAtTime(numHz, context.currentTime);
  }

  this.setWave = function(type) {
    var osc = racks[this.name].osc;
    osc.type = type;
  }

  this.toggleOutput = function(bool) {
    var unit = racks[this.name];
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
  // create box to put the views in
  modBox = document.createElement("div");
  modBox.id = "frame-"+name;
  modBox.classList.add("oscillator");

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
  modBox.appendChild(freqRange);
  modBox.appendChild(waveShaper);
  modBox.appendChild(volInput);
  modBox.appendChild(powerBtn);
  modBox.appendChild(freqInput);

  parentDiv.appendChild(modBox);
}

// creates a VCA model view and controller
// vca: voltage controlled amplifier/attenuator
function attenuatorFactory(name) {
  var vca = new VcaMod(name);
  console.log('created vca: '+vca.name);
  console.log(vca);
  racks[vca.name] = vca; // add to global reference
  initVcaUI(name);
}

function VcaMod(name) {
  ModuleModel.call(this, name);
  this.node = context.createGain();

  // volume num has to be 0.0 >= n >= 1.0
  this.setVolume = function(f) {
    if (1.0 < f) {f= 1.0;}
    console.log(this.name+' setting vol to '+f);
    var mod = racks[this.name];
    if (mod != null){
      mod.node.gain.setValueAtTime(f, context.currentTime);
    }
  }

  // this toggles whether or not output goes to main out
  this.toggleOutput = function(bool) {
    var node = racks[this.name].node;
    if (bool == true) {
      node.connect(context.destination);
    } else {
      node.disconnect(context.destination);
    }
  }

}

function initVcaUI(name) {
  // VIEW
  var rackPanel= elemFactory(name+' ', 'div');
  rackPanel.classList.add('module');
  var pwrBtn = elemFactory(name+'-pwr', "input");
  pwrBtn.type = "button";
  pwrBtn.value = "play";
  
  var volInput = elemFactory(name+'-vol',"input");
  volInput.classList.add('tooltip');
  volInput.type = "range";
  volInput.min = "0.0";
  volInput.max = '1.0';
  volInput.step = '0.1';

  var inputBox = createInputs(name, 1);
  // var outputBox = createOutputs();

  // CONTROLLER
  pwrBtn.onclick = function() {
    console.log(this);
    var index = this.id.slice(0, -4);
    var unit = racks[index];
    if (unit != null) {
      console.log('found element: '+index+' click. found rack unit:');
      console.log(unit);
    } else {
      console.log('rack unit with name: '+unit+' not found');
    }

    if (this.value == "stop") {
      unit.toggleOutput(false);
      this.value = "play";
    } else {
      var vol = document.getElementById(volInput.id);
      unit.toggleOutput(true);
      this.value = "stop";
    }
  }

  volInput.oninput = function() {
    console.log("event: "+this.id);
    var index = this.id.slice(0,-4);
    var mod = racks[index];
    mod.setVolume(this.value);
  }

  //ADD VIEWS TO WINDOW
  rackPanel.appendChild(inputBox);
  rackPanel.appendChild(volInput);
  rackPanel.appendChild(pwrBtn);
  // rackPanel.appendChild(outputBox);

  var modRack = document.getElementById('patchPanel');
  modRack.appendChild(rackPanel);
}

// ModuleModel is an abstraction of a synth module
function ModuleModel(name) {
  this.name = name;
  this.inputs = [];
  this.outputs = [];
  this.node; // the audioNode that powers the module
  // patch module output to input of another node
  this.patchTo = function(nodeName) {
    var audioNode = racks[nodeName];
    this.node.connect(audioNode);
  }
  // takes an audio node and connects its output to the vca gain
  this.patchFrom = function(node) {
    node.connect(this.vca.gain);
  }
}

//
// UI HELPER METHODS
//

// low-level helper that constructs a ui element
function elemFactory(name, type) {
  var m = document.createElement(type);
  m.id = name;
  return m;
}

// returns a collection of html input objects
function createInputs(name, num) {
  var panel = elemFactory(name+'-inputs', 'div');
  for (i = 0; i < num; i++) {
    e = elemFactory(name+'-input-'+i, 'input');
    e.type = 'radio';`1`
    panel.appendChild(e);
  }
  return panel;
}
