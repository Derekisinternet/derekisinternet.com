function init() {
  var msg = document.getElementById("message");
  msg.style.color = "red";
}

function submit() {
  // document.getElementById("message").innerHTML = "";
  var user = document.getElementById("uname");
  var pass = document.getElementById("pword");
  console.log(pass.value);

  if (pass.value.length == 0 || user.value.length == 0) {
    errorMsg("fields must not be blank.");
    return;
  } 
  var cont = checkName(user.value);
  user.value = "";
  pass.value = "";

  if (cont) {
    errorMsg("Invalid username/password");
  }
}

// return true if you don't have a message to display
function checkName(name) {
  var nameVal = name.toLowerCase().slice(0,5);
  if (nameVal == "admin") {
    errorMsg("dude . . . no.");
    return;
  }
  if (nameVal == "derek") {
    errorMsg("please don't hack me.");
    return;
  }
  return true;
}

function errorMsg(msg) {
  document.getElementById("message").innerHTML = msg;
}