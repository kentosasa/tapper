var tapper = require('../');
var microphone
var callback = function (res) {
  console.log(res)
}
microphone = new tapper.microphone(callback)
