var chai = require('chai');
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();
var tapper = require('../');

describe('analyze', function() {
  var analyze
  var callback = function (type) {
    // console.log(type)
  }

  beforeEach(function () {
    analyze = new tapper.analyze(callback)
  })

  it('init', function () {
  })

  it('option is available', function() {
    analyze = new tapper.analyze(callback, {types: ['clap']})
    var waveData = require('./data/knock').waves
    waveData.forEach(function (ele, index) {
      expect(analyze.load(ele).type).not.to.equal('knock');
    })
    analyze = new tapper.analyze(callback, {types: ['clap', 'knock']})
    waveData.forEach(function (ele, index) {
      expect(analyze.load(ele).type).to.equal('knock');
    })
  })

  it('load wave data', function () {
    var knockData = require('./data/knock')
    analyze.load(knockData.waves[0])
  })

  it('knock dectation', function () {
    var waveData = require('./data/knock').waves
    waveData.forEach(function (ele, index) {
      expect(analyze.load(ele).type).to.equal('knock');
    })
  })

  it('load noise data', function () {
    var waveData = require('./data/noise').waves
    waveData.forEach(function (ele, index) {
      expect(analyze.load(ele).type).to.equal(null);
    })
  })

  it('load clap data', function () {
    var waveData = require('./data/clap').waves
    waveData.forEach(function (ele, index) {
      expect(analyze.load(ele).type).to.equal('clap');
    })
  })

  it('load snap data', function () {
    // 拍手と波形が似ているのでテストを甘くする
    var waveData = require('./data/snap').waves
    let size = 0
    let count = 0
    waveData.forEach(function (ele, index) {
      size +=1
      if(analyze.load(ele).type == 'snap') {
        count = count+1
      }
    })
    expect(count/size > 0.85).to.equal(true);
    console.log('指パッチン正答率' + size + '中' + count + '門: ' + count/size)
  })

  it('load knuckle data', function () {
    var waveData = require('./data/knuckle').waves
    waveData.forEach(function (ele, index) {
      expect(analyze.load(ele).type).to.equal('knuckle');
    })
  })
})
