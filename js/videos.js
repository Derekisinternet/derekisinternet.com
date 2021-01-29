// Select which video to play on the main player:
function setVideo(link) {
  var player = document.getElementById('youtube-player');
  player.src = link;
  //redraw the player:
  player.parentElement.style.display = 'none';
  player.parentElement.style.display = 'block';
}
