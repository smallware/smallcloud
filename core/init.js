
var _          = require('lodash');
var DepGraph   = require('dependency-graph').DepGraph;


// Instantiate dependency graph
var depGraph = new DepGraph();

module.exports = {
  validate: function(services, candidate, srvId){

    // Service must have a manifest file
    if( !('manifest' in candidate) )
      return services;

    // TODO
    // Service must have a setup function
    //if( !('setup' in candidate) || !_.isFunction(candidate.setup) )
    //  return services;

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

    // XXX
    console.log('XXX', service.id);


    if( status.activable ){
      // Register dep graph nodes
      depGraph.addDependency(service.id, depId);
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