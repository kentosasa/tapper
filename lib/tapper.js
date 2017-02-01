'use strict';

exports.version = require('../package').version;

var config = require('./config');
exports.config = config;

var analyze = require('./analyze');
exports.analyze = analyze;