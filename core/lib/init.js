'use strict';

var _        = require('lodash');
var co       = require('co');
var semver   = require('semver');
var Promise  = require('bluebird');
var DepGraph = require('dependency-graph').DepGraph;


// Instantiate dependency graph
var depGraph = new DepGraph();

// XXX
var S = {thisIs_S: true};

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

    // XXX
    //console.log('\n===============================');
    //console.log('aaa', arguments);
    //console.log('qqq', queue);
    //console.log('sss', service.id);
    //console.log('ggg', depGraph.nodes);

    // Get init index of service init
    var _index = depGraph.overallOrder().indexOf(service.id);

    // Insert in queue
    queue[_index] = service;

    return queue;
  },

  run: function(services){

    return new Promise(function(resolve, reject){

      (function runner(i, result){
        i = i || 0;
        //console.log('\niii', i);
        //console.log('ttt', this);

        try{
          if( i < services.length && services[i].activable){
            console.log('\n>>> Running init for', i);
            services[i].active = true;
            return co(services[i].init(S)).then(runner.bind(null, i+1));
          }else{
            console.log('[EMIT ] Init done!');
            resolve(services);
          }
        }catch(e){
          reject(e);
        }
      }).call(services);

    });
  },




  //startup: function(services){
  //
  //  return depGraph.overallOrder().map(function(srvId){
  //
  //    // Get the service from ID
  //    var service = _.find(services, {id: srvId});
  //
  //    // TODO
  //    // Start up the services
  //    // service.startup();
  //
  //    // Return activated service
  //    return service;
  //  });
  //
  //}
};