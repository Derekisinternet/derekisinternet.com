

function setColor(element, attrib, red, green, blue) {
  var elems = document.getElementsByClassName(element);
  console.log(`found ${elems.length} elements`);
  for (i = 0; i < elems.length; i++) {
    newColor = `rgb(${red}, ${green}, ${blue})`;
    elems[i].style[`${attrib}`] = newColor;
  }
}

function colorButtonEvent(formId, attribute) {
  var elem = document.getElementById(formId);
  var colors = elem.childNodes;
  var r = colors[1].value;
  var g = colors[3].value;
  var b = colors[5].value;
  // TODO: make more dynamic
  setColor("sample_paragraph", attribute, r, g, b);
  console.log("new color set!");
}