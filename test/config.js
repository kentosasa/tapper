var chai = require('chai');
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();
var tapper = require('../');
describe('config', function() {
  it('init', function () {
    var config = tapper.config
    expect(config.hoge).to.equal('fuga');
  })
})
