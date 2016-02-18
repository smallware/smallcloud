
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

// Instantiate dependency graph
var depGraph = new DepGraph();

module.exports = function(S){

  // Services collection
  var services = [];

  // Add a service to the collection
  services.add = function addService(srv){
    this.push(srv);
    depGraph.addNode(srv.id);
  };

  // Remove a service
  services.remove = function removeService(srv){
    depGraph.dependantsOf(srv.id).forEach(depGraph.removeNode);
    depGraph.removeNode(srv.id);
  };

  // Run service's setup in dep order
  services.setup = function setupServices(){
    depGraph.overallOrder().forEach(_services.setup.bind(S));
  };

  // Load and validate service candidates
  var servs = _.reduce(requireAll(coreSrvPath), _services.load, services)
              .map(_services.process);

  // Process services
  //services = services.map(_services.process.bind(services));

  // Activate services
  _services.depGraph.overallOrder().map(_services.setup.bind(S, servs));

  // XXX
  console.log('>>> SERVICES:', servs);




  // Emit completion signal
  S.signal.emit('core.init.done');
};