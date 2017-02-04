var tapper = require('../../');
var microphone
var opt = {
  types: ['clap']
}
var callback = function (res) {
  console.log(res)
  switch (res.type) {
    case 'clap':
      alert('claped')
      break;
    default:

  }
}
microphone = new tapper.microphone(callback, opt)
