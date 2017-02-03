var config = require('./config')

//Web Audio API
let audioCtx
let analyser
const fftSize = config.fftSize
const waveCenter = config.waveCenter
let bufferLength
let waveData

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
    console.log(getGain(wave))
  }
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
      analyser.fftSize = fftSize
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
