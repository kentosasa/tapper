var config = require('./config')

//Web Audio API
let analyser
const waveCenter = config.waveCenter
let waveData
let waves = []

let callback

class Microphone {
  constructor (func) {
    // callbackとかanalyzerとか変数は全部class内に持たせたいけれど
    // loop内でメンバ変数の値が読み込めないのでclass外に変数を持たせる
    callback = func
    this.callback = callback

    initialize()
    window.setInterval(this.loop, 5)
  }
  loop() {
    //Analyzerの権限があるか確認
    if (!analyser) {
      console.log('can not access audio analyser')
      return
    }

    this.callback = this.callback ? this.callback : callback

    analyser.getByteTimeDomainData(waveData)
    let wave = waveData.slice(0)
    let gain = getGain(wave)
    waves.push({
      wave: wave,
      gain: gain
    })
    if (waves.length > config.stockNum) waves.shift()
    if (isMount(waves)) {
      waves = []
      console.log("center")
    }
  }
}

const isMount = (waves) => {
  let max = Math.max.apply(null, waves.map((item)=> {
    return item.gain
  }))
  return waves.length == config.stockNum && max > config.min && max == waves[config.stockNum/2].gain
}

const getGain = (wave) => {
	let max = 0
	for (var i = 0; i < wave.length; i++) {
		let val = Math.abs(wave[i]-waveCenter)
		if (val > max) {
			max = val
		}
	}
	return max
}

//生成時に実行
const initialize = (loop) => {
  let audioCtx
  let bufferLength
  //getUserMedia()の汎用化
  navigator.getMedia = navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia

  navigator.getMedia (
    { audio:true },
      function(stream) {
      audioCtx = new AudioContext()
      analyser = audioCtx.createAnalyser()
      analyser.smoothingTimeConstant = 0
      analyser.fftSize = config.fftSize
      bufferLength = analyser.frequencyBinCount

      let mediastreamsource = audioCtx.createMediaStreamSource(stream)
      waveData = new Uint8Array(analyser.frequencyBinCount)
      mediastreamsource.connect(analyser)
      console.log("success")
    }, function(err) {
       console.log("error")
    }
  )
}

module.exports = Microphone
