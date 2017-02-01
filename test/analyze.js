var chai = require('chai');
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();
var tapper = require('../');

describe('analyze', function() {
  var analyze
  var callback = function (type) {
    console.log(type)
  }

  beforeEach(function () {
    analyze = new tapper.analyze(callback)
  })

  it('init', function () {
  })

  it('load wave data', function () {
    var knockData = require('./data/knock')
    analyze.load(knockData.waves[0])
  })

  it('knock dectation', function () {
    var waveData = require('./data/knock').waves
    waveData.forEach(function (ele, index) {
      expect(analyze.load(ele)).to.equal('knock');
    })
  })

  it('load noise data', function () {
    var waveData = require('./data/noise').waves
    waveData.forEach(function (ele, index) {
      expect(analyze.load(ele)).to.equal(null);
    })
  })
})
