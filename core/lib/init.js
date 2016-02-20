'use strict';

var _        = require('lodash');
var s        = require('./s');
var co       = require('co');
var semver   = require('semver');
var Promise  = require('bluebird');
var DepGraph = require('dependency-graph').DepGraph;
var depGraph = new DepGraph();


module.exports = {

  validate: function(services, candidate, srvId){

    // Service must have a manifest file
    if( !('manifest' in candidate) )
      return services;

    // Service must have a init function
    if( !('init' in candidate) || !_.isFunction(candidate.init) )
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
    if( status.activable ){

      // Have dependencies?
      if(!_.isEmpty(service.manifest.dependencies))
        return _.assign(service, status);

      // Register dep graph nodes
      Object.keys(service.manifest.dependencies)
        .forEach(depGraph.addDependency.bind(depGraph, service.id));

      //depGraph.addDependency(service.id, depId);
    }else if(depGraph.hasNode(service.id)){
      // Remove node and dependants
      depGraph.dependantsOf(service.id).forEach(depGraph.removeNode);
      depGraph.removeNode(service.id);
    }

    // Done
    return _.assign(service, status);
  },

  queue: function(queue, service){

    // Get init index of service init
    var _index = depGraph.overallOrder().indexOf(service.id);

    // Insert in queue
    queue[_index] = service;

    return queue;
  },

  run: function(services){

    // Register all services in core registry
    s.reg('srv', services);

    // Return promise
    return new Promise(function(resolve, reject){

      // Define runner function
      //function thener(i, api){
      //
      //  // Register defined api
      //  if( api ) s.reg('api', services[i - 1], api);
      //
      //  // More services to initialize?
      //  if( i < services.length ){
      //
      //    try{ // Invoke init runner
      //      runner(i);
      //    }catch(e){
      //      reject(e)
      //    }
      //  }else{
      //    console.log('\n*** [DONE]');
      //    resolve(s);
      //  }
      //}

      // Define runner function
      //var runner = function(i){
      //
      //  // Defaults
      //  i = i || 0;
      //
      //  // Run generator
      //  co(services[i].init.bind(
      //    _.omit(services[i], ['init', 'manifest', 'active', 'activable']),
      //    s.ctx(services[i])
      //  )).then(thener.bind(null, i + 1))
      //    .catch(reject);
      //};

      // Run!
      console.log(' ');
      s.core.log('info', 'Starting SmallCloud services...');
      s.runner.call({
        services: services,
        resolve: resolve,
        reject: reject
      });

    });

  }
};