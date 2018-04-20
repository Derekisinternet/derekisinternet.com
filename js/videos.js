// Select which video to play on the main player:
function setVideo(link) {
  document.getElementById('youtube-player').src = link;
  //redraw the player:
  document.getElementById('youtube-player').parentElement.style.display = 'none';
  document.getElementById('youtube-player').parentElement.style.display = 'block';
}
