var config = require('./config')
var knock = require('./data/knock')

module.exports = class Analyze {
  constructor (callback) {
    this.callback = callback
  }

  load (wave) {
    console.log('before: ' + wave.length)
    wave = filterSample(wave)
    console.log('after: ' + wave.length)
    return 'knock'
  }
}
//ローパスフィルター
const lowpassfilter = (wave, passSize) => {
  let res = []
  for (var i = passSize; i < wave.length-passSize; i++) {
    let val = 0
    for (var j = 0; j < passSize; j++) {
      val += wave[i-j]-128
    }
    res.push((val/passSize)+128)
  }
  return res
}

const filterSample = (wave) => {
  let maxPoint = 0
  let max = 0
  let res = []
  let sampleNum = config.sampleNum
  for (var i = sampleNum/2; i < wave.length - sampleNum/2; i++) {
    if (max < Math.abs(wave[i]-128)) {
      max = Math.abs(wave[i]-128)
      maxPoint = i
    }
  }
  for (var i = maxPoint - sampleNum/2; i < maxPoint + sampleNum/2; i++) {
    res.push(wave[i])
  }
  return res.length > 0 ? res : null
}
