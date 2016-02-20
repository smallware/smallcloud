'use strict';

var _          = require('lodash');
var init       = require('./lib/init');
var path       = require('path');
var requireAll = require('require-all');

// Core and custom services paths
var srvPaths = {
  core: path.resolve(__dirname, './services'),
  custom: path.resolve(__dirname, '../services')
};

// Service init queue and runner
var runner = [];
runner.run = function(service){

};

// Get service candidates
var srvCandidates = _.assign({}, requireAll(srvPaths.core, srvPaths.custom));

// XXX
//console.log('ccc', srvCandidates);

// Load services
var services = _.reduce(srvCandidates, init.validate, [])
               .map(init.process).reduce(init.queue, []);

// XXX
//console.log('sss', services);

// Run init scripts
init.run(services).then(function(_services){
  console.log('\n[INSTALLED SERVICES]');
  console.log(_services);
});


// Start services up
//var activeSrvs = init.startup(services);




// XXX
module.exports = {
  services: services
};
