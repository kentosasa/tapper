var chai = require('chai');
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();
var tapper = require('../');

describe('microphone', function() {
  var microphone
  var callback = function () {
    console.log("callback")
  }
  it('init', function () {
    microphone = new tapper.microphone(callback)
  })
})
