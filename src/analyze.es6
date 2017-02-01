var config = require('./config')
var knock = require('./data/knock')
module.exports = function (callback) {
  this.load = function (data) {
    console.log('hoge')
    return 'knock'
  }
}
