
var _          = require('lodash');
var co         = require('co');
var fs         = require('fs');
var path       = require('path');
var semver     = require('semver');
var Promise    = require('bluebird');
var DepGraph   = require('dependency-graph').DepGraph;
var requireAll = require('require-all');


// Initialize dep graphs
var depGraph = new DepGraph();


module.exports = {

  depGraph: depGraph,

  load: function loadServices(services, candidate, name){

    // Service must have a manifest file
    if( !('manifest' in candidate) )
      return services;

    // Service must have a setup function
    if( !('setup' in candidate) || !_.isFunction(candidate.setup) )
      return services;

    // Add to services collection
    services.push(_.assign(candidate, {id: name}));

    // Add to dep graph
    depGraph.addNode(name);

    // Return collection
    return services;
  },

  process: function processServices(service, index, services){

    // XXX
    //console.log('aaa', arguments);
    //console.log('>>>>>>', services);

    // Default status
    var status = {
      activable: true,
      active: true
    };

    // Does service have any dependencies?
    if( !('dependencies' in service.manifest) )
      return _.assign(service, status);

    // Process dependencies
    status.activable = _.every(service.manifest.dependencies, function(version, depId){

      // Get required service
      var dependency = _.find(services, {id: depId});

      // Is dep installed?
      if( !dependency ) return false;

      // Valid version combination?
      return semver.satisfies(dependency.manifest.version, version);

    }, this);


    if( status.activable ){
      // Register dep graph nodes
      depGraph.addDependency(service.id, depId);
    }else{
      // Remove node and dependants
      depGraph.dependantsOf(service.id).forEach(function(srvId){
        depGraph.removeNode(srvId);
      });
      depGraph.removeNode(service.id);
    }

    // Done
    return _.assign(service, status);
  },

  setup: function setupServices(services, srvId){

    var service = _.find(services, {id: srvId});

    service.setup.call(this);

    return service;

  },

  persist: function(service){

  }
};
