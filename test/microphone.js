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
  it('message', function () {
    console.log('this class use naviagtor so we could not test')
    // microphone = new tapper.microphone(callback)
  })
})
