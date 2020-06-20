
function setColor(element, attrib, color) {
  var elems = document.getElementsByClassName(element);
  console.log(`found ${elems.length} elements`);
  for (i = 0; i < elems.length; i++) {
    elems[i].style[`${attrib}`] = color;
    console.log(`color: ${color} set!`)
  }
}

function colorButtonEvent(formId, attribute) {
  var color = document.getElementById(formId).value;
  setColor("sample_paragraph", attribute, color);
}