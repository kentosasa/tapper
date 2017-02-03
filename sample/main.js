var tapper = require('../');
var microphone
var callback = function () {
  console.log("callback")
}
microphone = new tapper.microphone(callback)
