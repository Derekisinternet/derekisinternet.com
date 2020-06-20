// creates the accordion-style user input forms
function initForms() {
  buttons = document.getElementsByClassName("accordion");
  for (i=0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", accordion());
  }
}

//allows a button to accordion adjacent element
function accordion(){
  "use strict"
  console.log(this);
  this.classList.toggle("active");
  var panel = this.nextElementSibling;
  if (panel.style.display === "block") {
    panel.style.display = "none";
    console.log("hidden")
  } else {
    panel.style.display = "block";
  }
}

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