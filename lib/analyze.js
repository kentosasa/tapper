var config = require('./config')
var knock = require('./data/knock')
module.exports = function (callback) {
  this.load = function (data) {
    console.log('load')
    return 'knock'
  }
}
