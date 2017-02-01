var chai = require('chai');
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();
var tapper = require('../');

describe('analyze', function() {

  var callback = function (type) {
    console.log(type)
  }
  var analyze = new tapper.analyze(callback)

  it('init', function () {
    var analyze = new tapper.analyze(callback)
  })

  it('load wave data', function () {
    var knockData = require('./data/knock')
    analyze.load(knockData.waves[0])
  })

  it('knock dectation', function () {
    var waveData = require('./data/knock').waves
    expect(analyze.load(waveData[0])).to.equal('knock');
  })

  it('load noise data', function () {
    var waveData = require('./data/noise').waves
    expect(analyze.load(waveData[0])).to.equal(null);
  })
})
