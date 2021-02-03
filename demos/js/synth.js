var mainOut, racks, patchBuf;

function init(){
  // disable the start button
  document.getElementById('start-btn').style.display = 'none';
  racks = {}; // memory to hold units
  patchBuf = []; // buffer for patching modules
  MainAudioFactory();

  // init form to create modules
  var start = elemFactory('add-module', 'select');
  // create a default value for form
  var defOpt = elemFactory('default', 'option');
  defOpt.innerHTML = 'add a module';
  defOpt.disabled = true;
  defOpt.selected = true;
  defOpt.style.display = 'none';
  start.appendChild(defOpt);

  var l = ['oscillator', 'amplifier'];
  l.forEach(i => {
    e = elemFactory(i, 'option');
    e.value = i.slice(0, 3);
    e.innerHTML = i;
    start.appendChild(e);
  })

  start.onchange = function() {
    console.log('selected new module: '+start.value);
    switch (start.value) {
      case 'osc':
        oscillatorFactory();
        break;
      case 'amp':
        attenuatorFactory();
        break;
      default:
        console.log("unspecified value for module start");
        break;
    }
    this.selectedIndex = 0;
  }
  document.getElementById("controlPanel").appendChild(start);

  // add an oscillator
  oscillatorFactory();
}

function MainAudioFactory() {
  var name = 'main-audio';
  var audioMod = new MainAudioMod(name);
  racks[name] = audioMod;
  initMainOutUI(name);
}

function MainAudioMod(name) {
  this.name = name;
  this.context = new window.AudioContext();
  this.node = this.context.createGain();
  this.node.connect(this.context.destination);

  // volume num has to be 0.0 >= n >= 1.0
  this.setVolume = function(f) {
    if (1.0 < f) {f= 1.0;}
    console.log(this.name+' setting vol to '+f);
    console.log(racks[this.name]);
    this.node.setValueAtTime(f, this.context.currentTime);
  }
}

// creates the main audio interface control board
function initMainOutUI(name) {
  // VIEW
  var parentNode = document.getElementById("audioPanel");
  var panel = elemFactory(name, 'div');
  var sigIns = createInputs(panel.id, ['01','02']);
  var mainVol = elemFactory(name+'-vol', 'input');
  mainVol.type = 'range';
  mainVol.step = '0.01';
  mainVol.min = '0.0';
  mainVol.max = '1.0';
  mainVol.value = '0.5';
  // CONTROLLER
  mainVol.oninput = function() {
    console.log("event: "+this.id);
    var index = this.id.slice(0,-4);
    var mod = racks[index];
    mod.setVolume(this.value);
  }
  panel.appendChild(mainVol);
  panel.appendChild(sigIns);

  parentNode.appendChild(panel);
}

// creates a model, view, and controller for a VCO
function oscillatorFactory() {
  var name = 'osc-' + Object.keys(racks).length
  // MODEL
  var oscillator = new OscMod(name);
  console.log('created new oscillator: ');
  console.log(oscillator);
  racks[oscillator.name] = oscillator; // add to global reference
  var parentDiv = document.getElementById('patchPanel');
  // VIEW/CONTROLLER
  initOscUI(oscillator.name, parentDiv);
}

// a code-ified VCO
function OscMod(name) {
  // this.name = name;
  ModuleModel.call(this, name);
  this.node = racks['main-audio'].context.createOscillator();
  this.node.start();

  this.setFreq = function(numHz) {
    this.node.frequency.setValueAtTime(numHz, racks['main-audio'].context.currentTime);
  }

  this.setWave = function(type) {
    var osc = racks[this.name].node;
    osc.type = type;
  }
}

// takes an OscMod name to pair with, and a div to live in
function initOscUI(name, parentDiv) {
  // VIEW
  // create box to put the views in
  modBox = elemFactory(name, "div");
  modBox.classList.add("oscillator");
  
  var waveShaper = elemFactory(name+'-wve', "select");
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

  var sigIns = createInputs(name, ['freq']);
  var sigOuts = createOutputs(name, ['main']);

  // CONTROLLERS

  waveShaper.onchange = function() {
    console.log("event: "+waveShaper.id);
    var index = this.id.slice(0, -4);
    var mod = racks[index];
    mod.setWave(waveShaper.value);
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
  modBox.appendChild(freqInput);
  modBox.appendChild(sigIns);
  modBox.appendChild(sigOuts);

  parentDiv.appendChild(modBox);
}

// creates a VCA model view and controller
// vca: voltage controlled amplifier/attenuator
function attenuatorFactory() {
  var name = 'amp-'+Object.keys(racks).length;
  var vca = new VcaMod(name);
  console.log('created vca: '+vca.name);
  console.log(vca);
  racks[vca.name] = vca; // add to global reference
  initVcaUI(name);
}

function VcaMod(name) {
  ModuleModel.call(this, name);
  var context = racks['main-audio'].context;
  this.setNode(context.createGain()); // create a 

  // volume num has to be 0.0 >= n >= 1.0
  this.setVolume = function(f) {
    if (1.0 < f) {f= 1.0;}
    console.log(this.name+' setting vol to '+f);
    var mod = racks[this.name];
    if (mod != null){
      mod.node.gain.setValueAtTime(f, context.currentTime);
    }
  }

  // takes an audio node and connects its output to the vca gain
  this.patchFrom = function(node) {
    node.connect(this.vca.gain);
  }
}

function initVcaUI(name) {
  // VIEW
  var rackPanel= elemFactory(name, 'div');
  rackPanel.classList.add('module');
  var pwrBtn = elemFactory(name+'-pwr', 'button');
  pwrBtn.innerHTML = "play";
  
  var volInput = elemFactory(name+'-vol',"input");
  volInput.type = "range";
  volInput.min = "0.0";
  volInput.max = '1.0';
  volInput.step = '0.01';
  volInput.value = '0.5';

  var sigIns = createInputs(name, ['main']); // these things come with their own controllers
  var sigOuts = createOutputs(name, ['main']);

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

    if (this.innerHTML == "stop") {
      unit.toggleOutput(false);
      this.innerHTML = "play";
    } else {
      unit.toggleOutput(true);
      this.innerHTML = "stop";
    }
  }

  volInput.oninput = function() {
    console.log("event: "+this.id);
    var index = this.id.slice(0,-4);
    var mod = racks[index];
    mod.setVolume(this.value);
  }

  //ADD VIEWS TO WINDOW
  rackPanel.appendChild(sigIns);
  rackPanel.appendChild(volInput);
  rackPanel.appendChild(pwrBtn);
  rackPanel.appendChild(sigOuts);

  var modRack = document.getElementById('patchPanel');
  modRack.appendChild(rackPanel);
}

// ModuleModel is an abstraction of a synth module
function ModuleModel(name) {
  this.name = name;
  this.inputs = [];
  this.outputs = [];
  this.node; // the audioNode that powers the module

  //set the module's audioNode
  this.setNode = function(node) {
    this.node = node;
  }
  // patch module output to input of another node
  this.patchTo = function(audioNode) {
    console.log('patching '+this.name+' to:');
    console.log(audioNode);
    this.node.connect(audioNode);
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

// takes the name of the parent HTML elem, and a list of names
// returns the panel node to place in a module 
function createInputs(parentName, inputs) {
  var panel = elemFactory(parentName+'-inputs', 'div');
  if (Array.isArray(inputs)) {
    inputs.forEach ( i => {
      e = elemFactory(parentName+'-input-'+i, 'button');
      e.innerHTML = 'i';
      e.classList.add('in-jack');

      // click function
      e.onclick = function(){
        console.log("button event: "+this.id);
        // if there is something in the buffer, connect it and then clear buffer
        if (patchBuf.length > 0) {
          var modID = patchBuf.pop();
          console.log('pulled signal id from buffer: '+modID);
          var signal = racks[modID];
          var lookup = this.parentNode.parentNode.id;
          console.log('receiver parent id: '+lookup);
          var reciever = racks[lookup];
          console.log(reciever);
          // connect the modules
          signal.patchTo(reciever.node);
        }
      }
      panel.appendChild(e);
    })
  }
  return panel;
}

// returns the parent node of the output objects
function createOutputs(parentName, outputs) {
  var panel = elemFactory(parentName+'-outputs', 'div');
  if (Array.isArray(outputs)) {
    outputs.forEach( i => {
      e = elemFactory(parentName+'-output-'+i, 'button');
      e.innerHTML = 'o';
      e.classList.add('out-jack');

      e.onclick = function() {
        console.log("button event: "+this.id);
        // the synth module is the button's parent's parent
        var mod = this.parentNode.parentNode;
        // store a reference to the module in the buffer
        patchBuf.push(mod.id);
        console.log('pushed new signal ref to buffer: '+mod.id);
      }
      panel.appendChild(e);
    })
  }
  
  return panel;
}