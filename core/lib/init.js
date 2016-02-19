'use strict';

var _        = require('lodash');
var co       = require('co');
var semver   = require('semver');
var DepGraph = require('dependency-graph').DepGraph;


// Instantiate dependency graph
var depGraph = new DepGraph();

module.exports = {
  validate: function(services, candidate, srvId){

    // Service must have a manifest file
    if( !('manifest' in candidate) )
      return services;

    // Service must have a setup function
    if( !('startup' in candidate) || !_.isFunction(candidate.startup) )
      return services;

    // Service must declare a valid version in manifest
    if( !('version' in candidate.manifest) )
      return services;

    // Declared version must be valid
    if( _.isNull(semver.valid(candidate.manifest.version)) )
      return services;


    // Add to services collection
    services.push(_.assign(candidate, {id: srvId}));

    // Add to dep graph
    depGraph.addNode(srvId);

    // Return collection
    return services;
  },

  process: function(service, index, services){

    // Default status
    var status = {
      activable: true,  // All services are assumed activable
      active: false     // All services are initially inactive
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

    // Is service activable?
    if( status.activable && !_.isEmpty(service.manifest.dependencies) ){
      // Register dep graph nodes
      Object.keys(service.manifest.dependencies)
        .forEach(depGraph.addDependency.bind(depGraph, service.id));

      //depGraph.addDependency(service.id, depId);
    }else{
      // Remove node and dependants
      depGraph.dependantsOf(service.id).forEach(depGraph.removeNode);
      depGraph.removeNode(service.id);
    }

    // Done
    return _.assign(service, status);
  },

  startup: function(services){

    return depGraph.overallOrder().map(function(srvId){

      // Get the service from ID
      var service = _.find(services, {id: srvId});

      // TODO
      // Start up the services
      // service.startup();

      // Return activated service
      return service;
    });

  }
};