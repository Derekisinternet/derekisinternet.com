function initNavigator(element) {
  console.log("this thing on?");
  req = new XMLHttpRequest();
  req.open('GET', "navigator.html", false);
  console.log(req.responseText);
  req.send(null);
  element.innerHTML = req.responseText;
}