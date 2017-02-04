var tapper = require('../../');
var microphone
var opt = {
  types: ['snap']
}
var callback = function (res) {
  console.log(res)
  switch (res.type) {
    case 'snap':
      context.drawImage(video, 0, 0, 640, 480);
      break;
    default:

  }
}
microphone = new tapper.microphone(callback, opt)

// Camera
// Grab elements, create settings, etc.
var video = document.getElementById('video')
var cnavas = document.getElementById('canvas')
var context = canvas.getContext('2d')
canvas.width = 640
canvas.height = 640
// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true , audio: true}).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}
