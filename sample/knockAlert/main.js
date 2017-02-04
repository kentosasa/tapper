var tapper = require('../../');
var microphone
var opt = {
  types: ['knock']
}
var callback = function (res) {
  console.log(res)
  switch (res.type) {
    case 'knock':
      alert('knocked')
      break;
    default:

  }
}
microphone = new tapper.microphone(callback, opt)
