
var _          = require('lodash');
var co         = require('co');
var fs         = require('fs');
var path       = require('path');
var semver     = require('semver');
var Promise    = require('bluebird');
var DepGraph   = require('dependency-graph').DepGraph;
var requireAll = require('require-all');

// Components
var _services  = require('./services');

// Paths
var coreSrvPath = path.resolve(__dirname, '../../services');

module.exports = function(S){

  // Services collection
  var services = [];

  // Load service candidates
  _.reduce(requireAll(coreSrvPath), _services.load, services);

  // Process services
  services = services.map(_services.process.bind(services));

  // Activate services
  _services.depGraph.OverallOrder().map(_services.setup.bind(S, services));

  // XXX
  console.log('>>> SERVICES:', services);




  // Emit completion signal
  S.signal.emit('core.init.done');
};