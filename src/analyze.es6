var config = require('./config')
var knock = require('./data/knock')

module.exports = class Analyze {
  constructor (callback) {
    this.callback = callback
    this.name = 'hoge'
  }

  load (data) {
    return 'knock'
  }
}
