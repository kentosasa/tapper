var tapper = require('./tapper');
var config = tapper.config
var analyze

//Web Audio API
let analyser
const waveCenter = config.waveCenter
let waveData
let waves = []

// TODO analyzer classを継承したほうがキレイかな。けど今はclassの外にいろんなメソッドを置いてしまってるから無理だよ
class Microphone {
  constructor (func, opt) {
    // callbackとかanalyzerとか変数は全部class内に持たせたいけれど
    // loop内でメンバ変数の値が読み込めないのでclass外に変数を持たせる
    analyze = new tapper.analyze(func, opt)
    initialize()
    window.setInterval(this.loop, 5)
  }
  loop() {
    //Analyzerの権限があるか確認
    if (!analyser) {
      console.log('can not access audio analyser')
      return
    }

    analyser.getByteTimeDomainData(waveData)
    let wave = waveData.slice(0)
    let gain = getGain(wave)
    waves.push({
      wave: wave,
      gain: gain
    })
    if (waves.length > config.stockNum) waves.shift()
    if (isMount(waves)) {
      analyze.load(waves[config.stockNum/2].wave)

      //保存する用
      // window.wave = waves[config.stockNum/2].wave.toString()
      if (window.waves) {
        window.waves.push(waves[config.stockNum/2].wave)
        window.wavesString = window.waves.map((item) => {
          return item.join()
        }).join('\n')
      } else {
        window.waves = []
      }
      waves = []
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
	for (var i = wave.length/config.stockNum*(config.stockNum/2-1); i < wave.length/config.stockNum*(config.stockNum/2+1); i++) {
		let val = Math.abs(wave[parseInt(i)]-waveCenter)
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
