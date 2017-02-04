var tapper = require('../');
var microphone
var opt = {
  types: ['knock']
}
var callback = function (res) {
  console.log(res)
}
microphone = new tapper.microphone(callback, opt)
