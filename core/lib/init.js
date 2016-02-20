'use strict';

var _        = require('lodash');
var S        = require('./s');
var co       = require('co');
var semver   = require('semver');
//var logger   = require('./util/logger.js');
var Promise  = require('bluebird');
var DepGraph = require('dependency-graph').DepGraph;


// Instantiate dependency graph
var depGraph = new DepGraph();

// XXX
//var S = {
//  srv: {},
//  log: logger
//};

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
    S.reg('services', services);

    // Return promise
    return new Promise(function(resolve, reject){

      // Define runner function
      function thener(i, api){

        // XXX
        //console.log('\nRunner', i, services[i].id);
        //console.log('--- args', arguments);

        // Register defined api
        //if(api) S.reg('api', services[i-1], api);

        // XXX
        console.log('--- length', i, services.length);

        // More services to initialize?
        if( i < services.length ){

          // XXX
          console.log('---', i, services[i].id);

          try{
            // Retrieve init context
            //var ctx = S.ctx(services[i]);

            // Run init script
            //co(services[i].init(ctx))
            //  .then(thener.bind(null, i+1))
            //  .catch(reject);

            // Invoke init runner
            runner(i);

          }catch(e){reject(e)}
        }else{
          console.log('\n*** [DONE]');
          resolve(S);
        }
      }

      // Define runner function
      var runner = function(i){

        i = i || 0;

        co(services[i].init.bind(
          _.omit(services[i], ['init', 'manifest', 'active', 'activable']),
          S.ctx(services[i])
        )).then(thener.bind(null, i+1))
          .catch(reject);
      };

      // Run!
      runner();
      //co(services[0].init.bind(
      //  _.omit(services[0], ['init', 'manifest', 'active', 'activable']),
      //  S.ctx(services[0])
      //)).then(runner.bind(null, 1));

    });

  },

  _run: function(services){

    return new Promise(function(resolve, reject){

      // Register first service
      //S.register(services[0], _api);

      // Run the runner!
      (function runner(i, ctx){

        // Setup
        //i = i || 0;

        //console.log('>>>', i, ctx);

        // Register previous service api
        //if(api) S.srv[services[i-1].id] = api;
        //if(api) S.register(services[i-1], api);

        try{
          // Activate service?
          if( i < services.length && services[i].activable){

            // Mark service as active
            services[i].active = true;

            // Get service init context
            //var ctx = S.ctx(services[i].id);

            // Run init scripts recursively
            //co(services[i].init(ctx)).then(runner.bind(null, i+1));
            co(services[i].init(ctx)).then(function(_api){

              // Register api?
              if(_api) S.register(services[i], _api);

              // Get service init context
              var _ctx = S.ctx(services[i].id);

              runner.call(null, i+1, _ctx);
            }).catch(reject);
          }else{
            resolve(S);
          }
        }catch(e){
          reject(e);
        }
      }).call(services, 0, S.common);

    });
  }
};