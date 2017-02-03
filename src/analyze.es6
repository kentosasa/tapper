var config = require('./config')
var knock = require('../data/knock')
const waveCenter = config.waveCenter

module.exports = class Analyze {
  constructor (callback) {
    this.callback = callback
    this.teacher = knock.waves.map((e) => {
      return { freq: waveToFreq(e), type: 'knock' }
    })
  }

  load (wave) {
    let freq = waveToFreq(wave)
    let similalities = this.teacher.map((item) => {
      return { similality: cosSimilarity(item.freq, freq), type: item.type}
    })
    let max = Math.max.apply(Math,similalities.map( function (item) { return item.similality }))
    let teacher = similalities.find((el) => {
      return el.similality == max && max > 0.75
    })
    return {
      max: max,
      type: teacher ? teacher.type : null
    }
  }
}


const waveToFreq = (wave) => {
  wave = fetchSample(wave)
  wave = hammingWindow(wave)
  return dft(wave)
}

// ローパスフィルター
const lowpassfilter = (wave, passSize) => {
  let res = []
  for (var i = passSize; i < wave.length-passSize; i++) {
    let val = 0
    for (var j = 0; j < passSize; j++) {
      val += wave[i-j]-waveCenter
    }
    res.push((val/passSize)+waveCenter)
  }
  return res
}

// waveの山の部分だけ取得する
const fetchSample = (wave) => {
  let maxPoint = 0
  let max = 0
  let res = []
  let sampleNum = config.sampleNum
  for (var i = sampleNum/2; i < wave.length - sampleNum/2; i++) {
    if (max < Math.abs(wave[i]-waveCenter)) {
      max = Math.abs(wave[i]-waveCenter)
      maxPoint = i
    }
  }
  for (var i = maxPoint - sampleNum/2; i < maxPoint + sampleNum/2; i++) {
    res.push(wave[i])
  }
  return res.length > 0 ? res : null
}

//ハミング窓をかける
const hammingWindow = (wave) => {
	let res = []
	for (var i = 0; i < wave.length; i++) {
		let ham = 1-(0.5+0.5*Math.cos(2*Math.PI*i/wave.length))
		let val = ham*(wave[i]-waveCenter)+waveCenter
		res.push(val)
	}
	return res
}

// 離散フーリエ変換
const dft = (raw) => {
	let res = []
	// 中心が waveCenter になっているので修正
	for (var i = 0; i < raw.length; i++) {
		raw[i] -= waveCenter
		raw[i] = raw[i]/waveCenter
	}
	let Re = [];// [出力] 実数部
	let Im = [];// [出力] 虚数部
	let N = raw.length;
	for( let j = 0; j < N/8; ++j ) { //低周波数帯しか確認しない
		let Re_sum = 0.0;
		let Im_sum = 0.0
		for (var i = 0; i < N; i++) {
			let tht = 2*Math.PI/N * j * i;
			Re_sum += raw[i] *Math.cos( tht );
			Im_sum += raw[i] *Math.sin( tht );
		}
		Re.push( Re_sum );
		Im.push( Im_sum );
    res.push( Math.sqrt(Re_sum*Re_sum + Im_sum*Im_sum)/2 )
	}
	return res;
}

// cos類似度を出す
const cosSimilarity = (ary1, ary2) => {
  let product = 0
  for (var i = ary1.length - 1; i >= 0; i--) {
    product += ary1[i]*ary2[i]
  }

  let ary1Size = 0
  for (var i = ary1.length - 1; i >= 0; i--) {
    ary1Size += ary1[i]*ary1[i]
  }
  ary1Size = Math.sqrt(ary1Size)

  let ary2Size = 0
  for (var i = ary2.length - 1; i >= 0; i--) {
    ary2Size += ary2[i]*ary2[i]
  }
  ary2Size = Math.sqrt(ary2Size)
  return product/ary1Size/ary2Size
}
