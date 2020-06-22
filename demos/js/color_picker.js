
function setColor(element, attrib, color) {
  var elems = document.getElementsByClassName(element);
  console.log(`found ${elems.length} elements`);
  for (i = 0; i < elems.length; i++) {
    elems[i].style[`${attrib}`] = color;
    console.log(`color: ${color} set!`)
  }
}

function colorButtonEvent(colorInput, elementForm) {
  var color = document.getElementById(colorInput).value;
  var targets = getColorTargets(elementForm);
  console.log(targets);
  for (let [key, value] of Object.entries(targets)) {
    // do stuff
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
