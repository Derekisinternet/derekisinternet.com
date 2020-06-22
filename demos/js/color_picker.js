
function setColor(element, attrib, color) {
  var elems = document.getElementsByTagName(element);
  console.log(`found ${elems.length} elements`);
  for (i = 0; i < elems.length; i++) {
    elems[i].style[`${attrib}`] = color;
    console.log(`color: ${color} set!`)
  }
}

function colorButtonEvent(colorInput, elementForm) {
  var color = document.getElementById(colorInput).value;
  console.log(`color value: ${color}`);
  var targets = getColorTargets(elementForm);
  for (let [key, value] of Object.entries(targets)) {
    for (i=0; i < value.length; i++) {
      setColor(key, value[i], color);
    }
  }
}

// extracts a collections of elements to apply the color to
function getColorTargets(formId) {
  var out = {};
  var rows = document.getElementById(formId).children[0].children;
  console.log(`rows: ${rows}`);
  for (i = 0; i < rows.length; i++) {
    var columns = rows[i].children;
    var input = columns[0].firstChild;
    console.log(input);
    if (input.checked === true) {
      // TODO: make target attributes configurable
      out[`${input.name}`] = ['background'];
    }
  }
  return out;
}
