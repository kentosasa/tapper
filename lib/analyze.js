'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = require('./config');
var knock = require('../data/knock');
var waveCenter = config.waveCenter;

module.exports = function () {
  function Analyze(callback) {
    _classCallCheck(this, Analyze);

    this.callback = callback;
    this.teacher = knock.waves.map(function (e) {
      return { freq: waveToFreq(e), type: 'knock' };
    });
  }

  _createClass(Analyze, [{
    key: 'load',
    value: function load(wave) {
      var freq = waveToFreq(wave);
      var similalities = this.teacher.map(function (item) {
        return { similality: cosSimilarity(item.freq, freq), type: item.type };
      });
      var max = Math.max.apply(Math, similalities.map(function (item) {
        return item.similality;
      }));
      var teacher = similalities.find(function (el) {
        return el.similality == max && max > 0.8;
      });
      return teacher ? teacher.type : null;
    }
  }]);

  return Analyze;
}();

var waveToFreq = function waveToFreq(wave) {
  wave = fetchSample(wave);
  wave = hammingWindow(wave);
  return dft(wave);
};

// ローパスフィルター
var lowpassfilter = function lowpassfilter(wave, passSize) {
  var res = [];
  for (var i = passSize; i < wave.length - passSize; i++) {
    var val = 0;
    for (var j = 0; j < passSize; j++) {
      val += wave[i - j] - waveCenter;
    }
    res.push(val / passSize + waveCenter);
  }
  return res;
};

// waveの山の部分だけ取得する
var fetchSample = function fetchSample(wave) {
  var maxPoint = 0;
  var max = 0;
  var res = [];
  var sampleNum = config.sampleNum;
  for (var i = sampleNum / 2; i < wave.length - sampleNum / 2; i++) {
    if (max < Math.abs(wave[i] - waveCenter)) {
      max = Math.abs(wave[i] - waveCenter);
      maxPoint = i;
    }
  }
  for (var i = maxPoint - sampleNum / 2; i < maxPoint + sampleNum / 2; i++) {
    res.push(wave[i]);
  }
  return res.length > 0 ? res : null;
};

//ハミング窓をかける
var hammingWindow = function hammingWindow(wave) {
  var res = [];
  for (var i = 0; i < wave.length; i++) {
    var ham = 1 - (0.5 + 0.5 * Math.cos(2 * Math.PI * i / wave.length));
    var val = ham * (wave[i] - waveCenter) + waveCenter;
    res.push(val);
  }
  return res;
};

// 離散フーリエ変換
var dft = function dft(raw) {
  var res = [];
  // 中心が waveCenter になっているので修正
  for (var i = 0; i < raw.length; i++) {
    raw[i] -= waveCenter;
    raw[i] = raw[i] / waveCenter;
  }
  var Re = []; // [出力] 実数部
  var Im = []; // [出力] 虚数部
  var N = raw.length;
  for (var j = 0; j < N / 8; ++j) {
    var Re_sum = 0.0;
    var Im_sum = 0.0;
    for (var i = 0; i < N; i++) {
      var tht = 2 * Math.PI / N * j * i;
      Re_sum += raw[i] * Math.cos(tht);
      Im_sum += raw[i] * Math.sin(tht);
    }
    Re.push(Re_sum);
    Im.push(Im_sum);
    res.push(Math.sqrt(Re_sum * Re_sum + Im_sum * Im_sum) / 2);
  }
  return res;
};

// cos類似度を出す
var cosSimilarity = function cosSimilarity(ary1, ary2) {
  var product = 0;
  for (var i = ary1.length - 1; i >= 0; i--) {
    product += ary1[i] * ary2[i];
  }

  var ary1Size = 0;
  for (var i = ary1.length - 1; i >= 0; i--) {
    ary1Size += ary1[i] * ary1[i];
  }
  ary1Size = Math.sqrt(ary1Size);

  var ary2Size = 0;
  for (var i = ary2.length - 1; i >= 0; i--) {
    ary2Size += ary2[i] * ary2[i];
  }
  ary2Size = Math.sqrt(ary2Size);
  return product / ary1Size / ary2Size;
};