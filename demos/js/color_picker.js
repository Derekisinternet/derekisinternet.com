
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
  var attribute = "background";
  // for (i = 0; i < targets.length; i++) {
  //   setColor("sample_paragraph", attribute, color);
  // }
}

// extracts a collections of elements/attributes to apply the color to
function getColorTargets(formId) {
  var nodes = document.getElementById(formId).childNodes;
  console.log(nodes);

}
