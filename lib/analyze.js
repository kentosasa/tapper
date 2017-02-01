'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = require('./config');
var knock = require('./data/knock');

module.exports = function () {
  function Analyze(callback) {
    _classCallCheck(this, Analyze);

    this.callback = callback;
  }

  _createClass(Analyze, [{
    key: 'load',
    value: function load(wave) {
      console.log('before: ' + wave.length);
      wave = filterSample(wave);
      console.log('after: ' + wave.length);
      return 'knock';
    }
  }]);

  return Analyze;
}();
//ローパスフィルター
var lowpassfilter = function lowpassfilter(wave, passSize) {
  var res = [];
  for (var i = passSize; i < wave.length - passSize; i++) {
    var val = 0;
    for (var j = 0; j < passSize; j++) {
      val += wave[i - j] - 128;
    }
    res.push(val / passSize + 128);
  }
  return res;
};

var filterSample = function filterSample(wave) {
  var maxPoint = 0;
  var max = 0;
  var res = [];
  var sampleNum = config.sampleNum;
  for (var i = sampleNum / 2; i < wave.length - sampleNum / 2; i++) {
    if (max < Math.abs(wave[i] - 128)) {
      max = Math.abs(wave[i] - 128);
      maxPoint = i;
    }
  }
  for (var i = maxPoint - sampleNum / 2; i < maxPoint + sampleNum / 2; i++) {
    res.push(wave[i]);
  }
  return res.length > 0 ? res : null;
};